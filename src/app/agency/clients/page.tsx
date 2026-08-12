import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Buildings,
  ChartLineUp,
  UsersThree,
  CurrencyDollar,
  ArrowRight,
  Plus,
  Globe,
} from '@phosphor-icons/react/dist/ssr'
import { getTranslations } from 'next-intl/server'
import AppNav from '@/components/app/AppNav'

export default async function AgencyClientsPage() {
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

  const FEATURE_CARDS = [
    { Icon: Buildings,      title: ta('perClientCampaign'),  body: ta('perClientCampaignDetail')  },
    { Icon: ChartLineUp,    title: ta('clientReporting'),    body: ta('clientReportingDetail')    },
    { Icon: CurrencyDollar, title: ta('budgetAllocation'),   body: ta('budgetAllocationDetail')   },
    { Icon: Globe,          title: ta('whiteLabel'),         body: ta('whiteLabelDetail')         },
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
                {ta('clients')}
              </h1>
            </div>
            <button
              type="button"
              disabled
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-green-500/40 text-black/50 dark:text-white/40 font-black px-5 py-3 text-[14px] cursor-not-allowed"
              title={ta('comingSoonFeatures')}
            >
              <Plus size={14} weight="bold" />
              {ta('addClient')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">

        {/* ── Empty state ─────────────────────────────────────────────────────── */}
        <div className="rounded-2xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden mb-6">
          <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-400" />
          <div className="px-8 py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-black/[0.05] dark:bg-white/[0.05] flex items-center justify-center mx-auto mb-4">
              <Buildings size={22} weight="fill" className="text-zinc-600" />
            </div>
            <p className="text-[16px] font-black text-zinc-900 dark:text-white mb-2">
              {ta('noClients')}
            </p>
            <p className="text-[13px] text-zinc-500 max-w-[360px] mx-auto leading-relaxed">
              {ta('noClientsDetail')}
            </p>
          </div>
        </div>

        {/* ── Feature preview ──────────────────────────────────────────────────── */}
        <div className="mb-3">
          <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.16em]">
            {ta('whatClientIncludes')}
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

        {/* ── Interim CTA ─────────────────────────────────────────────────────── */}
        <div className="rounded-2xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500" />
          <div className="px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-2">
                {ta('whileYouWait')}
              </p>
              <p className="text-[18px] font-black text-zinc-900 dark:text-white tracking-tight">
                {ta('exploreOrManage')}{' '}
                <span className="text-green-400">{ta('orManageCampaigns')}</span>
              </p>
            </div>
            <Link
              href="/agency/campaigns"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-green-500 hover:bg-green-400 active:scale-[0.97] text-black font-black px-6 py-3 text-[14px] transition-all"
            >
              {ta('viewCampaigns')}
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>

        {/* ── Team note ───────────────────────────────────────────────────────── */}
        <div className="mt-6 rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-6 py-5">
          <div className="flex items-start gap-3">
            <UsersThree size={16} weight="fill" className="text-zinc-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[13px] font-black text-zinc-900 dark:text-white mb-0.5">
                {ta('needMultiClient')}
              </p>
              <p className="text-[12px] text-zinc-500 leading-relaxed">
                {ta('contactTeam')}{' '}
                <a
                  href="mailto:agency@contentrewards.com"
                  className="text-green-500 hover:text-green-400 transition-colors"
                >
                  agency@contentrewards.com
                </a>{' '}
                {ta('earlyAccessNote')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
