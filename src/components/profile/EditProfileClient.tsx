'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Warning, FloppyDisk } from '@phosphor-icons/react'
import AppNav from '@/components/app/AppNav'

// ── Nav ───────────────────────────────────────────────────────────────────────

const CREATOR_NAV = [
  { label: 'Dashboard',    href: '/dashboard' },
  { label: 'Discover',     href: '/discover' },
  { label: 'My Campaigns', href: '/my-campaigns' },
  { label: 'Earnings',     href: '/earnings' },
  { label: 'Profile',      href: '/profile' },
]

// ── Constants ─────────────────────────────────────────────────────────────────

const NICHES = [
  { value: 'LIFESTYLE',     label: 'Lifestyle'     },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'GAMING',        label: 'Gaming'        },
  { value: 'TECHNOLOGY',    label: 'Technology'    },
  { value: 'FOOD',          label: 'Food'          },
  { value: 'FASHION',       label: 'Fashion'       },
  { value: 'BEAUTY',        label: 'Beauty'        },
  { value: 'TRAVEL',        label: 'Travel'        },
  { value: 'SPORTS',        label: 'Sports'        },
  { value: 'EDUCATION',     label: 'Education'     },
  { value: 'FINANCE',       label: 'Finance'       },
  { value: 'OTHER',         label: 'Other'         },
]

const COUNTRIES = [
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'AE', label: 'UAE'          },
  { value: 'KW', label: 'Kuwait'       },
  { value: 'QA', label: 'Qatar'        },
  { value: 'BH', label: 'Bahrain'      },
  { value: 'OM', label: 'Oman'         },
  { value: 'EG', label: 'Egypt'        },
  { value: 'JO', label: 'Jordan'       },
]

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  user: { id: string; name: string | null; email: string; role: string }
  profile: {
    displayName: string | null
    bio: string | null
    country: string | null
    city: string | null
    language: string | null
    phone: string | null
    website: string | null
  } | null
  creatorProfile: {
    handle: string | null
    niche: string[]
  } | null
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-[12px] font-bold text-zinc-400 mb-2">
      {children}
    </label>
  )
}

function TextInput({
  id, value, onChange, placeholder, maxLength,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  maxLength?: number
}) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full h-10 rounded-lg bg-black/[0.05] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.08] text-[13px] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 px-3 focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-black/[0.07] dark:focus:bg-white/[0.07] transition"
    />
  )
}

function DarkSelect({
  id, value, onChange, options,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-lg bg-black/[0.05] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.08] text-[13px] text-zinc-900 dark:text-white ps-3 pe-8 appearance-none focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-black/[0.07] dark:focus:bg-white/[0.07] transition cursor-pointer"
      >
        <option value="" className="bg-zinc-100 dark:bg-[#1c1c1c]">— Select —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-zinc-100 dark:bg-[#1c1c1c] text-zinc-900 dark:text-white">
            {o.label}
          </option>
        ))}
      </select>
      <span className="absolute end-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none text-[9px]">▾</span>
    </div>
  )
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
      <div className="px-6 py-5 border-b border-black/[0.06] dark:border-white/[0.06]">
        <p className="text-[15px] font-black text-zinc-900 dark:text-white">{title}</p>
        {description && <p className="text-[12px] text-zinc-600 mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-5 space-y-5">
        {children}
      </div>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function EditProfileClient({ user, profile, creatorProfile }: Props) {
  const router = useRouter()
  const isCreator = user.role === 'CREATOR'

  // Form state
  const [name,        setName]        = useState(user.name ?? '')
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '')
  const [bio,         setBio]         = useState(profile?.bio ?? '')
  const [country,     setCountry]     = useState(profile?.country ?? 'SA')
  const [city,        setCity]        = useState(profile?.city ?? '')
  const [language,    setLanguage]    = useState(profile?.language ?? 'ar')
  const [phone,       setPhone]       = useState(profile?.phone ?? '')
  const [website,     setWebsite]     = useState(profile?.website ?? '')
  const [handle,      setHandle]      = useState(creatorProfile?.handle ?? '')
  const [niche,       setNiche]       = useState<string[]>(creatorProfile?.niche ?? [])

  // UI state
  const [saving,   setSaving]   = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  function toggleNiche(value: string) {
    setNiche((prev) =>
      prev.includes(value)
        ? prev.filter((n) => n !== value)
        : prev.length < 5 ? [...prev, value] : prev
    )
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSuccess(false)
    setFieldErrors({})

    const payload: Record<string, unknown> = {
      name:        name.trim()        || undefined,
      displayName: displayName.trim() || undefined,
      bio:         bio.trim()         || undefined,
      country:     country            || undefined,
      city:        city.trim()        || undefined,
      language:    language           || undefined,
      phone:       phone.trim()       || undefined,
      website:     website.trim()     || undefined,
    }
    if (isCreator) {
      payload.handle = handle.trim() || undefined
      payload.niche  = niche
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.status === 409) {
        setFieldErrors({ handle: ['This handle is already taken'] })
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        if (data.details) {
          setFieldErrors(data.details)
        } else {
          setError(data.error ?? 'Something went wrong. Please try again.')
        }
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/profile')
        router.refresh()
      }, 800)
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-page">
      <AppNav links={CREATOR_NAV} />

      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[860px] mx-auto px-6 py-8">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-zinc-600 hover:text-white transition-colors mb-5"
          >
            <ArrowLeft size={12} weight="bold" />
            Back to profile
          </Link>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-2">
                Creator
              </p>
              <h1 className="text-[36px] sm:text-[48px] font-black text-zinc-900 dark:text-white tracking-[-0.02em] leading-none">
                Edit Profile
              </h1>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || success}
              className={`shrink-0 inline-flex items-center gap-2 rounded-xl font-black text-[13px] px-5 py-2.5 transition-all active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed ${
                success
                  ? 'bg-green-500 text-black'
                  : 'bg-white hover:bg-zinc-100 text-black'
              }`}
            >
              {success ? (
                <>
                  <CheckCircle size={14} weight="fill" />
                  Saved
                </>
              ) : (
                <>
                  <FloppyDisk size={14} weight="fill" />
                  {saving ? 'Saving…' : 'Save changes'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Form ───────────────────────────────────────────────────────────── */}
      <div className="max-w-[860px] mx-auto px-6 py-8 space-y-6">

        {/* Global error */}
        {error && (
          <div className="rounded-xl bg-red-500/[0.07] border border-red-500/20 px-5 py-4 flex items-start gap-3">
            <Warning size={16} weight="fill" className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-[13px] text-red-400">{error}</p>
          </div>
        )}

        {/* ── Basic info ───────────────────────────────────────────────────── */}
        <Section
          title="Basic Information"
          description="Your name and display information visible to brands."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <FieldLabel htmlFor="name">Full name</FieldLabel>
              <TextInput id="name" value={name} onChange={setName} placeholder="Your full name" maxLength={80} />
              {fieldErrors.name && <p className="text-[11px] text-red-400 mt-1">{fieldErrors.name[0]}</p>}
            </div>
            <div>
              <FieldLabel htmlFor="displayName">Display name</FieldLabel>
              <TextInput id="displayName" value={displayName} onChange={setDisplayName} placeholder="Shown on your profile" maxLength={80} />
              {fieldErrors.displayName && <p className="text-[11px] text-red-400 mt-1">{fieldErrors.displayName[0]}</p>}
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="bio">Bio</FieldLabel>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell brands about yourself and what you create…"
              maxLength={500}
              rows={3}
              className="w-full rounded-lg bg-black/[0.05] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.08] text-[13px] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 px-3 py-2.5 focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-black/[0.07] dark:focus:bg-white/[0.07] transition resize-none"
            />
            <p className="text-[11px] text-zinc-700 mt-1 text-end">{bio.length}/500</p>
          </div>
        </Section>

        {/* ── Creator identity (creator only) ──────────────────────────────── */}
        {isCreator && (
          <Section
            title="Creator Identity"
            description="Your public creator handle and content categories."
          >
            <div>
              <FieldLabel htmlFor="handle">Handle</FieldLabel>
              <div className="relative">
                <span className="absolute start-3 top-1/2 -translate-y-1/2 text-zinc-600 text-[13px] pointer-events-none select-none">@</span>
                <input
                  id="handle"
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                  placeholder="your_handle"
                  maxLength={40}
                  className="w-full h-10 rounded-lg bg-black/[0.05] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.08] text-[13px] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 ps-7 pe-3 focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-black/[0.07] dark:focus:bg-white/[0.07] transition"
                />
              </div>
              {fieldErrors.handle && <p className="text-[11px] text-red-400 mt-1">{fieldErrors.handle[0]}</p>}
              <p className="text-[11px] text-zinc-700 mt-1">Letters, numbers and underscores only</p>
            </div>

            <div>
              <FieldLabel htmlFor="niche">Content niches <span className="text-zinc-700 font-normal">(up to 5)</span></FieldLabel>
              <div className="flex flex-wrap gap-2 mt-1">
                {NICHES.map((n) => {
                  const active = niche.includes(n.value)
                  const atLimit = niche.length >= 5 && !active
                  return (
                    <button
                      key={n.value}
                      type="button"
                      onClick={() => toggleNiche(n.value)}
                      disabled={atLimit}
                      className={`rounded-lg text-[12px] font-bold px-3 py-1.5 transition-all border ${
                        active
                          ? 'bg-green-500/10 border-green-500/30 text-green-400'
                          : atLimit
                            ? 'bg-black/[0.02] dark:bg-white/[0.02] border-black/[0.04] dark:border-white/[0.04] text-zinc-700 cursor-not-allowed'
                            : 'bg-black/[0.05] dark:bg-white/[0.05] border-black/[0.06] dark:border-white/[0.06] text-zinc-400 hover:border-black/[0.14] dark:hover:border-white/[0.14] hover:text-zinc-900 dark:hover:text-white'
                      }`}
                    >
                      {n.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </Section>
        )}

        {/* ── Location & contact ────────────────────────────────────────────── */}
        <Section
          title="Location & Contact"
          description="Used for campaign eligibility and creator discovery."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <FieldLabel htmlFor="country">Country</FieldLabel>
              <DarkSelect id="country" value={country} onChange={setCountry} options={COUNTRIES} />
            </div>
            <div>
              <FieldLabel htmlFor="city">City</FieldLabel>
              <TextInput id="city" value={city} onChange={setCity} placeholder="e.g. Riyadh" maxLength={80} />
            </div>
            <div>
              <FieldLabel htmlFor="phone">Phone number</FieldLabel>
              <TextInput id="phone" value={phone} onChange={setPhone} placeholder="+966 5x xxx xxxx" maxLength={20} />
              {fieldErrors.phone && <p className="text-[11px] text-red-400 mt-1">{fieldErrors.phone[0]}</p>}
            </div>
            <div>
              <FieldLabel htmlFor="language">Preferred language</FieldLabel>
              <DarkSelect
                id="language"
                value={language}
                onChange={setLanguage}
                options={[
                  { value: 'ar', label: 'Arabic' },
                  { value: 'en', label: 'English' },
                ]}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="website">Website or portfolio</FieldLabel>
            <TextInput id="website" value={website} onChange={setWebsite} placeholder="https://yoursite.com" maxLength={200} />
            {fieldErrors.website && <p className="text-[11px] text-red-400 mt-1">{fieldErrors.website[0]}</p>}
          </div>
        </Section>

        {/* ── Action row ───────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 pt-2 pb-10">
          <Link
            href="/profile"
            className="text-[13px] font-semibold text-zinc-600 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={saving || success}
            className={`inline-flex items-center gap-2 rounded-xl font-black text-[13px] px-6 py-3 transition-all active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed ${
              success
                ? 'bg-green-500 text-black'
                : 'bg-white hover:bg-zinc-100 text-black'
            }`}
          >
            {success ? (
              <>
                <CheckCircle size={14} weight="fill" />
                Saved — redirecting…
              </>
            ) : (
              <>
                <FloppyDisk size={14} weight="fill" />
                {saving ? 'Saving…' : 'Save changes'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
