'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: 'How do I start earning?',
    a: 'Register a creator account, browse available campaigns, join one that fits your niche, publish content on your social account, then submit your post URL. Once verified and approved, you start earning.',
  },
  {
    q: 'What follower count do I need?',
    a: 'Requirements vary by campaign. Some campaigns are open to creators with as few as 1,000 followers, while premium campaigns may require 20,000+. Each campaign page clearly shows the minimum requirement.',
  },
  {
    q: 'How is my reward calculated?',
    a: 'Most campaigns pay on a CPM (cost per thousand views) basis. For example, a SAR 12 CPM campaign pays SAR 12 for every 1,000 verified views your content receives. The platform tracks performance and calculates your earnings automatically.',
  },
  {
    q: 'How quickly do I get paid?',
    a: 'After your content is approved and the performance tracking window closes, your earnings move to your wallet. Withdrawals to your Saudi bank account are processed on a regular cycle.',
  },
  {
    q: 'What platforms are supported?',
    a: 'Currently TikTok, Instagram, YouTube, and X (Twitter). Each campaign specifies which platforms are accepted.',
  },
  {
    q: 'Is Content Rewards free to join?',
    a: 'Yes, completely free for creators. The platform earns a small fee from the campaign budget — you keep the majority of your reward.',
  },
  {
    q: 'Can brands join too?',
    a: 'Absolutely. Brands and agencies can create campaigns, set budgets, and reach thousands of verified Saudi creators. Contact us to get started.',
  },
]

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      {FAQS.map((faq, i) => (
        <div
          key={i}
          className="border border-white/10 rounded-xl overflow-hidden bg-zinc-900/50"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left"
          >
            <span className="text-sm font-medium text-white">{faq.q}</span>
            <span className={`text-zinc-500 text-lg transition-transform ${open === i ? 'rotate-45' : ''}`}>+</span>
          </button>
          {open === i && (
            <div className="px-6 pb-5">
              <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
