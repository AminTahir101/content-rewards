import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Seed organizations + campaigns
  const orgs = [
    {
      name: 'Riyadh Season',
      slug: 'riyadh-season',
      logoUrl: null,
      campaigns: [
        {
          name: 'Riyadh Season 2025',
          slug: 'riyadh-season-2025',
          category: 'ENTERTAINMENT' as const,
          description:
            'Showcase the excitement of Riyadh Season to your audience. Create engaging content that captures the events, performances, and atmosphere.',
          objective: 'Drive awareness and attendance for Riyadh Season 2025 events.',
          contentBrief:
            'Create authentic content showing your experience at Riyadh Season events. Highlight the excitement, the crowd, and the unique Saudi entertainment experience.',
          cpm: '12.00',
          minPayout: '100',
          maxCreatorPayout: '5000',
          totalBudget: '500000',
          countries: ['SA'],
          minFollowers: 5000,
          requiredHashtags: ['#RiyadhSeason', '#موسم_الرياض'],
          requiredMentions: ['@RiyadhSeason'],
          contentDos: ['Show genuine excitement', 'Feature the events and venues', 'Include Arabic captions'],
          contentDonts: ['Do not show alcohol or prohibited content', 'Do not use competitor brand logos'],
          platforms: ['TIKTOK', 'INSTAGRAM'],
          endDate: new Date('2026-12-31'),
        },
      ],
    },
    {
      name: 'ROSHN',
      slug: 'roshn',
      logoUrl: null,
      campaigns: [
        {
          name: 'ROSHN — Dream Home',
          slug: 'roshn-dream-home',
          category: 'LIFESTYLE' as const,
          description:
            'Help Saudi families discover ROSHN communities. Share your vision of modern Saudi living and community life.',
          objective: 'Build brand awareness for ROSHN residential communities among Saudi families.',
          contentBrief:
            'Create aspirational lifestyle content that connects to the idea of owning a home in a premium Saudi community. Focus on family, comfort, and modern Saudi living.',
          cpm: '18.00',
          minPayout: '200',
          maxCreatorPayout: '8000',
          totalBudget: '300000',
          countries: ['SA'],
          minFollowers: 10000,
          requiredHashtags: ['#ROSHN', '#روشن'],
          requiredMentions: ['@ROSHN'],
          contentDos: ['Focus on family and community', 'Highlight Saudi culture', 'Use high-quality visuals'],
          contentDonts: ['Do not make specific price claims', 'Do not show competitor projects'],
          platforms: ['INSTAGRAM', 'YOUTUBE'],
          endDate: new Date('2026-09-30'),
        },
      ],
    },
    {
      name: 'stc',
      slug: 'stc',
      logoUrl: null,
      campaigns: [
        {
          name: 'stc 5G — Game Without Limits',
          slug: 'stc-5g-gaming',
          category: 'GAMING' as const,
          description:
            'Show how stc 5G takes your gaming to the next level. Zero lag, full power, total domination.',
          objective: 'Position stc 5G as the ultimate network for Saudi gamers.',
          contentBrief:
            'Create gaming content that showcases fast connectivity and seamless online gaming. Show reaction, gameplay, or unboxing content that integrates the stc 5G message naturally.',
          cpm: '22.00',
          minPayout: '150',
          maxCreatorPayout: '10000',
          totalBudget: '750000',
          countries: ['SA', 'BH', 'KW'],
          minFollowers: 8000,
          requiredHashtags: ['#stc5G', '#العب_بلا_حدود'],
          requiredMentions: ['@stc_KSA'],
          contentDos: ['Demonstrate fast download speeds', 'Show gaming setup', 'Include gaming reaction moments'],
          contentDonts: ['Do not mention competitor networks', 'Do not make false speed claims'],
          platforms: ['TIKTOK', 'YOUTUBE', 'X'],
          endDate: new Date('2026-10-15'),
        },
      ],
    },
    {
      name: 'Jarir Bookstore',
      slug: 'jarir',
      logoUrl: null,
      campaigns: [
        {
          name: 'Jarir Tech Deals',
          slug: 'jarir-tech-deals',
          category: 'TECHNOLOGY' as const,
          description:
            'Showcase the best tech deals at Jarir. Review products, unbox new arrivals, and help your audience find the best value.',
          objective: 'Drive foot traffic and online sales for Jarir tech products.',
          contentBrief:
            'Create tech review or unboxing content featuring products available at Jarir. Be genuine — your honest opinion builds more trust.',
          cpm: '15.00',
          minPayout: '80',
          maxCreatorPayout: '3000',
          totalBudget: '180000',
          countries: ['SA'],
          minFollowers: 3000,
          requiredHashtags: ['#جرير', '#Jarir'],
          requiredMentions: ['@JarirBooks'],
          contentDos: ['Show real product use', 'Mention where to buy', 'Include honest review'],
          contentDonts: ['Do not review broken or defective units', 'Do not make price errors'],
          platforms: ['TIKTOK', 'INSTAGRAM', 'YOUTUBE'],
          endDate: new Date('2026-11-30'),
        },
      ],
    },
    {
      name: 'Saudia Airlines',
      slug: 'saudia',
      logoUrl: null,
      campaigns: [
        {
          name: 'Saudia — Explore the World',
          slug: 'saudia-explore',
          category: 'TRAVEL' as const,
          description:
            'Travel the world with Saudia and share your journey. Create inspiring travel content that shows the world through Saudi eyes.',
          objective: 'Inspire Saudi travelers to book with Saudia for their next international trip.',
          contentBrief:
            'Document your travel experience flying Saudia. Capture the departure, inflight experience, and destination. Authentic travel storytelling is preferred over polished ads.',
          cpm: '20.00',
          minPayout: '250',
          maxCreatorPayout: '15000',
          totalBudget: '600000',
          countries: ['SA'],
          minFollowers: 20000,
          requiredHashtags: ['#Saudia', '#السعودية_للطيران'],
          requiredMentions: ['@Saudia_Airlines'],
          contentDos: ['Show the full journey', 'Highlight business class if applicable', 'Include destination highlights'],
          contentDonts: ['Do not show safety equipment in non-emergency context', 'Do not film crew without consent'],
          platforms: ['INSTAGRAM', 'YOUTUBE', 'TIKTOK'],
          endDate: new Date('2026-12-31'),
        },
      ],
    },
    {
      name: 'Noon',
      slug: 'noon',
      logoUrl: null,
      campaigns: [
        {
          name: 'Noon — Yellow Friday',
          slug: 'noon-yellow-friday',
          category: 'LIFESTYLE' as const,
          description:
            'Hype up Noon\'s biggest sale of the year. Unbox your Noon hauls, share wish lists, and get your audience excited.',
          objective: 'Drive awareness and orders during the Yellow Friday sale period.',
          contentBrief:
            'Create haul, wishlist, or deal-hunting content around Noon\'s Yellow Friday sale. Show genuine excitement about the discounts and the products you ordered.',
          cpm: '10.00',
          minPayout: '50',
          maxCreatorPayout: '2000',
          totalBudget: '400000',
          countries: ['SA', 'AE', 'EG'],
          minFollowers: 1000,
          requiredHashtags: ['#NoonYellowFriday', '#نون'],
          requiredMentions: ['@noonKSA'],
          contentDos: ['Show real orders and delivery', 'Share promo codes if available', 'Highlight best deals'],
          contentDonts: ['Do not show out-of-stock items as available', 'Do not fake reactions'],
          platforms: ['TIKTOK', 'INSTAGRAM'],
          endDate: new Date('2026-11-30'),
        },
      ],
    },
  ]

  console.log('Seeding organizations and campaigns...')

  for (const orgData of orgs) {
    const org = await prisma.organization.upsert({
      where: { slug: orgData.slug },
      update: {},
      create: {
        name: orgData.name,
        slug: orgData.slug,
        type: 'BRAND',
        country: 'SA',
        isActive: true,
        brandProfile: { create: {} },
      },
    })

    for (const c of orgData.campaigns) {
      const existing = await prisma.campaign.findUnique({ where: { slug: c.slug } })
      if (existing) {
        console.log(`  Skipping existing campaign: ${c.name}`)
        continue
      }

      const remaining =
        parseFloat(c.totalBudget) - Math.random() * parseFloat(c.totalBudget) * 0.6

      await prisma.campaign.create({
        data: {
          organizationId: org.id,
          name: c.name,
          slug: c.slug,
          category: c.category,
          status: 'ACTIVE',
          rewardModel: 'CPM',
          description: c.description,
          objective: c.objective,
          contentBrief: c.contentBrief,
          cpm: c.cpm,
          minPayout: c.minPayout,
          maxCreatorPayout: c.maxCreatorPayout,
          totalBudget: c.totalBudget,
          reservedBudget: (parseFloat(c.totalBudget) - remaining).toFixed(2),
          countries: c.countries,
          minFollowers: c.minFollowers,
          requiredHashtags: c.requiredHashtags,
          requiredMentions: c.requiredMentions,
          contentDos: c.contentDos,
          contentDonts: c.contentDonts,
          endDate: c.endDate,
          participantCount: Math.floor(Math.random() * 400) + 20,
          submissionCount: Math.floor(Math.random() * 300) + 10,
          verifiedViews: BigInt(Math.floor(Math.random() * 5000000) + 50000),
          platforms: {
            create: c.platforms.map((p) => ({ platform: p as 'TIKTOK' | 'INSTAGRAM' | 'YOUTUBE' | 'X' })),
          },
        },
      })

      console.log(`  Created campaign: ${c.name}`)
    }
  }

  console.log('Done.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
