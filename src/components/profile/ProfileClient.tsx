'use client'

import Image from 'next/image'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import {
  CheckCircle,
  Warning,
  ArrowRight,
  TrendUp,
  Megaphone,
  FileText,
  Globe,
  Phone,
  MapPin,
  Link as LinkIcon,
  User,
  SignOut,
} from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import AppNav from '@/components/app/AppNav'

// ── Types ─────────────────────────────────────────────────────────────────────

interface UserData {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string
  createdAt: string
}

interface ProfileData {
  displayName: string | null
  bio: string | null
  avatarUrl: string | null
  country: string | null
  city: string | null
  language: string | null
  phone: string | null
  website: string | null
  isComplete: boolean
}

interface CreatorProfileData {
  handle: string | null
  niche: string[]
  totalFollowers: number
  verifiedFollowers: number
  score: number
  isVerified: boolean
  isEligible: boolean
  isSuspended: boolean
}

interface Stats {
  campaignCount: number
  submissionCount: number
  totalEarned: string | null
  availableBalance: string | null
}

interface Props {
  user: UserData
  profile: ProfileData | null
  creatorProfile: CreatorProfileData | null
  stats: Stats
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sar(value: string | null): string {
  if (!value) return 'SAR 0'
  const n = parseFloat(value)
  if (n >= 1_000_000) return `SAR ${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `SAR ${(n / 1_000).toFixed(0)}K`
  return `SAR ${n.toFixed(0)}`
}


// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.14em] mb-4">{title}</p>
      {children}
    </div>
  )
}

// ── Info row ──────────────────────────────────────────────────────────────────

function InfoRow({ Icon, label, value }: { Icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-black/[0.05] dark:border-white/[0.05] last:border-0">
      <div className="w-7 h-7 rounded-lg bg-black/[0.05] dark:bg-white/[0.05] flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={13} weight="fill" className="text-zinc-600" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-zinc-600 mb-0.5">{label}</p>
        <p className="text-[13px] text-zinc-900 dark:text-white font-medium">{value}</p>
      </div>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProfileClient({ user, profile, creatorProfile, stats }: Props) {
  const t   = useTranslations('nav')
  const tp  = useTranslations('profile')
  const tdc = useTranslations('discover.category')

  const CREATOR_NAV = [
    { label: t('dashboard'),    href: '/dashboard' },
    { label: t('discover'),     href: '/discover' },
    { label: t('myCampaigns'),  href: '/my-campaigns' },
    { label: t('earnings'),     href: '/earnings' },
    { label: t('profile'),      href: '/profile' },
  ]

  const displayName = profile?.displayName ?? user.name ?? user.email.split('@')[0]
  const avatarUrl   = profile?.avatarUrl ?? user.image
  const handle      = creatorProfile?.handle
  const isVerified  = creatorProfile?.isVerified ?? false
  const isSuspended = creatorProfile?.isSuspended ?? false
  const isIncomplete = !profile?.isComplete

  const profileCompletion = (() => {
    if (!profile) return 0
    const fields = [
      profile.displayName,
      profile.bio,
      profile.avatarUrl,
      profile.country,
      profile.city,
      profile.phone,
    ]
    return Math.round((fields.filter(Boolean).length / fields.length) * 100)
  })()

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-SA', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-page">
      <AppNav links={CREATOR_NAV} />

      {/* ── Profile hero ───────────────────────────────────────────────────── */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">

            {/* Avatar */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-surface border border-black/[0.08] dark:border-white/[0.08]">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={displayName} fill className="object-cover" sizes="96px" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <User size={36} weight="fill" className="text-zinc-700" />
                </div>
              )}
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-[32px] sm:text-[42px] font-black text-zinc-900 dark:text-white tracking-[-0.02em] leading-none">
                  {displayName}
                </h1>
                {isVerified && (
                  <CheckCircle size={20} weight="fill" className="text-green-400 shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {handle && (
                  <span className="text-[13px] text-zinc-500 font-medium">@{handle}</span>
                )}
                {handle && (
                  <span className="text-zinc-700">·</span>
                )}
                <span className="text-[13px] text-zinc-600">{tp('memberSince', { date: memberSince })}</span>
                {isSuspended && (
                  <span className="rounded-md bg-red-500/10 text-red-400 text-[11px] font-black px-2 py-0.5">
                    {tp('suspended')}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <Link
                href="/profile/edit"
                className="inline-flex items-center gap-1.5 rounded-xl border border-black/[0.1] dark:border-white/[0.1] text-zinc-700 dark:text-white/70 hover:border-black/20 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-white text-[13px] font-bold px-4 py-2.5 transition-all"
              >
                {tp('editProfile')}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 text-red-400 hover:border-red-500/40 hover:bg-red-500/[0.06] text-[13px] font-bold px-4 py-2.5 transition-all"
              >
                <SignOut size={14} weight="bold" />
                {tp('signOut')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats strip ────────────────────────────────────────────────────── */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-black/[0.06] dark:divide-white/[0.06]">
            {[
              { label: tp('campaigns'),   value: stats.campaignCount,             suffix: tp('joined'),      Icon: Megaphone, raw: true  },
              { label: tp('submissions'), value: stats.submissionCount,       suffix: tp('total'),       Icon: FileText,  raw: true  },
              { label: tp('totalEarned'),value: sar(stats.totalEarned),      suffix: tp('allTime'),     Icon: TrendUp,   raw: false },
              { label: tp('available'),   value: sar(stats.availableBalance),suffix: tp('toWithdraw'),  Icon: TrendUp,   raw: false },
            ].map(({ label, value, suffix, Icon, raw }) => (
              <div key={label} className="px-8 py-7 first:ps-0 last:pe-0">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">{label}</p>
                  <Icon size={14} weight="fill" className="text-zinc-700 shrink-0" />
                </div>
                <p className="text-[28px] lg:text-[34px] font-black text-zinc-900 dark:text-white tracking-tight leading-none mb-1">
                  {raw ? value : value}
                </p>
                <p className="text-[12px] text-zinc-600">{suffix}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left column ────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Incomplete profile warning */}
            {isIncomplete && (
              <div className="rounded-xl bg-amber-500/[0.07] border border-amber-500/20 px-5 py-4 flex items-start gap-3">
                <Warning size={18} weight="fill" className="text-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-amber-400">{tp('completionWarning')}</p>
                  <p className="text-[12px] text-amber-600 mt-0.5 leading-relaxed">
                    {tp('completionHint')}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-1 rounded-full bg-amber-500/20 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${profileCompletion}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-amber-500 shrink-0">
                      {profileCompletion}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bio */}
            <Section title={tp('bio')}>
              <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-5 py-5">
                {profile?.bio ? (
                  <p className="text-[14px] text-zinc-400 leading-relaxed">{profile.bio}</p>
                ) : (
                  <p className="text-[13px] text-zinc-700 italic">{tp('noBio')}</p>
                )}
              </div>
            </Section>

            {/* Creator niches */}
            {creatorProfile && creatorProfile.niche.length > 0 && (
              <Section title={tp('niches')}>
                <div className="flex flex-wrap gap-2">
                  {creatorProfile.niche.map((n) => (
                    <span
                      key={n}
                      className="rounded-lg bg-black/[0.05] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.06] text-[12px] font-bold text-zinc-400 px-3 py-1.5"
                    >
                      {(() => { try { return tdc(n as any) } catch { return n } })()}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Creator stats */}
            {creatorProfile && (
              <Section title={tp('creatorStats')}>
                <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
                  <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-black/[0.05] dark:divide-white/[0.05]">
                    {[
                      { label: tp('followers'),          value: creatorProfile.totalFollowers.toLocaleString('en-SA')    },
                      { label: tp('verifiedFollowers'), value: creatorProfile.verifiedFollowers.toLocaleString('en-SA') },
                      { label: tp('creatorScore'),      value: creatorProfile.score.toString()                          },
                    ].map(({ label, value }) => (
                      <div key={label} className="px-5 py-5">
                        <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-2">{label}</p>
                        <p className="text-[24px] font-black text-zinc-900 dark:text-white tracking-tight">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>
            )}

            {/* Quick links */}
            <Section title={tp('quickLinks')}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: tp('myCampaigns'), detail: tp('myCampaignsDetail'), href: '/my-campaigns', Icon: Megaphone  },
                  { label: tp('earningsLink'),detail: tp('earningsDetail'),    href: '/earnings',     Icon: TrendUp    },
                ].map(({ label, detail, href, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.14] dark:hover:border-white/[0.14] p-4 flex items-center gap-3 transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-black/[0.05] dark:bg-white/[0.05] flex items-center justify-center group-hover:bg-green-500/10 transition-colors shrink-0">
                      <Icon size={16} weight="fill" className="text-zinc-600 group-hover:text-green-400 transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-black text-zinc-900 dark:text-white">{label}</p>
                      <p className="text-[11px] text-zinc-600">{detail}</p>
                    </div>
                    <ArrowRight size={12} weight="bold" className="text-zinc-700 group-hover:text-zinc-400 ms-auto shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            </Section>
          </div>

          {/* ── Right sidebar ───────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Account info */}
            <Section title={tp('account')}>
              <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-5 divide-y divide-black/[0.05] dark:divide-white/[0.05]">
                <InfoRow Icon={User}   label={tp('email')}  value={user.email} />
                {profile?.country && (
                  <InfoRow Icon={MapPin} label={tp('country')} value={(() => { try { return tp(`countries.${profile.country}` as any) } catch { return profile.country } })()} />
                )}
                {profile?.city && (
                  <InfoRow Icon={MapPin} label={tp('city')} value={profile.city} />
                )}
                {profile?.phone && (
                  <InfoRow Icon={Phone} label={tp('phone')} value={profile.phone} />
                )}
                {profile?.language && (
                  <InfoRow Icon={Globe} label={tp('language')} value={profile.language === 'ar' ? tp('arabic') : tp('english')} />
                )}
                {profile?.website && (
                  <InfoRow Icon={LinkIcon} label={tp('website')} value={profile.website} />
                )}
              </div>
            </Section>

            {/* Status */}
            <Section title={tp('status')}>
              <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-5 divide-y divide-black/[0.05] dark:divide-white/[0.05]">
                <div className="flex items-center justify-between py-3">
                  <p className="text-[12px] text-zinc-600">{tp('verifiedCreator')}</p>
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                    isVerified
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-black/[0.05] dark:bg-white/[0.05] text-zinc-600'
                  }`}>
                    {isVerified ? tp('verified') : tp('unverified')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <p className="text-[12px] text-zinc-600">{tp('campaignEligible')}</p>
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                    creatorProfile?.isEligible !== false
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {creatorProfile?.isEligible !== false ? tp('eligible') : tp('ineligible')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <p className="text-[12px] text-zinc-600">{tp('accountStanding')}</p>
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                    isSuspended
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-green-500/10 text-green-400'
                  }`}>
                    {isSuspended ? tp('suspended') : tp('good')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <p className="text-[12px] text-zinc-600">{tp('label')}</p>
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                    profile?.isComplete
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {profile?.isComplete ? tp('complete') : `${profileCompletion}%`}
                  </span>
                </div>
              </div>
            </Section>

            {/* Discover CTA */}
            <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-400" />
              <div className="px-5 py-5">
                <p className="text-[14px] font-black text-zinc-900 dark:text-white mb-1">{tp('findCampaigns')}</p>
                <p className="text-[12px] text-zinc-600 mb-4 leading-relaxed">
                  {tp('findCampaignsDetail')}
                </p>
                <Link
                  href="/discover"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 hover:bg-green-400 active:scale-[0.97] text-black font-black text-[12px] px-3.5 py-2 transition-all"
                >
                  {tp('discoverCampaigns')}
                  <ArrowRight size={11} weight="bold" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
