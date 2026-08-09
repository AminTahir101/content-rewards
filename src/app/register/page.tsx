'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from '@phosphor-icons/react'

type Role = 'CREATOR' | 'BRAND' | 'AGENCY'

const ROLES: { value: Role; label: string; detail: string }[] = [
  { value: 'CREATOR', label: 'Creator',  detail: 'Earn from brand campaigns' },
  { value: 'BRAND',   label: 'Brand',    detail: 'Run creator campaigns' },
  { value: 'AGENCY',  label: 'Agency',   detail: 'Manage multiple brands' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>('CREATOR')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
      setError(data.error ?? 'Registration failed. Please try again.')
      return
    }

    router.push('/login?registered=1')
  }

  return (
    <div className="min-h-[100dvh] flex">

      {/* ── Left panel — branding ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[44%] bg-zinc-950 flex-col justify-between p-12 shrink-0">
        <Link href="/" className="font-black text-[18px] text-white tracking-tight">
          Content<span className="text-green-500">Rewards</span>
        </Link>

        <div>
          <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-5">
            Saudi Arabia's creator platform
          </p>
          <h2 className="text-[36px] font-black text-white tracking-[-0.025em] leading-tight mb-10">
            Turn your content<br />into income.
          </h2>
          <div className="space-y-4">
            {[
              'Join active brand campaigns in one tap',
              'Earn per verified view — no guesswork',
              'Withdraw to your Saudi bank account',
            ].map((line) => (
              <div key={line} className="flex items-start gap-3">
                <CheckCircle size={18} weight="fill" className="text-green-500 shrink-0 mt-0.5" />
                <p className="text-[14px] text-zinc-400 leading-snug">{line}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.08] pt-8">
          <p className="text-[14px] text-zinc-300 leading-snug mb-3">
            "I earned more in one month than I used to make in three."
          </p>
          <p className="text-[12px] font-semibold text-zinc-500">Sarah A. — @saraha_ksa · SAR 18,400 earned</p>
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-6 py-16">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden font-black text-[18px] text-zinc-900 tracking-tight mb-10">
          Content<span className="text-green-600">Rewards</span>
        </Link>

        <div className="w-full max-w-[400px]">
          <h1 className="text-[28px] font-black text-zinc-950 tracking-tight mb-1">
            Create your account
          </h1>
          <p className="text-[15px] text-zinc-400 mb-8">
            Already have one?{' '}
            <Link href="/login" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
              Log in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-[13px] text-red-600 font-medium">
                {error}
              </div>
            )}

            {/* Role selector */}
            <div>
              <p className="text-[13px] font-semibold text-zinc-700 mb-2">I am a...</p>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`rounded-xl border p-3 text-start transition-all ${
                      role === r.value
                        ? 'border-green-600 bg-green-50 ring-1 ring-green-600'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <span className={`block text-[13px] font-black ${role === r.value ? 'text-green-700' : 'text-zinc-900'}`}>
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
              <label htmlFor="name" className="block text-[13px] font-semibold text-zinc-700 mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                required
                autoComplete="name"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[13px] font-semibold text-zinc-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[13px] font-semibold text-zinc-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                required
                autoComplete="new-password"
                minLength={8}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none text-white font-black px-6 py-3.5 text-[15px] transition-all"
            >
              {loading ? 'Creating account...' : (
                <>Create Account <ArrowRight size={16} weight="bold" /></>
              )}
            </button>

            <p className="text-center text-[12px] text-zinc-400">
              By creating an account you agree to our{' '}
              <Link href="/terms" className="underline hover:text-zinc-600">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline hover:text-zinc-600">Privacy Policy</Link>.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
