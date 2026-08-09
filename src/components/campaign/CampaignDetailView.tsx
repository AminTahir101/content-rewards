'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const PLATFORM_LABELS: Record<string, string> = {
  TIKTOK: 'TikTok',
  INSTAGRAM: 'Instagram',
  YOUTUBE: 'YouTube',
  X: 'X (Twitter)',
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

const COUNTRY_NAMES: Record<string, string> = {
  SA: 'Saudi Arabia',
  AE: 'UAE',
  BH: 'Bahrain',
  KW: 'Kuwait',
  QA: 'Qatar',
  OM: 'Oman',
  EG: 'Egypt',
}

function formatSAR(value: string | null, fallback = '—'): string {
  if (!value) return fallback
  const num = parseFloat(value)
  if (num >= 1_000_000) return `SAR ${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `SAR ${(num / 1_000).toFixed(0)}K`
  return `SAR ${num.toLocaleString()}`
}

function formatViews(raw: string): string {
  const n = parseInt(raw, 10)
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

function daysLeft(endDate: string | null): string | null {
  if (!endDate) return null
  const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86_400_000)
  if (diff < 0) return 'Ended'
  if (diff === 0) return 'Ends today'
  return `${diff} days left`
}

export interface CampaignDetail {
  id: string
  name: string
  slug: string
  coverUrl: string | null
  category: string
  status: string
  rewardModel: string
  cpm: string | null
  minPayout: string
  maxCreatorPayout: string | null
  totalBudget: string
  reservedBudget: string
  settledBudget: string
  remainingBudget: string
  maxSubmissions: number | null
  countries: string[]
  languages: string[]
  minFollowers: number
  requiredHashtags: string[]
  requiredMentions: string[]
  contentBrief: string | null
  contentDos: string[]
  contentDonts: string[]
  description: string | null
  objective: string | null
  startDate: string | null
  endDate: string | null
  participantCount: number
  submissionCount: number
  verifiedViews: string
  platforms: string[]
  organization: {
    id: string
    name: string
    slug: string
    logoUrl: string | null
    country: string | null
    isVerified: boolean
  }
}

interface SessionUser {
  id: string
  email: string
  name?: string | null
  role: string
}

interface Props {
  campaign: CampaignDetail
  user: SessionUser | null
  isJoined: boolean
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-base font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">{children}</h2>
}

function ListItem({ icon, children }: { icon: '✓' | '✗'; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <span
        className={`mt-0.5 shrink-0 font-bold ${icon === '✓' ? 'text-green-600' : 'text-destructive'}`}
      >
        {icon}
      </span>
      <span>{children}</span>
    </li>
  )
}

export default function CampaignDetailView({ campaign, user, isJoined: initialJoined }: Props) {
  const router = useRouter()
  const [isJoined, setIsJoined] = useState(initialJoined)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const remaining = parseFloat(campaign.remainingBudget)
  const total = parseFloat(campaign.totalBudget)
  const budgetPct = total > 0 ? Math.max(0, Math.min(100, (remaining / total) * 100)) : 0
  const deadline = daysLeft(campaign.endDate)
  const isActive = campaign.status === 'ACTIVE'

  function handleJoin() {
    if (!user) {
      router.push(`/login?callbackUrl=/campaigns/${campaign.slug}`)
      return
    }
    setError(null)
    startTransition(async () => {
      const res = await fetch(`/api/campaigns/${campaign.slug}/join`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to join campaign')
        return
      }
      setIsJoined(true)
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/discover"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            ← Discover
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium truncate">{campaign.name}</span>
        </div>
      </nav>

      <main className="max-w-lg mx-auto px-4 py-5 pb-36 space-y-6">

        {/* ── Cover / Header ─────────────────────────────────── */}
        <div className="rounded-xl overflow-hidden border">
          {campaign.coverUrl ? (
            <div
              className="h-40 bg-cover bg-center"
              style={{ backgroundImage: `url(${campaign.coverUrl})` }}
            />
          ) : (
            <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5" />
          )}

          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                <span>{campaign.organization.name}</span>
                {campaign.organization.isVerified && (
                  <span className="text-primary text-xs">✓</span>
                )}
              </div>
              <Badge variant="secondary">
                {CATEGORY_LABELS[campaign.category] ?? campaign.category}
              </Badge>
            </div>
            <h1 className="text-xl font-bold leading-snug">{campaign.name}</h1>
            {campaign.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {campaign.description}
              </p>
            )}
          </div>
        </div>

        {/* ── Reward ─────────────────────────────────────────── */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 space-y-3">
            <SectionHeading>Reward</SectionHeading>
            <div className="flex items-baseline gap-2">
              {campaign.cpm && (
                <span className="text-3xl font-bold text-primary">SAR {campaign.cpm}</span>
              )}
              <span className="text-muted-foreground font-medium">per 1,000 verified views</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-background border px-3 py-2">
                <p className="text-xs text-muted-foreground">Min. Payout</p>
                <p className="font-semibold">{formatSAR(campaign.minPayout)}</p>
              </div>
              <div className="rounded-lg bg-background border px-3 py-2">
                <p className="text-xs text-muted-foreground">Max. Earning</p>
                <p className="font-semibold">{formatSAR(campaign.maxCreatorPayout)}</p>
              </div>
            </div>
            {campaign.cpm && (
              <p className="text-xs text-muted-foreground">
                Formula: Verified Views ÷ 1,000 × SAR {campaign.cpm}
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── Campaign stats ─────────────────────────────────── */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-4 divide-x">
              <StatPill label="Creators" value={campaign.participantCount.toLocaleString()} />
              <StatPill label="Submissions" value={campaign.submissionCount.toLocaleString()} />
              <StatPill label="Verified Views" value={formatViews(campaign.verifiedViews)} />
              <StatPill
                label="Budget Left"
                value={formatSAR(campaign.remainingBudget)}
              />
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatSAR(campaign.remainingBudget)} of {formatSAR(campaign.totalBudget)} remaining</span>
                {deadline && (
                  <span className={budgetPct < 15 ? 'text-destructive font-medium' : ''}>
                    {deadline}
                  </span>
                )}
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${budgetPct}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Platforms ──────────────────────────────────────── */}
        <div>
          <SectionHeading>Supported Platforms</SectionHeading>
          <div className="flex flex-wrap gap-2">
            {campaign.platforms.map((p) => (
              <span
                key={p}
                className="rounded-full border border-border px-3 py-1 text-sm font-medium"
              >
                {PLATFORM_LABELS[p] ?? p}
              </span>
            ))}
          </div>
        </div>

        <Separator />

        {/* ── Objective ──────────────────────────────────────── */}
        {campaign.objective && (
          <div>
            <SectionHeading>Campaign Objective</SectionHeading>
            <p className="text-sm leading-relaxed">{campaign.objective}</p>
          </div>
        )}

        {/* ── Content Brief ──────────────────────────────────── */}
        {campaign.contentBrief && (
          <div>
            <SectionHeading>Content Brief</SectionHeading>
            <div className="rounded-xl bg-muted/50 border p-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{campaign.contentBrief}</p>
            </div>
          </div>
        )}

        {/* ── Do / Don't ─────────────────────────────────────── */}
        {(campaign.contentDos.length > 0 || campaign.contentDonts.length > 0) && (
          <div className="grid grid-cols-2 gap-3">
            {campaign.contentDos.length > 0 && (
              <div>
                <SectionHeading>Do</SectionHeading>
                <ul className="space-y-2">
                  {campaign.contentDos.map((d) => (
                    <ListItem key={d} icon="✓">{d}</ListItem>
                  ))}
                </ul>
              </div>
            )}
            {campaign.contentDonts.length > 0 && (
              <div>
                <SectionHeading>Don&apos;t</SectionHeading>
                <ul className="space-y-2">
                  {campaign.contentDonts.map((d) => (
                    <ListItem key={d} icon="✗">{d}</ListItem>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* ── Requirements ───────────────────────────────────── */}
        <div>
          <SectionHeading>Requirements</SectionHeading>
          <div className="space-y-2">
            {campaign.minFollowers > 0 && (
              <div className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                <span className="text-muted-foreground">Minimum followers</span>
                <span className="font-medium">{campaign.minFollowers.toLocaleString()}+</span>
              </div>
            )}
            {campaign.countries.length > 0 && (
              <div className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                <span className="text-muted-foreground">Eligible countries</span>
                <span className="font-medium">
                  {campaign.countries
                    .map((c) => COUNTRY_NAMES[c] ?? c)
                    .join(', ')}
                </span>
              </div>
            )}
            {campaign.maxSubmissions != null && (
              <div className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                <span className="text-muted-foreground">Max submissions</span>
                <span className="font-medium">{campaign.maxSubmissions.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Hashtags & Mentions ────────────────────────────── */}
        {(campaign.requiredHashtags.length > 0 || campaign.requiredMentions.length > 0) && (
          <div>
            <SectionHeading>Required Tags</SectionHeading>
            <div className="flex flex-wrap gap-2">
              {campaign.requiredHashtags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
              {campaign.requiredMentions.map((mention) => (
                <span
                  key={mention}
                  className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground"
                >
                  {mention}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── Sticky Join CTA ────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 border-t bg-background/95 backdrop-blur">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-2">
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          {!isActive ? (
            <div className="w-full rounded-lg bg-muted px-4 py-3 text-center text-sm text-muted-foreground font-medium">
              Campaign is {campaign.status.toLowerCase()}
            </div>
          ) : isJoined ? (
            <div className="space-y-2">
              <div className="w-full rounded-lg bg-green-600/10 border border-green-600/20 px-4 py-3 text-center text-sm font-medium text-green-700">
                ✓ You&apos;ve joined this campaign
              </div>
              <Link
                href="/my-campaigns"
                className={buttonVariants({ variant: 'outline' }) + ' w-full text-center block'}
              >
                Go to My Campaigns
              </Link>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span>
                  {campaign.cpm ? `SAR ${campaign.cpm} CPM` : campaign.rewardModel}
                </span>
                <span>Earn up to {formatSAR(campaign.maxCreatorPayout)}</span>
              </div>
              <button
                onClick={handleJoin}
                disabled={isPending}
                className={
                  buttonVariants({ size: 'lg' }) +
                  ' w-full disabled:opacity-60 disabled:pointer-events-none'
                }
              >
                {isPending
                  ? 'Joining...'
                  : user
                  ? 'Join Campaign'
                  : 'Log In to Join'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
