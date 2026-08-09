import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import MarketingNav from '@/components/marketing/MarketingNav'
import FAQAccordion from '@/components/marketing/FAQAccordion'

// ── Data ──────────────────────────────────────────────────────────────────────

async function getHotCampaigns() {
  const campaigns = await prisma.campaign.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { participantCount: 'desc' },
    take: 6,
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      cpm: true,
      maxCreatorPayout: true,
      totalBudget: true,
      reservedBudget: true,
      minFollowers: true,
      endDate: true,
      platforms: { select: { platform: true } },
      organization: { select: { name: true } },
    },
  })
  return campaigns.map((c) => ({
    ...c,
    cpm: c.cpm?.toString() ?? null,
    maxCreatorPayout: c.maxCreatorPayout?.toString() ?? null,
    totalBudget: c.totalBudget.toString(),
    reservedBudget: c.reservedBudget.toString(),
    endDate: c.endDate?.toISOString() ?? null,
  }))
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function platformIcon(p: string) {
  const icons: Record<string, string> = {
    TIKTOK: 'TK', INSTAGRAM: 'IG', YOUTUBE: 'YT', X: 'X',
  }
  return icons[p] ?? p
}

function daysLeft(iso: string | null) {
  if (!iso) return null
  const d = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000)
  return d > 0 ? d : null
}

const CATEGORY_COLORS: Record<string, string> = {
  ENTERTAINMENT: 'bg-purple-500/15 text-purple-300',
  LIFESTYLE:     'bg-pink-500/15 text-pink-300',
  GAMING:        'bg-blue-500/15 text-blue-300',
  TECHNOLOGY:    'bg-cyan-500/15 text-cyan-300',
  FOOD:          'bg-orange-500/15 text-orange-300',
  FASHION:       'bg-rose-500/15 text-rose-300',
  BEAUTY:        'bg-fuchsia-500/15 text-fuchsia-300',
  TRAVEL:        'bg-teal-500/15 text-teal-300',
  SPORTS:        'bg-yellow-500/15 text-yellow-300',
  EDUCATION:     'bg-indigo-500/15 text-indigo-300',
  FINANCE:       'bg-emerald-500/15 text-emerald-300',
  OTHER:         'bg-zinc-500/15 text-zinc-300',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const campaigns = await getHotCampaigns()

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <MarketingNav />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 pt-24 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400 mb-8">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            50,000+ verified creators earning real money
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
            Get Paid for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Posting
            </span>
          </h1>

          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Join Saudi Arabia's leading creator performance platform. Partner with top brands,
            publish content on TikTok, Instagram, YouTube & X, and earn real money for every verified view.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-4 text-base transition-colors"
            >
              Start Earning Free →
            </Link>
            <Link
              href="/discover"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-4 text-base transition-colors"
            >
              Browse Campaigns
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-3xl mx-auto">
            {[
              { label: 'Paid to Creators', value: 'SAR 12M+' },
              { label: 'Verified Views', value: '800M+' },
              { label: 'Active Campaigns', value: '40+' },
              { label: 'Trusted Creators', value: '50K+' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-5">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-zinc-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 border-t border-white/8">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold">From post to payment in 3 steps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Join a Campaign',
                body: 'Browse campaigns from top Saudi brands. Filter by platform, niche, or payout. Join in one click — no pitching required.',
                icon: '🎯',
              },
              {
                step: '02',
                title: 'Create & Submit',
                body: 'Read the campaign brief, publish your content on your social account, then paste the URL into Content Rewards. Takes 60 seconds.',
                icon: '🎬',
              },
              {
                step: '03',
                title: 'Earn & Withdraw',
                body: 'Your views are verified and your reward is calculated automatically. Withdraw to your Saudi bank account on a regular schedule.',
                icon: '💰',
              },
            ].map(({ step, title, body, icon }) => (
              <div key={step} className="relative rounded-2xl border border-white/8 bg-zinc-900/50 p-8">
                <div className="text-4xl mb-5">{icon}</div>
                <span className="absolute top-6 right-6 text-xs font-mono text-zinc-700">{step}</span>
                <h3 className="text-lg font-bold mb-3">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hot Campaigns ───────────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/8">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">Live Now</p>
              <h2 className="text-3xl sm:text-4xl font-bold">Hot Campaigns</h2>
            </div>
            <Link
              href="/discover"
              className="hidden sm:inline-flex text-sm text-zinc-400 hover:text-white transition-colors"
            >
              See all campaigns →
            </Link>
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">Campaigns loading — check back shortly.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map((c) => {
                const remaining = parseFloat(c.totalBudget) - parseFloat(c.reservedBudget)
                const pct = Math.max(0, Math.min(100, (remaining / parseFloat(c.totalBudget)) * 100))
                const days = daysLeft(c.endDate)
                const catColor = CATEGORY_COLORS[c.category] ?? CATEGORY_COLORS.OTHER

                return (
                  <Link
                    key={c.id}
                    href={`/campaigns/${c.slug}`}
                    className="group relative rounded-2xl border border-white/8 bg-zinc-900/60 p-6 hover:border-emerald-500/40 hover:bg-zinc-900 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <p className="text-xs text-zinc-500">{c.organization.name}</p>
                        <h3 className="text-sm font-bold mt-0.5 group-hover:text-emerald-300 transition-colors leading-tight">
                          {c.name}
                        </h3>
                      </div>
                      <span className={`shrink-0 text-xs font-medium rounded-full px-2.5 py-0.5 ${catColor}`}>
                        {c.category.charAt(0) + c.category.slice(1).toLowerCase()}
                      </span>
                    </div>

                    {/* Reward */}
                    <div className="mb-4">
                      {c.cpm && (
                        <p className="text-xl font-extrabold text-emerald-400">
                          SAR {c.cpm} <span className="text-xs font-semibold text-zinc-500">CPM</span>
                        </p>
                      )}
                      {c.maxCreatorPayout && (
                        <p className="text-xs text-zinc-500 mt-0.5">
                          Earn up to SAR {parseFloat(c.maxCreatorPayout).toLocaleString('en-SA')}
                        </p>
                      )}
                    </div>

                    {/* Platforms */}
                    <div className="flex items-center gap-1.5 mb-4">
                      {c.platforms.map(({ platform }) => (
                        <span key={platform} className="text-xs bg-white/8 rounded px-2 py-0.5 text-zinc-400 font-mono">
                          {platformIcon(platform)}
                        </span>
                      ))}
                      {c.minFollowers > 0 && (
                        <span className="text-xs text-zinc-600 ml-1">
                          {c.minFollowers.toLocaleString()}+ followers
                        </span>
                      )}
                    </div>

                    {/* Budget bar */}
                    <div>
                      <div className="flex justify-between text-xs text-zinc-600 mb-1.5">
                        <span>Budget remaining</span>
                        <span>SAR {remaining.toLocaleString('en-SA', { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {days !== null && (
                      <p className="text-xs text-zinc-600 mt-3">{days} days left</p>
                    )}
                  </Link>
                )
              })}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/discover" className="text-sm text-emerald-400 hover:text-emerald-300">
              See all campaigns →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/8">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">Creator Stories</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Real creators. Real earnings.</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Sarah A.', handle: '@saraha_ksa', amount: 'SAR 18,400', platform: 'TikTok', quote: 'I made more from one campaign than I used to in a whole month. The process is so simple — post, submit, get paid.' },
              { name: 'Mohammed K.', handle: '@mkgaming', amount: 'SAR 32,000', platform: 'YouTube', quote: 'The stc Gaming campaign was perfect for my channel. The CPM tracking is transparent and payments always come on time.' },
              { name: 'Lana R.', handle: '@lanarlife', amount: 'SAR 9,700', platform: 'Instagram', quote: 'As a lifestyle creator I always struggled to monetize. Content Rewards gave me brand partnerships I could never get alone.' },
              { name: 'Khalid M.', handle: '@khalidm_sa', amount: 'SAR 24,500', platform: 'TikTok', quote: 'Joined three campaigns at once and scaled my earnings massively. The dashboard makes it easy to track everything.' },
              { name: 'Nora F.', handle: '@nora.fashion', amount: 'SAR 11,200', platform: 'Instagram', quote: 'The fashion campaigns are competitive but the CPM rates are amazing. I earned SAR 11K in one month with just two posts.' },
              { name: 'Faisal T.', handle: '@faisaltech', amount: 'SAR 41,800', platform: 'YouTube', quote: 'Long-form tech reviews pay really well on this platform. My Jarir Tech campaign alone brought in over SAR 40K.' },
            ].map(({ name, handle, amount, platform, quote }) => (
              <div key={handle} className="rounded-2xl border border-white/8 bg-zinc-900/50 p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-400 shrink-0">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-zinc-500">{handle} · {platform}</p>
                  </div>
                  <span className="ml-auto text-base font-extrabold text-emerald-400 shrink-0">{amount}</span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">"{quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Brands ──────────────────────────────────────────────────── */}
      <section id="for-brands" className="py-24 border-t border-white/8">
        <div className="max-w-6xl mx-auto px-5">
          <div className="rounded-3xl border border-white/8 bg-gradient-to-br from-zinc-900 to-zinc-950 p-10 sm:p-16 flex flex-col lg:flex-row items-start lg:items-center gap-10">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4">For Brands & Agencies</p>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-5">
                Turn creator content into<br className="hidden sm:block" /> measurable performance
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-8 max-w-lg">
                Set a campaign budget, define your content brief, and reach thousands of verified Saudi creators.
                Only pay for verified views — no wasted impressions, no guesswork.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: 'Pay per verified view', icon: '✓' },
                  { label: 'Full content review', icon: '✓' },
                  { label: 'Real-time analytics', icon: '✓' },
                  { label: 'Fraud protection', icon: '✓' },
                ].map(({ label, icon }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="text-emerald-400 font-bold">{icon}</span>
                    {label}
                  </div>
                ))}
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white text-zinc-950 font-bold px-6 py-3 text-sm hover:bg-zinc-100 transition-colors"
              >
                Launch a Campaign →
              </Link>
            </div>
            <div className="w-full lg:w-72 shrink-0 space-y-3">
              {[
                { label: 'Avg CPM', value: 'SAR 16' },
                { label: 'Creator pool', value: '50K+' },
                { label: 'Avg approval rate', value: '94%' },
                { label: 'Markets', value: 'SA · AE · KW · BH' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center rounded-xl border border-white/8 bg-white/5 px-5 py-3.5">
                  <span className="text-sm text-zinc-500">{label}</span>
                  <span className="text-sm font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 border-t border-white/8">
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Common questions</h2>
          </div>
          <FAQAccordion />
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/8">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-5">
            Ready to start earning?
          </h2>
          <p className="text-zinc-400 mb-10 text-lg">
            Join 50,000+ creators already earning from their content.
            Takes 2 minutes to set up.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-10 py-4 text-base transition-colors"
          >
            Create Your Free Account →
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/8 py-12">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-bold text-lg text-white">
                Content<span className="text-emerald-400">Rewards</span>
              </p>
              <p className="text-xs text-zinc-600 mt-1">Saudi Arabia's creator performance platform</p>
            </div>
            <nav className="flex flex-wrap justify-center gap-6 text-xs text-zinc-500">
              <Link href="/discover" className="hover:text-white transition-colors">Campaigns</Link>
              <Link href="/#how-it-works" className="hover:text-white transition-colors">How it works</Link>
              <Link href="/#for-brands" className="hover:text-white transition-colors">For Brands</Link>
              <Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link>
              <Link href="/login" className="hover:text-white transition-colors">Log in</Link>
              <Link href="/register" className="hover:text-white transition-colors">Register</Link>
            </nav>
          </div>
          <div className="mt-8 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-700">
            <p>© {new Date().getFullYear()} Content Rewards. All rights reserved.</p>
            <p>Made for Saudi creators 🇸🇦</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
