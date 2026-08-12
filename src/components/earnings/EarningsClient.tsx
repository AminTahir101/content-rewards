'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUp, ArrowDown, TrendUp } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import AppNav from '@/components/app/AppNav'

// ── Types ─────────────────────────────────────────────────────────────────────

type TxType = 'CAMPAIGN_REWARD' | 'WITHDRAWAL' | 'REFUND' | 'PLATFORM_FEE' | 'ADJUSTMENT' | 'BONUS' | 'REFERRAL'
type TxDirection = 'CREDIT' | 'DEBIT'
type TxStatus = 'PENDING' | 'SETTLED' | 'FAILED' | 'REVERSED'

interface Transaction {
  id: string
  type: TxType
  direction: TxDirection
  status: TxStatus
  amount: string
  currency: string
  description: string | null
  referenceType: string | null
  referenceId: string | null
  balanceAfter: string | null
  createdAt: string
  settledAt: string | null
}

interface SubmissionEarning {
  id: string
  status: string
  earnedAmount: string
  submittedAt: string
  campaign: {
    id: string
    name: string
    slug: string
    cpm: string | null
    organization: { name: string }
  }
}

interface Wallet {
  totalEarned: string
  pendingBalance: string
  availableBalance: string
  lifetimePaid: string
  transactions: Transaction[]
}

interface Props {
  wallet: Wallet | null
  submissionEarnings: SubmissionEarning[]
  userName: string | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sar(value: string | null, decimals = 2): string {
  if (!value) return 'SAR 0'
  const num = parseFloat(value)
  if (num >= 1_000_000) return `SAR ${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000)     return `SAR ${(num / 1_000).toFixed(0)}K`
  return `SAR ${num.toLocaleString('en-SA', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
}

function relativeDate(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7)  return `${diff} days ago`
  return new Date(iso).toLocaleDateString('en-SA', { day: 'numeric', month: 'short', year: 'numeric' })
}

const SUBMISSION_STATUS_BADGE: Record<string, string> = {
  APPROVED:           'bg-green-500/10 text-green-400',
  TRACKING:           'bg-green-500/10 text-green-400',
  PERFORMANCE_LOCKED: 'bg-blue-500/10 text-blue-400',
  PAYOUT_PENDING:     'bg-amber-500/10 text-amber-400',
  PAID:               'bg-green-500/20 text-green-300',
}

// ── Tab type ──────────────────────────────────────────────────────────────────

type ActiveTab = 'overview' | 'history' | 'bycampaign'

// ── Component ─────────────────────────────────────────────────────────────────

export default function EarningsClient({ wallet, submissionEarnings, userName }: Props) {
  const t   = useTranslations('nav')
  const te  = useTranslations('earnings')
  const tcs = useTranslations('campaigns.status')
  const tc  = useTranslations('common')

  const CREATOR_NAV = [
    { label: t('dashboard'),    href: '/dashboard' },
    { label: t('discover'),     href: '/discover' },
    { label: t('myCampaigns'),  href: '/my-campaigns' },
    { label: t('earnings'),     href: '/earnings' },
    { label: t('profile'),      href: '/profile' },
  ]

  const TABS: { value: ActiveTab; label: string }[] = [
    { value: 'overview',   label: te('overview')    },
    { value: 'history',    label: te('history')     },
    { value: 'bycampaign', label: te('byCampaign')  },
  ]

  const TX_TYPE_LABELS: Record<TxType, string> = {
    CAMPAIGN_REWARD: te('txType.CAMPAIGN_REWARD'),
    WITHDRAWAL:      te('txType.WITHDRAWAL'),
    REFUND:          te('txType.REFUND'),
    PLATFORM_FEE:    te('txType.PLATFORM_FEE'),
    ADJUSTMENT:      te('txType.ADJUSTMENT'),
    BONUS:           te('txType.BONUS'),
    REFERRAL:        te('txType.REFERRAL'),
  }

  const SUBMISSION_STATUS_CFG: Record<string, { label: string; badge: string }> = {
    APPROVED:           { label: tcs('APPROVED'),           badge: SUBMISSION_STATUS_BADGE.APPROVED           },
    TRACKING:           { label: tcs('TRACKING'),           badge: SUBMISSION_STATUS_BADGE.TRACKING           },
    PERFORMANCE_LOCKED: { label: tcs('PERFORMANCE_LOCKED'), badge: SUBMISSION_STATUS_BADGE.PERFORMANCE_LOCKED },
    PAYOUT_PENDING:     { label: tcs('PAYOUT_PENDING'),     badge: SUBMISSION_STATUS_BADGE.PAYOUT_PENDING     },
    PAID:               { label: tcs('PAID'),               badge: SUBMISSION_STATUS_BADGE.PAID               },
  }

  const [tab, setTab] = useState<ActiveTab>('overview')

  const hasWallet          = wallet !== null
  const hasTransactions    = (wallet?.transactions.length ?? 0) > 0
  const hasCampaignEarnings = submissionEarnings.length > 0
  const availableAmt       = parseFloat(wallet?.availableBalance ?? '0')

  return (
    <div className="min-h-screen bg-page">
      <AppNav links={CREATOR_NAV} />

      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-3">
            {te('label')}
          </p>
          <h1 className="text-[42px] sm:text-[56px] font-black text-zinc-900 dark:text-white tracking-[-0.03em] leading-[0.92]">
            {userName ? te('titleNamed', { name: userName.split(' ')[0] }) : te('title')}
          </h1>
        </div>
      </div>

      {/* ── Stats strip ────────────────────────────────────────────────────── */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-black/[0.06] dark:divide-white/[0.06]">
            {[
              {
                label:  te('totalEarned'),
                value:  sar(wallet?.totalEarned ?? '0', 0),
                detail: te('allTime'),
                Icon:   TrendUp,
                accent: true,
              },
              {
                label:  te('available'),
                value:  sar(wallet?.availableBalance ?? '0', 0),
                detail: te('readyToWithdraw'),
                Icon:   ArrowUp,
              },
              {
                label:  te('pending'),
                value:  sar(wallet?.pendingBalance ?? '0', 0),
                detail: te('beingVerified'),
                Icon:   ArrowDown,
              },
              {
                label:  te('paidOut'),
                value:  sar(wallet?.lifetimePaid ?? '0', 0),
                detail: te('lifetime'),
                Icon:   ArrowUp,
              },
            ].map(({ label, value, detail, Icon, accent }) => (
              <div key={label} className="px-8 py-7 first:ps-0 last:pe-0">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">{label}</p>
                  <Icon size={14} weight="fill" className="text-zinc-700 shrink-0" />
                </div>
                <p className={`text-[28px] lg:text-[34px] font-black tracking-tight leading-none mb-1 ${
                  accent ? 'text-green-400' : 'text-zinc-900 dark:text-white'
                }`}>
                  {value}
                </p>
                <p className="text-[12px] text-zinc-600">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">

        {/* Available balance withdraw banner */}
        {availableAmt > 0 && (
          <div className="rounded-xl bg-green-500/[0.07] border border-green-500/20 px-5 py-4 flex items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-[13px] font-bold text-green-400">
                {te('availableToWithdraw', { amount: sar(wallet!.availableBalance) })}
              </p>
              <p className="text-[12px] text-green-600 mt-0.5">
                {te('withdrawComingSoon')}
              </p>
            </div>
            <button
              disabled
              className="shrink-0 rounded-lg bg-green-500/20 text-green-400 text-[12px] font-bold px-4 py-2 cursor-not-allowed opacity-60"
            >
              {te('withdraw')}
            </button>
          </div>
        )}

        {/* ── Tabs ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1 mb-6 border-b border-black/[0.06] dark:border-white/[0.06] pb-px">
          {TABS.map((tb) => {
            const active = tab === tb.value
            return (
              <button
                key={tb.value}
                onClick={() => setTab(tb.value)}
                className={`relative px-4 py-2.5 text-[13px] font-bold transition-colors ${
                  active ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 hover:text-zinc-400'
                }`}
              >
                {tb.label}
                {active && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-px bg-zinc-900 dark:bg-white" />
                )}
              </button>
            )
          })}
        </div>

        {/* ── Overview ─────────────────────────────────────────────────────── */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {!hasWallet ? (
              <DarkEmptyState
                title={te('noEarnings')}
                body={te('noEarningsDetail')}
                cta={{ label: te('discoverCampaigns'), href: '/discover' }}
              />
            ) : (
              <>
                {/* Recent transactions */}
                <div>
                  <p className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.14em] mb-4">
                    {te('recentActivity')}
                  </p>
                  {hasTransactions ? (
                    <div className="space-y-2">
                      {wallet!.transactions.slice(0, 5).map((tx) => (
                        <TxRow key={tx.id} tx={tx} />
                      ))}
                      {wallet!.transactions.length > 5 && (
                        <button
                          onClick={() => setTab('history')}
                          className="w-full text-center text-[12px] font-semibold text-zinc-600 hover:text-white transition-colors py-2"
                        >
                          {te('viewAllTransactions', { count: wallet!.transactions.length })}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-6 py-8 text-center">
                      <p className="text-[13px] text-zinc-600">{te('noTransactions')}</p>
                    </div>
                  )}
                </div>

                {/* Top campaigns */}
                {hasCampaignEarnings && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.14em]">
                        {te('topCampaigns')}
                      </p>
                      <button
                        onClick={() => setTab('bycampaign')}
                        className="text-[12px] font-semibold text-zinc-600 hover:text-white transition-colors flex items-center gap-1"
                      >
                        {tc('viewAll')} <ArrowRight size={11} weight="bold" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {submissionEarnings.slice(0, 3).map((s) => (
                        <CampaignEarningRow key={s.id} item={s} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── History ──────────────────────────────────────────────────────── */}
        {tab === 'history' && (
          <div>
            {!hasTransactions ? (
              <DarkEmptyState
                title={te('noTransactionHistory')}
                body={te('noTransactionHistoryDetail')}
              />
            ) : (
              <div className="space-y-1">
                {wallet!.transactions.map((tx, i) => {
                  const prev = wallet!.transactions[i - 1]
                  const showDateHeader =
                    i === 0 ||
                    new Date(tx.createdAt).toDateString() !== new Date(prev.createdAt).toDateString()
                  return (
                    <div key={tx.id}>
                      {showDateHeader && (
                        <p className="text-[11px] font-bold text-zinc-700 uppercase tracking-[0.12em] pt-5 pb-2 first:pt-0">
                          {relativeDate(tx.createdAt)}
                        </p>
                      )}
                      <TxRow tx={tx} showDate={false} />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── By Campaign ──────────────────────────────────────────────────── */}
        {tab === 'bycampaign' && (
          <div>
            {!hasCampaignEarnings ? (
              <DarkEmptyState
                title={te('noCampaignEarnings')}
                body={te('noCampaignEarningsDetail')}
                cta={{ label: te('discoverCampaigns'), href: '/discover' }}
              />
            ) : (
              <div className="space-y-2">
                {submissionEarnings.map((s) => (
                  <CampaignEarningRow key={s.id} item={s} expanded />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── TxRow ─────────────────────────────────────────────────────────────────────

function TxRow({ tx, showDate = true }: { tx: Transaction; showDate?: boolean }) {
  const te = useTranslations('earnings')
  const isCredit  = tx.direction === 'CREDIT'
  const isPending = tx.status === 'PENDING'
  const isFailed  = tx.status === 'FAILED' || tx.status === 'REVERSED'

  return (
    <div className="flex items-center justify-between rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-4 py-3.5 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        {/* Icon pill */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          isCredit ? 'bg-green-500/10' : 'bg-black/[0.05] dark:bg-white/[0.05]'
        }`}>
          {isCredit
            ? <ArrowUp size={14} weight="bold" className="text-green-400" />
            : <ArrowDown size={14} weight="bold" className="text-zinc-500" />
          }
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-zinc-900 dark:text-white truncate">
            {tx.description ?? te(`txType.${tx.type}`)}
          </p>
          {showDate && (
            <p className="text-[11px] text-zinc-600 mt-0.5">{relativeDate(tx.createdAt)}</p>
          )}
        </div>
      </div>
      <div className="text-end shrink-0">
        <p className={`text-[13px] font-bold ${
          isFailed ? 'text-red-400 line-through' : isCredit ? 'text-green-400' : 'text-zinc-400'
        }`}>
          {isCredit ? '+' : '−'}SAR {parseFloat(tx.amount).toLocaleString('en-SA', { minimumFractionDigits: 2 })}
        </p>
        {isPending && (
          <span className="text-[10px] font-bold text-amber-400">{te('pendingStatus')}</span>
        )}
        {isFailed && (
          <span className="text-[10px] font-bold text-red-400">{te('failedStatus')}</span>
        )}
      </div>
    </div>
  )
}

// ── CampaignEarningRow ────────────────────────────────────────────────────────

function CampaignEarningRow({ item, expanded = false }: { item: SubmissionEarning; expanded?: boolean }) {
  const tcs = useTranslations('campaigns.status')
  const badge = SUBMISSION_STATUS_BADGE[item.status] ?? 'bg-black/[0.06] dark:bg-white/[0.06] text-zinc-500'
  const statusLabel = (() => { try { return tcs(item.status as any) } catch { return item.status } })()

  return (
    <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] text-zinc-600 mb-0.5">{item.campaign.organization.name}</p>
          <Link
            href={`/campaigns/${item.campaign.slug}`}
            className="text-[14px] font-black text-zinc-900 dark:text-white hover:text-green-400 transition-colors truncate block"
          >
            {item.campaign.name}
          </Link>
          {expanded && (
            <p className="text-[11px] text-zinc-600 mt-1">
              {item.campaign.cpm && <>SAR {item.campaign.cpm} CPM · </>}
              {relativeDate(item.submittedAt)}
            </p>
          )}
        </div>
        <div className="text-end shrink-0">
          <p className="text-[15px] font-black text-green-400">
            +SAR {parseFloat(item.earnedAmount).toLocaleString('en-SA', { minimumFractionDigits: 2 })}
          </p>
          <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-black mt-1 ${badge}`}>
            {statusLabel}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── DarkEmptyState ────────────────────────────────────────────────────────────

function DarkEmptyState({
  title,
  body,
  cta,
}: {
  title: string
  body: string
  cta?: { label: string; href: string }
}) {
  return (
    <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-8 py-16 text-center">
      <p className="text-[15px] font-black text-zinc-900 dark:text-white mb-1">{title}</p>
      <p className="text-[13px] text-zinc-600 mb-6 max-w-[280px] mx-auto leading-relaxed">{body}</p>
      {cta && (
        <Link
          href={cta.href}
          className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-zinc-100 active:scale-[0.97] text-black font-black px-5 py-2.5 text-[13px] transition-all"
        >
          {cta.label}
          <ArrowRight size={13} weight="bold" />
        </Link>
      )}
    </div>
  )
}
