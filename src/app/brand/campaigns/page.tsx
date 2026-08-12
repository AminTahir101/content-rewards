import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Briefcase, ChartBar, CurrencyCircleDollar } from '@phosphor-icons/react/dist/ssr'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import BrandNav from '@/components/brand/BrandNav'
import CampaignListClient, { type CampaignRow } from '@/components/brand/CampaignListClient'

export const dynamic = 'force-dynamic'

export default async function BrandCampaignsPage() {
  const tb = await getTranslations('brand')
  const tc = await getTranslations('common')
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/brand/campaigns')
  if (
    session.user.role !== 'BRAND' &&
    session.user.role !== 'AGENCY' &&
    session.user.role !== 'ADMIN'
  ) {
    redirect('/dashboard')
  }

  // Resolve organization
  const memberships = await prisma.organizationMember.findMany({
    where: { userId: session.user.id, isActive: true },
    select: { organizationId: true, organization: { select: { name: true } } },
  })

  const orgName = memberships[0]?.organization?.name ?? null
  const orgIds  = memberships.map((m) => m.organizationId)

  // No org — graceful empty state
  if (orgIds.length === 0) {
    return (
      <div className="min-h-screen bg-page">
        <BrandNav orgName={orgName} userLabel={session.user.email} />
        <div className="max-w-[1400px] mx-auto px-6 py-16 text-center">
          <p className="text-[15px] font-black text-zinc-900 dark:text-white mb-1">{tc('noOrgFound')}</p>
          <p className="text-[13px] text-zinc-600">{tc('noOrgDetail', { action: tb('manageCampaigns') })}</p>
        </div>
      </div>
    )
  }

  const campaigns = await prisma.campaign.findMany({
    where: { organizationId: { in: orgIds } },
    orderBy: { createdAt: 'desc' },
    select: {
      id:               true,
      name:             true,
      slug:             true,
      status:           true,
      rewardModel:      true,
      cpm:              true,
      totalBudget:      true,
      reservedBudget:   true,
      settledBudget:    true,
      maxCreatorPayout: true,
      participantCount: true,
      submissionCount:  true,
      category:         true,
      endDate:          true,
      createdAt:        true,
      platforms:        { select: { platform: true } },
    },
  })

  // Compute stats strip values
  const totalCampaigns  = campaigns.length
  const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE').length
  const totalBudget     = campaigns.reduce((acc, c) => acc + parseFloat(c.totalBudget.toString()), 0)
  const totalSpend      = campaigns.reduce(
    (acc, c) =>
      acc +
      parseFloat(c.settledBudget.toString()) +
      parseFloat(c.reservedBudget.toString()),
    0,
  )

  function fmt(n: number): string {
    return n.toLocaleString('en-SA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  }

  // Serialize for client component (Decimal → string, Date → ISO)
  const serialized: CampaignRow[] = campaigns.map((c) => ({
    id:               c.id,
    name:             c.name,
    slug:             c.slug,
    status:           c.status as CampaignRow['status'],
    rewardModel:      c.rewardModel,
    cpm:              c.cpm?.toString() ?? null,
    totalBudget:      c.totalBudget.toString(),
    reservedBudget:   c.reservedBudget.toString(),
    settledBudget:    c.settledBudget.toString(),
    maxCreatorPayout: c.maxCreatorPayout?.toString() ?? null,
    participantCount: c.participantCount,
    submissionCount:  c.submissionCount,
    category:         c.category,
    endDate:          c.endDate?.toISOString() ?? null,
    createdAt:        c.createdAt.toISOString(),
    platforms:        c.platforms.map((p) => ({ platform: p.platform })),
  }))

  return (
    <div className="min-h-screen bg-page">
      <BrandNav orgName={orgName} userLabel={session.user.email} />

      <div className="max-w-[1400px] mx-auto px-6 py-8">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="mb-8">
          <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-3">{tb('label')}</p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-[42px] sm:text-[56px] font-black text-zinc-900 dark:text-white tracking-[-0.03em] leading-none">
              {tb('campaigns')}
            </h1>
            <Link
              href="/brand/campaigns/new"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-green-500 hover:bg-green-400 text-black text-[13px] font-black px-4 py-2.5 transition-colors mb-2"
            >
              <Plus size={15} weight="bold" />
              {tb('newCampaign')}
            </Link>
          </div>
        </div>

        {/* ── Stats strip ──────────────────────────────────────────────────── */}
        <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] grid grid-cols-2 lg:grid-cols-4 divide-x divide-black/[0.06] dark:divide-white/[0.06] mb-8 overflow-hidden">
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase size={14} className="text-zinc-500" weight="fill" />
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{tb('totalCampaigns')}</span>
            </div>
            <p className="text-[28px] font-black text-zinc-900 dark:text-white leading-none">{totalCampaigns}</p>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-2">
              <ChartBar size={14} className="text-green-500" weight="fill" />
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{tb('active')}</span>
            </div>
            <p className="text-[28px] font-black text-green-500 leading-none">{activeCampaigns}</p>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-2">
              <CurrencyCircleDollar size={14} className="text-zinc-500" weight="fill" />
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{tb('totalBudget')}</span>
            </div>
            <p className="text-[28px] font-black text-zinc-900 dark:text-white leading-none">
              <span className="text-[14px] font-bold text-zinc-500 me-1">SAR</span>
              {fmt(totalBudget)}
            </p>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-2">
              <CurrencyCircleDollar size={14} className="text-amber-500" weight="fill" />
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{tb('totalSpend')}</span>
            </div>
            <p className="text-[28px] font-black text-zinc-900 dark:text-white leading-none">
              <span className="text-[14px] font-bold text-zinc-500 me-1">SAR</span>
              {fmt(totalSpend)}
            </p>
          </div>
        </div>

        {/* ── Campaign list with filter tabs ───────────────────────────────── */}
        <CampaignListClient campaigns={serialized} />

      </div>
    </div>
  )
}
