'use client'

import { useState, useCallback, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MagnifyingGlass, ArrowRight, SlidersHorizontal } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import AppNav from '@/components/app/AppNav'
import CampaignCard from '@/components/discover/CampaignCard'
import type { DiscoverCampaign } from '@/components/discover/types'

// ── Platform filter styles (labels added inside component) ───────────────────

const PLATFORM_BADGE: { value: string; key: string; activeClass: string }[] = [
  { value: '',          key: 'allPlatforms', activeClass: 'bg-white text-black'      },
  { value: 'YOUTUBE',   key: 'YouTube',      activeClass: 'bg-red-600 text-white'    },
  { value: 'TIKTOK',    key: 'TikTok',       activeClass: 'bg-white text-black'      },
  { value: 'INSTAGRAM', key: 'Instagram',    activeClass: 'bg-pink-600 text-white'   },
  { value: 'X',         key: 'X',            activeClass: 'bg-white text-black'      },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatSAR(value: string | null): string {
  if (!value) return '—'
  const n = parseFloat(value)
  if (n >= 1_000_000) return `SAR ${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `SAR ${(n / 1_000).toFixed(0)}K`
  return `SAR ${n.toFixed(0)}`
}

// Category images (same set as CampaignCard)
const CATEGORY_IMAGES: Record<string, string> = {
  LIFESTYLE:     'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=600&fit=crop&auto=format',
  ENTERTAINMENT: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&h=600&fit=crop&auto=format',
  GAMING:        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1400&h=600&fit=crop&auto=format',
  TECHNOLOGY:    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&h=600&fit=crop&auto=format',
  FOOD:          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&h=600&fit=crop&auto=format',
  FASHION:       'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&h=600&fit=crop&auto=format',
  BEAUTY:        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1400&h=600&fit=crop&auto=format',
  TRAVEL:        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&h=600&fit=crop&auto=format',
  SPORTS:        'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1400&h=600&fit=crop&auto=format',
  EDUCATION:     'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1400&h=600&fit=crop&auto=format',
  FINANCE:       'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1400&h=600&fit=crop&auto=format',
  OTHER:         'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1400&h=600&fit=crop&auto=format',
}

// ── Featured banner ───────────────────────────────────────────────────────────

function FeaturedBanner({ campaign }: { campaign: DiscoverCampaign }) {
  const td = useTranslations('discover')
  const remaining  = parseFloat(campaign.remainingBudget)
  const total      = parseFloat(campaign.totalBudget)
  const budgetPct  = total > 0 ? Math.min(100, (remaining / total) * 100) : 0
  const coverImg   = campaign.coverUrl ?? CATEGORY_IMAGES[campaign.category] ?? CATEGORY_IMAGES.OTHER

  return (
    <div className="relative h-[240px] sm:h-[300px] rounded-2xl overflow-hidden group">
      {coverImg ? (
        <Image
          src={coverImg}
          alt={campaign.name}
          fill
          priority
          className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
          sizes="(max-width: 1400px) 100vw, 1400px"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-700" />
      )}

      {/* Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
        <div className="flex items-end justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.18em]">
                {td('featured')}
              </span>
              {campaign.cpm && (
                <span className="bg-green-500 text-black text-[11px] font-black px-2 py-0.5 rounded-md leading-none">
                  SAR {campaign.cpm} CPM
                </span>
              )}
            </div>
            <p className="text-[11px] text-white/40 mb-1">{campaign.organization.name}</p>
            <h2 className="text-[22px] sm:text-[28px] font-black text-white leading-tight tracking-tight truncate">
              {campaign.name}
            </h2>
            <div className="flex items-center gap-3 mt-2.5">
              <div className="w-28 h-0.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${budgetPct}%` }} />
              </div>
              <span className="text-[11px] text-white/40">
                {formatSAR(campaign.remainingBudget)} {td('remaining')}
              </span>
            </div>
          </div>

          <Link
            href={`/campaigns/${campaign.slug}`}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white hover:bg-zinc-100 active:scale-[0.97] text-black font-black text-[13px] px-4 py-2.5 transition-all"
          >
            {td('viewCampaign')}
            <ArrowRight size={13} weight="bold" />
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-surface rounded-xl overflow-hidden border border-black/[0.06] dark:border-white/[0.06] animate-pulse">
      <div className="aspect-[4/5] bg-black/[0.04] dark:bg-white/[0.04]" />
      <div className="px-3 pb-3 pt-2.5 space-y-2">
        <div className="h-2.5 w-1/2 rounded bg-black/[0.06] dark:bg-white/[0.06]" />
        <div className="h-3.5 w-5/6 rounded bg-black/[0.06] dark:bg-white/[0.06]" />
        <div className="h-0.5 w-full rounded-full bg-black/[0.06] dark:bg-white/[0.06]" />
      </div>
    </div>
  )
}

// ── Dark select ───────────────────────────────────────────────────────────────

function DarkSelect({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 rounded-lg bg-black/[0.07] dark:bg-white/[0.07] border border-black/[0.06] dark:border-white/[0.06] text-[12px] text-zinc-400 ps-3 pe-7 appearance-none focus:outline-none focus:border-black/[0.14] dark:focus:border-white/[0.14] focus:bg-black/[0.09] dark:focus:bg-white/[0.09] cursor-pointer transition"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-zinc-100 dark:bg-[#1c1c1c] text-zinc-900 dark:text-white">
            {o.label}
          </option>
        ))}
      </select>
      <span className="absolute end-2.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none text-[9px]">
        ▾
      </span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  initialCampaigns: DiscoverCampaign[]
}

export default function DiscoverClient({ initialCampaigns }: Props) {
  const t  = useTranslations('nav')
  const td = useTranslations('discover')
  const tc = useTranslations('common')
  const tdc = useTranslations('discover.category')
  const tds = useTranslations('discover.sort')

  const CREATOR_NAV = [
    { label: t('dashboard'),    href: '/dashboard' },
    { label: t('discover'),     href: '/discover' },
    { label: t('myCampaigns'),  href: '/my-campaigns' },
    { label: t('earnings'),     href: '/earnings' },
    { label: t('profile'),      href: '/profile' },
  ]

  const PLATFORM_FILTERS = PLATFORM_BADGE.map((f) => ({
    ...f,
    label: f.key === 'allPlatforms' ? td('allPlatforms') : f.key,
  }))

  const CATEGORY_OPTIONS = [
    { value: '',              label: td('allCategories') },
    { value: 'LIFESTYLE',     label: tdc('LIFESTYLE')    },
    { value: 'ENTERTAINMENT', label: tdc('ENTERTAINMENT')},
    { value: 'GAMING',        label: tdc('GAMING')       },
    { value: 'TECHNOLOGY',    label: tdc('TECHNOLOGY')   },
    { value: 'FOOD',          label: tdc('FOOD')         },
    { value: 'FASHION',       label: tdc('FASHION')      },
    { value: 'BEAUTY',        label: tdc('BEAUTY')       },
    { value: 'TRAVEL',        label: tdc('TRAVEL')       },
    { value: 'SPORTS',        label: tdc('SPORTS')       },
    { value: 'EDUCATION',     label: tdc('EDUCATION')    },
    { value: 'FINANCE',       label: tdc('FINANCE')      },
  ]

  const SORT_OPTIONS = [
    { value: 'newest',         label: tds('newest')       },
    { value: 'highest_paying', label: tds('highestPaying')},
    { value: 'ending_soon',    label: tds('endingSoon')   },
    { value: 'most_popular',   label: tds('mostPopular')  },
  ]

  const [campaigns, setCampaigns] = useState<DiscoverCampaign[]>(initialCampaigns)
  const [total,     setTotal]     = useState(initialCampaigns.length)
  const [search,    setSearch]    = useState('')
  const [platform,  setPlatform]  = useState('')
  const [category,  setCategory]  = useState('')
  const [sort,      setSort]      = useState('newest')
  const [isPending, startTransition] = useTransition()

  const fetchCampaigns = useCallback(
    (params: { q?: string; platform?: string; category?: string; sort?: string }) => {
      startTransition(async () => {
        const sp = new URLSearchParams()
        if (params.q)        sp.set('q',        params.q)
        if (params.platform) sp.set('platform', params.platform)
        if (params.category) sp.set('category', params.category)
        if (params.sort)     sp.set('sort',     params.sort)
        const res = await fetch(`/api/campaigns?${sp}`)
        if (!res.ok) return
        const data = await res.json()
        setCampaigns(data.campaigns)
        setTotal(data.total)
      })
    },
    [],
  )

  function handleSearch(v: string)   { setSearch(v);   fetchCampaigns({ q: v,  platform, category, sort }) }
  function handlePlatform(v: string) { setPlatform(v); fetchCampaigns({ q: search, platform: v, category, sort }) }
  function handleCategory(v: string) { setCategory(v); fetchCampaigns({ q: search, platform, category: v, sort }) }
  function handleSort(v: string)     { setSort(v);     fetchCampaigns({ q: search, platform, category, sort: v }) }

  function clearFilters() {
    setSearch(''); setPlatform(''); setCategory(''); setSort('newest')
    fetchCampaigns({})
  }

  const hasFilters = search !== '' || platform !== '' || category !== '' || sort !== 'newest'
  const featured   = campaigns[0] ?? null
  const grid       = campaigns.length > 1 ? campaigns.slice(1) : []

  return (
    <div className="min-h-screen bg-page">

      {/* ── App nav ────────────────────────────────────────────────────────── */}
      <AppNav links={CREATOR_NAV} />

      {/* ── Filter bar — sticky below nav ──────────────────────────────────── */}
      <div className="sticky top-14 z-40 bg-page/90 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center gap-3 h-12 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>

            {/* Search */}
            <div className="relative shrink-0">
              <MagnifyingGlass
                size={13}
                weight="bold"
                className="absolute start-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
              />
              <input
                type="search"
                placeholder={td('searchPlaceholder')}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-8 w-48 rounded-lg bg-black/[0.07] dark:bg-white/[0.07] border border-black/[0.06] dark:border-white/[0.06] ps-8 pe-3 text-[12px] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-black/[0.14] dark:focus:border-white/[0.14] focus:bg-black/[0.09] dark:focus:bg-white/[0.09] transition"
              />
            </div>

            {/* Divider */}
            <div className="w-px h-4 bg-black/[0.08] dark:bg-white/[0.08] shrink-0" />

            {/* Platform pills */}
            <div className="flex items-center gap-1.5 shrink-0">
              {PLATFORM_FILTERS.map((f) => {
                const active = platform === f.value
                return (
                  <button
                    key={f.value}
                    onClick={() => handlePlatform(f.value)}
                    className={`h-7 px-3 rounded-md text-[12px] font-bold transition-all ${
                      active
                        ? f.activeClass
                        : 'text-zinc-500 hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    {f.label}
                  </button>
                )
              })}
            </div>

            {/* Divider */}
            <div className="w-px h-4 bg-black/[0.08] dark:bg-white/[0.08] shrink-0" />

            {/* Category + Sort */}
            <div className="flex items-center gap-2 shrink-0">
              <DarkSelect value={category} onChange={handleCategory} options={CATEGORY_OPTIONS} />
              <DarkSelect value={sort}     onChange={handleSort}     options={SORT_OPTIONS} />
            </div>

            {/* Clear + count — pushed right */}
            <div className="flex items-center gap-3 ms-auto shrink-0">
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[12px] font-semibold text-zinc-600 hover:text-white transition-colors"
                >
                  {tc('clear')}
                </button>
              )}
              <span className="text-[12px] text-zinc-700 flex items-center gap-1.5">
                <SlidersHorizontal size={11} weight="bold" />
                {total} {td('campaigns')}
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <main className="max-w-[1400px] mx-auto px-6 py-6">

        {isPending ? (
          <div className="space-y-6">
            <div className="h-[240px] sm:h-[300px] rounded-2xl bg-black/[0.04] dark:bg-white/[0.04] animate-pulse" />
            <p className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.14em]">{td('sectionCampaigns')}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <p className="text-[56px] font-black text-black/[0.03] dark:text-white/[0.03] tracking-tight mb-4">0</p>
            <p className="text-[17px] font-black text-zinc-900 dark:text-white mb-1">{td('noResults')}</p>
            <p className="text-[13px] text-zinc-600 mb-6">{td('noResultsHint')}</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 h-9 rounded-lg bg-black/[0.07] dark:bg-white/[0.07] hover:bg-black/[0.1] dark:hover:bg-white/[0.1] border border-black/[0.06] dark:border-white/[0.06] text-zinc-900 dark:text-white text-[13px] font-semibold px-4 transition-all"
            >
              {td('clearFilters')}
            </button>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Featured banner — only when there are multiple campaigns */}
            {featured && grid.length > 0 && (
              <FeaturedBanner campaign={featured} />
            )}

            {/* Section label */}
            <p className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.14em]">
              {grid.length > 0 ? td('sectionCampaigns') : td('featured')}
            </p>

            {/* Grid — show all when only 1 campaign, or rest after featured */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {(grid.length > 0 ? grid : campaigns).map((c) => (
                <CampaignCard key={c.id} campaign={c} />
              ))}
            </div>

            {campaigns.length < total && (
              <p className="text-center text-[12px] text-zinc-700 pt-4">
                {td('showing', { current: campaigns.length, total })}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
