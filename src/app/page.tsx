import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  CheckCircle,
  TrendUp,
  UsersThree,
  Shield,
  CurrencyDollar,
  ChartLineUp,
  Star,
} from '@phosphor-icons/react/dist/ssr'
import { prisma } from '@/lib/prisma'
import MarketingNav from '@/components/marketing/MarketingNav'
import FAQAccordion from '@/components/marketing/FAQAccordion'
import BrandMarquee from '@/components/marketing/BrandMarquee'
import { RevealUp, RevealStagger } from '@/components/marketing/ScrollReveal'

// ── Data ──────────────────────────────────────────────────────────────────────

async function getHotCampaigns() {
  const campaigns = await prisma.campaign.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { cpm: 'desc' },
    take: 4,
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
  }))
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const PLATFORM_LABEL: Record<string, string> = {
  TIKTOK: 'TikTok', INSTAGRAM: 'Instagram', YOUTUBE: 'YouTube', X: 'X',
}

const CATEGORY_LABEL: Record<string, string> = {
  ENTERTAINMENT: 'Entertainment', LIFESTYLE: 'Lifestyle', GAMING: 'Gaming',
  TECHNOLOGY: 'Technology', FOOD: 'Food', FASHION: 'Fashion',
  BEAUTY: 'Beauty', TRAVEL: 'Travel', SPORTS: 'Sports',
  EDUCATION: 'Education', FINANCE: 'Finance', OTHER: 'Other',
}

const CAMPAIGN_SEEDS = [
  'riyadh-season-content',
  'roshn-lifestyle-saudi',
  'stc-gaming-creator',
  'jarir-tech-review',
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const campaigns = await getHotCampaigns()

  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900">
      <MarketingNav />

      {/* ─────────────────────────────────────────────────────────────
          HERO — left-aligned split, visual right
          Layout family: 2-column split, large display type left
      ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[100dvh] flex items-center bg-white border-b border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-6 w-full py-24 grid grid-cols-1 lg:grid-cols-[1fr_520px] gap-12 lg:gap-20 items-center">

          {/* Copy */}
          <div>
            <RevealUp>
              <p className="text-[13px] font-semibold text-green-600 uppercase tracking-widest mb-6">
                Saudi Arabia's creator performance platform
              </p>
            </RevealUp>

            <RevealUp delay={0.05}>
              <h1 className="text-[52px] sm:text-[68px] lg:text-[76px] font-black tracking-[-0.03em] leading-[1.02] text-zinc-900">
                Your content<br />
                <span className="text-green-600">earns money.</span><br />
                Every view.
              </h1>
            </RevealUp>

            <RevealUp delay={0.09}>
              <p className="mt-7 text-[18px] text-zinc-500 leading-relaxed max-w-[480px]">
                Partner with top brands, publish on TikTok, Instagram, YouTube or X,
                and collect a verified payout for every view you generate.
              </p>
            </RevealUp>

            <RevealUp delay={0.13}>
              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-bold px-8 py-4 text-[16px] transition-all"
                >
                  Start Earning Free
                  <ArrowRight size={18} weight="bold" />
                </Link>
                <Link
                  href="/discover"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold px-8 py-4 text-[16px] transition-all"
                >
                  Browse Campaigns
                </Link>
              </div>
            </RevealUp>

            <RevealUp delay={0.17}>
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {['creator-a', 'creator-b', 'creator-c', 'creator-d'].map((seed) => (
                    <Image
                      key={seed}
                      src={`https://picsum.photos/seed/${seed}/40/40`}
                      alt="Creator"
                      width={36}
                      height={36}
                      className="rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[0,1,2,3,4].map((i) => (
                      <Star key={i} size={13} weight="fill" className="text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-500">Trusted by <strong className="text-zinc-900">50,000+</strong> Saudi creators</p>
                </div>
              </div>
            </RevealUp>
          </div>

          {/* Visual */}
          <RevealUp delay={0.06} className="hidden lg:block">
            <div className="relative">
              <Image
                src="https://picsum.photos/seed/saudi-creator-studio/520/600"
                alt="Creator recording content"
                width={520}
                height={600}
                priority
                className="rounded-3xl object-cover w-full h-[580px]"
              />
              {/* Earnings card */}
              <div className="absolute -bottom-6 -left-8 bg-white border border-zinc-200 rounded-2xl px-6 py-5 shadow-lg shadow-zinc-200/80">
                <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wide mb-1.5">This month</p>
                <p className="text-[28px] font-black text-zinc-900 tracking-tight">SAR 14,320</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <TrendUp size={14} weight="bold" className="text-green-600" />
                  <p className="text-sm font-semibold text-green-600">+34% vs last month</p>
                </div>
              </div>
              {/* CPM badge */}
              <div className="absolute top-6 -right-5 bg-white border border-zinc-200 rounded-xl px-4 py-3.5 shadow-md shadow-zinc-200/60">
                <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wide mb-1">Top CPM</p>
                <p className="text-xl font-black text-zinc-900">SAR 22</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">stc Gaming campaign</p>
              </div>
            </div>
          </RevealUp>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          BRAND MARQUEE — horizontal logo scroll
          Layout family: infinite marquee strip
      ───────────────────────────────────────────────────────────── */}
      <section className="border-b border-zinc-200 bg-zinc-50 py-5">
        <div className="mb-4 px-6">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest text-center">
            Brands running campaigns now
          </p>
        </div>
        <BrandMarquee />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          STATS — 4-col with top border rule, large display numbers
          Layout family: ruled stat grid
      ───────────────────────────────────────────────────────────── */}
      <section className="py-28 bg-white border-b border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-zinc-200 border border-zinc-200 rounded-3xl overflow-hidden">
            {[
              { value: 'SAR 12M+', label: 'Paid to creators', sub: 'and counting' },
              { value: '800M+',    label: 'Verified views',   sub: 'fraud-screened' },
              { value: '50,000+', label: 'Active creators',   sub: 'across KSA' },
              { value: '40+',     label: 'Live campaigns',    sub: 'right now' },
            ].map(({ value, label, sub }) => (
              <RevealStagger key={label} className="px-8 py-10">
                <p className="text-[36px] sm:text-[44px] font-black text-zinc-900 tracking-tight leading-none">{value}</p>
                <p className="text-[15px] font-semibold text-zinc-700 mt-3">{label}</p>
                <p className="text-sm text-zinc-400 mt-0.5">{sub}</p>
              </RevealStagger>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CAMPAIGNS — alternating large feature rows (max 2 zig-zag)
          then a 2-col grid for remaining — layout diversity enforced
          Layout family: alternating image+copy rows + mini card grid
      ───────────────────────────────────────────────────────────── */}
      <section className="py-28 border-b border-zinc-200 bg-zinc-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-end justify-between mb-14">
            <RevealUp>
              <h2 className="text-[36px] sm:text-[48px] font-black tracking-[-0.025em] leading-tight">
                Live campaigns
              </h2>
            </RevealUp>
            <RevealUp delay={0.04}>
              <Link href="/discover" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
                See all <ArrowRight size={15} weight="bold" />
              </Link>
            </RevealUp>
          </div>

          {/* 2 featured zig-zag rows */}
          <div className="space-y-6 mb-6">
            {campaigns.slice(0, 2).map((c, i) => {
              const remaining = parseFloat(c.totalBudget) - parseFloat(c.reservedBudget)
              const isEven = i % 2 === 0

              return (
                <RevealUp key={c.id} delay={i * 0.05}>
                  <Link
                    href={`/campaigns/${c.slug}`}
                    className={`group flex flex-col md:flex-row items-stretch gap-0 rounded-3xl border border-zinc-200 overflow-hidden bg-white hover:border-green-300 hover:shadow-md hover:shadow-green-100 transition-all ${isEven ? '' : 'md:flex-row-reverse'}`}
                  >
                    <div className="relative md:w-[340px] shrink-0 min-h-[220px]">
                      <Image
                        src={`https://picsum.photos/seed/${CAMPAIGN_SEEDS[i]}/680/440`}
                        alt={c.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 p-8 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">{c.organization.name}</p>
                        <h3 className="text-[22px] font-black tracking-tight text-zinc-900 group-hover:text-green-700 transition-colors mb-3 leading-tight">
                          {c.name}
                        </h3>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {c.platforms.map(({ platform }) => (
                            <span key={platform} className="text-[12px] font-semibold bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-lg">
                              {PLATFORM_LABEL[platform]}
                            </span>
                          ))}
                          <span className="text-[12px] font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-lg">
                            {CATEGORY_LABEL[c.category] ?? c.category}
                          </span>
                        </div>
                        {c.minFollowers > 0 && (
                          <p className="text-sm text-zinc-400">
                            {c.minFollowers.toLocaleString()}+ followers required
                          </p>
                        )}
                      </div>
                      <div className="flex items-end justify-between mt-6 pt-6 border-t border-zinc-100">
                        <div>
                          {c.cpm && (
                            <p className="text-[32px] font-black text-green-600 tracking-tight leading-none">
                              SAR {c.cpm}<span className="text-base font-semibold text-zinc-400 ml-1.5">CPM</span>
                            </p>
                          )}
                          {c.maxCreatorPayout && (
                            <p className="text-sm text-zinc-400 mt-1">
                              Up to SAR {parseFloat(c.maxCreatorPayout).toLocaleString('en-SA')}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-zinc-400 mb-1">Budget remaining</p>
                          <p className="text-sm font-bold text-zinc-700">
                            SAR {remaining.toLocaleString('en-SA', { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </RevealUp>
              )
            })}
          </div>

          {/* Remaining 2 campaigns as compact 2-col grid — breaks the zig-zag pattern */}
          {campaigns.slice(2).length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {campaigns.slice(2).map((c, i) => (
                <RevealStagger key={c.id} delay={i * 0.05}>
                  <Link
                    href={`/campaigns/${c.slug}`}
                    className="group flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white hover:border-green-300 hover:shadow-md hover:shadow-green-100 p-6 transition-all"
                  >
                    <div>
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">{c.organization.name}</p>
                      <h3 className="text-[17px] font-black text-zinc-900 group-hover:text-green-700 transition-colors leading-tight">{c.name}</h3>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100">
                      <div className="flex gap-1.5">
                        {c.platforms.map(({ platform }) => (
                          <span key={platform} className="text-[11px] font-semibold bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded">
                            {PLATFORM_LABEL[platform]}
                          </span>
                        ))}
                      </div>
                      {c.cpm && (
                        <span className="text-lg font-black text-green-600">SAR {c.cpm} <span className="text-xs font-semibold text-zinc-400">CPM</span></span>
                      )}
                    </div>
                  </Link>
                </RevealStagger>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          HOW IT WORKS — numbered vertical steps, large step numerals
          Layout family: vertical timeline with large counters
      ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 bg-white border-b border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-6">
          <RevealUp className="mb-16">
            <h2 className="text-[36px] sm:text-[48px] font-black tracking-[-0.025em] leading-tight max-w-sm">
              From post to payout in three steps.
            </h2>
          </RevealUp>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {[
              {
                n: '01',
                title: 'Join a campaign',
                body: 'Browse live brand campaigns filtered by your niche, platform, and CPM rate. No pitch needed. One tap joins.',
                icon: <UsersThree size={28} weight="duotone" className="text-green-600" />,
                seed: 'campaign-join-mobile',
              },
              {
                n: '02',
                title: 'Create and submit',
                body: 'Follow the creative brief, publish on your social account, then paste your URL into Content Rewards. Done in under a minute.',
                icon: <ChartLineUp size={28} weight="duotone" className="text-green-600" />,
                seed: 'content-creator-filming',
              },
              {
                n: '03',
                title: 'Collect your earnings',
                body: 'Views are independently verified. Your reward is calculated and deposited to your wallet. Withdraw to your Saudi bank account.',
                icon: <CurrencyDollar size={28} weight="duotone" className="text-green-600" />,
                seed: 'bank-payment-success',
              },
            ].map(({ n, title, body, icon, seed }, i) => (
              <RevealUp key={n} delay={i * 0.08}>
                <div className="relative">
                  {/* Large step number */}
                  <p className="text-[96px] font-black text-zinc-100 leading-none tracking-tighter select-none mb-4 -ml-2">
                    {n}
                  </p>
                  <div className="relative z-10 -mt-10">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
                      {icon}
                    </div>
                    <h3 className="text-[20px] font-black tracking-tight mb-3">{title}</h3>
                    <p className="text-[15px] text-zinc-500 leading-relaxed max-w-[280px]">{body}</p>
                  </div>
                  <div className="mt-6 rounded-2xl overflow-hidden">
                    <Image
                      src={`https://picsum.photos/seed/${seed}/600/280`}
                      alt={title}
                      width={600}
                      height={280}
                      className="w-full object-cover h-[180px] rounded-2xl"
                    />
                  </div>
                </div>
              </RevealUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          TESTIMONIALS — asymmetric masonry 2fr + 1fr columns
          Layout family: masonry/asymmetric quote grid
      ───────────────────────────────────────────────────────────── */}
      <section className="py-28 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-6">
          <RevealUp className="mb-14">
            <h2 className="text-[36px] sm:text-[48px] font-black tracking-[-0.025em] leading-tight max-w-sm">
              Creators who are winning.
            </h2>
          </RevealUp>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-4">
            {/* Featured large */}
            <RevealUp className="relative rounded-3xl overflow-hidden min-h-[440px] row-span-2">
              <Image
                src="https://picsum.photos/seed/top-saudi-creator-success/700/600"
                alt="Featured creator"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <p className="text-[17px] font-semibold text-white leading-snug mb-5 max-w-[360px]">
                  "I made more from one campaign than I used to earn in a full month. The process is so simple."
                </p>
                <p className="text-sm font-bold text-white">Sarah A.</p>
                <p className="text-xs text-white/60">@saraha_ksa, TikTok</p>
                <p className="text-2xl font-black text-green-400 mt-2">SAR 18,400</p>
              </div>
            </RevealUp>

            {/* Top right */}
            {[
              {
                quote: "The stc Gaming campaign was perfect. CPM tracking is completely transparent.",
                name: 'Mohammed K.', handle: '@mkgaming, YouTube', amount: 'SAR 32,000', seed: 'gamer-creator',
              },
              {
                quote: "Joined three campaigns at once. The dashboard makes everything easy to follow.",
                name: 'Khalid M.', handle: '@khalidm_sa, TikTok', amount: 'SAR 24,500', seed: 'male-creator-sa',
              },
              {
                quote: "Brand partnerships I could never get on my own. Payments are always on time.",
                name: 'Lana R.', handle: '@lanarlife, Instagram', amount: 'SAR 9,700', seed: 'female-lifestyle-creator',
              },
              {
                quote: "Long-form tech reviews pay incredibly well here. My Jarir campaign changed everything.",
                name: 'Faisal T.', handle: '@faisaltech, YouTube', amount: 'SAR 41,800', seed: 'tech-youtuber',
              },
            ].map(({ quote, name, handle, amount, seed }, i) => (
              <RevealStagger key={name} delay={i * 0.06 + 0.05}>
                <div className="rounded-2xl bg-white border border-zinc-200 p-6 flex flex-col justify-between min-h-[200px]">
                  <p className="text-[14px] text-zinc-600 leading-relaxed">"{quote}"</p>
                  <div className="flex items-end justify-between mt-5 pt-4 border-t border-zinc-100">
                    <div>
                      <p className="text-sm font-bold text-zinc-900">{name}</p>
                      <p className="text-xs text-zinc-400">{handle}</p>
                    </div>
                    <span className="text-base font-black text-green-600">{amount}</span>
                  </div>
                </div>
              </RevealStagger>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOR BRANDS — full-width tinted section, centered content
          Layout family: tinted full-width feature band
      ───────────────────────────────────────────────────────────── */}
      <section id="for-brands" className="py-28 bg-zinc-900 border-b border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <RevealUp>
              <p className="text-[13px] font-semibold text-green-400 uppercase tracking-widest mb-5">
                For brands and agencies
              </p>
              <h2 className="text-[36px] sm:text-[48px] font-black tracking-[-0.025em] leading-tight text-white mb-6">
                Pay for views, not promises.
              </h2>
              <p className="text-[17px] text-zinc-400 leading-relaxed mb-10 max-w-[480px]">
                Fund a campaign, define your brief, and reach 50,000 verified Saudi creators.
                Only pay per verified view. No guesswork, no wasted budget.
              </p>
              <div className="space-y-4 mb-10">
                {[
                  { icon: <CheckCircle size={20} weight="fill" className="text-green-400 shrink-0" />, text: 'Content reviewed before view counts begin' },
                  { icon: <Shield size={20} weight="fill" className="text-green-400 shrink-0" />, text: 'Built-in fraud detection on every submission' },
                  { icon: <ChartLineUp size={20} weight="fill" className="text-green-400 shrink-0" />, text: 'Real-time verified view tracking dashboard' },
                  { icon: <UsersThree size={20} weight="fill" className="text-green-400 shrink-0" />, text: '50,000+ verified creators across KSA, UAE, Kuwait' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-[15px] text-zinc-300">
                    {icon}
                    <span>{text}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white text-zinc-900 font-black px-8 py-4 text-[15px] hover:bg-zinc-100 active:scale-[0.98] transition-all"
              >
                Launch a Campaign
                <ArrowRight size={17} weight="bold" />
              </Link>
            </RevealUp>

            <RevealUp delay={0.06} className="relative rounded-3xl overflow-hidden min-h-[480px]">
              <Image
                src="https://picsum.photos/seed/brand-analytics-screen/700/540"
                alt="Brand campaign analytics"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-zinc-900/20" />
              {/* Floating ROI card */}
              <div className="absolute top-8 left-8 bg-white rounded-2xl px-5 py-4 shadow-xl">
                <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wide mb-1">Campaign ROI</p>
                <p className="text-2xl font-black text-zinc-900">4.8x</p>
                <p className="text-xs text-green-600 font-semibold mt-0.5">vs. display average</p>
              </div>
            </RevealUp>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FAQ — two-column question grid
          Layout family: 2-column question-answer split
      ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-28 bg-white border-b border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-6">
          <RevealUp className="mb-14">
            <h2 className="text-[36px] sm:text-[48px] font-black tracking-[-0.025em] leading-tight">
              Common questions
            </h2>
          </RevealUp>
          <RevealUp delay={0.05}>
            <FAQAccordion />
          </RevealUp>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CTA — centered manifesto band (manifesto exception applies)
          Layout family: centered manifesto, full-width green section
      ───────────────────────────────────────────────────────────── */}
      <section className="py-32 bg-green-600">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <RevealUp>
            <h2 className="text-[40px] sm:text-[60px] font-black tracking-[-0.03em] leading-tight text-white mb-6">
              Your content is already worth money.
            </h2>
          </RevealUp>
          <RevealUp delay={0.06}>
            <p className="text-[18px] text-green-100 mb-12 leading-relaxed">
              Join 50,000 creators already earning from brands they actually like.
              Takes 2 minutes to get started.
            </p>
          </RevealUp>
          <RevealUp delay={0.1}>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-green-700 font-black px-10 py-4 text-[16px] hover:bg-green-50 active:scale-[0.98] transition-all"
            >
              Create Free Account
              <ArrowRight size={18} weight="bold" />
            </Link>
          </RevealUp>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="bg-zinc-900 py-14">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10 pb-10 border-b border-white/10">
            <div>
              <p className="font-black text-[18px] text-white tracking-tight">
                Content<span className="text-green-400">Rewards</span>
              </p>
              <p className="text-sm text-zinc-500 mt-1.5">Saudi Arabia's creator performance platform</p>
            </div>
            <nav className="flex flex-wrap gap-x-8 gap-y-2 text-[14px] text-zinc-500">
              {[
                { label: 'Campaigns', href: '/discover' },
                { label: 'How it works', href: '/#how-it-works' },
                { label: 'For Brands', href: '/#for-brands' },
                { label: 'FAQ', href: '/#faq' },
                { label: 'Log in', href: '/login' },
                { label: 'Register', href: '/register' },
              ].map(({ label, href }) => (
                <Link key={href} href={href} className="hover:text-white transition-colors">{label}</Link>
              ))}
            </nav>
          </div>
          <p className="text-xs text-zinc-700 mt-8">
            &copy; {new Date().getFullYear()} Content Rewards. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
