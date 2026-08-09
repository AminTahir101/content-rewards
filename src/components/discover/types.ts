export interface DiscoverCampaign {
  id: string
  name: string
  slug: string
  coverUrl: string | null
  category: string
  rewardModel: string
  cpm: string | null
  maxCreatorPayout: string | null
  totalBudget: string
  reservedBudget: string
  remainingBudget: string
  countries: string[]
  endDate: string | null
  participantCount: number
  platforms: string[]
  organization: {
    name: string
    logoUrl: string | null
  }
}
