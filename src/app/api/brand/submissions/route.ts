import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (session.user.role !== 'BRAND' && session.user.role !== 'AGENCY' && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') // e.g. PENDING_REVIEW, APPROVED, REJECTED, FLAGGED, TRACKING, PAID
  const campaignId = searchParams.get('campaignId')
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const take = 20
  const skip = (page - 1) * take

  // Find organizations the user belongs to
  const memberships = await prisma.organizationMember.findMany({
    where: { userId: session.user.id, isActive: true },
    select: { organizationId: true },
  })
  const orgIds = memberships.map((m) => m.organizationId)

  if (orgIds.length === 0) {
    return NextResponse.json({ submissions: [], total: 0, page, pageCount: 0 })
  }

  const statusFilter = status
    ? { status: status as any }
    : {
        status: {
          in: ['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'FLAGGED', 'TRACKING', 'PERFORMANCE_LOCKED', 'PAYOUT_PENDING', 'PAID', 'PAYMENT_HOLD', 'DISPUTED'],
        },
      }

  const campaignFilter = campaignId ? { campaignId } : {}

  const [submissions, total] = await Promise.all([
    prisma.submission.findMany({
      where: {
        ...statusFilter,
        ...campaignFilter,
        campaign: { organizationId: { in: orgIds } },
      },
      orderBy: { submittedAt: 'desc' },
      skip,
      take,
      select: {
        id: true,
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
            organization: { select: { id: true, name: true } },
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            action: true,
            reason: true,
            createdAt: true,
          },
        },
      },
    }),
    prisma.submission.count({
      where: {
        ...statusFilter,
        ...campaignFilter,
        campaign: { organizationId: { in: orgIds } },
      },
    }),
  ])

  return NextResponse.json({
    submissions: submissions.map((s) => ({
      ...s,
      earnedAmount: s.earnedAmount?.toString() ?? null,
      campaign: {
        ...s.campaign,
        cpm: s.campaign.cpm?.toString() ?? null,
      },
      submittedAt: s.submittedAt.toISOString(),
      reviewedAt: s.reviewedAt?.toISOString() ?? null,
      updatedAt: s.updatedAt.toISOString(),
      reviews: s.reviews.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
    })),
    total,
    page,
    pageCount: Math.ceil(total / take),
  })
}
