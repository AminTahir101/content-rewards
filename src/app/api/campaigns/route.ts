import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { CampaignCategory, SocialPlatform } from '@/generated/prisma/client'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const search = searchParams.get('q')?.trim() ?? ''
  const platform = searchParams.get('platform') as SocialPlatform | null
  const category = searchParams.get('category') as CampaignCategory | null
  const sort = searchParams.get('sort') ?? 'newest'
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = 12

  const where = {
    status: 'ACTIVE' as const,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
            { organization: { name: { contains: search, mode: 'insensitive' as const } } },
          ],
        }
      : {}),
    ...(platform
      ? { platforms: { some: { platform } } }
      : {}),
    ...(category ? { category } : {}),
  }

  const orderBy =
    sort === 'highest_paying'
      ? { cpm: 'desc' as const }
      : sort === 'ending_soon'
      ? { endDate: 'asc' as const }
      : sort === 'most_popular'
      ? { participantCount: 'desc' as const }
      : { createdAt: 'desc' as const }

  const [campaigns, total] = await Promise.all([
    prisma.campaign.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
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
        submissionCount: true,
        verifiedViews: true,
        platforms: { select: { platform: true } },
        organization: { select: { name: true, logoUrl: true } },
      },
    }),
    prisma.campaign.count({ where }),
  ])

  return NextResponse.json({
    campaigns: campaigns.map((c) => ({
      ...c,
      cpm: c.cpm ? c.cpm.toString() : null,
      maxCreatorPayout: c.maxCreatorPayout ? c.maxCreatorPayout.toString() : null,
      totalBudget: c.totalBudget.toString(),
      reservedBudget: c.reservedBudget.toString(),
      remainingBudget: (
        parseFloat(c.totalBudget.toString()) - parseFloat(c.reservedBudget.toString())
      ).toFixed(2),
      verifiedViews: c.verifiedViews.toString(),
      platforms: c.platforms.map((p) => p.platform),
    })),
    total,
    page,
    pages: Math.ceil(total / limit),
  })
}
