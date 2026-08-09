import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle, TrendUp, UsersThree, Sparkle, DeviceMobile } from '@phosphor-icons/react/dist/ssr'
import { prisma } from '@/lib/prisma'
import MarketingNav from '@/components/marketing/MarketingNav'
import FAQAccordion from '@/components/marketing/FAQAccordion'
import { RevealUp, RevealStagger } from '@/components/marketing/ScrollReveal'

// ── Data ──────────────────────────────────────────────────────────────────────

async function getHotCampaigns() {
  const campaigns = await prisma.campaign.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { participantCount: 'desc' },
    take: 5,
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

const PLATFORM_LABEL: Record<string, string> = {
  TIKTOK: 'TikTok', INSTAGRAM: 'Instagram', YOUTUBE: 'YouTube', X: 'X',
}

function daysLeft(iso: string | null) {
  if (!iso) return null
  const d = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000)
  return d > 0 ? d : null
}

const CATEGORY_DOT: Record<string, string> = {
  ENTERTAINMENT: 'bg-purple-400',
  LIFESTYLE:     'bg-pink-400',
  GAMING:        'bg-blue-400',
  TECHNOLOGY:    'bg-cyan-400',
  FOOD:          'bg-orange-400',
  FASHION:       'bg-rose-400',
  TRAVEL:        'bg-teal-400',
  SPORTS:        'bg-yellow-400',
  EDUCATION:     'bg-indigo-400',
  FINANCE:       'bg-emerald-400',
  OTHER:         'bg-zinc-400',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const campaigns = await getHotCampaigns()

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-white">
      <MarketingNav />

      {/* ── HERO: Left-aligned split, VARIANCE 8 ──────────────────────── */}
      <section className="relative overflow-hidden min-h-[100dvh] flex items-center">
        {/* Ambient glow — top-left, not centered */}
        <div className="pointer-events-none absolute -top-60 -left-40 w-[700px] h-[700px] bg-emerald-500/[0.07] rounded-full blur-3xl" />
        <div className="pointer-events-none absolute top-20 right-0 w-[400px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-3xl" />

        <div className="relative max-w-[1400px] mx-auto px-6 w-full py-20 grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <RevealUp>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3.5 py-1 text-[11px] font-semibold tracking-wide text-emerald-400 uppercase mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Saudi Arabia's #1 Creator Platform
              </div>
            </RevealUp>

            <RevealUp delay={0.06}>
              <h1 className="text-[52px] sm:text-[64px] lg:text-[72px] font-extrabold tracking-[-0.03em] leading-[1.04] text-white">
                Get paid for<br />
                <span className="text-emerald-400">every view</span><br />
                you earn.
              </h1>
            </RevealUp>

            <RevealUp delay={0.1}>
              <p className="mt-6 text-[17px] text-zinc-400 leading-relaxed max-w-[520px]">
                Partner with top Saudi brands, post on TikTok, Instagram, YouTube or X,
                and earn real money per verified view.
              </p>
            </RevealUp>

            <RevealUp delay={0.14}>
              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-black font-bold px-7 py-3.5 text-[15px] transition-all"
                >
                  Start Earning Free
                  <ArrowRight size={17} weight="bold" />
                </Link>
                <Link
                  href="/discover"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold px-7 py-3.5 text-[15px] transition-all"
                >
                  Browse Campaigns
                </Link>
              </div>
            </RevealUp>
          </div>

          {/* Right: stacked creator cards visual */}
          <RevealUp delay={0.08} className="hidden lg:block">
            <div className="relative">
              <Image
                src="https://picsum.photos/seed/saudi-creator-phone/480/560"
                alt="Creator filming content"
                width={480}
                height={560}
                className="rounded-3xl object-cover w-full h-[520px]"
              />
              {/* Floating stat card */}
              <div className="absolute -bottom-5 -left-8 bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 shadow-xl">
                <p className="text-xs text-zinc-500 mb-1">Last 30 days</p>
                <p className="text-2xl font-extrabold text-white tracking-tight">SAR 14,320</p>
                <p className="text-xs text-emerald-400 mt-0.5 flex items-center gap-1">
                  <TrendUp size={13} weight="bold" /> +34% from last month
                </p>
              </div>
              {/* Floating platform badge */}
              <div className="absolute -top-4 -right-4 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 shadow-xl">
                <p className="text-[11px] text-zinc-500 mb-2">Active on</p>
                <div className="flex gap-2">
                  {['TK', 'IG', 'YT'].map((p) => (
                    <span key={p} className="text-[10px] font-bold bg-white/[0.06] px-2 py-1 rounded-md text-zinc-300 font-mono">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </RevealUp>
        </div>
      </section>

      {/* ── STATS BAR (separate from hero) ──────────────────────────────── */}
      <section className="border-y border-white/[0.06] bg-white/[0.015]">
        <div className="max-w-[1400px] mx-auto px-6 py-7 grid grid-cols-2 lg:grid-cols-4 gap-6 divide-x-0 lg:divide-x divide-white/[0.06]">
          {[
            { value: 'SAR 12M+', label: 'Paid to creators' },
            { value: '800M+',    label: 'Verified views' },
            { value: '50,000+',  label: 'Active creators' },
            { value: '40+',      label: 'Live campaigns' },
          ].map(({ value, label }) => (
            <RevealStagger key={label} className="flex flex-col lg:pl-6 first:pl-0">
              <span className="text-[28px] font-extrabold tracking-tight text-white">{value}</span>
              <span className="text-sm text-zinc-500 mt-0.5">{label}</span>
            </RevealStagger>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS: Asymmetric 2+1 layout ─────────────────────────── */}
      <section id="how-it-works" className="py-28">
        <div className="max-w-[1400px] mx-auto px-6">
          <RevealUp>
            <h2 className="text-[36px] sm:text-[44px] font-extrabold tracking-[-0.02em] mb-14 max-w-sm leading-tight">
              From post to payment, fast.
            </h2>
          </RevealUp>

          {/* Asymmetric grid — large left + 2 stacked right */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
            {/* Feature 1 — large with image */}
            <RevealUp className="relative rounded-3xl overflow-hidden min-h-[400px] lg:min-h-[480px]">
              <Image
                src="https://picsum.photos/seed/campaign-discovery-phone/700/480"
                alt="Discover campaigns"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <span className="text-xs font-mono text-zinc-500 tracking-widest">01</span>
                <h3 className="text-[22px] font-bold mt-2 mb-2">Join a campaign</h3>
                <p className="text-sm text-zinc-400 max-w-[300px] leading-relaxed">
                  Browse live campaigns from Saudi brands. Filter by CPM, platform, or category. One tap to join.
                </p>
              </div>
            </RevealUp>

            {/* Features 2 & 3 — stacked right */}
            <div className="flex flex-col gap-4">
              <RevealUp delay={0.06} className="relative rounded-3xl overflow-hidden min-h-[220px]">
                <Image
                  src="https://picsum.photos/seed/content-creation-submit/700/300"
                  alt="Create and submit content"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <span className="text-xs font-mono text-zinc-500 tracking-widest">02</span>
                  <h3 className="text-lg font-bold mt-2 mb-1">Create & submit</h3>
                  <p className="text-sm text-zinc-400">Post on social, paste your URL. Done in 60 seconds.</p>
                </div>
              </RevealUp>

              <RevealUp delay={0.1} className="relative rounded-3xl bg-emerald-500/[0.08] border border-emerald-500/20 min-h-[220px] p-6 flex flex-col justify-between">
                <span className="text-xs font-mono text-zinc-500 tracking-widest">03</span>
                <div>
                  <h3 className="text-lg font-bold mb-1">Earn & withdraw</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Views are verified, rewards calculated, funds deposited to your wallet. Withdraw to your Saudi bank account.
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400">
                    <CheckCircle size={16} weight="fill" /> No manual invoicing required
                  </div>
                </div>
              </RevealUp>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAMPAIGNS: List layout, not 3-column grid ────────────────────── */}
      <section className="py-28 border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <RevealUp>
              <h2 className="text-[36px] sm:text-[44px] font-extrabold tracking-[-0.02em] leading-tight">
                Live campaigns
              </h2>
            </RevealUp>
            <RevealUp delay={0.05}>
              <Link href="/discover" className="text-sm text-zinc-500 hover:text-white transition-colors hidden sm:block">
                See all →
              </Link>
            </RevealUp>
          </div>

          <div className="space-y-2">
            {campaigns.map((c, i) => {
              const remaining = parseFloat(c.totalBudget) - parseFloat(c.reservedBudget)
              const pct = Math.max(4, Math.min(100, (remaining / parseFloat(c.totalBudget)) * 100))
              const days = daysLeft(c.endDate)
              const dotColor = CATEGORY_DOT[c.category] ?? CATEGORY_DOT.OTHER

              return (
                <RevealStagger key={c.id} delay={i * 0.05}>
                  <Link
                    href={`/campaigns/${c.slug}`}
                    className="group flex items-center gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.025] hover:bg-white/[0.05] hover:border-white/10 px-6 py-5 transition-all"
                  >
                    {/* Category dot */}
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`} />

                    {/* Brand + name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-zinc-600 uppercase tracking-wide font-medium">{c.organization.name}</p>
                      <p className="text-[15px] font-semibold text-white mt-0.5 truncate group-hover:text-emerald-300 transition-colors">
                        {c.name}
                      </p>
                    </div>

                    {/* Platforms */}
                    <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                      {c.platforms.map(({ platform }) => (
                        <span key={platform} className="text-[11px] text-zinc-500 font-mono bg-white/[0.04] px-2 py-0.5 rounded">
                          {PLATFORM_LABEL[platform] ?? platform}
                        </span>
                      ))}
                    </div>

                    {/* Budget bar */}
                    <div className="hidden lg:block w-28 shrink-0">
                      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[11px] text-zinc-600 mt-1">
                        SAR {remaining.toLocaleString('en-SA', { maximumFractionDigits: 0 })} left
                      </p>
                    </div>

                    {/* CPM + days */}
                    <div className="text-right shrink-0">
                      {c.cpm && (
                        <p className="text-base font-extrabold text-emerald-400">SAR {c.cpm}<span className="text-[11px] text-zinc-500 font-medium ml-1">CPM</span></p>
                      )}
                      {days !== null && (
                        <p className="text-[11px] text-zinc-600 mt-0.5">{days}d left</p>
                      )}
                    </div>

                    <ArrowRight size={16} className="text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0 hidden sm:block" />
                  </Link>
                </RevealStagger>
              )
            })}
          </div>

          <RevealUp delay={0.1} className="mt-6 sm:hidden text-center">
            <Link href="/discover" className="text-sm text-emerald-400">See all campaigns →</Link>
          </RevealUp>
        </div>
      </section>

      {/* ── TESTIMONIALS: 2-column with featured large quote ─────────────── */}
      <section className="py-28 border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6">
          <RevealUp className="mb-14">
            <h2 className="text-[36px] sm:text-[44px] font-extrabold tracking-[-0.02em] max-w-xs leading-tight">
              Creators are winning.
            </h2>
          </RevealUp>

          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4">
            {/* Featured large testimonial */}
            <RevealUp className="relative rounded-3xl overflow-hidden min-h-[420px]">
              <Image
                src="https://picsum.photos/seed/saudi-female-creator-tiktok/700/500"
                alt="Top creator"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 max-w-[420px]">
                <p className="text-[17px] font-medium text-white leading-snug mb-5">
                  "I made more in one campaign than I used to earn in a full month. The process is simple — post, submit, get paid."
                </p>
                <div>
                  <p className="text-sm font-semibold text-white">Sarah A.</p>
                  <p className="text-xs text-zinc-400">@saraha_ksa · TikTok creator</p>
                  <p className="text-xl font-extrabold text-emerald-400 mt-2">SAR 18,400 earned</p>
                </div>
              </div>
            </RevealUp>

            {/* Right column — 2 stacked quotes */}
            <div className="flex flex-col gap-4">
              {[
                {
                  quote: "The stc Gaming campaign was perfect for my audience. CPM tracking is transparent and payments are always on time.",
                  name: 'Mohammed K.', handle: '@mkgaming · YouTube', amount: 'SAR 32,000',
                  seed: 'saudi-male-gamer-youtube',
                },
                {
                  quote: "Joined three campaigns in one month. The dashboard makes it easy to track everything in one place.",
                  name: 'Khalid M.', handle: '@khalidm_sa · TikTok', amount: 'SAR 24,500',
                  seed: 'saudi-creator-dashboard',
                },
              ].map(({ quote, name, handle, amount, seed }, i) => (
                <RevealUp key={name} delay={i * 0.07 + 0.05} className="relative rounded-3xl bg-white/[0.025] border border-white/[0.06] p-7 flex flex-col justify-between min-h-[190px]">
                  <p className="text-[15px] text-zinc-300 leading-snug">"{quote}"</p>
                  <div className="flex items-center justify-between mt-5">
                    <div>
                      <p className="text-sm font-semibold text-white">{name}</p>
                      <p className="text-xs text-zinc-500">{handle}</p>
                    </div>
                    <span className="text-lg font-extrabold text-emerald-400">{amount}</span>
                  </div>
                </RevealUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR BRANDS: Full-width feature panel ─────────────────────────── */}
      <section id="for-brands" className="py-28 border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image side */}
            <RevealUp className="relative rounded-3xl overflow-hidden min-h-[400px] order-2 lg:order-1">
              <Image
                src="https://picsum.photos/seed/brand-analytics-dashboard/700/480"
                alt="Brand campaign analytics"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-zinc-950/30" />
              {/* Floating metric */}
              <div className="absolute top-6 right-6 bg-zinc-900/90 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-sm">
                <p className="text-[11px] text-zinc-500 mb-1">Campaign ROI</p>
                <p className="text-2xl font-extrabold text-white">4.8×</p>
                <p className="text-xs text-emerald-400 mt-0.5">vs. display average</p>
              </div>
            </RevealUp>

            {/* Copy side */}
            <div className="order-1 lg:order-2">
              <RevealUp>
                <h2 className="text-[36px] sm:text-[44px] font-extrabold tracking-[-0.02em] leading-tight mb-5">
                  Performance you can<br />actually measure.
                </h2>
              </RevealUp>
              <RevealUp delay={0.05}>
                <p className="text-[16px] text-zinc-400 leading-relaxed mb-8 max-w-[480px]">
                  Set your brief, fund your campaign, and reach 50,000 verified Saudi creators. Pay only for verified views — no wasted impressions.
                </p>
              </RevealUp>

              <RevealUp delay={0.08}>
                <div className="space-y-3 mb-10">
                  {[
                    { icon: <CheckCircle size={18} weight="fill" className="text-emerald-400 shrink-0 mt-0.5" />, text: 'Full content review before publishing counts' },
                    { icon: <TrendUp size={18} weight="fill" className="text-emerald-400 shrink-0 mt-0.5" />, text: 'Real-time verified view tracking' },
                    { icon: <UsersThree size={18} weight="fill" className="text-emerald-400 shrink-0 mt-0.5" />, text: '50,000+ verified Saudi creators across all niches' },
                    { icon: <Sparkle size={18} weight="fill" className="text-emerald-400 shrink-0 mt-0.5" />, text: 'Built-in fraud detection on every submission' },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-start gap-3 text-[15px] text-zinc-300">
                      {icon}
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </RevealUp>

              <RevealUp delay={0.1}>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-zinc-950 font-bold px-7 py-3.5 text-[15px] hover:bg-zinc-100 active:scale-[0.98] transition-all"
                >
                  Launch a Campaign
                  <ArrowRight size={17} weight="bold" />
                </Link>
              </RevealUp>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-28 border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-16">
            <RevealUp>
              <h2 className="text-[32px] font-extrabold tracking-[-0.02em] leading-tight sticky top-24">
                Common questions
              </h2>
            </RevealUp>
            <RevealUp delay={0.06}>
              <FAQAccordion />
            </RevealUp>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA: Asymmetric with mobile visual ──────────────────────── */}
      <section className="py-28 border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="rounded-3xl bg-emerald-500/[0.06] border border-emerald-500/20 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
              <div className="p-10 sm:p-14">
                <RevealUp>
                  <h2 className="text-[36px] sm:text-[48px] font-extrabold tracking-[-0.025em] leading-tight mb-5">
                    Your content is<br />already worth money.
                  </h2>
                </RevealUp>
                <RevealUp delay={0.05}>
                  <p className="text-[16px] text-zinc-400 mb-10 max-w-md leading-relaxed">
                    Join 50,000 creators earning from brands they actually like. Takes 2 minutes to get started.
                  </p>
                </RevealUp>
                <RevealUp delay={0.08}>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-black font-bold px-8 py-4 text-[15px] transition-all"
                  >
                    Create Free Account
                    <ArrowRight size={17} weight="bold" />
                  </Link>
                </RevealUp>
              </div>
              <div className="relative hidden lg:block min-h-[280px]">
                <Image
                  src="https://picsum.photos/seed/creator-phone-earnings/400/400"
                  alt="Creator checking earnings on phone"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <p className="font-bold text-[17px] text-white tracking-[-0.02em]">
              Content<span className="text-emerald-400">Rewards</span>
            </p>
            <p className="text-xs text-zinc-600 mt-1.5">Saudi Arabia's creator performance platform</p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-zinc-500">
            <Link href="/discover" className="hover:text-white transition-colors">Campaigns</Link>
            <Link href="/#how-it-works" className="hover:text-white transition-colors">How it works</Link>
            <Link href="/#for-brands" className="hover:text-white transition-colors">For Brands</Link>
            <Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/login" className="hover:text-white transition-colors">Log in</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
          </nav>

          <p className="text-[12px] text-zinc-700">
            &copy; {new Date().getFullYear()} Content Rewards
          </p>
        </div>
      </footer>
    </div>
  )
}
