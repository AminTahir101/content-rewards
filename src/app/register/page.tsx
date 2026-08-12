'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import Logo from '@/components/Logo'

type Role = 'CREATOR' | 'BRAND' | 'AGENCY'

export default function RegisterPage() {
  const router = useRouter()
  const t = useTranslations('auth')
  const [role, setRole] = useState<Role>('CREATOR')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const ROLES: { value: Role; label: string; detail: string }[] = [
    { value: 'CREATOR', label: t('roleCreator'), detail: t('roleCreatorDetail') },
    { value: 'BRAND',   label: t('roleBrand'),   detail: t('roleBrandDetail')   },
    { value: 'AGENCY',  label: t('roleAgency'),  detail: t('roleAgencyDetail')  },
  ]

  const bullets = [t('heroBullet1'), t('heroBullet2'), t('heroBullet3')]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
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

    router.push('/login?registered=1')
  }

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
          <p className="text-[15px] text-zinc-400 leading-relaxed max-w-[320px] mb-8">
            {t('heroSubtext')}
          </p>
          <div className="space-y-4">
            {bullets.map((line) => (
              <div key={line} className="flex items-start gap-3">
                <CheckCircle size={18} weight="fill" className="text-green-500 shrink-0 mt-0.5" />
                <p className="text-[14px] text-zinc-400 leading-snug">{line}</p>
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

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-16">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden mb-10">
          <Logo height={30} />
        </Link>

        <div className="w-full max-w-[400px]">
          <h1 className="text-[28px] font-black text-zinc-950 dark:text-white tracking-tight mb-1">
            {t('registerTitle')}
          </h1>
          <p className="text-[15px] text-zinc-400 mb-8">
            {t('hasAccount')}{' '}
            <Link href="/login" className="text-green-600 dark:text-green-400 font-semibold hover:text-green-700 transition-colors">
              {t('signInLink')}
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-[13px] text-red-600 dark:text-red-400 font-medium">
                {error}
              </div>
            )}

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
              <label htmlFor="name" className="block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                {t('name')}
              </label>
              <input
                id="name"
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
              <label htmlFor="email" className="block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                {t('email')}
              </label>
              <input
                id="email"
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
              <label htmlFor="password" className="block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                {t('password')}
              </label>
              <input
                id="password"
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

            <p className="text-center text-[12px] text-zinc-400">
              {t('termsNoteRegister')}{' '}
              <Link href="/terms" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">{t('termsLink')}</Link>
              {' '}{t('andText')}{' '}
              <Link href="/privacy" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">{t('privacyLink')}</Link>.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
