'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowRight, ArrowSquareOut, Clock } from '@phosphor-icons/react'

// ── Types ─────────────────────────────────────────────────────────────────────

type SubmissionStatus =
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'FLAGGED'
  | 'TRACKING'
  | 'PERFORMANCE_LOCKED'
  | 'PAYOUT_PENDING'
  | 'PAID'
  | 'PAYMENT_HOLD'
  | 'DISPUTED'

interface SubmissionRow {
  id: string
  status: SubmissionStatus
  contentUrl: string
  platform: string
  earnedAmount: string | null
  rejectionReason: string | null
  submittedAt: string
  reviewedAt: string | null
  campaign: {
    id: string
    name: string
    slug: string
    cpm: string | null
    organization: { name: string }
  }
  reviews: Array<{
    action: string
    reason: string | null
    createdAt: string
  }>
}

interface Props {
  initialSubmissions: SubmissionRow[]
  initialTotal: number
  pendingCount: number
}

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, string> = {
  PENDING_REVIEW:     'bg-amber-500/10 text-amber-400',
  APPROVED:           'bg-green-500/10 text-green-400',
  REJECTED:           'bg-red-500/10 text-red-400',
  FLAGGED:            'bg-orange-500/10 text-orange-400',
  TRACKING:           'bg-blue-500/10 text-blue-400',
  PERFORMANCE_LOCKED: 'bg-blue-500/10 text-blue-400',
  PAYOUT_PENDING:     'bg-amber-500/10 text-amber-400',
  PAID:               'bg-green-500/20 text-green-300',
  PAYMENT_HOLD:       'bg-red-500/10 text-red-400',
  DISPUTED:           'bg-orange-500/10 text-orange-400',
}

const PLATFORM_SHORT: Record<string, string> = {
  TIKTOK: 'TikTok', INSTAGRAM: 'Instagram', YOUTUBE: 'YouTube', X: 'X',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function relativeDate(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7)  return `${diff}d ago`
  return new Date(iso).toLocaleDateString('en-SA', { day: 'numeric', month: 'short' })
}

// ── Row component ─────────────────────────────────────────────────────────────

function SubmissionCard({ submission: s }: { submission: SubmissionRow }) {
  const tcs = useTranslations('campaigns.status')
  const ts = useTranslations('submissions')
  const tc = useTranslations('common')
  const cfg = { label: tcs(s.status), badge: STATUS_BADGE[s.status] ?? 'bg-black/[0.06] dark:bg-white/[0.06] text-zinc-500' }
  const isActionable = s.status === 'PENDING_REVIEW' || s.status === 'FLAGGED' || s.status === 'PAYMENT_HOLD'

  return (
    <div className={`rounded-xl bg-surface border overflow-hidden transition-colors ${
      isActionable ? 'border-amber-500/20' : 'border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.12]'
    }`}>
      {/* Accent line */}
      <div className={`h-px ${
        isActionable
          ? 'bg-amber-500/40'
          : s.status === 'PAID'
            ? 'bg-gradient-to-r from-green-500 to-emerald-400'
            : s.status === 'REJECTED'
              ? 'bg-red-500/40'
              : 'bg-gradient-to-r from-blue-500/40 to-blue-400/20'
      }`} />

      <div className="flex items-start gap-4 p-4">
        {/* Platform pill */}
        <div className="w-10 h-10 rounded-lg bg-black/[0.05] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-center shrink-0">
          <span className="text-[10px] font-black text-zinc-500">
            {s.platform === 'INSTAGRAM' ? 'IG' : s.platform === 'YOUTUBE' ? 'YT' : s.platform.slice(0, 2)}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-600 truncate">{s.campaign.organization.name}</p>
              <p className="text-[14px] font-black text-zinc-900 dark:text-white truncate">{s.campaign.name}</p>
            </div>
            <span className={`shrink-0 text-[11px] font-black px-2.5 py-0.5 rounded-md ${cfg.badge}`}>
              {cfg.label}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-zinc-600 mb-3 flex-wrap">
            <span>{PLATFORM_SHORT[s.platform] ?? s.platform}</span>
            <span className="text-zinc-700">·</span>
            <span className="flex items-center gap-1">
              <Clock size={9} weight="fill" />
              {relativeDate(s.submittedAt)}
            </span>
            {s.campaign.cpm && (
              <>
                <span className="text-zinc-700">·</span>
                <span className="text-green-500 font-semibold">SAR {s.campaign.cpm} CPM</span>
              </>
            )}
          </div>

          {/* Rejection reason */}
          {s.rejectionReason && (
            <p className="text-[11px] text-red-400 truncate mb-3">
              {ts('rejectionReason', { reason: s.rejectionReason })}
            </p>
          )}

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {s.earnedAmount && (
                <span className="text-[13px] font-black text-green-400">
                  +SAR {parseFloat(s.earnedAmount).toLocaleString('en-SA', { minimumFractionDigits: 2 })}
                </span>
              )}
              <a
                href={s.contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-600 hover:text-white transition-colors"
              >
                {ts('viewPost')} <ArrowSquareOut size={10} weight="bold" />
              </a>
            </div>
            <Link
              href={`/brand/submissions/${s.id}`}
              className={`inline-flex items-center gap-1.5 rounded-lg text-[12px] font-bold px-3.5 py-1.5 transition-all active:scale-[0.97] ${
                isActionable
                  ? 'bg-white text-black hover:bg-zinc-100'
                  : 'border border-black/[0.1] dark:border-white/[0.1] text-zinc-700 dark:text-white/70 hover:border-black/20 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {isActionable ? tc('review') : tc('view')}
              <ArrowRight size={11} weight="bold" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SubmissionQueueClient({ initialSubmissions, initialTotal, pendingCount }: Props) {
  const tb = useTranslations('brand')
  const ts = useTranslations('submissions')
  const tc = useTranslations('common')
  const tcs = useTranslations('campaigns.status')
  const [activeStatus, setActiveStatus] = useState('')
  const [submissions,  setSubmissions]  = useState(initialSubmissions)
  const [total,        setTotal]        = useState(initialTotal)
  const [isPending,    startTransition] = useTransition()

  const STATUS_TABS: { value: string; label: string }[] = [
    { value: '',               label: tc('all')                  },
    { value: 'PENDING_REVIEW', label: tcs('PENDING_REVIEW') },
    { value: 'APPROVED',       label: tcs('APPROVED')       },
    { value: 'TRACKING',       label: tcs('TRACKING')       },
    { value: 'FLAGGED',        label: tcs('FLAGGED')        },
    { value: 'REJECTED',       label: tcs('REJECTED')       },
    { value: 'PAID',           label: tcs('PAID')           },
  ]

  function switchTab(status: string) {
    setActiveStatus(status)
    startTransition(async () => {
      const qs = status ? `?status=${status}` : ''
      const res = await fetch(`/api/brand/submissions${qs}`)
      if (res.ok) {
        const data = await res.json()
        setSubmissions(data.submissions)
        setTotal(data.total)
      }
    })
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-3">{tb('label')}</p>
        <div className="flex items-end justify-between gap-4">
          <h1 className="text-[42px] sm:text-[56px] font-black text-zinc-900 dark:text-white tracking-[-0.03em] leading-none">
            {ts('title')}
          </h1>
          {pendingCount > 0 && (
            <span className="shrink-0 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[12px] font-black px-3 py-1.5 mb-2">
              {pendingCount} {ts('pendingReview')}
            </span>
          )}
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-black/[0.06] dark:border-white/[0.06] pb-px mb-6 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {STATUS_TABS.map((t) => {
          const active = activeStatus === t.value
          return (
            <button
              key={t.value}
              onClick={() => switchTab(t.value)}
              className={`relative shrink-0 px-4 py-2.5 text-[13px] font-bold transition-colors ${
                active ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {t.label}
              {active && <span className="absolute bottom-[-1px] left-0 right-0 h-px bg-zinc-900 dark:bg-white" />}
            </button>
          )
        })}
        <span className="ms-auto shrink-0 text-[12px] text-zinc-700 pb-2.5 ps-4">
          {total} {tc('submissionsUnit', { count: total })}
        </span>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-[100px] rounded-xl bg-black/[0.03] dark:bg-white/[0.03] animate-pulse border border-black/[0.04] dark:border-white/[0.04]" />
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-8 py-20 text-center">
          <p className="text-[15px] font-black text-zinc-900 dark:text-white mb-1">{ts('noSubmissions')}</p>
          <p className="text-[13px] text-zinc-600">
            {activeStatus
              ? ts('noSubmissionsFiltered', { status: tcs(activeStatus as SubmissionStatus) })
              : ts('noSubmissionsEmpty')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => (
            <SubmissionCard key={s.id} submission={s} />
          ))}
        </div>
      )}
    </div>
  )
}
