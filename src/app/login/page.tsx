'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import Logo from '@/components/Logo'

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab  = 'login' | 'register'
type Role = 'CREATOR' | 'BRAND' | 'AGENCY'

// ── Login form ────────────────────────────────────────────────────────────────

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter()
  const params = useSearchParams()
  const justRegistered = params.get('registered') === '1'
  const t = useTranslations('auth')

  const [error,   setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd     = new FormData(e.currentTarget)
    const result = await signIn('credentials', {
      email:    fd.get('email'),
      password: fd.get('password'),
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError(t('invalidCredentials'))
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="space-y-5">
      {justRegistered && !error && (
        <div className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-[13px] text-green-600 dark:text-green-400 font-medium">
          {t('accountCreated')}
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-[13px] text-red-600 dark:text-red-400 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="login-email" className="block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            {t('email')}
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            placeholder={t('emailPlaceholder')}
            required
            autoComplete="email"
            className="w-full rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] px-4 py-3 text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            {t('password')}
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] px-4 py-3 text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none text-white font-black px-6 py-3.5 text-[15px] transition-all"
        >
          {loading ? t('loggingIn') : (
            <>{t('loginButton')} <ArrowRight size={16} weight="bold" className="rtl:rotate-180" /></>
          )}
        </button>
      </form>

      <p className="text-center text-[13px] text-zinc-400">
        {t('noAccount')}{' '}
        <button onClick={onSwitch} className="text-green-600 dark:text-green-400 font-semibold hover:underline">
          {t('signUpLink')}
        </button>
      </p>

      <p className="text-center text-[12px] text-zinc-500">
        {t('termsNote')}{' '}
        <Link href="/terms" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">{t('termsLink')}</Link>
        {' '}{t('andText')}{' '}
        <Link href="/privacy" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">{t('privacyLink')}</Link>.
      </p>
    </div>
  )
}

// ── Register form ─────────────────────────────────────────────────────────────

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter()
  const t = useTranslations('auth')
  const [role,    setRole]    = useState<Role>('CREATOR')
  const [error,   setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const ROLES: { value: Role; label: string; detail: string }[] = [
    { value: 'CREATOR', label: t('roleCreator'), detail: t('roleCreatorDetail') },
    { value: 'BRAND',   label: t('roleBrand'),   detail: t('roleBrandDetail')   },
    { value: 'AGENCY',  label: t('roleAgency'),  detail: t('roleAgencyDetail')  },
  ]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd  = new FormData(e.currentTarget)
    const res = await fetch('/api/auth/register', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email:    fd.get('email'),
        password: fd.get('password'),
        name:     fd.get('name'),
        role,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? t('registrationFailed'))
      return
    }

    // Auto sign-in after registration
    const result = await signIn('credentials', {
      email:    fd.get('email'),
      password: fd.get('password'),
      redirect: false,
    })

    if (result?.error) {
      // Fallback: switch to login tab with success banner
      onSwitch()
      router.replace('/login?registered=1')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-[13px] text-red-600 dark:text-red-400 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Role selector */}
        <div>
          <p className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{t('selectRole')}</p>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`rounded-xl border p-3 text-start transition-all ${
                  role === r.value
                    ? 'border-green-500 bg-green-500/10 ring-1 ring-green-500'
                    : 'border-zinc-200 dark:border-white/[0.1] hover:border-zinc-300 dark:hover:border-white/20 bg-white dark:bg-white/[0.04]'
                }`}
              >
                <span className={`block text-[13px] font-black ${role === r.value ? 'text-green-600 dark:text-green-400' : 'text-zinc-900 dark:text-white'}`}>
                  {r.label}
                </span>
                <span className="block text-[11px] text-zinc-400 mt-0.5 leading-snug">
                  {r.detail}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="reg-name" className="block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            {t('name')}
          </label>
          <input
            id="reg-name"
            name="name"
            type="text"
            placeholder={t('namePlaceholder')}
            required
            autoComplete="name"
            className="w-full rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] px-4 py-3 text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="reg-email" className="block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            {t('email')}
          </label>
          <input
            id="reg-email"
            name="email"
            type="email"
            placeholder={t('emailPlaceholder')}
            required
            autoComplete="email"
            className="w-full rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] px-4 py-3 text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="reg-password" className="block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            {t('password')}
          </label>
          <input
            id="reg-password"
            name="password"
            type="password"
            placeholder={t('passwordPlaceholder')}
            required
            autoComplete="new-password"
            minLength={8}
            className="w-full rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] px-4 py-3 text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none text-white font-black px-6 py-3.5 text-[15px] transition-all"
        >
          {loading ? t('creatingAccount') : (
            <>{t('createAccount')} <ArrowRight size={16} weight="bold" className="rtl:rotate-180" /></>
          )}
        </button>
      </form>

      <p className="text-center text-[13px] text-zinc-400">
        {t('hasAccount')}{' '}
        <button onClick={onSwitch} className="text-green-600 dark:text-green-400 font-semibold hover:underline">
          {t('signInLink')}
        </button>
      </p>

      <p className="text-center text-[12px] text-zinc-500">
        {t('termsNoteRegister')}{' '}
        <Link href="/terms" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">{t('termsLink')}</Link>
        {' '}{t('andText')}{' '}
        <Link href="/privacy" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">{t('privacyLink')}</Link>.
      </p>
    </div>
  )
}

// ── Inner component (needs useSearchParams -> must be inside Suspense) ─────────

function AuthPanel() {
  const params          = useSearchParams()
  const defaultTab: Tab = params.get('registered') === '1' ? 'login' : 'login'
  const [tab, setTab]   = useState<Tab>(defaultTab)
  const t = useTranslations('auth')

  return (
    <div className="w-full max-w-[420px]">
      {/* Heading */}
      <h1 className="text-[28px] font-black text-zinc-950 dark:text-white tracking-tight mb-6">
        {tab === 'login' ? t('loginTitle') : t('registerTitle')}
      </h1>

      {/* Tab switcher */}
      <div className="flex rounded-xl bg-zinc-100 dark:bg-white/[0.05] p-1 mb-7">
        {(['login', 'register'] as Tab[]).map((tabVal) => (
          <button
            key={tabVal}
            onClick={() => setTab(tabVal)}
            className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${
              tab === tabVal
                ? 'bg-white dark:bg-white/[0.1] text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            {tabVal === 'login' ? t('login') : t('register')}
          </button>
        ))}
      </div>

      {/* Form */}
      {tab === 'login'
        ? <LoginForm    onSwitch={() => setTab('register')} />
        : <RegisterForm onSwitch={() => setTab('login')}    />
      }
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const t = useTranslations('auth')

  const bullets = [
    t('heroBullet1'),
    t('heroBullet2'),
    t('heroBullet3'),
  ]

  return (
    <div className="min-h-[100dvh] flex bg-white dark:bg-page">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[44%] bg-zinc-950 flex-col justify-between p-12 shrink-0">
        <Link href="/">
          <Logo height={32} />
        </Link>

        <div>
          <p className="text-[52px] font-black text-white tracking-[-0.03em] leading-[0.95] mb-6">
            {t('heroTagline')}<br />
            <span className="text-green-500">{t('heroPays')}</span>
          </p>
          <p className="text-[15px] text-zinc-400 leading-relaxed max-w-[320px]">
            {t('heroSubtext')}
          </p>
          <div className="mt-8 space-y-3">
            {bullets.map((line) => (
              <div key={line} className="flex items-start gap-3">
                <CheckCircle size={16} weight="fill" className="text-green-500 shrink-0 mt-0.5" />
                <p className="text-[13px] text-zinc-400 leading-snug">{line}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.08] pt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[28px] font-black text-white tracking-tight leading-none">SAR 12M+</p>
              <p className="text-[12px] text-zinc-500 mt-1">{t('paidToCreators')}</p>
            </div>
            <div>
              <p className="text-[28px] font-black text-white tracking-tight leading-none">800M+</p>
              <p className="text-[12px] text-zinc-500 mt-1">{t('verifiedViews')}</p>
            </div>
            <div>
              <p className="text-[28px] font-black text-white tracking-tight leading-none">40+</p>
              <p className="text-[12px] text-zinc-500 mt-1">{t('liveCampaigns')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden mb-8">
          <Logo height={30} />
        </Link>

        <Suspense fallback={<div className="w-full max-w-[420px] h-64 animate-pulse rounded-xl bg-zinc-100 dark:bg-white/[0.05]" />}>
          <AuthPanel />
        </Suspense>
      </div>
    </div>
  )
}
