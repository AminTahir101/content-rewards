import { redirect } from 'next/navigation'
import {
  Eye,
  CurrencyCircleDollar,
  ChartBar,
  Briefcase,
  TrendUp,
  Users,
  FileText,
} from '@phosphor-icons/react/dist/ssr'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import BrandNav from '@/components/brand/BrandNav'

export const dynamic = 'force-dynamic'

// ── Types ──────────────────────────────────────────────────────────────────────

type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'

interface CampaignAnalyticsRow {
  id: string
  name: string
  slug: string
  status: CampaignStatus
  cpm: string | null
  settledBudget: string
  reservedBudget: string
  participantCount: number
  submissionCount: number
  verifiedViews: bigint
  platforms: Array<{ platform: string }>
}

// ── Config ─────────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<CampaignStatus, string> = {
  ACTIVE:    'bg-green-500/10 text-green-400',
  PAUSED:    'bg-amber-500/10 text-amber-400',
  COMPLETED: 'bg-blue-500/10 text-blue-400',
  DRAFT:     'bg-zinc-500/10 text-zinc-400',
  CANCELLED: 'bg-red-500/10 text-red-400',
}

const PLATFORMS: Array<{ key: string; label: string; color: string }> = [
  { key: 'TIKTOK',    label: 'TikTok',    color: 'text-pink-400'    },
  { key: 'INSTAGRAM', label: 'Instagram', color: 'text-purple-400'  },
  { key: 'YOUTUBE',   label: 'YouTube',   color: 'text-red-400'     },
  { key: 'X',         label: 'X (Twitter)', color: 'text-blue-400'  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString('en-SA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function fmtDec(n: number): string {
  return n.toLocaleString('en-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export default async function BrandAnalyticsPage() {
  const tb = await getTranslations('brand')
  const tc = await getTranslations('common')
  const tcs = await getTranslations('campaigns.status')

  const STATUS_CFG: Record<CampaignStatus, { label: string; badge: string }> = {
    ACTIVE:    { label: tcs('ACTIVE'),    badge: STATUS_BADGE.ACTIVE    },
    PAUSED:    { label: tcs('PAUSED'),    badge: STATUS_BADGE.PAUSED    },
    COMPLETED: { label: tcs('COMPLETED'), badge: STATUS_BADGE.COMPLETED },
    DRAFT:     { label: tcs('DRAFT'),     badge: STATUS_BADGE.DRAFT     },
    CANCELLED: { label: tcs('CANCELLED'), badge: STATUS_BADGE.CANCELLED },
  }

  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/brand/analytics')
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
          <p className="text-[13px] text-zinc-600">{tc('noOrgDetail', { action: tb('manageAnalytics') })}</p>
        </div>
      </div>
    )
  }

  const rawCampaigns = await prisma.campaign.findMany({
    where: { organizationId: { in: orgIds } },
    orderBy: { createdAt: 'desc' },
    select: {
      id:               true,
      name:             true,
      slug:             true,
      status:           true,
      cpm:              true,
      settledBudget:    true,
      reservedBudget:   true,
      participantCount: true,
      submissionCount:  true,
      verifiedViews:    true,
      platforms:        { select: { platform: true } },
    },
  })

  const campaigns: CampaignAnalyticsRow[] = rawCampaigns.map((c) => ({
    id:               c.id,
    name:             c.name,
    slug:             c.slug,
    status:           c.status as CampaignStatus,
    cpm:              c.cpm?.toString() ?? null,
    settledBudget:    c.settledBudget.toString(),
    reservedBudget:   c.reservedBudget.toString(),
    participantCount: c.participantCount,
    submissionCount:  c.submissionCount,
    verifiedViews:    c.verifiedViews,
    platforms:        c.platforms.map((p) => ({ platform: p.platform })),
  }))

  // ── Aggregate stats ────────────────────────────────────────────────────────

  const totalVerifiedViews = campaigns.reduce(
    (acc, c) => acc + Number(c.verifiedViews),
    0,
  )
  const totalSpend = campaigns.reduce(
    (acc, c) =>
      acc +
      parseFloat(c.settledBudget) +
      parseFloat(c.reservedBudget),
    0,
  )
  const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE').length

  // Weighted average CPM across campaigns with cpm set
  const cpmCampaigns = campaigns.filter((c) => c.cpm !== null)
  const avgCpm =
    cpmCampaigns.length > 0
      ? cpmCampaigns.reduce((acc, c) => acc + parseFloat(c.cpm!), 0) / cpmCampaigns.length
      : 0

  // Platform distribution — count submissions per platform
  const platformCounts: Record<string, number> = {}
  for (const c of campaigns) {
    for (const p of c.platforms) {
      platformCounts[p.platform] = (platformCounts[p.platform] ?? 0) + c.submissionCount
    }
  }

  return (
    <div className="min-h-screen bg-page">
      <BrandNav orgName={orgName} userLabel={session.user.email} />

      <div className="max-w-[1400px] mx-auto px-6 py-8">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="mb-8">
          <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-3">{tb('label')}</p>
          <h1 className="text-[42px] sm:text-[56px] font-black text-zinc-900 dark:text-white tracking-[-0.03em] leading-none">
            {tb('analytics')}
          </h1>
        </div>

        {/* ── Stats strip ──────────────────────────────────────────────────── */}
        <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] grid grid-cols-2 lg:grid-cols-4 divide-x divide-black/[0.06] dark:divide-white/[0.06] mb-8 overflow-hidden">
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-2">
              <Eye size={14} className="text-blue-400" weight="fill" />
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{tb('verifiedViews')}</span>
            </div>
            <p className="text-[28px] font-black text-zinc-900 dark:text-white leading-none">
              {fmtViews(totalVerifiedViews)}
            </p>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-2">
              <CurrencyCircleDollar size={14} className="text-amber-400" weight="fill" />
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{tb('totalSpend')}</span>
            </div>
            <p className="text-[28px] font-black text-zinc-900 dark:text-white leading-none">
              <span className="text-[14px] font-bold text-zinc-500 me-1">SAR</span>
              {fmt(totalSpend)}
            </p>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendUp size={14} className="text-green-500" weight="bold" />
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{tb('avgCPM')}</span>
            </div>
            <p className="text-[28px] font-black text-zinc-900 dark:text-white leading-none">
              <span className="text-[14px] font-bold text-zinc-500 me-1">SAR</span>
              {fmtDec(avgCpm)}
            </p>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase size={14} className="text-green-400" weight="fill" />
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{tb('activeCampaigns')}</span>
            </div>
            <p className="text-[28px] font-black text-green-400 leading-none">{activeCampaigns}</p>
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-8 py-20 text-center">
            <p className="text-[15px] font-black text-zinc-900 dark:text-white mb-1">{tb('noCampaignData')}</p>
            <p className="text-[13px] text-zinc-600">{tb('noCampaignDataDetail')}</p>
          </div>
        ) : (
          <div className="space-y-6">

            {/* ── Performance by Campaign ──────────────────────────────────── */}
            <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
              <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.06]">
                <h2 className="text-[15px] font-black text-zinc-900 dark:text-white">{tb('performanceByCampaign')}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                      <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{tb('campaign')}</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{tb('status')}</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-end">{tb('verifiedViews')}</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-end">{tb('spendSAR')}</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-end">CPM</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-end">{tb('creators')}</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-end">{tb('submissions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c, i) => {
                      const cfg   = STATUS_CFG[c.status] ?? { label: c.status, badge: 'bg-zinc-500/10 text-zinc-400' }
                      const spend = parseFloat(c.settledBudget) + parseFloat(c.reservedBudget)
                      const views = Number(c.verifiedViews)
                      return (
                        <tr
                          key={c.id}
                          className={`border-b border-black/[0.04] dark:border-white/[0.04] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors ${
                            i === campaigns.length - 1 ? 'border-b-0' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <ChartBar size={12} className="text-zinc-500 shrink-0" weight="fill" />
                              <span className="text-[13px] font-bold text-zinc-900 dark:text-white">{c.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-md ${cfg.badge}`}>
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-end">
                            <span className="text-[13px] font-bold text-zinc-900 dark:text-white">{fmtViews(views)}</span>
                          </td>
                          <td className="px-4 py-4 text-end">
                            <span className="text-[13px] font-bold text-zinc-900 dark:text-white">{fmtDec(spend)}</span>
                          </td>
                          <td className="px-4 py-4 text-end">
                            <span className="text-[13px] text-zinc-600">
                              {c.cpm ? `SAR ${c.cpm}` : '—'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-end">
                            <div className="inline-flex items-center gap-1 text-[13px] text-zinc-900 dark:text-white">
                              <Users size={11} weight="fill" className="text-zinc-500" />
                              {fmt(c.participantCount)}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-end">
                            <div className="inline-flex items-center gap-1 text-[13px] text-zinc-900 dark:text-white">
                              <FileText size={11} weight="fill" className="text-zinc-500" />
                              {fmt(c.submissionCount)}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Platform Distribution ─────────────────────────────────────── */}
            <div>
              <h2 className="text-[15px] font-black text-zinc-900 dark:text-white mb-4">{tb('platformDistribution')}</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {PLATFORMS.map((p) => {
                  const count = platformCounts[p.key] ?? 0
                  const total = Object.values(platformCounts).reduce((a, b) => a + b, 0)
                  const pct   = total > 0 ? Math.round((count / total) * 100) : 0
                  return (
                    <div
                      key={p.key}
                      className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] p-5"
                    >
                      <div className={`text-[11px] font-black uppercase tracking-wider mb-2 ${p.color}`}>
                        {p.label}
                      </div>
                      <p className="text-[28px] font-black text-zinc-900 dark:text-white leading-none mb-1">
                        {fmt(count)}
                      </p>
                      <p className="text-[11px] text-zinc-600">
                        {tc('submissionsUnit')} · <span className="font-bold text-zinc-500">{pct}%</span>
                      </p>
                      {/* Mini bar */}
                      <div className="mt-3 h-1 rounded-full bg-black/[0.06] dark:bg-white/[0.06] overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-current ${p.color}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
