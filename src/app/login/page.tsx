'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const justRegistered = params.get('registered') === '1'

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const result = await signIn('credentials', {
      email:    fd.get('email'),
      password: fd.get('password'),
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password. Please try again.')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="w-full max-w-[400px]">
      <h1 className="text-[28px] font-black text-zinc-950 tracking-tight mb-1">
        Welcome back
      </h1>
      <p className="text-[15px] text-zinc-400 mb-8">
        No account yet?{' '}
        <Link href="/register" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
          Create one free
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {justRegistered && !error && (
          <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-[13px] text-green-700 font-medium">
            Account created. Log in to get started.
          </div>
        )}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-[13px] text-red-600 font-medium">
            {error}
          </div>
        )}

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
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="text-[13px] font-semibold text-zinc-700">
              Password
            </label>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none text-white font-black px-6 py-3.5 text-[15px] transition-all"
        >
          {loading ? 'Logging in...' : (
            <>Log In <ArrowRight size={16} weight="bold" /></>
          )}
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-[100dvh] flex">

      {/* ── Left panel — branding ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[44%] bg-zinc-950 flex-col justify-between p-12 shrink-0">
        <Link href="/" className="font-black text-[18px] text-white tracking-tight">
          Content<span className="text-green-500">Rewards</span>
        </Link>

        <div>
          <p className="text-[52px] font-black text-white tracking-[-0.03em] leading-[0.95] mb-6">
            Every view<br />
            <span className="text-green-500">pays.</span>
          </p>
          <p className="text-[15px] text-zinc-400 leading-relaxed max-w-[320px]">
            50,000 Saudi creators are already earning from top brand campaigns.
            Log in and pick up where you left off.
          </p>
        </div>

        <div className="border-t border-white/[0.08] pt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[32px] font-black text-white tracking-tight leading-none">SAR 12M+</p>
              <p className="text-[13px] text-zinc-500 mt-1">paid to creators</p>
            </div>
            <div>
              <p className="text-[32px] font-black text-white tracking-tight leading-none">800M+</p>
              <p className="text-[13px] text-zinc-500 mt-1">verified views</p>
            </div>
            <div>
              <p className="text-[32px] font-black text-white tracking-tight leading-none">40+</p>
              <p className="text-[13px] text-zinc-500 mt-1">live campaigns</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-6 py-16">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden font-black text-[18px] text-zinc-900 tracking-tight mb-10">
          Content<span className="text-green-600">Rewards</span>
        </Link>

        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
