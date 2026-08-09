'use client'

import { useState } from 'react'
import { Plus, Minus } from '@phosphor-icons/react'

interface FAQItem {
  q: string
  a: string
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="divide-y divide-zinc-100">
      {items.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-5 text-start gap-8"
          >
            <span className="text-[15px] font-semibold text-zinc-900">{faq.q}</span>
            <span className="shrink-0 text-zinc-400">
              {open === i
                ? <Minus size={18} weight="bold" />
                : <Plus size={18} weight="bold" />
              }
            </span>
          </button>
          {open === i && (
            <p className="text-[15px] text-zinc-500 leading-relaxed pb-5 max-w-[65ch]">
              {faq.a}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
