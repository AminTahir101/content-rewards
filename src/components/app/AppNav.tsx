'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { List, X } from '@phosphor-icons/react'
import { ThemeToggle } from '@/components/ThemeToggle'
import Logo from '@/components/Logo'

export interface AppNavLink {
  label: string
  href: string
}

interface Props {
  links: AppNavLink[]
  roleBadge?: string
  userLabel?: string
  ctaHref?: string
  ctaLabel?: string
}

export default function AppNav({ links, roleBadge, userLabel, ctaHref, ctaLabel }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] dark:border-white/[0.06] bg-page/90 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center gap-6">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Logo height={32} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1">
          {links.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                  active
                    ? 'text-green-400 bg-green-500/10'
                    : 'text-zinc-500 hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.06]'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3 ms-auto shrink-0">
          {roleBadge && (
            <span className="rounded-full bg-black/[0.07] dark:bg-white/[0.07] border border-black/[0.07] dark:border-white/[0.07] px-3 py-0.5 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              {roleBadge}
            </span>
          )}
          {userLabel && (
            <span className="text-[13px] text-zinc-600 max-w-[180px] truncate">{userLabel}</span>
          )}
          <ThemeToggle />
          {ctaHref && ctaLabel && (
            <Link
              href={ctaHref}
              className="text-[13px] font-bold bg-white hover:bg-zinc-100 active:scale-[0.97] text-black px-4 py-1.5 rounded-lg transition-all"
            >
              {ctaLabel}
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-zinc-500 hover:text-white ms-auto transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-black/[0.06] dark:border-white/[0.06] bg-page px-6 py-4 space-y-1">
          {links.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`block text-[14px] font-medium py-2.5 border-b border-black/[0.05] dark:border-white/[0.05] ${
                  active ? 'text-green-400' : 'text-zinc-500 hover:text-white'
                }`}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            )
          })}
          {ctaHref && ctaLabel && (
            <div className="pt-4">
              <Link
                href={ctaHref}
                className="block text-center text-[14px] font-bold bg-white text-black px-4 py-2.5 rounded-lg"
              >
                {ctaLabel}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
