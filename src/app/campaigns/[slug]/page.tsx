import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import CampaignDetailView from '@/components/campaign/CampaignDetailView'

interface Props {
  params: Promise<{ slug: string }>
}

async function getCampaign(slug: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      coverUrl: true,
      category: true,
      status: true,
      rewardModel: true,
      cpm: true,
      minPayout: true,
      maxCreatorPayout: true,
      totalBudget: true,
      reservedBudget: true,
      settledBudget: true,
      maxSubmissions: true,
      countries: true,
      languages: true,
      minFollowers: true,
      requiredHashtags: true,
      requiredMentions: true,
      contentBrief: true,
      contentDos: true,
      contentDonts: true,
      description: true,
      objective: true,
      startDate: true,
      endDate: true,
      participantCount: true,
      submissionCount: true,
      verifiedViews: true,
      platforms: { select: { platform: true } },
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          country: true,
          isVerified: true,
        },
      },
    },
  })

  if (!campaign) return null

  return {
    ...campaign,
    cpm: campaign.cpm?.toString() ?? null,
    minPayout: campaign.minPayout.toString(),
    maxCreatorPayout: campaign.maxCreatorPayout?.toString() ?? null,
    totalBudget: campaign.totalBudget.toString(),
    reservedBudget: campaign.reservedBudget.toString(),
    settledBudget: campaign.settledBudget.toString(),
    remainingBudget: (
      parseFloat(campaign.totalBudget.toString()) -
      parseFloat(campaign.reservedBudget.toString())
    ).toFixed(2),
    verifiedViews: campaign.verifiedViews.toString(),
    platforms: campaign.platforms.map((p) => p.platform),
    startDate: campaign.startDate?.toISOString() ?? null,
    endDate: campaign.endDate?.toISOString() ?? null,
  }
}

async function getIsJoined(campaignId: string, userId: string | undefined) {
  if (!userId) return false
  const p = await prisma.campaignParticipant.findUnique({
    where: { campaignId_userId: { campaignId, userId } },
    select: { id: true },
  })
  return !!p
}

export default async function CampaignDetailPage({ params }: Props) {
  const { slug } = await params
  const [campaign, session] = await Promise.all([getCampaign(slug), auth()])

  if (!campaign || campaign.status === 'DRAFT') notFound()

  const isJoined = await getIsJoined(campaign.id, session?.user?.id)

  return (
    <CampaignDetailView
      campaign={campaign}
      user={session?.user ?? null}
      isJoined={isJoined}
    />
  )
}
