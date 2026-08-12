import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ChartLineUp,
  Buildings,
  UsersThree,
  CurrencyDollar,
  ArrowRight,
  Plus,
  Target,
  Megaphone,
} from '@phosphor-icons/react/dist/ssr'
import { getTranslations } from 'next-intl/server'
import AppNav from '@/components/app/AppNav'

export default async function AgencyCampaignsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'AGENCY') redirect('/dashboard')

  const t = await getTranslations('nav')
  const ta = await getTranslations('agency')

  const AGENCY_NAV = [
    { label: t('dashboard'),  href: '/dashboard' },
    { label: t('clients'),    href: '/agency/clients' },
    { label: t('campaigns'),  href: '/agency/campaigns' },
    { label: t('analytics'),  href: '/agency/analytics' },
    { label: t('finance'),    href: '/agency/finance' },
    { label: t('profile'),    href: '/profile' },
  ]

  const STATS = [
    { label: ta('activeCampaigns'), value: '0', detail: ta('runningNow'),     Icon: ChartLineUp  },
    { label: ta('totalCampaigns'),  value: '0', detail: ta('allTime'),         Icon: Megaphone    },
    { label: ta('totalSpend'),      value: 'SAR 0', detail: ta('acrossClients'), Icon: CurrencyDollar },
  ]

  const FEATURE_CARDS = [
    { Icon: Buildings,   title: ta('multiClientHub'),     body: ta('multiClientHubDetail')     },
    { Icon: Target,      title: ta('campaignTargeting'),  body: ta('campaignTargetingDetail')  },
    { Icon: UsersThree,  title: ta('creatorDiscovery'),   body: ta('creatorDiscoveryDetail')   },
    { Icon: ChartLineUp, title: ta('crossClientPerf'),    body: ta('crossClientPerfDetail')    },
  ]

  return (
    <div className="min-h-screen bg-page">
      <AppNav links={AGENCY_NAV} roleBadge={t('roleBadgeAgency')} userLabel={session.user.email} />

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-3">
                {ta('label')}
              </p>
              <h1 className="text-[42px] sm:text-[56px] font-black text-zinc-900 dark:text-white tracking-[-0.03em] leading-[0.92]">
                {ta('campaigns')}
              </h1>
            </div>
            <button
              type="button"
              disabled
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-green-500/40 text-black/50 dark:text-white/40 font-black px-5 py-3 text-[14px] cursor-not-allowed"
              title={ta('addClientFirst')}
            >
              <Plus size={14} weight="bold" />
              {ta('newCampaign')}
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats strip ─────────────────────────────────────────────────────── */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-black/[0.06] dark:divide-white/[0.06]">
            {STATS.map(({ label, value, detail, Icon }) => (
              <div key={label} className="px-8 py-7 first:ps-0 last:pe-0">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">{label}</p>
                  <Icon size={14} weight="fill" className="text-zinc-700 shrink-0" />
                </div>
                <p className="text-[30px] font-black text-zinc-900 dark:text-white tracking-tight leading-none mb-1">
                  {value}
                </p>
                <p className="text-[12px] text-zinc-600">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">

        {/* ── Empty state ─────────────────────────────────────────────────────── */}
        <div className="rounded-2xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden mb-6">
          <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-400" />
          <div className="px-8 py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-black/[0.05] dark:bg-white/[0.05] flex items-center justify-center mx-auto mb-4">
              <Megaphone size={22} weight="fill" className="text-zinc-600" />
            </div>
            <p className="text-[16px] font-black text-zinc-900 dark:text-white mb-2">
              {ta('noCampaignsYet')}
            </p>
            <p className="text-[13px] text-zinc-500 max-w-[380px] mx-auto leading-relaxed">
              {ta('noCampaignsDetail')}
            </p>
            <Link
              href="/agency/clients"
              className="inline-flex items-center gap-2 mt-6 rounded-xl border border-black/[0.1] dark:border-white/[0.1] hover:border-black/20 dark:hover:border-white/20 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-bold px-5 py-2.5 text-[13px] transition-all"
            >
              {ta('goToClients')}
              <ArrowRight size={12} weight="bold" />
            </Link>
          </div>
        </div>

        {/* ── Feature preview ──────────────────────────────────────────────────── */}
        <div className="mb-3">
          <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.16em]">
            {ta('campaignFeatures')}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {FEATURE_CARDS.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] p-5"
            >
              <div className="w-9 h-9 rounded-lg bg-black/[0.05] dark:bg-white/[0.05] flex items-center justify-center mb-4">
                <Icon size={16} weight="fill" className="text-zinc-600" />
              </div>
              <p className="text-[14px] font-black text-zinc-900 dark:text-white mb-1.5">{title}</p>
              <p className="text-[12px] text-zinc-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* ── Browse marketplace CTA ───────────────────────────────────────────── */}
        <div className="rounded-2xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500" />
          <div className="px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-2">
                {ta('inTheMeantime')}
              </p>
              <p className="text-[18px] font-black text-zinc-900 dark:text-white tracking-tight">
                {ta('browseCreatorMarketplace')}{' '}
                <span className="text-green-400">{ta('planFirstCampaign')}</span>
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
