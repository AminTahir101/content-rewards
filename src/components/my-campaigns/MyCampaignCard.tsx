import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Warning, Clock } from '@phosphor-icons/react/dist/ssr'
import { getNextAction, type MyCampaignEntry, type SubmissionStatus } from '@/components/my-campaigns/types'

// ── Labels ────────────────────────────────────────────────────────────────────

const PLATFORM_SHORT: Record<string, string> = {
  TIKTOK: 'TikTok', INSTAGRAM: 'Instagram', YOUTUBE: 'YouTube', X: 'X',
}

const CATEGORY_LABELS: Record<string, string> = {
  LIFESTYLE: 'Lifestyle', ENTERTAINMENT: 'Entertainment', GAMING: 'Gaming',
  TECHNOLOGY: 'Technology', FOOD: 'Food', FASHION: 'Fashion',
  BEAUTY: 'Beauty', TRAVEL: 'Travel', SPORTS: 'Sports',
  EDUCATION: 'Education', FINANCE: 'Finance', OTHER: 'Other',
}

// ── Status config ─────────────────────────────────────────────────────────────

interface StatusCfg { label: string; badge: string }

const STATUS_CFG: Record<SubmissionStatus, StatusCfg> = {
  DRAFT:              { label: 'Draft',          badge: 'bg-black/[0.07] dark:bg-white/[0.07] text-zinc-500'          },
  SUBMITTED:          { label: 'Submitted',      badge: 'bg-blue-500/10 text-blue-400'           },
  VERIFYING:          { label: 'Verifying',      badge: 'bg-blue-500/10 text-blue-400'           },
  PENDING_REVIEW:     { label: 'In Review',      badge: 'bg-amber-500/10 text-amber-400'         },
  APPROVED:           { label: 'Approved',       badge: 'bg-green-500/10 text-green-400'         },
  TRACKING:           { label: 'Tracking',       badge: 'bg-green-500/10 text-green-400'         },
  PERFORMANCE_LOCKED: { label: 'Locked In',      badge: 'bg-green-500/10 text-green-400'         },
  PAYOUT_PENDING:     { label: 'Payout Pending', badge: 'bg-amber-500/10 text-amber-400'         },
  PAID:               { label: 'Paid',           badge: 'bg-green-500/20 text-green-300'         },
  REJECTED:           { label: 'Rejected',       badge: 'bg-red-500/10 text-red-400'             },
  FLAGGED:            { label: 'Flagged',        badge: 'bg-orange-500/10 text-orange-400'       },
  DISPUTED:           { label: 'Disputed',       badge: 'bg-orange-500/10 text-orange-400'       },
  PAYMENT_HOLD:       { label: 'Payment Hold',   badge: 'bg-red-500/10 text-red-400'             },
}

// ── Action button style ────────────────────────────────────────────────────────

function actionClass(variant: 'default' | 'outline' | 'secondary', status?: SubmissionStatus): string {
  if (status === 'REJECTED' || status === 'PAYMENT_HOLD') {
    return 'border border-red-500/20 text-red-400 hover:bg-red-500/10'
  }
  if (status === 'FLAGGED' || status === 'DISPUTED') {
    return 'border border-orange-500/20 text-orange-400 hover:bg-orange-500/10'
  }
  if (status === 'PAID') {
    return 'bg-green-500 text-black hover:bg-green-400'
  }
  if (variant === 'default') return 'bg-white text-black hover:bg-zinc-100'
  return 'border border-black/[0.1] dark:border-white/[0.1] text-zinc-700 dark:text-white/70 hover:border-black/20 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-white'
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatSAR(value: string | null): string {
  if (!value) return '—'
  const n = parseFloat(value)
  if (n >= 1_000_000) return `SAR ${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `SAR ${(n / 1_000).toFixed(0)}K`
  return `SAR ${n.toFixed(0)}`
}

function daysLeft(endDate: string | null): { text: string; urgent: boolean } | null {
  if (!endDate) return null
  const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86_400_000)
  if (diff < 0)  return { text: 'Ended', urgent: false }
  if (diff === 0) return { text: 'Ends today', urgent: true }
  if (diff <= 3)  return { text: `${diff}d left`, urgent: true }
  return null
}

const GRADIENT_FALLBACKS = [
  'from-green-900 to-emerald-800', 'from-violet-900 to-purple-800',
  'from-rose-900 to-pink-800',     'from-amber-900 to-yellow-800',
  'from-sky-900 to-cyan-800',      'from-zinc-800 to-zinc-700',
]

function hashGradient(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return GRADIENT_FALLBACKS[Math.abs(h) % GRADIENT_FALLBACKS.length]
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props { entry: MyCampaignEntry }

export default function MyCampaignCard({ entry }: Props) {
  const { campaign, submission } = entry
  const action    = getNextAction(entry)
  const deadline  = daysLeft(campaign.endDate)
  const statusCfg = submission ? STATUS_CFG[submission.status] : null
  const gradient  = hashGradient(campaign.name)
  const isIssue   = submission?.status === 'REJECTED'
    || submission?.status === 'FLAGGED'
    || submission?.status === 'DISPUTED'
    || submission?.status === 'PAYMENT_HOLD'

  return (
    <div className={`rounded-xl bg-surface border overflow-hidden transition-colors ${
      isIssue ? 'border-red-500/20' : 'border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.12]'
    }`}>
      {/* Accent line */}
      <div className={`h-px ${
        isIssue
          ? 'bg-red-500/40'
          : submission?.status === 'PAID'
            ? 'bg-gradient-to-r from-green-500 to-emerald-400'
            : submission
              ? 'bg-gradient-to-r from-blue-500/60 to-blue-400/40'
              : 'bg-gradient-to-r from-green-500 to-emerald-400'
      }`} />

      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <div className="relative w-[72px] h-[72px] shrink-0 rounded-lg overflow-hidden">
          {campaign.coverUrl ? (
            <Image
              src={campaign.coverUrl}
              alt={campaign.name}
              fill
              className="object-cover"
              sizes="72px"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Top row: name + status */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-600 truncate flex items-center gap-1">
                {campaign.organization.name}
                <CheckCircle size={9} weight="fill" className="text-green-500 shrink-0" />
              </p>
              <Link
                href={`/campaigns/${campaign.slug}`}
                className="text-[14px] font-black text-zinc-900 dark:text-white leading-snug line-clamp-1 hover:text-green-400 transition-colors"
              >
                {campaign.name}
              </Link>
            </div>
            {statusCfg ? (
              <span className={`shrink-0 text-[11px] font-bold px-2.5 py-0.5 rounded-md ${statusCfg.badge}`}>
                {statusCfg.label}
              </span>
            ) : (
              <span className="shrink-0 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-black/[0.05] dark:bg-white/[0.05] text-zinc-600">
                No submission
              </span>
            )}
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-600 mb-2 flex-wrap">
            <span>{CATEGORY_LABELS[campaign.category] ?? campaign.category}</span>
            {campaign.cpm && (
              <>
                <span className="text-zinc-700">·</span>
                <span className="text-green-500 font-semibold">SAR {campaign.cpm} CPM</span>
              </>
            )}
            {campaign.platforms.length > 0 && (
              <>
                <span className="text-zinc-700">·</span>
                <span>{campaign.platforms.map((p) => PLATFORM_SHORT[p] ?? p).join(' · ')}</span>
              </>
            )}
            {deadline && (
              <>
                <span className="text-zinc-700">·</span>
                <span className={`flex items-center gap-1 font-semibold ${deadline.urgent ? 'text-red-400' : 'text-zinc-500'}`}>
                  <Clock size={9} weight="fill" />
                  {deadline.text}
                </span>
              </>
            )}
          </div>

          {/* Earned amount */}
          {submission?.earnedAmount && (
            <p className="text-[13px] font-black text-green-400 mb-2">
              +{formatSAR(submission.earnedAmount)} earned
            </p>
          )}

          {/* Rejection reason */}
          {submission?.rejectionReason && (
            <div className="flex items-start gap-2 rounded-lg bg-red-500/[0.07] border border-red-500/15 px-3 py-2 mb-2">
              <Warning size={12} weight="fill" className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-[12px] text-red-400 leading-relaxed">{submission.rejectionReason}</p>
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center justify-between">
            <Link
              href={action.href}
              className={`inline-flex items-center gap-1.5 rounded-lg text-[12px] font-bold px-3.5 py-1.5 transition-all active:scale-[0.97] ${
                actionClass(action.variant, submission?.status)
              }`}
            >
              {action.label}
              <ArrowRight size={11} weight="bold" />
            </Link>

            {/* Joined date */}
            <p className="text-[11px] text-zinc-700">
              Joined {new Date(entry.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
