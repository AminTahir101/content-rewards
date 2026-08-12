import Link from 'next/link'
import {
  ArrowRight,
  Plus,
  ChartLineUp,
  Eye,
  Megaphone,
  ClockCountdown,
  UsersThree,
  CurrencyCircleDollar,
} from '@phosphor-icons/react/dist/ssr'
import { getTranslations } from 'next-intl/server'
import AppNav from '@/components/app/AppNav'

interface Props {
  user: { id: string; name?: string | null; email: string; role: string }
}

export default async function BrandHome({ user }: Props) {
  const t = await getTranslations('nav')
  const tb = await getTranslations('brand')
  const tc = await getTranslations('common')

  const BRAND_NAV = [
    { label: t('overview'),    href: '/dashboard' },
    { label: t('campaigns'),   href: '/brand/campaigns' },
    { label: t('submissions'), href: '/brand/submissions' },
    { label: t('analytics'),   href: '/brand/analytics' },
    { label: t('finance'),     href: '/brand/finance' },
  ]
  const orgName = user.name ?? 'Your Brand'

  return (
    <div className="min-h-screen bg-page">
      <AppNav
        links={BRAND_NAV}
        roleBadge={t('roleBrand')}
        userLabel={user.email}
        ctaHref="/brand/campaigns/new"
        ctaLabel={tb('newCampaign')}
      />

      {/* ── Welcome ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-3">
            {tb('brandDashboard')}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <h1 className="text-[42px] sm:text-[56px] font-black text-zinc-900 dark:text-white tracking-[-0.03em] leading-[0.92] mb-2">
                {tb('overview')}
              </h1>
              <p className="text-[14px] text-zinc-600">{orgName}</p>
            </div>
            <Link
              href="/brand/campaigns/new"
              className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-zinc-100 active:scale-[0.97] text-black font-black px-5 py-2.5 text-[14px] transition-all self-start"
            >
              <Plus size={14} weight="bold" />
              {tb('createCampaign')}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-black/[0.06] dark:divide-white/[0.06]">
            {[
              { label: tb('totalSpend'),      value: 'SAR 0', detail: tb('budgetDeployed'),  Icon: CurrencyCircleDollar },
              { label: tb('verifiedViews'),   value: '0',     detail: tb('fraudScreened'),   Icon: Eye                  },
              { label: tb('activeCampaigns'), value: '0',     detail: tb('currentlyLive'),   Icon: Megaphone            },
              { label: tb('pendingReviews'),  value: '0',     detail: tb('awaitingAction'),  Icon: ClockCountdown       },
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

      {/* ── Campaigns section ───────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-black text-zinc-900 dark:text-white tracking-tight">{t('campaigns')}</h2>
          <Link href="/brand/campaigns" className="text-[12px] font-semibold text-zinc-600 hover:text-white flex items-center gap-1 transition-colors">
            {tc('viewAll')} <ArrowRight size={11} weight="bold" />
          </Link>
        </div>

        {/* Empty state */}
        <div className="rounded-2xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden mb-6">
          <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-400" />
          <div className="px-8 py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-black/[0.05] dark:bg-white/[0.05] flex items-center justify-center mx-auto mb-4">
              <Megaphone size={22} weight="fill" className="text-zinc-600" />
            </div>
            <p className="text-[16px] font-black text-zinc-900 dark:text-white mb-1">{tb('noCampaignsYet')}</p>
            <p className="text-[13px] text-zinc-600 mb-6 max-w-[280px] mx-auto leading-relaxed">
              {tb('noCampaignsYetDetail')}
            </p>
            <Link
              href="/brand/campaigns/new"
              className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-zinc-100 active:scale-[0.97] text-black font-black px-5 py-2.5 text-[13px] transition-all"
            >
              <Plus size={13} weight="bold" />
              {tb('createCampaign')}
            </Link>
          </div>
        </div>

        {/* Value props */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              Icon: UsersThree,
              title: tb('valueCreators'),
              body: tb('valueCreatorsDetail'),
            },
            {
              Icon: Eye,
              title: tb('valuePayPerView'),
              body: tb('valuePayPerViewDetail'),
            },
            {
              Icon: ChartLineUp,
              title: tb('valueAnalytics'),
              body: tb('valueAnalyticsDetail'),
            },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] p-5">
              <div className="w-9 h-9 rounded-lg bg-black/[0.05] dark:bg-white/[0.05] flex items-center justify-center mb-4">
                <Icon size={16} weight="fill" className="text-zinc-600" />
              </div>
              <p className="text-[14px] font-black text-zinc-900 dark:text-white mb-1.5">{title}</p>
              <p className="text-[12px] text-zinc-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="mt-6 rounded-2xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500" />
          <div className="px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-2">
                {tb('performanceMarketing')}
              </p>
              <p className="text-[20px] font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
                {tb('heroCTA')} <span className="text-green-400">{tb('heroCTAHighlight')}</span>
              </p>
            </div>
            <Link
              href="/brand/campaigns/new"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-green-500 hover:bg-green-400 active:scale-[0.97] text-black font-black px-6 py-3 text-[14px] transition-all"
            >
              {tb('launchFirstCampaign')}
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
