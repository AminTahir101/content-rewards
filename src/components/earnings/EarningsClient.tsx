'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

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

function sar(value: string | null, opts?: { sign?: boolean }): string {
  if (!value) return 'SAR 0'
  const num = parseFloat(value)
  const formatted = num.toLocaleString('en-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (opts?.sign && num > 0) return `+SAR ${formatted}`
  return `SAR ${formatted}`
}

function relativeDate(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`
  return new Date(iso).toLocaleDateString('en-SA', { day: 'numeric', month: 'short', year: 'numeric' })
}

const TX_TYPE_LABELS: Record<TxType, string> = {
  CAMPAIGN_REWARD: 'Campaign Reward',
  WITHDRAWAL:      'Withdrawal',
  REFUND:          'Refund',
  PLATFORM_FEE:    'Platform Fee',
  ADJUSTMENT:      'Adjustment',
  BONUS:           'Bonus',
  REFERRAL:        'Referral',
}

const SUBMISSION_STATUS_LABELS: Record<string, string> = {
  APPROVED:           'Approved',
  TRACKING:           'Tracking',
  PERFORMANCE_LOCKED: 'Locked In',
  PAYOUT_PENDING:     'Payout Pending',
  PAID:               'Paid',
}

const SUBMISSION_STATUS_COLOR: Record<string, string> = {
  APPROVED:           'bg-green-500/10 text-green-700',
  TRACKING:           'bg-green-500/10 text-green-700',
  PERFORMANCE_LOCKED: 'bg-blue-500/10 text-blue-700',
  PAYOUT_PENDING:     'bg-amber-500/10 text-amber-700',
  PAID:               'bg-green-600/10 text-green-800',
}

// ── Component ─────────────────────────────────────────────────────────────────

type ActiveTab = 'overview' | 'history' | 'bycampaign'

export default function EarningsClient({ wallet, submissionEarnings, userName }: Props) {
  const [tab, setTab] = useState<ActiveTab>('overview')

  const hasWallet = wallet !== null
  const hasTransactions = (wallet?.transactions.length ?? 0) > 0
  const hasCampaignEarnings = submissionEarnings.length > 0

  const tabs: { value: ActiveTab; label: string }[] = [
    { value: 'overview', label: 'Overview' },
    { value: 'history', label: 'History' },
    { value: 'bycampaign', label: 'By Campaign' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-lg">Content Rewards</span>
          <Badge variant="secondary">Creator</Badge>
        </div>
      </nav>

      <main className="max-w-lg mx-auto px-4 py-5 pb-28 space-y-5">
        <h1 className="text-xl font-bold">
          {userName ? `${userName.split(' ')[0]}'s Earnings` : 'My Earnings'}
        </h1>

        {/* ── Balance cards ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="col-span-2 bg-primary text-primary-foreground">
            <CardContent className="pt-5 pb-4 px-5">
              <p className="text-sm opacity-80">Total Earned</p>
              <p className="text-3xl font-bold mt-1">
                {sar(wallet?.totalEarned ?? '0')}
              </p>
            </CardContent>
          </Card>

          {[
            { label: 'Available', value: wallet?.availableBalance ?? '0', color: 'text-green-700' },
            { label: 'Pending', value: wallet?.pendingBalance ?? '0', color: 'text-amber-700' },
            { label: 'Paid Out', value: wallet?.lifetimePaid ?? '0', color: '' },
            { label: 'Campaigns', value: String(submissionEarnings.length), color: '', isSar: false },
          ].map(({ label, value, color, isSar = true }) => (
            <Card key={label}>
              <CardContent className="pt-4 pb-3 px-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-lg font-bold mt-0.5 ${color}`}>
                  {isSar ? sar(value) : value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Available balance CTA */}
        {parseFloat(wallet?.availableBalance ?? '0') > 0 && (
          <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-green-900">
                {sar(wallet!.availableBalance)} available
              </p>
              <p className="text-xs text-green-700 mt-0.5">Ready to withdraw to your bank</p>
            </div>
            <button
              disabled
              className="rounded-lg bg-green-700 px-3 py-1.5 text-xs font-semibold text-white opacity-60 cursor-not-allowed"
              title="Withdrawals coming soon"
            >
              Withdraw
            </button>
          </div>
        )}

        {/* ── Tabs ────────────────────────────────────────────────────── */}
        <div className="flex border-b">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === t.value
                  ? 'text-primary border-b-2 border-primary -mb-px'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Overview tab ────────────────────────────────────────────── */}
        {tab === 'overview' && (
          <div className="space-y-4">
            {!hasWallet ? (
              <EmptyState
                title="No earnings yet"
                body="Join campaigns and submit content to start earning."
                cta={{ label: 'Discover campaigns', href: '/discover' }}
              />
            ) : (
              <>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                    Recent Activity
                  </p>
                  {hasTransactions ? (
                    <div className="space-y-2">
                      {wallet!.transactions.slice(0, 5).map((tx) => (
                        <TxRow key={tx.id} tx={tx} />
                      ))}
                      {wallet!.transactions.length > 5 && (
                        <button
                          onClick={() => setTab('history')}
                          className="w-full text-center text-sm text-primary hover:underline py-1"
                        >
                          View all {wallet!.transactions.length} transactions →
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No transactions yet.</p>
                  )}
                </div>

                {hasCampaignEarnings && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                        Top Campaigns
                      </p>
                      <div className="space-y-2">
                        {submissionEarnings.slice(0, 3).map((s) => (
                          <CampaignEarningRow key={s.id} item={s} />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* ── History tab ─────────────────────────────────────────────── */}
        {tab === 'history' && (
          <div>
            {!hasTransactions ? (
              <EmptyState
                title="No transaction history"
                body="Transactions appear here once your content earns rewards."
              />
            ) : (
              <div className="space-y-1">
                {wallet!.transactions.map((tx, i) => {
                  const prev = wallet!.transactions[i - 1]
                  const showDate =
                    i === 0 ||
                    new Date(tx.createdAt).toDateString() !== new Date(prev.createdAt).toDateString()
                  return (
                    <div key={tx.id}>
                      {showDate && (
                        <p className="text-xs text-muted-foreground pt-3 pb-1 font-medium">
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

        {/* ── By Campaign tab ─────────────────────────────────────────── */}
        {tab === 'bycampaign' && (
          <div>
            {!hasCampaignEarnings ? (
              <EmptyState
                title="No campaign earnings yet"
                body="Approved submissions with verified views appear here."
                cta={{ label: 'Discover campaigns', href: '/discover' }}
              />
            ) : (
              <div className="space-y-3">
                {submissionEarnings.map((s) => (
                  <CampaignEarningRow key={s.id} item={s} expanded />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 inset-x-0 border-t bg-background">
        <div className="max-w-lg mx-auto grid grid-cols-5 py-2">
          {[
            { label: 'Home', href: '/dashboard' },
            { label: 'Discover', href: '/discover' },
            { label: 'Campaigns', href: '/my-campaigns' },
            { label: 'Earnings', href: '/earnings' },
            { label: 'Profile', href: '/profile' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 text-xs transition-colors ${
                item.href === '/earnings'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="w-5 h-5 rounded bg-muted" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TxRow({ tx, showDate = true }: { tx: Transaction; showDate?: boolean }) {
  const isCredit = tx.direction === 'CREDIT'
  const isPending = tx.status === 'PENDING'

  return (
    <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-3 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
            isCredit ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
          }`}
        >
          {isCredit ? '↑' : '↓'}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {tx.description ?? TX_TYPE_LABELS[tx.type]}
          </p>
          {showDate && (
            <p className="text-xs text-muted-foreground mt-0.5">{relativeDate(tx.createdAt)}</p>
          )}
        </div>
      </div>
      <div className="text-end shrink-0">
        <p
          className={`text-sm font-semibold ${
            isCredit ? 'text-green-700' : 'text-foreground'
          }`}
        >
          {isCredit ? '+' : '-'}SAR {parseFloat(tx.amount).toLocaleString('en-SA', { minimumFractionDigits: 2 })}
        </p>
        {isPending && (
          <span className="text-xs text-amber-600 font-medium">Pending</span>
        )}
      </div>
    </div>
  )
}

function CampaignEarningRow({ item, expanded = false }: { item: SubmissionEarning; expanded?: boolean }) {
  const statusLabel = SUBMISSION_STATUS_LABELS[item.status] ?? item.status
  const statusColor = SUBMISSION_STATUS_COLOR[item.status] ?? 'bg-muted text-muted-foreground'

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{item.campaign.organization.name}</p>
            <Link
              href={`/campaigns/${item.campaign.slug}`}
              className="text-sm font-semibold hover:underline truncate block mt-0.5"
            >
              {item.campaign.name}
            </Link>
          </div>
          <div className="text-end shrink-0">
            <p className="text-base font-bold text-green-700">
              +SAR {parseFloat(item.earnedAmount).toLocaleString('en-SA', { minimumFractionDigits: 2 })}
            </p>
            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium mt-1 ${statusColor}`}>
              {statusLabel}
            </span>
          </div>
        </div>
        {expanded && item.campaign.cpm && (
          <p className="text-xs text-muted-foreground mt-2">
            SAR {item.campaign.cpm} CPM · {relativeDate(item.submittedAt)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function EmptyState({
  title,
  body,
  cta,
}: {
  title: string
  body: string
  cta?: { label: string; href: string }
}) {
  return (
    <div className="py-12 text-center space-y-2">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{body}</p>
      {cta && (
        <Link href={cta.href} className="inline-block mt-3 text-sm text-primary hover:underline">
          {cta.label} →
        </Link>
      )}
    </div>
  )
}
