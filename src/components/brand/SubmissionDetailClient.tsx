'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  ArrowLeft,
  ArrowSquareOut,
  CheckCircle,
  XCircle,
  Flag,
  Lock,
  Warning,
  User,
  Clock,
} from '@phosphor-icons/react'

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

const ACTION_ACTIVE_STYLE: Record<ReviewAction, { active: string; Icon: React.ElementType }> = {
  APPROVED: { active: 'bg-green-500 text-black border-green-500',         Icon: CheckCircle },
  REJECTED: { active: 'bg-red-500 text-white border-red-500',              Icon: XCircle    },
  FLAGGED:  { active: 'bg-orange-500 text-white border-orange-500',        Icon: Flag       },
  HOLD:     { active: 'bg-zinc-600 text-white border-zinc-600',            Icon: Lock       },
}

const REVIEW_STATES = ['PENDING_REVIEW', 'FLAGGED', 'PAYMENT_HOLD']

const PLATFORM_SHORT: Record<string, string> = {
  TIKTOK: 'TikTok', INSTAGRAM: 'Instagram', YOUTUBE: 'YouTube', X: 'X',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString('en-SA', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Dark card wrapper ─────────────────────────────────────────────────────────

function DarkCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
      <div className="px-5 py-4 border-b border-black/[0.05] dark:border-white/[0.05]">
        <p className="text-[13px] font-black text-zinc-900 dark:text-white">{title}</p>
      </div>
      <div className="px-5 py-4">
        {children}
      </div>
    </div>
  )
}

// ── Timeline row ──────────────────────────────────────────────────────────────

function TimelineRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-black/[0.05] dark:border-white/[0.05] last:border-0">
      <p className="text-[12px] text-zinc-600">{label}</p>
      <p className={`text-[12px] font-semibold text-end ${accent ? 'text-green-400' : 'text-zinc-400'}`}>
        {value}
      </p>
    </div>
  )
}

// ── Review panel ──────────────────────────────────────────────────────────────

function ReviewPanel({ submissionId }: { submissionId: string }) {
  const tb = useTranslations('brand')
  const [action,  setAction]  = useState<ReviewAction | ''>('')
  const [reason,  setReason]  = useState('')
  const [notes,   setNotes]   = useState('')
  const [error,   setError]   = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const ACTION_CFG: Record<ReviewAction, { label: string; active: string; Icon: React.ElementType }> = {
    APPROVED: { label: tb('approve'),     ...ACTION_ACTIVE_STYLE.APPROVED },
    REJECTED: { label: tb('reject'),      ...ACTION_ACTIVE_STYLE.REJECTED },
    FLAGGED:  { label: tb('flag'),        ...ACTION_ACTIVE_STYLE.FLAGGED  },
    HOLD:     { label: tb('putOnHold'),   ...ACTION_ACTIVE_STYLE.HOLD     },
  }

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
      if (!res.ok) { setError(data.error ?? 'Something went wrong'); return }
      router.refresh()
    })
  }

  const needsReason = action === 'REJECTED' || action === 'FLAGGED'

  return (
    <div className="rounded-xl bg-amber-500/[0.05] border border-amber-500/20 overflow-hidden">
      <div className="px-5 py-4 border-b border-amber-500/10">
        <p className="text-[13px] font-black text-amber-400">{tb('reviewSubmission')}</p>
      </div>
      <div className="px-5 py-4 space-y-4">

        {/* Action buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['APPROVED', 'REJECTED', 'FLAGGED', 'HOLD'] as ReviewAction[]).map((a) => {
            const cfg    = ACTION_CFG[a]
            const active = action === a
            return (
              <button
                key={a}
                onClick={() => setAction(a)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-[12px] font-black transition-all ${
                  active
                    ? cfg.active
                    : 'bg-black/[0.04] dark:bg-white/[0.04] border-black/[0.08] dark:border-white/[0.08] text-zinc-500 hover:border-black/20 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <cfg.Icon size={13} weight="fill" />
                {cfg.label}
              </button>
            )
          })}
        </div>

        {/* Reason */}
        {needsReason && (
          <div>
            <label className="block text-[12px] font-bold text-zinc-400 mb-2">
              {tb('reason')} {action === 'REJECTED' ? <span className="text-red-400">({tb('required')})</span> : `(${tb('optional')})`}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              maxLength={1000}
              placeholder={action === 'REJECTED' ? tb('rejectPlaceholder') : tb('flagPlaceholder')}
              className="w-full rounded-lg bg-black/[0.05] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.08] text-[13px] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 px-3 py-2.5 focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-black/[0.07] dark:focus:bg-white/[0.07] transition resize-none"
            />
          </div>
        )}

        {/* Internal notes */}
        {action && (
          <div>
            <label className="block text-[12px] font-bold text-zinc-400 mb-2">
              {tb('internalNotes')} <span className="text-zinc-600 font-normal">({tb('teamOnly')})</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              maxLength={2000}
              placeholder={tb('notesPlaceholder')}
              className="w-full rounded-lg bg-black/[0.05] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.08] text-[13px] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 px-3 py-2.5 focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-black/[0.07] dark:focus:bg-white/[0.07] transition resize-none"
            />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/[0.07] border border-red-500/20 px-3 py-2.5">
            <Warning size={13} weight="fill" className="text-red-400 shrink-0" />
            <p className="text-[12px] text-red-400">{error}</p>
          </div>
        )}

        <button
          onClick={submit}
          disabled={!action || isPending || (action === 'REJECTED' && !reason.trim())}
          className="w-full rounded-lg bg-white hover:bg-zinc-100 active:scale-[0.98] text-black font-black text-[13px] py-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending
            ? tb('submitting')
            : action
              ? tb('confirm', { action: ACTION_CFG[action].label })
              : tb('selectAction')
          }
        </button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SubmissionDetailClient({ submission: s, creator, canReview }: Props) {
  const tb = useTranslations('brand')
  const ts = useTranslations('submissions')
  const tp = useTranslations('profile')
  const tcs = useTranslations('campaigns.status')
  const statusCfg = { label: tcs(s.status as any), badge: STATUS_BADGE[s.status] ?? 'bg-black/[0.06] dark:bg-white/[0.06] text-zinc-500' }
  const isReviewable = REVIEW_STATES.includes(s.status) && canReview
  const displayName  = creator?.profile?.displayName ?? creator?.name ?? creator?.email ?? 'Unknown creator'
  const handle       = creator?.creatorProfile?.handle

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">

      {/* ── Back link ────────────────────────────────────────────────────────── */}
      <Link
        href="/brand/submissions"
        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors mb-8"
      >
        <ArrowLeft size={12} weight="bold" />
        {tb('backToSubmissions')}
      </Link>

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-2">
            {s.campaign.organization.name} · {s.campaign.name}
          </p>
          <h1 className="text-[36px] sm:text-[48px] font-black text-zinc-900 dark:text-white tracking-[-0.02em] leading-none">
            {tb('submissionDetail')}
          </h1>
        </div>
        <span className={`shrink-0 rounded-lg text-[12px] font-black px-3 py-1.5 ${statusCfg.badge}`}>
          {statusCfg.label}
        </span>
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left column ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Content card */}
          <DarkCard title={tb('content')}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">{ts('platform')}</p>
                <p className="text-[14px] font-black text-zinc-900 dark:text-white">
                  {PLATFORM_SHORT[s.platform] ?? s.platform}
                </p>
              </div>
              <a
                href={s.contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.1] dark:border-white/[0.1] text-zinc-700 dark:text-white/70 hover:border-black/20 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-white text-[12px] font-bold px-3.5 py-2 transition-all"
              >
                {tb('viewContent')}
                <ArrowSquareOut size={12} weight="bold" />
              </a>
            </div>
            <div className="border-t border-black/[0.05] dark:border-white/[0.05] pt-4">
              <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-2">{tb('url')}</p>
              <p className="text-[12px] text-zinc-500 break-all font-mono leading-relaxed">{s.contentUrl}</p>
            </div>
            {s.rejectionReason && (
              <div className="mt-4 rounded-lg bg-red-500/[0.07] border border-red-500/15 px-4 py-3">
                <p className="text-[11px] font-black text-red-500 uppercase tracking-wider mb-1">{tb('rejectionReason')}</p>
                <p className="text-[13px] text-red-400 leading-relaxed">{s.rejectionReason}</p>
              </div>
            )}
          </DarkCard>

          {/* Campaign context */}
          <DarkCard title={tb('campaignContext')}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 mb-4">
              <div>
                <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">{tb('rewardModel')}</p>
                <p className="text-[13px] font-black text-zinc-900 dark:text-white">{s.campaign.rewardModel}</p>
              </div>
              {s.campaign.cpm && (
                <div>
                  <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">CPM</p>
                  <p className="text-[13px] font-black text-green-400">SAR {s.campaign.cpm}</p>
                </div>
              )}
              <div>
                <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">{tb('minPayout')}</p>
                <p className="text-[13px] font-black text-zinc-900 dark:text-white">SAR {s.campaign.minPayout}</p>
              </div>
              {s.campaign.maxCreatorPayout && (
                <div>
                  <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">{tb('maxPayout')}</p>
                  <p className="text-[13px] font-black text-zinc-900 dark:text-white">SAR {s.campaign.maxCreatorPayout}</p>
                </div>
              )}
            </div>
            {(s.campaign.requiredHashtags.length > 0 || s.campaign.requiredMentions.length > 0) && (
              <div className="border-t border-black/[0.05] dark:border-white/[0.05] pt-4 flex flex-wrap gap-2">
                {s.campaign.requiredHashtags.map((h) => (
                  <span key={h} className="rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-bold px-2.5 py-1">
                    {h}
                  </span>
                ))}
                {s.campaign.requiredMentions.map((m) => (
                  <span key={m} className="rounded-lg bg-black/[0.05] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.06] text-zinc-400 text-[11px] font-bold px-2.5 py-1">
                    {m}
                  </span>
                ))}
              </div>
            )}
          </DarkCard>

          {/* Review history */}
          {s.reviews.length > 0 && (
            <DarkCard title={tb('reviewHistory')}>
              <div className="space-y-4">
                {s.reviews.map((r) => {
                  const actionBadge =
                    r.action === 'APPROVED' ? 'bg-green-500/10 text-green-400' :
                    r.action === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                    r.action === 'FLAGGED'  ? 'bg-orange-500/10 text-orange-400' :
                    'bg-black/[0.06] dark:bg-white/[0.06] text-zinc-500'
                  return (
                    <div key={r.id} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-black/[0.05] dark:bg-white/[0.05] flex items-center justify-center shrink-0">
                        <Clock size={12} weight="fill" className="text-zinc-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`rounded-md text-[10px] font-black px-2 py-0.5 ${actionBadge}`}>
                            {r.action === 'APPROVED' ? tb('approved') : r.action === 'REJECTED' ? tb('rejected') : r.action === 'FLAGGED' ? tb('flagged') : r.action === 'HOLD' ? tb('held') : r.action}
                          </span>
                          <span className="text-[11px] text-zinc-600">{fmt(r.createdAt)}</span>
                        </div>
                        {r.reason && <p className="text-[12px] text-zinc-500 leading-relaxed">{r.reason}</p>}
                        {r.notes && (
                          <p className="text-[11px] text-zinc-700 mt-1 italic">{tb('note', { note: r.notes })}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </DarkCard>
          )}

          {/* Review panel */}
          {isReviewable && <ReviewPanel submissionId={s.id} />}
        </div>

        {/* ── Right sidebar ────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Creator card */}
          <DarkCard title={tb('creator')}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-black/[0.05] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-center shrink-0">
                <User size={18} weight="fill" className="text-zinc-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-black text-zinc-900 dark:text-white truncate">{displayName}</p>
                {handle && <p className="text-[12px] text-zinc-600">@{handle}</p>}
              </div>
            </div>
            {creator?.creatorProfile && (
              <div className="border-t border-black/[0.05] dark:border-white/[0.05] pt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">{tp('followers')}</p>
                  <p className="text-[16px] font-black text-zinc-900 dark:text-white">
                    {creator.creatorProfile.totalFollowers.toLocaleString('en-SA')}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">{tb('score')}</p>
                  <p className="text-[16px] font-black text-zinc-900 dark:text-white">{creator.creatorProfile.score}</p>
                </div>
                {creator.creatorProfile.isVerified && (
                  <div className="col-span-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-black px-2.5 py-1">
                      <CheckCircle size={10} weight="fill" />
                      {tb('verifiedCreator')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </DarkCard>

          {/* Timeline card */}
          <DarkCard title={tb('timeline')}>
            <TimelineRow label={tb('submitted')}    value={fmt(s.submittedAt)} />
            {s.reviewedAt && (
              <TimelineRow label={tb('reviewed')}   value={fmt(s.reviewedAt)} />
            )}
            <TimelineRow label={tb('lastUpdated')} value={fmt(s.updatedAt)} />
            {s.earnedAmount && (
              <TimelineRow
                label={tb('earned')}
                value={`SAR ${parseFloat(s.earnedAmount).toLocaleString('en-SA', { minimumFractionDigits: 2 })}`}
                accent
              />
            )}
          </DarkCard>
        </div>
      </div>
    </div>
  )
}
