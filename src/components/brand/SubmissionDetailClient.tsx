'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// ── Types ─────────────────────────────────────────────────────────────────────

type ReviewAction = 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'HOLD'

interface ReviewRecord {
  id: string
  reviewerId: string
  action: ReviewAction
  reason: string | null
  notes: string | null
  createdAt: string
}

interface Submission {
  id: string
  userId: string
  status: string
  contentUrl: string
  platform: string
  earnedAmount: string | null
  rejectionReason: string | null
  submittedAt: string
  reviewedAt: string | null
  updatedAt: string
  campaign: {
    id: string
    name: string
    slug: string
    cpm: string | null
    rewardModel: string
    minPayout: string
    maxCreatorPayout: string | null
    requiredHashtags: string[]
    requiredMentions: string[]
    organization: { name: string }
  }
  reviews: ReviewRecord[]
}

interface Creator {
  id: string
  name: string | null
  email: string
  profile: { displayName: string | null; avatarUrl: string | null; country: string | null } | null
  creatorProfile: {
    handle: string | null
    totalFollowers: number
    score: number
    isVerified: boolean
  } | null
}

interface Props {
  submission: Submission
  creator: Creator | null
  canReview: boolean
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  PENDING_REVIEW:     'bg-amber-100 text-amber-800',
  APPROVED:           'bg-green-100 text-green-800',
  REJECTED:           'bg-red-100 text-red-800',
  FLAGGED:            'bg-orange-100 text-orange-800',
  TRACKING:           'bg-blue-100 text-blue-800',
  PERFORMANCE_LOCKED: 'bg-blue-200 text-blue-900',
  PAYOUT_PENDING:     'bg-purple-100 text-purple-800',
  PAID:               'bg-green-200 text-green-900',
  PAYMENT_HOLD:       'bg-rose-100 text-rose-800',
  DISPUTED:           'bg-gray-100 text-gray-800',
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

const ACTION_LABEL: Record<string, string> = {
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  FLAGGED:  'Flagged',
  HOLD:     'Put on Hold',
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-SA', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function platformLabel(p: string): string {
  const map: Record<string, string> = { TIKTOK: 'TikTok', INSTAGRAM: 'Instagram', YOUTUBE: 'YouTube', X: 'X' }
  return map[p] ?? p
}

// ── Review Panel ──────────────────────────────────────────────────────────────

const REVIEW_STATES = ['PENDING_REVIEW', 'FLAGGED', 'PAYMENT_HOLD']

function ReviewPanel({ submissionId }: { submissionId: string }) {
  const [action, setAction] = useState<ReviewAction | ''>('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function submit() {
    if (!action) return
    setError(null)
    startTransition(async () => {
      const res = await fetch(`/api/brand/submissions/${submissionId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason: reason || undefined, notes: notes || undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
        return
      }
      router.refresh()
    })
  }

  return (
    <Card className="border-amber-200 bg-amber-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Review Submission</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Action selector */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(['APPROVED', 'REJECTED', 'FLAGGED', 'HOLD'] as ReviewAction[]).map((a) => (
            <button
              key={a}
              onClick={() => setAction(a)}
              className={`rounded-lg border py-2 text-sm font-medium transition-colors ${
                action === a
                  ? a === 'APPROVED'
                    ? 'bg-green-600 text-white border-green-600'
                    : a === 'REJECTED'
                    ? 'bg-red-600 text-white border-red-600'
                    : a === 'FLAGGED'
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-gray-600 text-white border-gray-600'
                  : 'bg-background hover:bg-muted'
              }`}
            >
              {ACTION_LABEL[a]}
            </button>
          ))}
        </div>

        {/* Reason (required for REJECT) */}
        {(action === 'REJECTED' || action === 'FLAGGED') && (
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">
              Reason {action === 'REJECTED' ? '(required)' : '(optional)'}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              maxLength={1000}
              placeholder={action === 'REJECTED' ? 'Why is this being rejected?' : 'What was flagged?'}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {/* Internal notes (always available when action chosen) */}
        {action && (
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">
              Internal notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              maxLength={2000}
              placeholder="Notes visible to your team only"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          onClick={submit}
          disabled={!action || isPending || (action === 'REJECTED' && !reason.trim())}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isPending ? 'Submitting…' : action ? `Confirm: ${ACTION_LABEL[action]}` : 'Select an action above'}
        </button>
      </CardContent>
    </Card>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function SubmissionDetailClient({ submission: s, creator, canReview }: Props) {
  const statusColor = STATUS_COLOR[s.status] ?? 'bg-muted text-muted-foreground'
  const statusLabel = STATUS_LABEL[s.status] ?? s.status
  const isReviewable = REVIEW_STATES.includes(s.status) && canReview

  const displayName = creator?.profile?.displayName ?? creator?.name ?? creator?.email ?? 'Unknown creator'
  const handle = creator?.creatorProfile?.handle

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{s.campaign.organization.name} · {s.campaign.name}</p>
          <h1 className="text-2xl font-bold">Submission Detail</h1>
        </div>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">

          {/* Content */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Platform</p>
                  <p className="font-medium">{platformLabel(s.platform)}</p>
                </div>
                <a
                  href={s.contentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
                >
                  View content ↗
                </a>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">URL</p>
                <p className="text-sm break-all text-muted-foreground">{s.contentUrl}</p>
              </div>
              {s.rejectionReason && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
                  <p className="text-xs font-semibold text-red-700 mb-0.5">Rejection reason</p>
                  <p className="text-sm text-red-700">{s.rejectionReason}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Campaign context */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Reward model</p>
                  <p className="font-medium">{s.campaign.rewardModel}</p>
                </div>
                {s.campaign.cpm && (
                  <div>
                    <p className="text-xs text-muted-foreground">CPM</p>
                    <p className="font-medium">SAR {s.campaign.cpm}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Min payout</p>
                  <p className="font-medium">SAR {s.campaign.minPayout}</p>
                </div>
                {s.campaign.maxCreatorPayout && (
                  <div>
                    <p className="text-xs text-muted-foreground">Max payout</p>
                    <p className="font-medium">SAR {s.campaign.maxCreatorPayout}</p>
                  </div>
                )}
              </div>
              {(s.campaign.requiredHashtags.length > 0 || s.campaign.requiredMentions.length > 0) && (
                <>
                  <Separator className="my-3" />
                  <div className="flex flex-wrap gap-1.5">
                    {s.campaign.requiredHashtags.map((h) => (
                      <span key={h} className="rounded-full bg-muted px-2 py-0.5 text-xs">{h}</span>
                    ))}
                    {s.campaign.requiredMentions.map((m) => (
                      <span key={m} className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-xs">{m}</span>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Review history */}
          {s.reviews.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Review History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {s.reviews.map((r) => (
                    <div key={r.id} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                        {r.action[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{ACTION_LABEL[r.action] ?? r.action}</span>
                          <span className="text-xs text-muted-foreground">{fmt(r.createdAt)}</span>
                        </div>
                        {r.reason && <p className="text-sm text-muted-foreground mt-0.5">{r.reason}</p>}
                        {r.notes && (
                          <p className="text-xs text-muted-foreground/70 mt-0.5 italic">Note: {r.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review action panel */}
          {isReviewable && <ReviewPanel submissionId={s.id} />}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Creator card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Creator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0">
                  {displayName[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{displayName}</p>
                  {handle && <p className="text-xs text-muted-foreground">@{handle}</p>}
                </div>
              </div>
              {creator?.creatorProfile && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Followers</p>
                    <p className="font-semibold text-sm">
                      {creator.creatorProfile.totalFollowers.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className="font-semibold text-sm">{creator.creatorProfile.score}</p>
                  </div>
                  {creator.creatorProfile.isVerified && (
                    <div className="col-span-2">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                        Verified creator
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submitted</span>
                <span className="font-medium">{fmt(s.submittedAt)}</span>
              </div>
              {s.reviewedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reviewed</span>
                  <span className="font-medium">{fmt(s.reviewedAt)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last updated</span>
                <span className="font-medium">{fmt(s.updatedAt)}</span>
              </div>
              {s.earnedAmount && (
                <>
                  <Separator className="my-1" />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Earned</span>
                    <span className="font-bold text-green-700">
                      SAR {parseFloat(s.earnedAmount).toLocaleString('en-SA', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
