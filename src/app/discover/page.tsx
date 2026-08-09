import { Suspense } from 'react'
import DiscoverClient from '@/components/discover/DiscoverClient'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getInitialCampaigns() {
  const campaigns = await prisma.campaign.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    take: 12,
    select: {
      id: true,
      name: true,
      slug: true,
      coverUrl: true,
      category: true,
      rewardModel: true,
      cpm: true,
      maxCreatorPayout: true,
      totalBudget: true,
      reservedBudget: true,
      countries: true,
      endDate: true,
      participantCount: true,
      platforms: { select: { platform: true } },
      organization: { select: { name: true, logoUrl: true } },
    },
  })

  return campaigns.map((c) => ({
    ...c,
    cpm: c.cpm ? c.cpm.toString() : null,
    maxCreatorPayout: c.maxCreatorPayout ? c.maxCreatorPayout.toString() : null,
    totalBudget: c.totalBudget.toString(),
    reservedBudget: c.reservedBudget.toString(),
    remainingBudget: (
      parseFloat(c.totalBudget.toString()) - parseFloat(c.reservedBudget.toString())
    ).toFixed(2),
    platforms: c.platforms.map((p) => p.platform),
    endDate: c.endDate ? c.endDate.toISOString() : null,
  }))
}

export default async function DiscoverPage() {
  const initialCampaigns = await getInitialCampaigns()

  return (
    <Suspense fallback={null}>
      <DiscoverClient initialCampaigns={initialCampaigns} />
    </Suspense>
  )
}
