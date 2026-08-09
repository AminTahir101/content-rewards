import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import MyCampaignsClient from '@/components/my-campaigns/MyCampaignsClient'

export const dynamic = 'force-dynamic'

async function getMyCampaigns(userId: string) {
  const participants = await prisma.campaignParticipant.findMany({
    where: { userId },
    orderBy: { joinedAt: 'desc' },
    select: {
      joinedAt: true,
      campaign: {
        select: {
          id: true,
          name: true,
          slug: true,
          coverUrl: true,
          category: true,
          status: true,
          cpm: true,
          maxCreatorPayout: true,
          endDate: true,
          platforms: { select: { platform: true } },
          organization: { select: { name: true } },
          submissions: {
            where: { userId },
            orderBy: { submittedAt: 'desc' },
            take: 1,
            select: {
              id: true,
              status: true,
              contentUrl: true,
              earnedAmount: true,
              submittedAt: true,
              rejectionReason: true,
            },
          },
        },
      },
    },
  })

  return participants.map(({ joinedAt, campaign }) => {
    const submission = campaign.submissions[0] ?? null
    return {
      joinedAt: joinedAt.toISOString(),
      campaign: {
        id: campaign.id,
        name: campaign.name,
        slug: campaign.slug,
        coverUrl: campaign.coverUrl,
        category: campaign.category,
        status: campaign.status,
        cpm: campaign.cpm?.toString() ?? null,
        maxCreatorPayout: campaign.maxCreatorPayout?.toString() ?? null,
        endDate: campaign.endDate?.toISOString() ?? null,
        platforms: campaign.platforms.map((p) => p.platform),
        organization: campaign.organization,
      },
      submission: submission
        ? {
            id: submission.id,
            status: submission.status,
            contentUrl: submission.contentUrl,
            earnedAmount: submission.earnedAmount?.toString() ?? null,
            submittedAt: submission.submittedAt.toISOString(),
            rejectionReason: submission.rejectionReason,
          }
        : null,
    }
  })
}

export default async function MyCampaignsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/my-campaigns')
  if (session.user.role !== 'CREATOR') redirect('/dashboard')

  const entries = await getMyCampaigns(session.user.id)

  return <MyCampaignsClient entries={entries} />
}
