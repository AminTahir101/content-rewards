'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ThemeToggle } from '@/components/ThemeToggle'
import Logo from '@/components/Logo'

interface Props {
  orgName?: string | null
  userLabel?: string | null
}

export default function BrandNav({ orgName, userLabel }: Props) {
  const pathname = usePathname()
  const t = useTranslations('nav')

  const BRAND_NAV = [
    { label: t('overview'),    href: '/dashboard'          },
    { label: t('campaigns'),   href: '/brand/campaigns'    },
    { label: t('submissions'), href: '/brand/submissions'  },
    { label: t('analytics'),   href: '/brand/analytics'    },
    { label: t('finance'),     href: '/brand/finance'      },
    { label: t('profile'),     href: '/profile'            },
  ]

  return (
    <nav className="sticky top-0 z-50 h-14 bg-page/90 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.06] flex items-center">
      <div className="max-w-[1400px] mx-auto w-full px-6 flex items-center justify-between gap-6">

        {/* Logo + nav links */}
        <div className="flex items-center gap-6 min-w-0">
          <Link href="/dashboard" className="shrink-0">
            <Logo height={30} />
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {BRAND_NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors ${
                    active
                      ? 'text-green-400 bg-green-500/10'
                      : 'text-zinc-500 hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.06]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          {(orgName ?? userLabel) && (
            <span className="hidden sm:block text-[12px] text-zinc-600 truncate max-w-[200px]">
              {orgName ?? userLabel}
            </span>
          )}
          <ThemeToggle />
          <span className="rounded-md bg-black/[0.07] dark:bg-white/[0.07] border border-black/[0.08] dark:border-white/[0.08] text-[11px] font-black text-zinc-400 px-2.5 py-1">
            {t('roleBrand')}
          </span>
        </div>
      </div>
    </nav>
  )
}
