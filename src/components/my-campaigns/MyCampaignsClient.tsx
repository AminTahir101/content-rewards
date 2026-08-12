'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import AppNav from '@/components/app/AppNav'
import MyCampaignCard from '@/components/my-campaigns/MyCampaignCard'
import { getTab, type MyCampaignEntry, type CampaignTab } from '@/components/my-campaigns/types'

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  entries: MyCampaignEntry[]
}

export default function MyCampaignsClient({ entries }: Props) {
  const t  = useTranslations('nav')
  const tm = useTranslations('myCampaigns')

  const CREATOR_NAV = [
    { label: t('dashboard'),    href: '/dashboard' },
    { label: t('discover'),     href: '/discover' },
    { label: t('myCampaigns'),  href: '/my-campaigns' },
    { label: t('earnings'),     href: '/earnings' },
    { label: t('profile'),      href: '/profile' },
  ]

  const TABS: { value: CampaignTab; label: string }[] = [
    { value: 'active',    label: tm('active')    },
    { value: 'submitted', label: tm('submitted') },
    { value: 'completed', label: tm('completed') },
    { value: 'issues',    label: tm('issues')    },
  ]
  const [activeTab, setActiveTab] = useState<CampaignTab>('active')

  const counts = {
    active:    entries.filter((e) => getTab(e) === 'active').length,
    submitted: entries.filter((e) => getTab(e) === 'submitted').length,
    completed: entries.filter((e) => getTab(e) === 'completed').length,
    issues:    entries.filter((e) => getTab(e) === 'issues').length,
  }

  const totalEarned = entries.reduce((sum, e) => {
    return sum + (e.submission?.earnedAmount ? parseFloat(e.submission.earnedAmount) : 0)
  }, 0)

  function formatSAR(n: number): string {
    if (n >= 1_000_000) return `SAR ${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000)     return `SAR ${(n / 1_000).toFixed(0)}K`
    return `SAR ${n.toFixed(0)}`
  }

  const visible = entries.filter((e) => getTab(e) === activeTab)

  return (
    <div className="min-h-screen bg-page">
      <AppNav links={CREATOR_NAV} />

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-3">
            {tm('label')}
          </p>
          <h1 className="text-[42px] sm:text-[56px] font-black text-zinc-900 dark:text-white tracking-[-0.03em] leading-[0.92]">
            {tm('title')}
          </h1>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-black/[0.06] dark:divide-white/[0.06]">
            {[
              { label: tm('joined'),     value: entries.length,           suffix: tm('campaignsLabel')  },
              { label: tm('active'),     value: counts.active,            suffix: tm('inProgress')      },
              { label: tm('submitted'),  value: counts.submitted,         suffix: tm('underReview')     },
              { label: tm('earned'),     value: formatSAR(totalEarned),   suffix: tm('totalRewards'), raw: true },
            ].map(({ label, value, suffix, raw }) => (
              <div key={label} className="px-8 py-7 first:ps-0 last:pe-0">
                <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-3">{label}</p>
                <p className="text-[34px] font-black text-zinc-900 dark:text-white tracking-tight leading-none mb-1">
                  {raw ? value : value}
                </p>
                <p className="text-[12px] text-zinc-600">{suffix}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">

        {entries.length === 0 ? (
          /* Empty — no campaigns joined at all */
          <div className="rounded-2xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-400" />
            <div className="px-8 py-20 text-center">
              <p className="text-[48px] font-black text-black/[0.03] dark:text-white/[0.03] tracking-tight mb-4">0</p>
              <p className="text-[17px] font-black text-zinc-900 dark:text-white mb-1">{tm('noCampaigns')}</p>
              <p className="text-[13px] text-zinc-600 mb-8 max-w-[280px] mx-auto leading-relaxed">
                {tm('noCampaignsDetail')}
              </p>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-zinc-100 active:scale-[0.97] text-black font-black px-5 py-2.5 text-[13px] transition-all"
              >
                {tm('discoverCampaigns')}
                <ArrowRight size={13} weight="bold" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* ── Tabs ─────────────────────────────────────────────────────── */}
            <div className="flex items-center gap-1 mb-6 border-b border-black/[0.06] dark:border-white/[0.06] pb-px">
              {TABS.map((tab) => {
                const active = activeTab === tab.value
                const isIssues = tab.value === 'issues'
                const count = counts[tab.value]
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`relative flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-bold transition-colors ${
                      active
                        ? 'text-zinc-900 dark:text-white'
                        : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-black leading-none ${
                          isIssues
                            ? 'bg-red-500/10 text-red-400'
                            : active
                              ? 'bg-green-500/10 text-green-400'
                              : 'bg-black/[0.06] dark:bg-white/[0.06] text-zinc-500'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                    {/* Active underline */}
                    {active && (
                      <span className="absolute bottom-[-1px] left-0 right-0 h-px bg-zinc-900 dark:bg-white" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* ── Tab content ──────────────────────────────────────────────── */}
            {visible.length === 0 ? (
              <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-8 py-16 text-center">
                <p className="text-[15px] font-black text-zinc-900 dark:text-white mb-1">
                  {tm('noTabCampaigns', { tab: activeTab })}
                </p>
                <p className="text-[13px] text-zinc-600 mb-6">
                  {activeTab === 'active'
                    ? tm('noTabActive')
                    : activeTab === 'submitted'
                      ? tm('noTabSubmitted')
                      : activeTab === 'completed'
                        ? tm('noTabCompleted')
                        : tm('noTabIssues')}
                </p>
                {activeTab === 'active' && (
                  <Link
                    href="/discover"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-black/[0.07] dark:bg-white/[0.07] hover:bg-black/[0.1] dark:hover:bg-white/[0.1] border border-black/[0.06] dark:border-white/[0.06] text-zinc-900 dark:text-white text-[13px] font-semibold px-4 py-2 transition-all"
                  >
                    {tm('browseCampaigns')}
                    <ArrowRight size={11} weight="bold" />
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

            {/* ── Discover CTA ─────────────────────────────────────────────── */}
            {activeTab === 'active' && visible.length > 0 && (
              <div className="mt-8 rounded-2xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500" />
                <div className="px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-2">
                      {tm('keepEarning')}
                    </p>
                    <p className="text-[18px] font-black text-zinc-900 dark:text-white tracking-tight">
                      {tm('discoverMore')} <span className="text-green-400">{tm('growEarnings')}</span>
                    </p>
                  </div>
                  <Link
                    href="/discover"
                    className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-green-500 hover:bg-green-400 active:scale-[0.97] text-black font-black px-6 py-3 text-[14px] transition-all"
                  >
                    {tm('discoverCampaigns')}
                    <ArrowRight size={14} weight="bold" />
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
