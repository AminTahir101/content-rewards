'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function LocaleToggle({ current, label }: { current: string; label: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function toggle() {
    const next = current === 'en' ? 'ar' : 'en'
    document.cookie = `locale=${next};path=/;max-age=31536000`
    startTransition(() => router.refresh())
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors px-2 py-1 rounded-lg hover:bg-zinc-100 disabled:opacity-50"
    >
      {label}
    </button>
  )
}
