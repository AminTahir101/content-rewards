import Link from 'next/link'
import {
  ArrowRight,
  Buildings,
  UsersThree,
  ChartLineUp,
} from '@phosphor-icons/react/dist/ssr'
import { getTranslations } from 'next-intl/server'
import AppNav from '@/components/app/AppNav'

interface Props {
  user: { id: string; name?: string | null; email: string; role: string }
}

export default async function AgencyHome({ user }: Props) {
  const t = await getTranslations('nav')
  const ta = await getTranslations('agency')

  const AGENCY_NAV = [
    { label: t('dashboard'), href: '/dashboard' },
    { label: t('clients'),   href: '/agency/clients' },
    { label: t('campaigns'), href: '/agency/campaigns' },
    { label: t('analytics'), href: '/agency/analytics' },
    { label: t('finance'),   href: '/agency/finance' },
  ]

  const COMING_SOON = [
    {
      Icon: Buildings,
      title: ta('multiBrand'),
      body: ta('multiBrandDetail'),
    },
    {
      Icon: ChartLineUp,
      title: ta('consolidatedAnalytics'),
      body: ta('consolidatedAnalyticsDetail'),
    },
    {
      Icon: UsersThree,
      title: ta('teamCollab'),
      body: ta('teamCollabDetail'),
    },
  ]

  return (
    <div className="min-h-screen bg-page">
      <AppNav links={AGENCY_NAV} roleBadge={t('roleBadgeAgency')} userLabel={user.email} />

      {/* ── Welcome ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-3">
            {ta('dashboard')}
          </p>
          <h1 className="text-[42px] sm:text-[56px] font-black text-zinc-900 dark:text-white tracking-[-0.03em] leading-[0.92] mb-2">
            {ta('label')}<br /><span className="text-green-400">{ta('agencyOverview')}</span>
          </h1>
          <p className="text-[14px] text-zinc-600 max-w-[420px]">
            {ta('manageDesc')}
          </p>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-black/[0.06] dark:divide-white/[0.06]">
            {[
              { label: ta('brandClients'),    value: '0', detail: ta('underManagement'), Icon: Buildings   },
              { label: ta('activeCampaigns'), value: '0', detail: ta('runningNow'),      Icon: ChartLineUp },
              { label: ta('totalCreators'),   value: '0', detail: ta('engaged'),          Icon: UsersThree  },
            ].map(({ label, value, detail, Icon }) => (
              <div key={label} className="px-8 py-7 first:ps-0 last:pe-0">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">{label}</p>
                  <Icon size={14} weight="fill" className="text-zinc-700 shrink-0" />
                </div>
                <p className="text-[34px] font-black text-zinc-900 dark:text-white tracking-tight leading-none mb-1">{value}</p>
                <p className="text-[12px] text-zinc-600">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Coming soon ──────────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="rounded-2xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden mb-6">
          <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-400" />
          <div className="px-8 py-14 text-center">
            <div className="w-12 h-12 rounded-xl bg-black/[0.05] dark:bg-white/[0.05] flex items-center justify-center mx-auto mb-4">
              <Buildings size={22} weight="fill" className="text-zinc-600" />
            </div>
            <p className="text-[16px] font-black text-zinc-900 dark:text-white mb-1">{ta('comingSoon')}</p>
            <p className="text-[13px] text-zinc-600 max-w-[320px] mx-auto leading-relaxed">
              {ta('comingSoonDetail')}
            </p>
          </div>
        </div>

        {/* Feature preview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {COMING_SOON.map(({ Icon, title, body }) => (
            <div key={title} className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] p-5">
              <div className="w-9 h-9 rounded-lg bg-black/[0.05] dark:bg-white/[0.05] flex items-center justify-center mb-4">
                <Icon size={16} weight="fill" className="text-zinc-600" />
              </div>
              <p className="text-[14px] font-black text-zinc-900 dark:text-white mb-1.5">{title}</p>
              <p className="text-[12px] text-zinc-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Interim CTA */}
        <div className="mt-6 rounded-2xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500" />
          <div className="px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-2">
                {ta('needSomethingNow')}
              </p>
              <p className="text-[18px] font-black text-zinc-900 dark:text-white tracking-tight">
                {ta('browseMarketplace')} <span className="text-green-400">{ta('whileBuilt')}</span>
              </p>
            </div>
            <Link
              href="/discover"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-green-500 hover:bg-green-400 active:scale-[0.97] text-black font-black px-6 py-3 text-[14px] transition-all"
            >
              {ta('exploreCampaigns')}
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
