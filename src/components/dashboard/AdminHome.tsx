import Link from 'next/link'
import {
  ArrowRight,
  Users,
  Megaphone,
  FileText,
  ShieldWarning,
  CurrencyDollar,
  ChartLineUp,
  Warning,
} from '@phosphor-icons/react/dist/ssr'
import AppNav from '@/components/app/AppNav'

interface Props {
  user: { id: string; name?: string | null; email: string; role: string }
}

const ADMIN_NAV = [
  { label: 'Overview',    href: '/dashboard' },
  { label: 'Users',       href: '/admin/users' },
  { label: 'Campaigns',   href: '/admin/campaigns' },
  { label: 'Submissions', href: '/admin/submissions' },
  { label: 'Risk',        href: '/admin/risk' },
  { label: 'Finance',     href: '/admin/finance' },
]

const ADMIN_ACTIONS = [
  { Icon: Users,          label: 'User Management',    detail: 'Creators, brands, agencies',          href: '/admin/users' },
  { Icon: Megaphone,      label: 'Campaign Oversight', detail: 'Review and manage campaigns',         href: '/admin/campaigns' },
  { Icon: FileText,       label: 'Submission Queue',   detail: 'Pending reviews and disputes',        href: '/admin/submissions' },
  { Icon: ShieldWarning,  label: 'Risk & Fraud',       detail: 'Flagged activity and risk scores',    href: '/admin/risk' },
  { Icon: CurrencyDollar, label: 'Finance',            detail: 'Payouts, wallets, reconciliation',    href: '/admin/finance' },
  { Icon: ChartLineUp,    label: 'Analytics',          detail: 'Platform-wide performance',           href: '/admin/analytics' },
]

export default function AdminHome({ user }: Props) {
  return (
    <div className="min-h-screen bg-page">
      <AppNav links={ADMIN_NAV} roleBadge="Admin" userLabel={user.email} />

      {/* ── Welcome ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-3">
            Platform Administration
          </p>
          <h1 className="text-[42px] sm:text-[56px] font-black text-zinc-900 dark:text-white tracking-[-0.03em] leading-[0.92] mb-2">
            Platform<br /><span className="text-green-400">Overview</span>
          </h1>
          <p className="text-[14px] text-zinc-600">
            Full platform administration for Content Rewards.
          </p>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-black/[0.06] dark:divide-white/[0.06]">
            {[
              { label: 'Total Users',      value: '0',     detail: 'registered',     Icon: Users         },
              { label: 'Live Campaigns',   value: '0',     detail: 'active now',     Icon: Megaphone     },
              { label: 'Submissions',      value: '0',     detail: 'pending review', Icon: FileText      },
              { label: 'Platform Revenue', value: 'SAR 0', detail: 'total fees',     Icon: CurrencyDollar},
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

      {/* ── Admin modules ────────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <h2 className="text-[17px] font-black text-zinc-900 dark:text-white tracking-tight mb-4">Administration</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {ADMIN_ACTIONS.map(({ Icon, label, detail, href }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.14] dark:hover:border-white/[0.14] p-5 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-black/[0.05] dark:bg-white/[0.05] flex items-center justify-center group-hover:bg-green-500/10 transition-colors">
                  <Icon size={18} weight="fill" className="text-zinc-600 group-hover:text-green-400 transition-colors" />
                </div>
                <ArrowRight
                  size={12}
                  weight="bold"
                  className="text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all mt-1"
                />
              </div>
              <p className="text-[15px] font-black text-zinc-900 dark:text-white mb-1">{label}</p>
              <p className="text-[12px] text-zinc-600">{detail}</p>
            </Link>
          ))}
        </div>

        {/* Construction notice */}
        <div className="rounded-xl bg-amber-500/[0.07] border border-amber-500/20 px-5 py-4 flex items-start gap-3 mb-6">
          <Warning size={18} weight="fill" className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-bold text-amber-400">Admin panel under construction</p>
            <p className="text-[12px] text-amber-600 mt-0.5 leading-relaxed">
              Full administration tools are being built. Links above will activate as each module is completed.
            </p>
          </div>
        </div>

        {/* Logged-in strip */}
        <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-6 py-5 flex items-center justify-between gap-6 flex-wrap">
          <div>
            <p className="text-[11px] text-zinc-600 mb-0.5">Logged in as</p>
            <p className="text-[15px] font-bold text-zinc-900 dark:text-white">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-zinc-500 hover:text-white border border-black/[0.07] dark:border-white/[0.07] hover:border-black/20 dark:hover:border-white/20 px-4 py-2 rounded-lg transition-all"
            >
              View marketplace
            </Link>
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1.5 text-[13px] font-bold bg-white hover:bg-zinc-100 text-black px-4 py-2 rounded-lg transition-all"
            >
              Manage users <ArrowRight size={12} weight="bold" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
