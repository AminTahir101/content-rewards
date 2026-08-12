import { redirect } from 'next/navigation'
import {
  CurrencyCircleDollar,
  ArrowDown,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  Receipt,
} from '@phosphor-icons/react/dist/ssr'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import BrandNav from '@/components/brand/BrandNav'

export const dynamic = 'force-dynamic'

// ── Types ──────────────────────────────────────────────────────────────────────

type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'

interface CampaignBudgetRow {
  id: string
  name: string
  slug: string
  status: CampaignStatus
  totalBudget: number
  reservedBudget: number
  settledBudget: number
}

interface TransactionRow {
  id: string
  type: string
  direction: string
  status: string
  amount: string
  description: string | null
  createdAt: string
}

// ── Config ─────────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<CampaignStatus, string> = {
  ACTIVE:    'bg-green-500/10 text-green-400',
  PAUSED:    'bg-amber-500/10 text-amber-400',
  COMPLETED: 'bg-blue-500/10 text-blue-400',
  DRAFT:     'bg-zinc-500/10 text-zinc-400',
  CANCELLED: 'bg-red-500/10 text-red-400',
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString('en-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-SA', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  })
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function BrandFinancePage() {
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

  const TX_TYPE_LABELS: Record<string, string> = {
    CAMPAIGN_REWARD: tb('txCampaignReward'),
    WITHDRAWAL:      tb('txWithdrawal'),
    REFUND:          tb('txRefund'),
    PLATFORM_FEE:    tb('txPlatformFee'),
    ADJUSTMENT:      tb('txAdjustment'),
    BONUS:           tb('txBonus'),
    REFERRAL:        tb('txReferral'),
  }

  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/brand/finance')
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
          <p className="text-[13px] text-zinc-600">{tc('noOrgDetail', { action: tb('manageFinance') })}</p>
        </div>
      </div>
    )
  }

  const rawCampaigns = await prisma.campaign.findMany({
    where: { organizationId: { in: orgIds } },
    orderBy: { createdAt: 'desc' },
    select: {
      id:             true,
      name:           true,
      slug:           true,
      status:         true,
      totalBudget:    true,
      reservedBudget: true,
      settledBudget:  true,
    },
  })

  const campaigns: CampaignBudgetRow[] = rawCampaigns.map((c) => ({
    id:             c.id,
    name:           c.name,
    slug:           c.slug,
    status:         c.status as CampaignStatus,
    totalBudget:    parseFloat(c.totalBudget.toString()),
    reservedBudget: parseFloat(c.reservedBudget.toString()),
    settledBudget:  parseFloat(c.settledBudget.toString()),
  }))

  // ── Aggregate stats ────────────────────────────────────────────────────────

  const totalFunded  = campaigns.reduce((acc, c) => acc + c.totalBudget, 0)
  const totalSpent   = campaigns.reduce((acc, c) => acc + c.settledBudget, 0)
  const totalPending = campaigns.reduce((acc, c) => acc + c.reservedBudget, 0)
  const totalAvail   = totalFunded - totalSpent - totalPending

  // ── Recent transactions (wallet transactions linked to org users) ─────────
  // We look up wallet transactions for org member user IDs
  const orgMemberIds = memberships.map((m) => m.organizationId)
  // Fetch member user IDs from the org
  const orgMembers = await prisma.organizationMember.findMany({
    where: { organizationId: { in: orgMemberIds }, isActive: true },
    select: { userId: true },
  })
  const memberUserIds = orgMembers.map((m) => m.userId)

  const rawTxs = await prisma.walletTransaction.findMany({
    where: { userId: { in: memberUserIds } },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id:          true,
      type:        true,
      direction:   true,
      status:      true,
      amount:      true,
      description: true,
      createdAt:   true,
    },
  })

  const transactions: TransactionRow[] = rawTxs.map((tx) => ({
    id:          tx.id,
    type:        tx.type,
    direction:   tx.direction,
    status:      tx.status,
    amount:      tx.amount.toString(),
    description: tx.description,
    createdAt:   tx.createdAt.toISOString(),
  }))

  return (
    <div className="min-h-screen bg-page">
      <BrandNav orgName={orgName} userLabel={session.user.email} />

      <div className="max-w-[1400px] mx-auto px-6 py-8">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="mb-8">
          <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-3">{tb('label')}</p>
          <h1 className="text-[42px] sm:text-[56px] font-black text-zinc-900 dark:text-white tracking-[-0.03em] leading-none">
            {tb('finance')}
          </h1>
        </div>

        {/* ── Add Budget CTA ────────────────────────────────────────────────── */}
        <div className="rounded-xl bg-green-500/[0.06] border border-green-500/20 p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="text-[14px] font-black text-zinc-900 dark:text-white mb-0.5">{tb('fundCampaign')}</p>
            <p className="text-[12px] text-zinc-600">{tb('fundCampaignDetail')}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/brand/campaigns/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 hover:bg-green-400 text-black text-[12px] font-black px-4 py-2 transition-colors"
            >
              <Plus size={12} weight="bold" />
              {tb('newCampaign')}
            </a>
            <a
              href="/brand/campaigns"
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.1] dark:border-white/[0.1] text-zinc-700 dark:text-white/70 hover:text-zinc-900 dark:hover:text-white text-[12px] font-bold px-4 py-2 transition-colors"
            >
              {tb('viewCampaigns')}
              <ArrowRight size={11} weight="bold" />
            </a>
          </div>
        </div>

        {/* ── Stats strip ──────────────────────────────────────────────────── */}
        <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] grid grid-cols-2 lg:grid-cols-4 divide-x divide-black/[0.06] dark:divide-white/[0.06] mb-8 overflow-hidden">
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-2">
              <CurrencyCircleDollar size={14} className="text-zinc-500" weight="fill" />
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{tb('totalFunded')}</span>
            </div>
            <p className="text-[28px] font-black text-zinc-900 dark:text-white leading-none">
              <span className="text-[14px] font-bold text-zinc-500 me-1">SAR</span>
              {fmt(totalFunded)}
            </p>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDown size={14} className="text-red-400" weight="bold" />
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{tb('totalSpent')}</span>
            </div>
            <p className="text-[28px] font-black text-zinc-900 dark:text-white leading-none">
              <span className="text-[14px] font-bold text-zinc-500 me-1">SAR</span>
              {fmt(totalSpent)}
            </p>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-amber-400" weight="fill" />
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{tb('pendingPayout')}</span>
            </div>
            <p className="text-[28px] font-black text-zinc-900 dark:text-white leading-none">
              <span className="text-[14px] font-bold text-zinc-500 me-1">SAR</span>
              {fmt(totalPending)}
            </p>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={14} className="text-green-400" weight="fill" />
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{tb('available')}</span>
            </div>
            <p className={`text-[28px] font-black leading-none ${totalAvail >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              <span className="text-[14px] font-bold text-zinc-500 me-1">SAR</span>
              {fmt(Math.max(totalAvail, 0))}
            </p>
          </div>
        </div>

        <div className="space-y-6">

          {/* ── Campaign Budget Breakdown ─────────────────────────────────── */}
          <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
            <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.06]">
              <h2 className="text-[15px] font-black text-zinc-900 dark:text-white">{tb('campaignBudgetBreakdown')}</h2>
            </div>

            {campaigns.length === 0 ? (
              <div className="px-8 py-16 text-center">
                <p className="text-[13px] text-zinc-600">{tb('noCampaignsFinance')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                      <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{tb('campaign')}</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{tb('status')}</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-end">{tb('totalSAR')}</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-end">{tb('reservedSAR')}</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-end">{tb('settledSAR')}</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-end">{tb('remainingSAR')}</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{tb('usage')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c, i) => {
                      const cfg       = STATUS_CFG[c.status] ?? { label: c.status, badge: 'bg-zinc-500/10 text-zinc-400' }
                      const remaining = c.totalBudget - c.settledBudget - c.reservedBudget
                      const usagePct  = c.totalBudget > 0
                        ? Math.min(((c.settledBudget + c.reservedBudget) / c.totalBudget) * 100, 100)
                        : 0
                      const remainPct = c.totalBudget > 0
                        ? Math.max((remaining / c.totalBudget) * 100, 0)
                        : 0
                      const barColor =
                        remainPct > 50 ? 'bg-green-500'
                        : remainPct > 20 ? 'bg-amber-500'
                        : 'bg-red-500'

                      return (
                        <tr
                          key={c.id}
                          className={`border-b border-black/[0.04] dark:border-white/[0.04] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors ${
                            i === campaigns.length - 1 ? 'border-b-0' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <span className="text-[13px] font-bold text-zinc-900 dark:text-white">{c.name}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-md ${cfg.badge}`}>
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-end">
                            <span className="text-[13px] font-bold text-zinc-900 dark:text-white">{fmt(c.totalBudget)}</span>
                          </td>
                          <td className="px-4 py-4 text-end">
                            <span className="text-[13px] text-amber-400 font-semibold">{fmt(c.reservedBudget)}</span>
                          </td>
                          <td className="px-4 py-4 text-end">
                            <span className="text-[13px] text-zinc-600">{fmt(c.settledBudget)}</span>
                          </td>
                          <td className="px-4 py-4 text-end">
                            <span className={`text-[13px] font-bold ${
                              remainPct > 50 ? 'text-green-400' : remainPct > 20 ? 'text-amber-400' : 'text-red-400'
                            }`}>
                              {fmt(Math.max(remaining, 0))}
                            </span>
                          </td>
                          <td className="px-4 py-4 min-w-[100px]">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.06] overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${barColor}`}
                                  style={{ width: `${usagePct}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-zinc-600 shrink-0 w-8 text-end">
                                {Math.round(usagePct)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Recent Transactions ───────────────────────────────────────── */}
          <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
            <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.06]">
              <h2 className="text-[15px] font-black text-zinc-900 dark:text-white">{tb('recentTransactions')}</h2>
            </div>

            {transactions.length === 0 ? (
              <div className="px-8 py-16 text-center">
                <Receipt size={32} className="text-zinc-700 mx-auto mb-3" weight="duotone" />
                <p className="text-[14px] font-black text-zinc-900 dark:text-white mb-1">{tb('noTransactions')}</p>
                <p className="text-[12px] text-zinc-600">
                  {tb('noTransactionsDetail')}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                {transactions.map((tx) => {
                  const isCredit = tx.direction === 'CREDIT'
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isCredit
                            ? 'bg-green-500/10'
                            : 'bg-red-500/10'
                        }`}>
                          {isCredit
                            ? <CurrencyCircleDollar size={14} className="text-green-400" weight="fill" />
                            : <ArrowDown size={14} className="text-red-400" weight="bold" />
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-zinc-900 dark:text-white truncate">
                            {TX_TYPE_LABELS[tx.type] ?? tx.type}
                          </p>
                          {tx.description && (
                            <p className="text-[11px] text-zinc-600 truncate">{tx.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0 text-end">
                        <p className={`text-[14px] font-black ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                          {isCredit ? '+' : '−'}SAR {fmt(parseFloat(tx.amount))}
                        </p>
                        <p className="text-[11px] text-zinc-600">{fmtDate(tx.createdAt)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
