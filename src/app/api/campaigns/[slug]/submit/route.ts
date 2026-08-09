import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validatePlatformUrl } from '@/lib/social-url'

const submitSchema = z.object({
  contentUrl: z.string().url('Must be a valid URL'),
  platform: z.enum(['TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'X']),
})

interface Params {
  params: Promise<{ slug: string }>
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = session.user
  if (user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Only creators can submit content' }, { status: 403 })
  }

  const { slug } = await params

  const body = await req.json().catch(() => null)
  const parsed = submitSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { contentUrl, platform } = parsed.data

  // Validate URL matches the declared platform
  if (!validatePlatformUrl(contentUrl, platform)) {
    return NextResponse.json(
      { error: `URL does not appear to be a valid ${platform} post link` },
      { status: 400 }
    )
  }

  const campaign = await prisma.campaign.findUnique({
    where: { slug },
    select: {
      id: true,
      status: true,
      endDate: true,
      platforms: { select: { platform: true } },
      participants: {
        where: { userId: user.id },
        select: { id: true },
      },
    },
  })

  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  if (campaign.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Campaign is not active' }, { status: 400 })
  }

  if (campaign.endDate && campaign.endDate < new Date()) {
    return NextResponse.json({ error: 'Campaign deadline has passed' }, { status: 400 })
  }

  // Creator must have joined
  if (campaign.participants.length === 0) {
    return NextResponse.json(
      { error: 'You must join this campaign before submitting' },
      { status: 403 }
    )
  }

  // Platform must be supported by this campaign
  const supported = campaign.platforms.map((p) => p.platform)
  if (!supported.includes(platform)) {
    return NextResponse.json(
      { error: `${platform} is not a supported platform for this campaign` },
      { status: 400 }
    )
  }

  // Duplicate URL check across all campaigns
  const duplicateUrl = await prisma.submission.findFirst({
    where: { contentUrl },
    select: { id: true },
  })
  if (duplicateUrl) {
    return NextResponse.json(
      { error: 'This content URL has already been submitted' },
      { status: 409 }
    )
  }

  // One active submission per campaign per creator
  const existingSubmission = await prisma.submission.findFirst({
    where: {
      campaignId: campaign.id,
      userId: user.id,
      status: {
        notIn: ['REJECTED', 'DISPUTED'],
      },
    },
    select: { id: true, status: true },
  })
  if (existingSubmission) {
    return NextResponse.json(
      { error: 'You already have an active submission for this campaign' },
      { status: 409 }
    )
  }

  const submission = await prisma.$transaction(async (tx) => {
    const created = await tx.submission.create({
      data: {
        campaignId: campaign.id,
        userId: user.id,
        contentUrl,
        platform,
        status: 'SUBMITTED',
      },
      select: { id: true, status: true, submittedAt: true },
    })

    await tx.campaign.update({
      where: { id: campaign.id },
      data: { submissionCount: { increment: 1 } },
    })

    return created
  })

  return NextResponse.json(
    {
      submission: {
        id: submission.id,
        status: submission.status,
        submittedAt: submission.submittedAt.toISOString(),
      },
    },
    { status: 201 }
  )
}
