import Link from 'next/link'
import {
  ArrowRight,
  Compass,
  VideoCamera,
  CurrencyDollar,
  ChartLineUp,
  Lightning,
  Rocket,
  UserCircle,
  CheckCircle,
} from '@phosphor-icons/react/dist/ssr'
import { getTranslations } from 'next-intl/server'
import AppNav from '@/components/app/AppNav'

interface Props {
  user: { id: string; name?: string | null; email: string; role: string }
}

export default async function CreatorHome({ user }: Props) {
  const t = await getTranslations('nav')
  const td = await getTranslations('creatorDashboard')
  const tc = await getTranslations('common')

  const CREATOR_NAV = [
    { label: t('dashboard'), href: '/dashboard' },
    { label: t('discover'), href: '/discover' },
    { label: t('myCampaigns'), href: '/my-campaigns' },
    { label: t('earnings'), href: '/earnings' },
    { label: t('profile'), href: '/profile' },
  ]

  const QUICK_ACTIONS = [
    { Icon: Compass,       label: td('browseCampaignsAction'),  detail: td('browseCampaignsDetail'), href: '/discover' },
    { Icon: VideoCamera,   label: td('myCampaignsAction'),       detail: td('myCampaignsDetail'),     href: '/my-campaigns' },
    { Icon: CurrencyDollar,label: td('earningsAction'),           detail: td('earningsDetail'),        href: '/earnings' },
    { Icon: UserCircle,    label: td('profileAction'),            detail: td('profileDetail'),         href: '/profile' },
  ]
  const firstName = user.name?.split(' ')[0] ?? null

  return (
    <div className="min-h-screen bg-page">
      <AppNav links={CREATOR_NAV} roleBadge={t('roleBadgeCreator')} userLabel={user.email} />

      {/* ── Welcome ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-3">
            {td('label')}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <h1 className="text-[42px] sm:text-[56px] font-black text-zinc-900 dark:text-white tracking-[-0.03em] leading-[0.92]">
              {firstName ? (
                <>{td('welcomeBack')}<br /><span className="text-green-400">{firstName}</span></>
              ) : (
                <>{td('welcome')}<br /><span className="text-green-400">{td('back')}</span></>
              )}
            </h1>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-zinc-100 active:scale-[0.97] text-black font-black px-5 py-2.5 text-[14px] transition-all self-start"
            >
              {td('browseCampaigns')}
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-black/[0.06] dark:divide-white/[0.06]">
            {[
              { label: td('totalEarned'),      value: 'SAR 0', detail: td('lifetime'),          Icon: ChartLineUp   },
              { label: td('available'),         value: 'SAR 0', detail: td('readyToWithdraw'), Icon: CurrencyDollar},
              { label: td('pending'),           value: 'SAR 0', detail: td('beingVerified'),    Icon: Lightning     },
              { label: td('activeCampaigns'),  value: '0',     detail: td('inProgress'),       Icon: Rocket        },
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

      {/* ── Main grid ───────────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

          {/* Active campaigns */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-black text-zinc-900 dark:text-white tracking-tight">{td('activeCampaigns')}</h2>
              <Link href="/my-campaigns" className="text-[12px] font-semibold text-zinc-600 hover:text-white flex items-center gap-1 transition-colors">
                {td('viewAll')} <ArrowRight size={11} weight="bold" />
              </Link>
            </div>

            {/* Empty state */}
            <div className="rounded-2xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-400" />
              <div className="px-8 py-16 text-center">
                <div className="w-12 h-12 rounded-xl bg-black/[0.05] dark:bg-white/[0.05] flex items-center justify-center mx-auto mb-4">
                  <VideoCamera size={22} weight="fill" className="text-zinc-600" />
                </div>
                <p className="text-[16px] font-black text-zinc-900 dark:text-white mb-1">{td('noActiveCampaigns')}</p>
                <p className="text-[13px] text-zinc-600 mb-6 max-w-[260px] mx-auto leading-relaxed">
                  {td('noActiveCampaignsDetail')}
                </p>
                <Link
                  href="/discover"
                  className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-zinc-100 active:scale-[0.97] text-black font-black px-5 py-2.5 text-[13px] transition-all"
                >
                  {td('discoverCampaigns')}
                  <ArrowRight size={13} weight="bold" />
                </Link>
              </div>
            </div>

            {/* Recent earnings placeholder */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[17px] font-black text-zinc-900 dark:text-white tracking-tight">{td('recentEarnings')}</h2>
                <Link href="/earnings" className="text-[12px] font-semibold text-zinc-600 hover:text-white flex items-center gap-1 transition-colors">
                  {td('viewAll')} <ArrowRight size={11} weight="bold" />
                </Link>
              </div>
              <div className="rounded-2xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-6 py-8 text-center">
                <p className="text-[13px] text-zinc-600">{td('noEarnings')}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            <h2 className="text-[17px] font-black text-zinc-900 dark:text-white tracking-tight mb-4">{td('quickActions')}</h2>

            {QUICK_ACTIONS.map(({ Icon, label, detail, href }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-4 rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.14] dark:hover:border-white/[0.14] px-4 py-3.5 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-black/[0.05] dark:bg-white/[0.05] flex items-center justify-center shrink-0 group-hover:bg-green-500/10 transition-colors">
                  <Icon size={16} weight="fill" className="text-zinc-600 group-hover:text-green-400 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-zinc-900 dark:text-white">{label}</p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">{detail}</p>
                </div>
                <ArrowRight size={12} weight="bold" className="text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}

            {/* Profile completion */}
            <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] p-5 mt-2">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={14} weight="fill" className="text-green-500" />
                <p className="text-[13px] font-bold text-zinc-900 dark:text-white">{td('completeProfile')}</p>
              </div>
              <p className="text-[12px] text-zinc-600 mb-4 leading-relaxed">
                {td('completeProfileDetail')}
              </p>
              <div className="h-1 rounded-full bg-black/[0.06] dark:bg-white/[0.06] mb-2 overflow-hidden">
                <div className="h-full w-1/3 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] text-zinc-600">{td('profileComplete', { pct: 33 })}</span>
                <span className="text-[11px] text-green-500 font-semibold">{td('profileSteps', { done: 1, total: 3 })}</span>
              </div>
              <Link href="/profile" className="inline-flex items-center gap-1 text-[12px] font-semibold text-green-400 hover:text-green-300 transition-colors">
                {td('setupProfile')} <ArrowRight size={11} weight="bold" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Discover CTA banner ──────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 pb-10">
        <div className="rounded-2xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500" />
          <div className="px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-2">
                {td('liveNow')}
              </p>
              <p className="text-[22px] font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
                {td('everyViewPays')} <span className="text-green-400">{td('pays')}</span>
              </p>
              <p className="text-[13px] text-zinc-600 mt-1">
                {td('saudiBrandsPaying')}
              </p>
            </div>
            <Link
              href="/discover"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-green-500 hover:bg-green-400 active:scale-[0.97] text-black font-black px-6 py-3 text-[14px] transition-all"
            >
              {td('browseCampaigns')}
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
