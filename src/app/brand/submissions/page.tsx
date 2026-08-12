import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import BrandNav from '@/components/brand/BrandNav'
import SubmissionQueueClient from '@/components/brand/SubmissionQueueClient'

export const dynamic = 'force-dynamic'

export default async function BrandSubmissionsPage() {
  const tc = await getTranslations('common')
  const tb = await getTranslations('brand')
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/brand/submissions')
  if (session.user.role !== 'BRAND' && session.user.role !== 'AGENCY' && session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const memberships = await prisma.organizationMember.findMany({
    where: { userId: session.user.id, isActive: true },
    select: { organizationId: true, organization: { select: { name: true } } },
  })
  const orgIds = memberships.map((m) => m.organizationId)
  const orgName = memberships[0]?.organization?.name ?? null

  if (orgIds.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d]">
        <BrandNav orgName={orgName} userLabel={session.user.email} />
        <div className="max-w-[1400px] mx-auto px-6 py-16 text-center">
          <p className="text-[15px] font-black text-white mb-1">{tc('noOrgFound')}</p>
          <p className="text-[13px] text-zinc-600">{tc('noOrgDetail', { action: tb('reviewSubmissions') })}</p>
        </div>
      </div>
    )
  }

  const reviewableStatuses = [
    'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'FLAGGED',
    'TRACKING', 'PERFORMANCE_LOCKED', 'PAYOUT_PENDING', 'PAID', 'PAYMENT_HOLD', 'DISPUTED',
  ]

  const [submissions, total, pendingCount] = await Promise.all([
    prisma.submission.findMany({
      where: {
        status: { in: reviewableStatuses as any[] },
        campaign: { organizationId: { in: orgIds } },
      },
      orderBy: { submittedAt: 'desc' },
      take: 20,
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
          select: { action: true, reason: true, createdAt: true },
        },
      },
    }),
    prisma.submission.count({
      where: {
        status: { in: reviewableStatuses as any[] },
        campaign: { organizationId: { in: orgIds } },
      },
    }),
    prisma.submission.count({
      where: {
        status: 'PENDING_REVIEW',
        campaign: { organizationId: { in: orgIds } },
      },
    }),
  ])

  const serialized = submissions.map((s) => ({
    ...s,
    status: s.status as any,
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
  }))

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <BrandNav orgName={orgName} userLabel={session.user.email} />
      <SubmissionQueueClient
        initialSubmissions={serialized}
        initialTotal={total}
        pendingCount={pendingCount}
      />
    </div>
  )
}
