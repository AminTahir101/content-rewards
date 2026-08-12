'use client'

import { useState } from 'react'
import Link from 'next/link'
import { List, X } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import LocaleToggle from './LocaleToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import Logo from '@/components/Logo'

export default function MarketingNav({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false)
  const t = useTranslations('marketing.nav')

  const navLinks = [
    { label: t('campaigns'),   href: '/discover' },
    { label: t('howItWorks'),  href: '/#how-it-works' },
    { label: t('forBrands'),   href: '/#for-brands' },
    { label: t('faq'),         href: '/#faq' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] dark:border-white/[0.06] bg-white/95 dark:bg-page/95 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-6 h-[68px] flex items-center justify-between">
        <Link href="/">
          <Logo height={34} />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="px-3.5 py-1.5 rounded-lg text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-all"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3 ms-auto">
          <LocaleToggle current={locale} label={t('switchLang')} />
          <ThemeToggle />
          <Link href="/login" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            {t('login')}
          </Link>
          <Link
            href="/register"
            className="text-sm font-bold bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white px-4 py-2 rounded-lg transition-all"
          >
            {t('startEarning')}
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors ms-auto"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-page px-6 py-5 space-y-1">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white py-2.5 border-b border-black/[0.05] dark:border-white/[0.05]"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-3 pt-4 items-center">
            <LocaleToggle current={locale} label={t('switchLang')} />
            <ThemeToggle />
            <Link href="/login" className="flex-1 text-center text-sm border border-black/[0.1] dark:border-white/[0.1] text-zinc-700 dark:text-zinc-300 px-4 py-2.5 rounded-lg">{t('login')}</Link>
            <Link href="/register" className="flex-1 text-center text-sm font-bold bg-green-500 text-white px-4 py-2.5 rounded-lg">{t('startEarning')}</Link>
          </div>
        </div>
      )}
    </header>
  )
}
