import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import {
  getNextAction,
  type MyCampaignEntry,
  type SubmissionStatus,
} from '@/components/my-campaigns/types'

const PLATFORM_LABELS: Record<string, string> = {
  TIKTOK: 'TikTok',
  INSTAGRAM: 'Instagram',
  YOUTUBE: 'YouTube',
  X: 'X',
}

const CATEGORY_LABELS: Record<string, string> = {
  LIFESTYLE: 'Lifestyle',
  ENTERTAINMENT: 'Entertainment',
  GAMING: 'Gaming',
  TECHNOLOGY: 'Technology',
  FOOD: 'Food',
  FASHION: 'Fashion',
  BEAUTY: 'Beauty',
  TRAVEL: 'Travel',
  SPORTS: 'Sports',
  EDUCATION: 'Education',
  FINANCE: 'Finance',
  OTHER: 'Other',
}

interface StatusConfig {
  label: string
  className: string
}

const STATUS_CONFIG: Record<SubmissionStatus, StatusConfig> = {
  DRAFT:              { label: 'Draft',             className: 'bg-muted text-muted-foreground' },
  SUBMITTED:          { label: 'Submitted',         className: 'bg-blue-500/10 text-blue-700' },
  VERIFYING:          { label: 'Verifying',         className: 'bg-blue-500/10 text-blue-700' },
  PENDING_REVIEW:     { label: 'In Review',         className: 'bg-amber-500/10 text-amber-700' },
  APPROVED:           { label: 'Approved',          className: 'bg-green-500/10 text-green-700' },
  TRACKING:           { label: 'Tracking',          className: 'bg-green-500/10 text-green-700' },
  PERFORMANCE_LOCKED: { label: 'Locked In',         className: 'bg-green-500/10 text-green-700' },
  PAYOUT_PENDING:     { label: 'Payout Pending',    className: 'bg-amber-500/10 text-amber-700' },
  PAID:               { label: 'Paid',              className: 'bg-green-600/10 text-green-800' },
  REJECTED:           { label: 'Rejected',          className: 'bg-destructive/10 text-destructive' },
  FLAGGED:            { label: 'Flagged',           className: 'bg-orange-500/10 text-orange-700' },
  DISPUTED:           { label: 'Disputed',          className: 'bg-orange-500/10 text-orange-700' },
  PAYMENT_HOLD:       { label: 'Payment Hold',      className: 'bg-destructive/10 text-destructive' },
}

function formatSAR(value: string | null): string {
  if (!value) return '—'
  const num = parseFloat(value)
  if (num >= 1_000) return `SAR ${(num / 1_000).toFixed(0)}K`
  return `SAR ${num.toFixed(0)}`
}

function daysLeft(endDate: string | null): string | null {
  if (!endDate) return null
  const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86_400_000)
  if (diff < 0) return 'Ended'
  if (diff === 0) return 'Ends today'
  if (diff <= 3) return `${diff}d left`
  return null
}

interface Props {
  entry: MyCampaignEntry
}

export default function MyCampaignCard({ entry }: Props) {
  const { campaign, submission } = entry
  const action = getNextAction(entry)
  const deadline = daysLeft(campaign.endDate)
  const submissionStatus = submission ? STATUS_CONFIG[submission.status] : null

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">{campaign.organization.name}</p>
            <Link
              href={`/campaigns/${campaign.slug}`}
              className="font-semibold leading-snug hover:underline line-clamp-2 block mt-0.5"
            >
              {campaign.name}
            </Link>
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {CATEGORY_LABELS[campaign.category] ?? campaign.category}
          </Badge>
        </div>

        {/* Submission status + earned */}
        {submission ? (
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${submissionStatus?.className}`}
            >
              {submissionStatus?.label}
            </span>
            {submission.earnedAmount && (
              <span className="text-sm font-semibold text-green-700">
                +{formatSAR(submission.earnedAmount)}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
              No submission yet
            </span>
          </div>
        )}

        {/* Rejection reason */}
        {submission?.rejectionReason && (
          <p className="rounded-lg bg-destructive/5 border border-destructive/20 px-3 py-2 text-xs text-destructive leading-relaxed">
            {submission.rejectionReason}
          </p>
        )}

        {/* Reward + platforms */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {campaign.cpm && <span>SAR {campaign.cpm} CPM</span>}
            <span>·</span>
            <span>{campaign.platforms.map((p) => PLATFORM_LABELS[p] ?? p).join(' · ')}</span>
          </div>
          {deadline && (
            <span className={deadline === 'Ended' || deadline.includes('d left') ? 'text-destructive font-medium' : ''}>
              {deadline}
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          href={action.href}
          className={
            buttonVariants({ variant: action.variant, size: 'sm' }) + ' w-full text-center'
          }
        >
          {action.label}
        </Link>
      </CardContent>
    </Card>
  )
}
