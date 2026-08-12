import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { SocialPlatform, CampaignCategory, RewardModel } from '@/generated/prisma/client'

// ── Zod schema ────────────────────────────────────────────────────────────────

const campaignSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.enum([
    'LIFESTYLE', 'ENTERTAINMENT', 'GAMING', 'TECHNOLOGY', 'FOOD',
    'FASHION', 'BEAUTY', 'TRAVEL', 'SPORTS', 'EDUCATION', 'FINANCE', 'OTHER',
  ]),
  description: z.string().max(5000).optional(),
  objective: z.string().max(2000).optional(),
  platforms: z.array(z.enum(['TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'X'])).min(1),
  minFollowers: z.number().int().min(0).default(0),
  countries: z.array(z.string()).min(1),
  languages: z.array(z.string()).min(1),
  requiredHashtags: z.array(z.string()),
  requiredMentions: z.array(z.string()),
  contentBrief: z.string().max(10000).optional(),
  contentDos: z.array(z.string()),
  contentDonts: z.array(z.string()),
  rewardModel: z.enum(['CPM', 'CPV', 'CPA', 'FIXED', 'HYBRID', 'MILESTONE']),
  cpm: z.number().positive().optional(),
  minPayout: z.number().min(0).default(0),
  maxCreatorPayout: z.number().positive().optional(),
  totalBudget: z.number().positive(),
  maxSubmissions: z.number().int().positive().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  coverUrl: z.string().url().optional(),
})

// ── Slug generation ───────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 7)
}

async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name) || 'campaign'
  const existing = await prisma.campaign.findUnique({ where: { slug: base }, select: { id: true } })
  if (!existing) return base
  // Append random suffix until unique
  for (let i = 0; i < 10; i++) {
    const candidate = `${base}-${randomSuffix()}`
    const clash = await prisma.campaign.findUnique({ where: { slug: candidate }, select: { id: true } })
    if (!clash) return candidate
  }
  return `${base}-${Date.now()}`
}

// ── POST /api/brand/campaigns ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Auth
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (
    session.user.role !== 'BRAND' &&
    session.user.role !== 'AGENCY' &&
    session.user.role !== 'ADMIN'
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Organization
  const membership = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id, isActive: true },
    select: { organizationId: true },
  })
  if (!membership) {
    return NextResponse.json({ error: 'No organization found' }, { status: 400 })
  }

  // Validate body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = campaignSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 422 },
    )
  }

  const data = parsed.data

  // Generate unique slug
  const slug = await generateUniqueSlug(data.name)

  // Create campaign + platforms in a transaction
  const campaign = await prisma.$transaction(async (tx) => {
    const c = await tx.campaign.create({
      data: {
        organizationId: membership.organizationId,
        name: data.name,
        slug,
        category: data.category as CampaignCategory,
        description: data.description,
        objective: data.objective,
        status: 'DRAFT',
        rewardModel: data.rewardModel as RewardModel,
        cpm: data.cpm ?? null,
        minPayout: data.minPayout,
        maxCreatorPayout: data.maxCreatorPayout ?? null,
        totalBudget: data.totalBudget,
        maxSubmissions: data.maxSubmissions ?? null,
        countries: data.countries,
        languages: data.languages,
        minFollowers: data.minFollowers,
        requiredHashtags: data.requiredHashtags,
        requiredMentions: data.requiredMentions,
        contentBrief: data.contentBrief,
        contentDos: data.contentDos,
        contentDonts: data.contentDonts,
        coverUrl: data.coverUrl,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
      select: { id: true, slug: true },
    })

    await tx.campaignPlatform.createMany({
      data: data.platforms.map((platform) => ({
        campaignId: c.id,
        platform: platform as SocialPlatform,
      })),
    })

    return c
  })

  return NextResponse.json({ id: campaign.id, slug: campaign.slug }, { status: 201 })
}
