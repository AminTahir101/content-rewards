import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import BrandNav from '@/components/brand/BrandNav'
import SubmissionDetailClient from '@/components/brand/SubmissionDetailClient'

export const dynamic = 'force-dynamic'

export default async function BrandSubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const session = await auth()
  if (!session?.user) redirect(`/login?callbackUrl=/brand/submissions/${id}`)
  if (session.user.role !== 'BRAND' && session.user.role !== 'AGENCY' && session.user.role !== 'ADMIN') {
    redirect('/dashboard')
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

  if (!submission) notFound()

  // Verify brand ownership
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId: session.user.id,
      organizationId: submission.campaign.organizationId,
      isActive: true,
    },
  })
  if (!membership && session.user.role !== 'ADMIN') redirect('/brand/submissions')

  const orgName = membership
    ? (
        await prisma.organization.findUnique({
          where: { id: submission.campaign.organizationId },
          select: { name: true },
        })
      )?.name ?? null
    : null

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

  const serialized = {
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
  }

  return (
    <div className="min-h-screen bg-background">
      <BrandNav activeHref="/brand/submissions" orgName={orgName} userEmail={session.user.email} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        <Link href="/brand/submissions" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to submissions
        </Link>
      </div>
      <SubmissionDetailClient
        submission={serialized}
        creator={creator}
        canReview={!!membership || session.user.role === 'ADMIN'}
      />
    </div>
  )
}
