'use client'

import { useState } from 'react'
import { Plus, Minus } from '@phosphor-icons/react'

const FAQS = [
  {
    q: 'How do I start earning?',
    a: 'Register, browse campaigns, join one that fits your niche, publish your content, then paste the URL. Once verified and approved, earnings land in your wallet automatically.',
  },
  {
    q: 'What follower count do I need?',
    a: 'Requirements vary by campaign — some are open from 1,000 followers, premium campaigns may require 20,000+. Each campaign page shows the exact minimum.',
  },
  {
    q: 'How is my reward calculated?',
    a: 'Most campaigns pay CPM — cost per thousand verified views. A SAR 12 CPM campaign pays SAR 12 for every 1,000 views your content earns. Calculations are automatic and fully transparent.',
  },
  {
    q: 'How quickly do I get paid?',
    a: 'After your content is approved and the tracking window closes, earnings move to your wallet. Withdrawals to Saudi bank accounts are processed on a regular cycle.',
  },
  {
    q: 'Which platforms are supported?',
    a: 'TikTok, Instagram, YouTube, and X. Each campaign specifies which platforms are accepted.',
  },
  {
    q: 'Is Content Rewards free for creators?',
    a: 'Yes — free to join, free to participate. The platform earns a small fee from campaign budgets; creators keep the majority of every reward.',
  },
]

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="divide-y divide-zinc-100">
      {FAQS.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-5 text-left gap-8"
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
