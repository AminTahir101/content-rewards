'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from '@phosphor-icons/react'

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch — only render after mount
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-8 h-8" />

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
        text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.06]
        dark:text-zinc-500 dark:hover:text-white dark:hover:bg-white/[0.08]
        ${className ?? ''}`}
    >
      {isDark
        ? <Sun size={16} weight="bold" />
        : <Moon size={16} weight="bold" />
      }
    </button>
  )
}
