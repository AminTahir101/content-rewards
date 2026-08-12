import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle } from '@phosphor-icons/react/dist/ssr'
import type { DiscoverCampaign } from '@/components/discover/types'

const PLATFORM_SHORT: Record<string, string> = {
  TIKTOK: 'TT',
  INSTAGRAM: 'IG',
  YOUTUBE: 'YT',
  X: 'X',
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

// Curated Unsplash photos per category (portrait-friendly)
const CATEGORY_IMAGES: Record<string, string> = {
  LIFESTYLE:     'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=750&fit=crop&auto=format',
  ENTERTAINMENT: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=750&fit=crop&auto=format',
  GAMING:        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=750&fit=crop&auto=format',
  TECHNOLOGY:    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=750&fit=crop&auto=format',
  FOOD:          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=750&fit=crop&auto=format',
  FASHION:       'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=750&fit=crop&auto=format',
  BEAUTY:        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=750&fit=crop&auto=format',
  TRAVEL:        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=750&fit=crop&auto=format',
  SPORTS:        'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=750&fit=crop&auto=format',
  EDUCATION:     'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=750&fit=crop&auto=format',
  FINANCE:       'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=750&fit=crop&auto=format',
  OTHER:         'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=750&fit=crop&auto=format',
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
  if (diff === 1) return '1d left'
  return `${diff}d left`
}

function getCoverImage(campaign: { coverUrl: string | null; category: string }): string | null {
  if (campaign.coverUrl) return campaign.coverUrl
  return CATEGORY_IMAGES[campaign.category] ?? CATEGORY_IMAGES.OTHER
}

interface Props {
  campaign: DiscoverCampaign
}

export default function CampaignCard({ campaign }: Props) {
  const deadline = daysLeft(campaign.endDate)
  const coverImage = getCoverImage(campaign)
  const remaining = parseFloat(campaign.remainingBudget)
  const total = parseFloat(campaign.totalBudget)
  const budgetPct = total > 0 ? Math.max(4, Math.min(100, (remaining / total) * 100)) : 0

  return (
    <Link href={`/campaigns/${campaign.slug}`} className="group block">
      <div className="bg-surface rounded-xl overflow-hidden border border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.14] dark:hover:border-white/[0.14] hover:shadow-xl hover:shadow-black/40 transition-all duration-200">

        {/* Cover image — portrait */}
        <div className="relative aspect-[4/5] overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={campaign.name}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-700" />
          )}

          {/* Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          {/* CPM badge — top right */}
          {campaign.cpm && (
            <div className="absolute top-2.5 end-2.5 flex items-center gap-1">
              <span className="bg-green-500 text-black text-[10px] font-black px-2 py-0.5 rounded-md leading-none">
                SAR {campaign.cpm} CPM
              </span>
            </div>
          )}

          {/* Deadline badge — top left */}
          {deadline && (
            <div className="absolute top-2.5 start-2.5">
              <span className="bg-black/60 text-white/80 text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm">
                {deadline}
              </span>
            </div>
          )}

          {/* Max earning — bottom left */}
          {campaign.maxCreatorPayout && (
            <div className="absolute bottom-2.5 start-2.5">
              <span className="text-[11px] font-bold text-white/90">
                up to {formatSAR(campaign.maxCreatorPayout)}
              </span>
            </div>
          )}

          {/* Platforms — bottom right */}
          <div className="absolute bottom-2.5 end-2.5 flex gap-1">
            {campaign.platforms.slice(0, 3).map((p) => (
              <span
                key={p}
                className={`text-[9px] font-black px-1.5 py-0.5 rounded ${PLATFORM_COLOR[p] ?? 'bg-white/10 text-white'}`}
              >
                {PLATFORM_SHORT[p] ?? p}
              </span>
            ))}
          </div>
        </div>

        {/* Info strip */}
        <div className="px-3 pb-3 pt-2.5">
          {/* Org */}
          <div className="flex items-center gap-1 mb-0.5">
            <p className="text-[11px] text-zinc-500 truncate">{campaign.organization.name}</p>
            <CheckCircle size={10} weight="fill" className="text-green-500 shrink-0" />
          </div>

          {/* Campaign name */}
          <p className="text-[13px] font-bold text-zinc-900 dark:text-white leading-snug line-clamp-2">
            {campaign.name}
          </p>

          {/* Category + participant count */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">
              {CATEGORY_LABELS[campaign.category] ?? campaign.category}
            </span>
            <span className="text-[11px] text-zinc-500">
              {campaign.participantCount.toLocaleString()} creators
            </span>
          </div>

          {/* Budget bar */}
          <div className="mt-2 h-0.5 rounded-full bg-black/[0.06] dark:bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500/60 transition-all"
              style={{ width: `${budgetPct}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
