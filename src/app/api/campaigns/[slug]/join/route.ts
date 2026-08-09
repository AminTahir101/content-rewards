import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    return NextResponse.json({ error: 'Only creators can join campaigns' }, { status: 403 })
  }

  const { slug } = await params

  const campaign = await prisma.campaign.findUnique({
    where: { slug },
    select: {
      id: true,
      status: true,
      maxSubmissions: true,
      submissionCount: true,
      reservedBudget: true,
      totalBudget: true,
      countries: true,
      minFollowers: true,
    },
  })

  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  if (campaign.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Campaign is not active' }, { status: 400 })
  }

  const remaining =
    parseFloat(campaign.totalBudget.toString()) -
    parseFloat(campaign.reservedBudget.toString())
  if (remaining <= 0) {
    return NextResponse.json({ error: 'Campaign budget is exhausted' }, { status: 400 })
  }

  if (
    campaign.maxSubmissions != null &&
    campaign.submissionCount >= campaign.maxSubmissions
  ) {
    return NextResponse.json({ error: 'Campaign is at capacity' }, { status: 400 })
  }

  const existing = await prisma.campaignParticipant.findUnique({
    where: { campaignId_userId: { campaignId: campaign.id, userId: user.id } },
  })
  if (existing) {
    return NextResponse.json({ error: 'Already joined this campaign' }, { status: 409 })
  }

  await prisma.$transaction([
    prisma.campaignParticipant.create({
      data: { campaignId: campaign.id, userId: user.id },
    }),
    prisma.campaign.update({
      where: { id: campaign.id },
      data: { participantCount: { increment: 1 } },
    }),
  ])

  return NextResponse.json({ joined: true }, { status: 201 })
}
