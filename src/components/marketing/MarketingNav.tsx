'use client'

import { useState } from 'react'
import Link from 'next/link'
import { List, X } from '@phosphor-icons/react'

export default function MarketingNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-6 h-[68px] flex items-center justify-between">
        <Link href="/" className="font-black text-[18px] text-zinc-900 tracking-tight">
          Content<span className="text-green-600">Rewards</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: 'Campaigns', href: '/discover' },
            { label: 'How it works', href: '/#how-it-works' },
            { label: 'For Brands', href: '/#for-brands' },
            { label: 'FAQ', href: '/#faq' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="px-3.5 py-1.5 rounded-lg text-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
            Log in
          </Link>
          <Link
            href="/register"
            className="text-sm font-bold bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white px-4 py-2 rounded-lg transition-all"
          >
            Start Earning
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-zinc-500 hover:text-zinc-900 transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-6 py-5 space-y-1">
          {[
            { label: 'Campaigns', href: '/discover' },
            { label: 'How it works', href: '/#how-it-works' },
            { label: 'For Brands', href: '/#for-brands' },
            { label: 'FAQ', href: '/#faq' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="block text-sm text-zinc-600 hover:text-zinc-900 py-2.5 border-b border-zinc-100"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-3 pt-4">
            <Link href="/login" className="flex-1 text-center text-sm border border-zinc-200 text-zinc-700 px-4 py-2.5 rounded-lg">Log in</Link>
            <Link href="/register" className="flex-1 text-center text-sm font-bold bg-green-600 text-white px-4 py-2.5 rounded-lg">Start Earning</Link>
          </div>
        </div>
      )}
    </header>
  )
}
