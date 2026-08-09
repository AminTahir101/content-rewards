import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import type { DiscoverCampaign } from '@/components/discover/types'

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

function formatSAR(value: string | null): string {
  if (!value) return '—'
  const num = parseFloat(value)
  if (num >= 1_000_000) return `SAR ${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `SAR ${(num / 1_000).toFixed(0)}K`
  return `SAR ${num.toFixed(0)}`
}

function daysLeft(endDate: string | null): string | null {
  if (!endDate) return null
  const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return null
  if (diff === 0) return 'Ends today'
  if (diff === 1) return '1 day left'
  return `${diff} days left`
}

interface Props {
  campaign: DiscoverCampaign
}

export default function CampaignCard({ campaign }: Props) {
  const remaining = parseFloat(campaign.remainingBudget)
  const total = parseFloat(campaign.totalBudget)
  const budgetPct = total > 0 ? Math.max(0, Math.min(100, (remaining / total) * 100)) : 0
  const deadline = daysLeft(campaign.endDate)

  return (
    <Card className="overflow-hidden">
      {/* Cover placeholder — replace with real image when available */}
      {campaign.coverUrl ? (
        <div
          className="h-32 bg-cover bg-center"
          style={{ backgroundImage: `url(${campaign.coverUrl})` }}
        />
      ) : (
        <div className="h-24 bg-gradient-to-br from-primary/20 to-primary/5 flex items-end px-4 pb-3">
          <span className="text-xs font-medium text-primary/70">
            {campaign.organization.name}
          </span>
        </div>
      )}

      <CardContent className="p-4 space-y-3">
        {/* Brand + category */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground font-medium truncate">
            {campaign.organization.name}
          </span>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {CATEGORY_LABELS[campaign.category] ?? campaign.category}
          </Badge>
        </div>

        {/* Campaign name */}
        <h3 className="font-semibold leading-snug">{campaign.name}</h3>

        {/* Reward */}
        <div className="flex items-baseline gap-1.5">
          {campaign.cpm && (
            <span className="text-lg font-bold text-primary">SAR {campaign.cpm} CPM</span>
          )}
          {campaign.maxCreatorPayout && (
            <span className="text-sm text-muted-foreground">
              · Earn up to {formatSAR(campaign.maxCreatorPayout)}
            </span>
          )}
        </div>

        {/* Platforms */}
        <div className="flex flex-wrap gap-1">
          {campaign.platforms.map((p) => (
            <span
              key={p}
              className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {PLATFORM_LABELS[p] ?? p}
            </span>
          ))}
          {campaign.countries.map((c) => (
            <span
              key={c}
              className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {c}
            </span>
          ))}
        </div>

        {/* Budget bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatSAR(campaign.remainingBudget)} remaining</span>
            {deadline && (
              <span className={budgetPct < 20 ? 'text-destructive' : ''}>{deadline}</span>
            )}
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${budgetPct}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">
            {campaign.participantCount.toLocaleString()} creators
          </span>
          <Link
            href={`/campaigns/${campaign.slug}`}
            className={buttonVariants({ size: 'sm' })}
          >
            View Campaign
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
