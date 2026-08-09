'use client'

import { useState, useCallback, useTransition } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import CampaignCard from '@/components/discover/CampaignCard'
import type { DiscoverCampaign } from '@/components/discover/types'

const PLATFORM_FILTERS = [
  { value: '', label: 'All Platforms' },
  { value: 'TIKTOK', label: 'TikTok' },
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'YOUTUBE', label: 'YouTube' },
  { value: 'X', label: 'X (Twitter)' },
]

const CATEGORY_FILTERS = [
  { value: '', label: 'All Categories' },
  { value: 'LIFESTYLE', label: 'Lifestyle' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'GAMING', label: 'Gaming' },
  { value: 'TECHNOLOGY', label: 'Technology' },
  { value: 'FOOD', label: 'Food' },
  { value: 'FASHION', label: 'Fashion' },
  { value: 'BEAUTY', label: 'Beauty' },
  { value: 'TRAVEL', label: 'Travel' },
  { value: 'SPORTS', label: 'Sports' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'FINANCE', label: 'Finance' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'highest_paying', label: 'Highest Paying' },
  { value: 'ending_soon', label: 'Ending Soon' },
  { value: 'most_popular', label: 'Most Popular' },
]

interface Props {
  initialCampaigns: DiscoverCampaign[]
}

export default function DiscoverClient({ initialCampaigns }: Props) {
  const [campaigns, setCampaigns] = useState<DiscoverCampaign[]>(initialCampaigns)
  const [total, setTotal] = useState(initialCampaigns.length)
  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('newest')
  const [isPending, startTransition] = useTransition()

  const fetchCampaigns = useCallback(
    (params: { q?: string; platform?: string; category?: string; sort?: string }) => {
      startTransition(async () => {
        const sp = new URLSearchParams()
        if (params.q) sp.set('q', params.q)
        if (params.platform) sp.set('platform', params.platform)
        if (params.category) sp.set('category', params.category)
        if (params.sort) sp.set('sort', params.sort)

        const res = await fetch(`/api/campaigns?${sp.toString()}`)
        if (!res.ok) return
        const data = await res.json()
        setCampaigns(data.campaigns)
        setTotal(data.total)
      })
    },
    []
  )

  function handleSearch(value: string) {
    setSearch(value)
    fetchCampaigns({ q: value, platform, category, sort })
  }

  function handlePlatform(value: string) {
    setPlatform(value)
    fetchCampaigns({ q: search, platform: value, category, sort })
  }

  function handleCategory(value: string) {
    setCategory(value)
    fetchCampaigns({ q: search, platform, category: value, sort })
  }

  function handleSort(value: string) {
    setSort(value)
    fetchCampaigns({ q: search, platform, category, sort: value })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header nav */}
      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="font-bold text-lg">
            Content Rewards
          </Link>
          <Badge variant="secondary">Creator</Badge>
        </div>
      </nav>

      <main className="max-w-lg mx-auto px-4 py-5 pb-28">
        {/* Title */}
        <div className="mb-4">
          <h1 className="text-xl font-bold">Discover Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total} active {total === 1 ? 'campaign' : 'campaigns'}
          </p>
        </div>

        {/* Search */}
        <div className="mb-4">
          <Input
            type="search"
            placeholder="Search campaigns or brands..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Sort */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-3 scrollbar-none">
          {SORT_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => handleSort(s.value)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                sort === s.value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Platform filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-3 scrollbar-none">
          {PLATFORM_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handlePlatform(f.value)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                platform === f.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleCategory(f.value)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                category === f.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Campaign grid */}
        {isPending ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <p className="font-medium">No campaigns found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 inset-x-0 border-t bg-background">
        <div className="max-w-lg mx-auto grid grid-cols-5 py-2">
          {[
            { label: 'Home', href: '/dashboard' },
            { label: 'Discover', href: '/discover' },
            { label: 'Campaigns', href: '/my-campaigns' },
            { label: 'Earnings', href: '/earnings' },
            { label: 'Profile', href: '/profile' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 text-xs transition-colors ${
                item.href === '/discover'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="w-5 h-5 rounded bg-muted" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
