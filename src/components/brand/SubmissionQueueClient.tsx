'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

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

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_TABS: { value: string; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'PENDING_REVIEW', label: 'Pending Review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'TRACKING', label: 'Tracking' },
  { value: 'FLAGGED', label: 'Flagged' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'PAID', label: 'Paid' },
]

const STATUS_COLOR: Record<string, string> = {
  PENDING_REVIEW:     'bg-amber-500/10 text-amber-700 border-amber-200',
  APPROVED:           'bg-green-500/10 text-green-700 border-green-200',
  REJECTED:           'bg-red-500/10 text-red-700 border-red-200',
  FLAGGED:            'bg-orange-500/10 text-orange-700 border-orange-200',
  TRACKING:           'bg-blue-500/10 text-blue-700 border-blue-200',
  PERFORMANCE_LOCKED: 'bg-blue-600/10 text-blue-800 border-blue-200',
  PAYOUT_PENDING:     'bg-purple-500/10 text-purple-700 border-purple-200',
  PAID:               'bg-green-600/10 text-green-800 border-green-200',
  PAYMENT_HOLD:       'bg-rose-500/10 text-rose-700 border-rose-200',
  DISPUTED:           'bg-gray-500/10 text-gray-700 border-gray-200',
}

const STATUS_LABEL: Record<string, string> = {
  PENDING_REVIEW:     'Pending Review',
  APPROVED:           'Approved',
  REJECTED:           'Rejected',
  FLAGGED:            'Flagged',
  TRACKING:           'Tracking',
  PERFORMANCE_LOCKED: 'Locked In',
  PAYOUT_PENDING:     'Payout Pending',
  PAID:               'Paid',
  PAYMENT_HOLD:       'On Hold',
  DISPUTED:           'Disputed',
}

function relativeDate(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff}d ago`
  return new Date(iso).toLocaleDateString('en-SA', { day: 'numeric', month: 'short' })
}

function platformLabel(p: string): string {
  const map: Record<string, string> = {
    TIKTOK: 'TikTok',
    INSTAGRAM: 'Instagram',
    YOUTUBE: 'YouTube',
    X: 'X',
  }
  return map[p] ?? p
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SubmissionQueueClient({ initialSubmissions, initialTotal, pendingCount }: Props) {
  const [activeStatus, setActiveStatus] = useState('')
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [total, setTotal] = useState(initialTotal)
  const [isPending, startTransition] = useTransition()

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Submissions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total} submission{total !== 1 ? 's' : ''}
            {pendingCount > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                {pendingCount} pending review
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 flex-wrap border-b pb-0">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => switchTab(t.value)}
            className={`px-3 py-2 text-sm font-medium transition-colors rounded-t ${
              activeStatus === t.value
                ? 'text-primary border-b-2 border-primary -mb-px bg-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-semibold">No submissions</p>
          <p className="text-sm text-muted-foreground mt-1">
            {activeStatus ? `No ${STATUS_LABEL[activeStatus]?.toLowerCase()} submissions` : 'No submissions yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {submissions.map((s) => (
            <SubmissionRow key={s.id} submission={s} />
          ))}
        </div>
      )}
    </div>
  )
}

function SubmissionRow({ submission: s }: { submission: SubmissionRow }) {
  const colorClass = STATUS_COLOR[s.status] ?? 'bg-muted text-muted-foreground border-muted'
  const labelText = STATUS_LABEL[s.status] ?? s.status
  const isActionable = s.status === 'PENDING_REVIEW' || s.status === 'FLAGGED' || s.status === 'PAYMENT_HOLD'

  return (
    <Card className={`transition-shadow hover:shadow-sm ${isActionable ? 'ring-1 ring-amber-200' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Platform indicator */}
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xs font-bold shrink-0 text-muted-foreground">
            {s.platform.slice(0, 2)}
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{s.campaign.organization.name}</p>
                <p className="font-semibold text-sm truncate mt-0.5">{s.campaign.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{platformLabel(s.platform)}</span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-xs text-muted-foreground">{relativeDate(s.submittedAt)}</span>
                  <span className="text-muted-foreground/40">·</span>
                  <a
                    href={s.contentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline truncate max-w-[140px] inline-block"
                  >
                    View content ↗
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2 shrink-0">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
                  {labelText}
                </span>
              </div>
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <div className="flex items-center gap-4">
                {s.earnedAmount && (
                  <span className="text-sm font-semibold text-green-700">
                    SAR {parseFloat(s.earnedAmount).toLocaleString('en-SA', { minimumFractionDigits: 2 })}
                  </span>
                )}
                {s.rejectionReason && (
                  <span className="text-xs text-red-600 truncate max-w-[200px]">
                    Rejected: {s.rejectionReason}
                  </span>
                )}
              </div>
              <Link
                href={`/brand/submissions/${s.id}`}
                className="text-xs font-medium text-primary hover:underline"
              >
                {isActionable ? 'Review →' : 'View →'}
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
