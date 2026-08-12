'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ShareNetwork,
  CheckCircle,
  Check,
  ArrowSquareOut,
  Users,
  Eye,
  FileText,
  CurrencyCircleDollar,
} from '@phosphor-icons/react'

// ── Labels ────────────────────────────────────────────────────────────────────

const PLATFORM_LABELS: Record<string, string> = {
  TIKTOK: 'TikTok', INSTAGRAM: 'Instagram', YOUTUBE: 'YouTube', X: 'X',
}

const PLATFORM_COLOR: Record<string, string> = {
  TIKTOK: 'bg-white/10 text-white',
  INSTAGRAM: 'bg-pink-600/20 text-pink-300',
  YOUTUBE: 'bg-red-600/20 text-red-400',
  X: 'bg-white/10 text-white',
}

const CATEGORY_LABELS: Record<string, string> = {
  LIFESTYLE: 'Lifestyle', ENTERTAINMENT: 'Entertainment', GAMING: 'Gaming',
  TECHNOLOGY: 'Technology', FOOD: 'Food', FASHION: 'Fashion',
  BEAUTY: 'Beauty', TRAVEL: 'Travel', SPORTS: 'Sports',
  EDUCATION: 'Education', FINANCE: 'Finance', OTHER: 'Other',
}

const COUNTRY_NAMES: Record<string, string> = {
  SA: 'Saudi Arabia', AE: 'UAE', BH: 'Bahrain',
  KW: 'Kuwait', QA: 'Qatar', OM: 'Oman', EG: 'Egypt',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

function daysLeft(endDate: string | null): string | null {
  if (!endDate) return null
  const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86_400_000)
  if (diff < 0) return 'Ended'
  if (diff === 0) return 'Ends today'
  return `${diff} days left`
}

const GRADIENT_FALLBACKS = [
  'from-green-900 to-emerald-700', 'from-violet-900 to-purple-700',
  'from-rose-900 to-pink-700', 'from-amber-900 to-yellow-700',
  'from-sky-900 to-cyan-700', 'from-zinc-800 to-zinc-700',
]

function hashGradient(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return GRADIENT_FALLBACKS[Math.abs(h) % GRADIENT_FALLBACKS.length]
}

// ── Types ─────────────────────────────────────────────────────────────────────

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

type Tab = 'overview' | 'requirements' | 'earnings'

// ── Section heading ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.14em] mb-3">
      {children}
    </p>
  )
}

function Divider() {
  return <div className="border-t border-black/[0.06] dark:border-white/[0.06] my-6" />
}

// ── Sidebar stat row ──────────────────────────────────────────────────────────

function SidebarRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-black/[0.05] dark:border-white/[0.05] last:border-0">
      <span className="text-[13px] text-zinc-500">{label}</span>
      <span className="text-[13px] font-semibold text-zinc-900 dark:text-white">{value}</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CampaignDetailView({ campaign, user, isJoined: initialJoined }: Props) {
  const router = useRouter()
  const [isJoined, setIsJoined] = useState(initialJoined)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [tab, setTab] = useState<Tab>('overview')
  const [briefExpanded, setBriefExpanded] = useState(false)

  const remaining = parseFloat(campaign.remainingBudget)
  const total = parseFloat(campaign.totalBudget)
  const budgetPct = total > 0 ? Math.max(0, Math.min(100, (remaining / total) * 100)) : 0
  const deadline = daysLeft(campaign.endDate)
  const isActive = campaign.status === 'ACTIVE'
  const gradient = hashGradient(campaign.name)

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
    <div className="min-h-screen bg-page">

      {/* ── Sticky top bar ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-page/90 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-5 h-14 flex items-center justify-between">
          <Link
            href="/discover"
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[14px]"
          >
            <ArrowLeft size={16} weight="bold" />
            Back
          </Link>

          <div className="flex items-center gap-2">
            {/* Error */}
            {error && (
              <p className="text-[12px] text-red-400 max-w-[200px] truncate">{error}</p>
            )}

            {/* Share */}
            <button className="flex items-center justify-center w-9 h-9 rounded-xl bg-black/[0.07] dark:bg-white/[0.07] hover:bg-black/[0.12] dark:hover:bg-white/[0.12] border border-black/[0.07] dark:border-white/[0.07] text-zinc-400 hover:text-white transition-all">
              <ShareNetwork size={16} weight="bold" />
            </button>

            {/* Join / Joined */}
            {!isActive ? (
              <div className="h-9 px-4 rounded-xl bg-black/[0.05] dark:bg-white/[0.05] border border-black/[0.07] dark:border-white/[0.07] text-zinc-500 text-[13px] font-semibold flex items-center">
                {campaign.status.toLowerCase()}
              </div>
            ) : isJoined ? (
              <div className="h-9 px-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-[13px] font-bold flex items-center gap-1.5">
                <Check size={14} weight="bold" /> Joined
              </div>
            ) : (
              <button
                onClick={handleJoin}
                disabled={isPending}
                className="h-9 px-5 rounded-xl bg-white hover:bg-zinc-100 active:scale-[0.97] disabled:opacity-50 text-black text-[13px] font-black transition-all"
              >
                {isPending ? 'Joining...' : user ? 'Join Campaign' : 'Log In to Join'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero cover ──────────────────────────────────────────────────────── */}
      <div className="relative h-[260px] sm:h-[340px] overflow-hidden">
        {campaign.coverUrl ? (
          <Image
            src={campaign.coverUrl}
            alt={campaign.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}
        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/30 to-transparent" />

        {/* Org badge */}
        <div className="absolute bottom-6 start-5 sm:start-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[12px] font-semibold text-white/60">
              {campaign.organization.name}
            </span>
            {campaign.organization.isVerified && (
              <CheckCircle size={14} weight="fill" className="text-green-400" />
            )}
          </div>
        </div>
      </div>

      {/* ── Campaign identity ────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-5 -mt-2 pb-6 border-b border-black/[0.06] dark:border-white/[0.06]">
        <h1 className="text-[28px] sm:text-[36px] font-black text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
          {campaign.name}
        </h1>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {campaign.cpm && (
            <span className="bg-green-500 text-black text-[12px] font-black px-3 py-1 rounded-lg">
              SAR {campaign.cpm} CPM
            </span>
          )}
          <span className="bg-black/[0.07] dark:bg-white/[0.07] border border-black/[0.07] dark:border-white/[0.07] text-zinc-700 dark:text-white/70 text-[12px] font-semibold px-3 py-1 rounded-lg">
            {CATEGORY_LABELS[campaign.category] ?? campaign.category}
          </span>
          {campaign.participantCount > 0 && (
            <span className="text-[12px] text-zinc-500 flex items-center gap-1">
              <Users size={12} weight="fill" />
              {campaign.participantCount.toLocaleString()} creators
            </span>
          )}
          {deadline && (
            <span className={`text-[12px] font-semibold flex items-center gap-1 ${budgetPct < 20 ? 'text-red-400' : 'text-zinc-500'}`}>
              {deadline}
            </span>
          )}
        </div>

        {/* Mobile join CTA */}
        <div className="sm:hidden">
          {!isActive ? (
            <div className="w-full rounded-xl bg-black/[0.05] dark:bg-white/[0.05] border border-black/[0.07] dark:border-white/[0.07] text-zinc-500 text-[14px] font-semibold py-3 text-center">
              Campaign {campaign.status.toLowerCase()}
            </div>
          ) : isJoined ? (
            <div className="w-full rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-[14px] font-bold py-3 text-center flex items-center justify-center gap-2">
              <Check size={16} weight="bold" /> Joined
            </div>
          ) : (
            <button
              onClick={handleJoin}
              disabled={isPending}
              className="w-full rounded-xl bg-white hover:bg-zinc-100 disabled:opacity-50 text-black text-[14px] font-black py-3 transition-all active:scale-[0.98]"
            >
              {isPending ? 'Joining...' : user ? 'Join Campaign' : 'Log In to Join'}
            </button>
          )}
          {error && <p className="text-[12px] text-red-400 text-center mt-2">{error}</p>}
        </div>
      </div>

      {/* ── Two-column layout ────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-5 py-8 flex flex-col lg:flex-row gap-8">

        {/* ── Main content ────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 border-b border-black/[0.06] dark:border-white/[0.06]">
            {(['overview', 'requirements', 'earnings'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-[13px] font-semibold capitalize transition-colors border-b-2 -mb-px ${
                  tab === t
                    ? 'text-zinc-900 dark:text-white border-zinc-900 dark:border-white'
                    : 'text-zinc-500 border-transparent hover:text-zinc-300'
                }`}
              >
                {t === 'overview' ? 'Overview' : t === 'requirements' ? 'Requirements' : 'Earnings'}
              </button>
            ))}
          </div>

          {/* ── Overview tab ──────────────────────────────────────────────── */}
          {tab === 'overview' && (
            <div className="space-y-6">

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { Icon: Users, label: 'Creators', value: campaign.participantCount.toLocaleString() },
                  { Icon: FileText, label: 'Submissions', value: campaign.submissionCount.toLocaleString() },
                  { Icon: Eye, label: 'Verified Views', value: formatViews(campaign.verifiedViews) },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] p-4">
                    <Icon size={16} weight="fill" className="text-zinc-600 mb-2" />
                    <p className="text-[22px] font-black text-zinc-900 dark:text-white tracking-tight leading-none mb-1">{value}</p>
                    <p className="text-[11px] text-zinc-600 uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {campaign.description && (
                <div>
                  <SectionLabel>Campaign Brief</SectionLabel>
                  <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] p-5">
                    <p className={`text-[14px] text-zinc-300 leading-relaxed whitespace-pre-wrap ${!briefExpanded ? 'line-clamp-5' : ''}`}>
                      {campaign.description}
                    </p>
                    {campaign.description.length > 300 && (
                      <button
                        onClick={() => setBriefExpanded(!briefExpanded)}
                        className="mt-3 text-[13px] font-semibold text-zinc-500 hover:text-white transition-colors"
                      >
                        {briefExpanded ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Content Brief */}
              {campaign.contentBrief && (
                <div>
                  <SectionLabel>Content Brief</SectionLabel>
                  <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] p-5">
                    <p className="text-[14px] text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {campaign.contentBrief}
                    </p>
                  </div>
                </div>
              )}

              {/* Objective */}
              {campaign.objective && (
                <div>
                  <SectionLabel>Objective</SectionLabel>
                  <p className="text-[14px] text-zinc-400 leading-relaxed">{campaign.objective}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Requirements tab ──────────────────────────────────────────── */}
          {tab === 'requirements' && (
            <div className="space-y-6">

              {/* Eligibility */}
              <div>
                <SectionLabel>Eligibility</SectionLabel>
                <div className="space-y-2">
                  {campaign.minFollowers > 0 && (
                    <div className="flex items-center justify-between rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-4 py-3">
                      <span className="text-[13px] text-zinc-500">Minimum followers</span>
                      <span className="text-[13px] font-bold text-zinc-900 dark:text-white">
                        {campaign.minFollowers.toLocaleString()}+
                      </span>
                    </div>
                  )}
                  {campaign.countries.length > 0 && (
                    <div className="flex items-center justify-between rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-4 py-3">
                      <span className="text-[13px] text-zinc-500">Eligible countries</span>
                      <span className="text-[13px] font-bold text-zinc-900 dark:text-white">
                        {campaign.countries.map((c) => COUNTRY_NAMES[c] ?? c).join(', ')}
                      </span>
                    </div>
                  )}
                  {campaign.maxSubmissions != null && (
                    <div className="flex items-center justify-between rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-4 py-3">
                      <span className="text-[13px] text-zinc-500">Max submissions</span>
                      <span className="text-[13px] font-bold text-zinc-900 dark:text-white">
                        {campaign.maxSubmissions.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {campaign.minFollowers === 0 && campaign.countries.length === 0 && campaign.maxSubmissions == null && (
                    <p className="text-[14px] text-zinc-600">No specific eligibility restrictions.</p>
                  )}
                </div>
              </div>

              {/* Do / Don't */}
              {(campaign.contentDos.length > 0 || campaign.contentDonts.length > 0) && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {campaign.contentDos.length > 0 && (
                    <div>
                      <SectionLabel>Do</SectionLabel>
                      <ul className="space-y-2">
                        {campaign.contentDos.map((d) => (
                          <li key={d} className="flex items-start gap-2.5 text-[13px] text-zinc-300">
                            <span className="mt-0.5 shrink-0 text-green-500 font-black">✓</span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {campaign.contentDonts.length > 0 && (
                    <div>
                      <SectionLabel>Don&apos;t</SectionLabel>
                      <ul className="space-y-2">
                        {campaign.contentDonts.map((d) => (
                          <li key={d} className="flex items-start gap-2.5 text-[13px] text-zinc-300">
                            <span className="mt-0.5 shrink-0 text-red-500 font-black">✗</span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Hashtags + mentions */}
              {(campaign.requiredHashtags.length > 0 || campaign.requiredMentions.length > 0) && (
                <div>
                  <SectionLabel>Required Tags</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {campaign.requiredHashtags.map((tag) => (
                      <span key={tag} className="rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-[13px] font-semibold px-3 py-1">
                        {tag}
                      </span>
                    ))}
                    {campaign.requiredMentions.map((mention) => (
                      <span key={mention} className="rounded-lg bg-black/[0.07] dark:bg-white/[0.07] border border-black/[0.07] dark:border-white/[0.07] text-zinc-400 text-[13px] font-semibold px-3 py-1">
                        {mention}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Platforms */}
              <div>
                <SectionLabel>Supported Platforms</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {campaign.platforms.map((p) => (
                    <span
                      key={p}
                      className={`rounded-lg text-[13px] font-bold px-3 py-1.5 ${PLATFORM_COLOR[p] ?? 'bg-white/10 text-white'}`}
                    >
                      {PLATFORM_LABELS[p] ?? p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Earnings tab ──────────────────────────────────────────────── */}
          {tab === 'earnings' && (
            <div className="space-y-6">
              <div>
                <SectionLabel>Reward Model</SectionLabel>
                <div className="rounded-xl bg-surface border border-green-500/20 p-5">
                  <div className="flex items-baseline gap-2 mb-3">
                    <CurrencyCircleDollar size={20} weight="fill" className="text-green-400 shrink-0" />
                    {campaign.cpm ? (
                      <>
                        <span className="text-[38px] font-black text-zinc-900 dark:text-white tracking-tight leading-none">
                          SAR {campaign.cpm}
                        </span>
                        <span className="text-[15px] text-zinc-500 font-medium">
                          per 1,000 verified views
                        </span>
                      </>
                    ) : (
                      <span className="text-[18px] font-bold text-zinc-900 dark:text-white">{campaign.rewardModel}</span>
                    )}
                  </div>
                  {campaign.cpm && (
                    <p className="text-[12px] text-zinc-600 font-mono">
                      Reward = Verified Views ÷ 1,000 × SAR {campaign.cpm}
                    </p>
                  )}
                </div>
              </div>

              {/* Payout limits */}
              <div>
                <SectionLabel>Payout Limits</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] p-4">
                    <p className="text-[11px] text-zinc-600 uppercase tracking-wider mb-1.5">
                      Min. Payout
                    </p>
                    <p className="text-[22px] font-black text-zinc-900 dark:text-white tracking-tight leading-none">
                      {formatSAR(campaign.minPayout)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] p-4">
                    <p className="text-[11px] text-zinc-600 uppercase tracking-wider mb-1.5">
                      Max. Earning
                    </p>
                    <p className="text-[22px] font-black text-zinc-900 dark:text-white tracking-tight leading-none">
                      {formatSAR(campaign.maxCreatorPayout)}
                    </p>
                  </div>
                </div>
              </div>

              {/* By platform */}
              {campaign.platforms.length > 0 && (
                <div>
                  <SectionLabel>By Platform</SectionLabel>
                  <div className="space-y-2">
                    {campaign.platforms.map((p) => (
                      <div
                        key={p}
                        className="flex items-center justify-between rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-4 py-3"
                      >
                        <span className={`text-[13px] font-bold px-2.5 py-0.5 rounded-md ${PLATFORM_COLOR[p] ?? 'bg-white/10 text-white'}`}>
                          {PLATFORM_LABELS[p] ?? p}
                        </span>
                        <div className="text-end">
                          {campaign.cpm && (
                            <p className="text-[13px] font-bold text-zinc-900 dark:text-white">
                              SAR {campaign.cpm} / 1K views
                            </p>
                          )}
                          <p className="text-[11px] text-zinc-600">
                            up to {formatSAR(campaign.maxCreatorPayout)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* My campaigns CTA if joined */}
              {isJoined && (
                <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-5">
                  <p className="text-[14px] font-bold text-green-400 mb-1">
                    You&apos;re in this campaign
                  </p>
                  <p className="text-[13px] text-zinc-500 mb-3">
                    Submit your content to start earning.
                  </p>
                  <Link
                    href="/my-campaigns"
                    className="inline-flex items-center gap-1.5 text-[13px] font-bold text-green-400 hover:text-green-300"
                  >
                    Go to My Campaigns <ArrowSquareOut size={13} weight="bold" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right sidebar ────────────────────────────────────────────────── */}
        <div className="lg:w-[300px] shrink-0">
          <div className="sticky top-[72px] space-y-4">

            {/* Join CTA — desktop */}
            <div className="hidden sm:block rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] p-5">
              {!isActive ? (
                <div className="w-full rounded-xl bg-black/[0.05] dark:bg-white/[0.05] border border-black/[0.07] dark:border-white/[0.07] text-zinc-500 text-[14px] font-semibold py-3 text-center">
                  Campaign {campaign.status.toLowerCase()}
                </div>
              ) : isJoined ? (
                <div className="space-y-3">
                  <div className="w-full rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-[14px] font-bold py-3 text-center flex items-center justify-center gap-2">
                    <Check size={16} weight="bold" /> You&apos;ve joined
                  </div>
                  <Link
                    href="/my-campaigns"
                    className="block w-full text-center rounded-xl border border-black/[0.07] dark:border-white/[0.07] text-zinc-700 dark:text-white/70 text-[13px] font-semibold py-2.5 hover:border-black/20 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-white transition-all"
                  >
                    View My Campaigns
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[12px] text-zinc-600 mb-1">
                    <span>{campaign.cpm ? `SAR ${campaign.cpm} CPM` : campaign.rewardModel}</span>
                    <span>Earn up to {formatSAR(campaign.maxCreatorPayout)}</span>
                  </div>
                  <button
                    onClick={handleJoin}
                    disabled={isPending}
                    className="w-full rounded-xl bg-white hover:bg-zinc-100 active:scale-[0.97] disabled:opacity-50 text-black text-[15px] font-black py-3 transition-all"
                  >
                    {isPending ? 'Joining...' : user ? 'Join Campaign' : 'Log In to Join'}
                  </button>
                  {error && <p className="text-[12px] text-red-400 text-center">{error}</p>}
                </div>
              )}
            </div>

            {/* Budget card */}
            <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] p-5">
              <SectionLabel>Campaign Budget</SectionLabel>
              <p className="text-[28px] font-black text-zinc-900 dark:text-white tracking-tight leading-none mb-1">
                {formatSAR(campaign.totalBudget)}
              </p>
              <p className="text-[12px] text-zinc-600 mb-3">total budget</p>

              {/* Budget bar */}
              <div className="h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.06] overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-green-500/70 transition-all"
                  style={{ width: `${budgetPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[12px] text-zinc-600">
                <span>{formatSAR(campaign.remainingBudget)} remaining</span>
                <span>{Math.round(budgetPct)}%</span>
              </div>
            </div>

            {/* Details card */}
            <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-5 py-2">
              {campaign.cpm && <SidebarRow label="CPM" value={`SAR ${campaign.cpm} / 1K views`} />}
              <SidebarRow label="Category" value={CATEGORY_LABELS[campaign.category] ?? campaign.category} />
              <SidebarRow
                label="Platforms"
                value={
                  <div className="flex gap-1">
                    {campaign.platforms.map((p) => (
                      <span key={p} className={`text-[10px] font-black px-1.5 py-0.5 rounded ${PLATFORM_COLOR[p] ?? 'bg-white/10 text-white'}`}>
                        {p.slice(0, 2)}
                      </span>
                    ))}
                  </div>
                }
              />
              {campaign.countries.length > 0 && (
                <SidebarRow
                  label="Countries"
                  value={campaign.countries.map((c) => COUNTRY_NAMES[c] ?? c).join(', ')}
                />
              )}
              {campaign.minFollowers > 0 && (
                <SidebarRow
                  label="Min. followers"
                  value={`${campaign.minFollowers.toLocaleString()}+`}
                />
              )}
              {deadline && (
                <SidebarRow
                  label="Deadline"
                  value={<span className={budgetPct < 20 ? 'text-red-400' : 'text-zinc-900 dark:text-white'}>{deadline}</span>}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
