'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import MyCampaignCard from '@/components/my-campaigns/MyCampaignCard'
import { getTab, type MyCampaignEntry, type CampaignTab } from '@/components/my-campaigns/types'

const TABS: { value: CampaignTab; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'completed', label: 'Completed' },
  { value: 'issues', label: 'Issues' },
]

interface Props {
  entries: MyCampaignEntry[]
}

export default function MyCampaignsClient({ entries }: Props) {
  const [activeTab, setActiveTab] = useState<CampaignTab>('active')

  const counts = {
    active: entries.filter((e) => getTab(e) === 'active').length,
    submitted: entries.filter((e) => getTab(e) === 'submitted').length,
    completed: entries.filter((e) => getTab(e) === 'completed').length,
    issues: entries.filter((e) => getTab(e) === 'issues').length,
  }

  const visible = entries.filter((e) => getTab(e) === activeTab)

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-lg">Content Rewards</span>
          <Badge variant="secondary">Creator</Badge>
        </div>
      </nav>

      <main className="max-w-lg mx-auto px-4 py-5 pb-28">
        <h1 className="text-xl font-bold mb-4">My Campaigns</h1>

        {/* Tabs */}
        <div className="flex border-b mb-5">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? 'text-primary border-b-2 border-primary -mb-px'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {counts[tab.value] > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs font-semibold leading-none ${
                    tab.value === 'issues'
                      ? 'bg-destructive/10 text-destructive'
                      : activeTab === tab.value
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {counts[tab.value]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {entries.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <p className="text-2xl">📋</p>
            <p className="font-semibold">No campaigns yet</p>
            <p className="text-sm text-muted-foreground">
              Join a campaign from the Discover page to start earning.
            </p>
            <Link href="/discover" className={buttonVariants()}>
              Discover Campaigns
            </Link>
          </div>
        ) : visible.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-muted-foreground font-medium">
              No {activeTab} campaigns
            </p>
            {activeTab === 'active' && (
              <Link
                href="/discover"
                className="text-sm text-primary hover:underline"
              >
                Browse more campaigns →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((entry) => (
              <MyCampaignCard key={entry.campaign.id} entry={entry} />
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
                item.href === '/my-campaigns'
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
