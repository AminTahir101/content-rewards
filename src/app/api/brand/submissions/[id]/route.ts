import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (session.user.role !== 'BRAND' && session.user.role !== 'AGENCY' && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const submission = await prisma.submission.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      status: true,
      contentUrl: true,
      platform: true,
      earnedAmount: true,
      rejectionReason: true,
      submittedAt: true,
      reviewedAt: true,
      updatedAt: true,
      campaign: {
        select: {
          id: true,
          name: true,
          slug: true,
          cpm: true,
          rewardModel: true,
          minPayout: true,
          maxCreatorPayout: true,
          requiredHashtags: true,
          requiredMentions: true,
          organizationId: true,
          organization: { select: { id: true, name: true } },
        },
      },
      reviews: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          reviewerId: true,
          action: true,
          reason: true,
          notes: true,
          createdAt: true,
        },
      },
    },
  })

  if (!submission) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
  }

  // Verify ownership
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId: session.user.id,
      organizationId: submission.campaign.organizationId,
      isActive: true,
    },
  })
  if (!membership && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Load creator info
  const creator = await prisma.user.findUnique({
    where: { id: submission.userId },
    select: {
      id: true,
      name: true,
      email: true,
      profile: { select: { displayName: true, avatarUrl: true, country: true } },
      creatorProfile: { select: { handle: true, totalFollowers: true, score: true, isVerified: true } },
    },
  })

  return NextResponse.json({
    submission: {
      ...submission,
      earnedAmount: submission.earnedAmount?.toString() ?? null,
      campaign: {
        ...submission.campaign,
        cpm: submission.campaign.cpm?.toString() ?? null,
        minPayout: submission.campaign.minPayout.toString(),
        maxCreatorPayout: submission.campaign.maxCreatorPayout?.toString() ?? null,
      },
      submittedAt: submission.submittedAt.toISOString(),
      reviewedAt: submission.reviewedAt?.toISOString() ?? null,
      updatedAt: submission.updatedAt.toISOString(),
      reviews: submission.reviews.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
    },
    creator,
  })
}
