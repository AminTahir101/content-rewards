'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function MarketingNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl text-white tracking-tight">
          Content<span className="text-emerald-400">Rewards</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
          <Link href="/discover" className="hover:text-white transition-colors">Campaigns</Link>
          <Link href="/#how-it-works" className="hover:text-white transition-colors">How it works</Link>
          <Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link>
          <Link href="/#for-brands" className="hover:text-white transition-colors">For Brands</Link>
        </nav>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg transition-colors"
          >
            Start Earning →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-zinc-400 hover:text-white"
          aria-label="Menu"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-current transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-6 bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-current transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/8 bg-zinc-950 px-5 py-4 space-y-3">
          <Link href="/discover" className="block text-sm text-zinc-300 hover:text-white py-1" onClick={() => setOpen(false)}>Campaigns</Link>
          <Link href="/#how-it-works" className="block text-sm text-zinc-300 hover:text-white py-1" onClick={() => setOpen(false)}>How it works</Link>
          <Link href="/#faq" className="block text-sm text-zinc-300 hover:text-white py-1" onClick={() => setOpen(false)}>FAQ</Link>
          <Link href="/#for-brands" className="block text-sm text-zinc-300 hover:text-white py-1" onClick={() => setOpen(false)}>For Brands</Link>
          <div className="flex gap-3 pt-2 border-t border-white/8">
            <Link href="/login" className="flex-1 text-center text-sm border border-white/15 text-zinc-300 hover:text-white px-4 py-2 rounded-lg">Log in</Link>
            <Link href="/register" className="flex-1 text-center text-sm font-semibold bg-emerald-500 text-black px-4 py-2 rounded-lg">Start Earning</Link>
          </div>
        </div>
      )}
    </header>
  )
}
