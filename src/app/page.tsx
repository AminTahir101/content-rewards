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
  Play,
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
  const featured = campaigns[0]
  const rest = campaigns.slice(1)

  return (
    <div className="min-h-[100dvh] bg-white text-zinc-900">
      <MarketingNav />

      {/* ─────────────────────────────────────────────────────────────
          HERO
          Layout family: edge-bleeding full-height photo (absolute right),
          copy hard-left — no grid column, no floating cards
      ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[100dvh] bg-white flex items-center overflow-hidden">

        {/* Edge-bleeding photo — absolute, right half */}
        <div className="absolute top-0 right-0 bottom-0 w-[52%] hidden lg:block pointer-events-none">
          <Image
            src="https://d8j0ntlcm91z4.cloudfront.net/user_3GSqHKoPVu8jjSvOXL6Aq0ehOQc/hf_20260809_113747_e3163e91-2104-42c4-9bb8-2235df32edce.png"
            alt=""
            fill
            priority
            className="object-cover object-top"
          />
          {/* Left fade to white */}
          <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-white to-transparent z-10" />
          {/* Bottom fade to white */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent z-10" />
        </div>

        {/* Copy — left column only, never overlapping image */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 w-full py-32 lg:py-0">
          <div className="max-w-[560px]">
            <RevealUp>
              <h1 className="text-[64px] sm:text-[80px] lg:text-[90px] font-black tracking-[-0.04em] leading-[0.93] text-zinc-950 mb-8">
                Earn from<br />
                <em className="not-italic text-green-600">every view.</em>
              </h1>
            </RevealUp>

            <RevealUp delay={0.06}>
              <p className="text-[18px] text-zinc-500 leading-relaxed mb-10 max-w-[440px]">
                Join 50,000 Saudi creators getting paid by top brands — per verified view, automatically.
              </p>
            </RevealUp>

            <RevealUp delay={0.1}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-black px-8 py-4 text-[16px] transition-all"
                >
                  Start Earning Free
                  <ArrowRight size={18} weight="bold" />
                </Link>
                <Link
                  href="/discover"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 font-semibold px-8 py-4 text-[16px] transition-all"
                >
                  Browse Campaigns
                </Link>
              </div>
            </RevealUp>

            {/* Live indicator */}
            <RevealUp delay={0.14}>
              <div className="mt-12 inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-zinc-200 bg-zinc-50">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[13px] font-semibold text-zinc-600">
                  {campaigns.length > 0 ? campaigns.length : '40'}+ campaigns paying right now
                </span>
              </div>
            </RevealUp>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden lg:block">
          <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-300 to-transparent mx-auto" />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          BRAND STRIP — dark inverted marquee
          Layout family: dark band / infinite scroll strip
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-zinc-950 py-5">
        <div className="mb-4 px-6">
          <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.2em] text-center">
            Brands running campaigns now
          </p>
        </div>
        <BrandMarquee />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          STATS — large numbers separated by hairline rules, no box
          Layout family: open stat row with vertical dividers
      ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-zinc-100">
            {[
              { value: 'SAR 12M+', label: 'Paid to creators',  detail: 'and counting' },
              { value: '800M+',    label: 'Verified views',    detail: 'fraud-screened' },
              { value: '50,000+', label: 'Active creators',    detail: 'across KSA' },
              { value: '40+',     label: 'Live campaigns',     detail: 'right now' },
            ].map(({ value, label, detail }, i) => (
              <RevealStagger key={label} delay={i * 0.07} className="px-8 first:pl-0 last:pr-0 py-6">
                <p className="text-[40px] sm:text-[48px] font-black text-zinc-950 tracking-[-0.03em] leading-none">
                  {value}
                </p>
                <p className="text-[14px] font-semibold text-zinc-700 mt-3">{label}</p>
                <p className="text-[13px] text-zinc-400 mt-0.5">{detail}</p>
              </RevealStagger>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CAMPAIGNS — 1 large featured card + compact list rows
          Layout family: featured hero card + divider-separated list
      ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-[1400px] mx-auto px-6">

          <div className="flex items-end justify-between mb-10">
            <RevealUp>
              <h2 className="text-[36px] sm:text-[44px] font-black tracking-[-0.025em] leading-tight">
                Live campaigns
              </h2>
            </RevealUp>
            <RevealUp delay={0.04}>
              <Link
                href="/discover"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
              >
                View all <ArrowRight size={15} weight="bold" />
              </Link>
            </RevealUp>
          </div>

          {/* Featured large card */}
          {featured && (
            <RevealUp className="mb-4">
              <Link
                href={`/campaigns/${featured.slug}`}
                className="group relative flex flex-col lg:flex-row rounded-2xl overflow-hidden border border-zinc-200 bg-white hover:border-green-300 hover:shadow-lg hover:shadow-green-50 transition-all"
              >
                <div className="relative lg:w-[460px] shrink-0 min-h-[260px] lg:min-h-[320px]">
                  <Image
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_3GSqHKoPVu8jjSvOXL6Aq0ehOQc/hf_20260809_113747_db592cac-e2ea-4120-b752-a7028ede6cba.png"
                    alt={featured.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-zinc-950/70 lg:from-transparent to-transparent" />
                </div>
                <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                        {featured.organization.name}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-zinc-300" />
                      <span className="text-[11px] font-bold text-green-600 uppercase tracking-widest">
                        {CATEGORY_LABEL[featured.category] ?? featured.category}
                      </span>
                    </div>
                    <h3 className="text-[28px] lg:text-[32px] font-black tracking-tight text-zinc-900 group-hover:text-green-700 transition-colors leading-tight mb-4">
                      {featured.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {featured.platforms.map(({ platform }) => (
                        <span
                          key={platform}
                          className="text-[12px] font-semibold bg-zinc-100 text-zinc-600 px-3 py-1 rounded-lg"
                        >
                          {PLATFORM_LABEL[platform]}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end gap-8 mt-8 pt-8 border-t border-zinc-100">
                    <div>
                      {featured.cpm && (
                        <>
                          <p className="text-[42px] font-black text-green-600 tracking-tight leading-none">
                            SAR {featured.cpm}
                          </p>
                          <p className="text-[13px] font-semibold text-zinc-400 mt-1">per 1,000 verified views</p>
                        </>
                      )}
                    </div>
                    {featured.maxCreatorPayout && (
                      <div>
                        <p className="text-[13px] font-semibold text-zinc-400">Max payout</p>
                        <p className="text-[18px] font-black text-zinc-800">
                          SAR {parseFloat(featured.maxCreatorPayout).toLocaleString('en-SA')}
                        </p>
                      </div>
                    )}
                    <div className="ml-auto">
                      <span className="inline-flex items-center gap-2 bg-green-600 group-hover:bg-green-700 text-white font-bold px-5 py-3 rounded-xl text-[14px] transition-colors">
                        Join campaign <ArrowRight size={15} weight="bold" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </RevealUp>
          )}

          {/* Compact list rows for remaining campaigns */}
          {rest.length > 0 && (
            <div className="bg-white rounded-2xl border border-zinc-200 divide-y divide-zinc-100 overflow-hidden">
              {rest.map((c, i) => {
                const remaining = parseFloat(c.totalBudget) - parseFloat(c.reservedBudget)
                return (
                  <RevealUp key={c.id} delay={i * 0.04}>
                    <Link
                      href={`/campaigns/${c.slug}`}
                      className="group flex items-center gap-4 sm:gap-6 px-6 py-5 hover:bg-zinc-50 transition-colors"
                    >
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                        <Image
                          src={`https://picsum.photos/seed/${CAMPAIGN_SEEDS[i + 1] ?? `campaign-${i}`}/96/96`}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[13px] font-semibold text-zinc-400 truncate">{c.organization.name}</p>
                        </div>
                        <p className="text-[15px] font-black text-zinc-900 group-hover:text-green-700 transition-colors truncate">
                          {c.name}
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                        {c.platforms.slice(0, 2).map(({ platform }) => (
                          <span key={platform} className="text-[11px] font-semibold bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded">
                            {PLATFORM_LABEL[platform]}
                          </span>
                        ))}
                      </div>
                      <div className="hidden lg:block shrink-0 text-right">
                        <p className="text-[11px] font-semibold text-zinc-400">Budget left</p>
                        <p className="text-[13px] font-bold text-zinc-700">
                          SAR {remaining.toLocaleString('en-SA', { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                      {c.cpm && (
                        <div className="shrink-0 text-right">
                          <p className="text-[20px] font-black text-green-600 leading-none">
                            SAR {c.cpm}
                          </p>
                          <p className="text-[10px] font-semibold text-zinc-400 mt-0.5">CPM</p>
                        </div>
                      )}
                      <ArrowRight size={16} weight="bold" className="shrink-0 text-zinc-300 group-hover:text-green-600 transition-colors" />
                    </Link>
                  </RevealUp>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          HOW IT WORKS — numbered steps left / single image right
          Layout family: stacked numbered list + anchoring image (2-col)
          Different from 3-col with background numerals
      ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-white border-b border-zinc-100">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-16 items-center">

            {/* Steps */}
            <div>
              <RevealUp className="mb-12">
                <h2 className="text-[36px] sm:text-[44px] font-black tracking-[-0.025em] leading-tight">
                  From zero to payout<br />in three steps.
                </h2>
              </RevealUp>

              <div className="space-y-0 divide-y divide-zinc-100">
                {[
                  {
                    n: '01',
                    icon: <UsersThree size={20} weight="fill" className="text-green-600" />,
                    title: 'Join a campaign',
                    body: 'Browse active brand campaigns, filter by niche and platform, and join with one tap. No pitch needed.',
                  },
                  {
                    n: '02',
                    icon: <Play size={20} weight="fill" className="text-green-600" />,
                    title: 'Create and submit',
                    body: 'Follow the creative brief, publish on your social account, then paste the post URL. Done in under a minute.',
                  },
                  {
                    n: '03',
                    icon: <CurrencyDollar size={20} weight="fill" className="text-green-600" />,
                    title: 'Collect your earnings',
                    body: 'Views are independently verified and your reward lands in your wallet automatically. Withdraw any time.',
                  },
                ].map(({ n, icon, title, body }, i) => (
                  <RevealUp key={n} delay={i * 0.08}>
                    <div className="flex gap-6 py-8">
                      <div className="shrink-0 mt-0.5">
                        <p className="text-[11px] font-black text-zinc-300 tracking-widest mb-3">{n}</p>
                        <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                          {icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-[18px] font-black tracking-tight text-zinc-900 mb-2">{title}</h3>
                        <p className="text-[15px] text-zinc-500 leading-relaxed max-w-[380px]">{body}</p>
                      </div>
                    </div>
                  </RevealUp>
                ))}
              </div>

              <RevealUp delay={0.3}>
                <div className="mt-10 pt-10 border-t border-zinc-100">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-black px-7 py-3.5 text-[15px] transition-all"
                  >
                    Get started free <ArrowRight size={16} weight="bold" />
                  </Link>
                </div>
              </RevealUp>
            </div>

            {/* Anchoring image */}
            <RevealUp delay={0.05} className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
                <Image
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_3GSqHKoPVu8jjSvOXL6Aq0ehOQc/hf_20260809_113747_b972f910-d41f-41e5-af1e-2c73a29187cb.png"
                  alt="Creator filming content"
                  fill
                  className="object-cover"
                />
                {/* Earnings badge overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl px-5 py-4 border border-zinc-200/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Latest payout</p>
                      <p className="text-[26px] font-black text-zinc-900 tracking-tight">SAR 3,840</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-green-600">
                      <TrendUp size={16} weight="bold" />
                      <span className="text-[13px] font-black">+41%</span>
                    </div>
                  </div>
                </div>
              </div>
            </RevealUp>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOR BRANDS — dark bento grid
          Layout family: dark inversion with unequal bento cells
          Only dark section on the page
      ───────────────────────────────────────────────────────────── */}
      <section id="for-brands" className="py-24 bg-zinc-950">
        <div className="max-w-[1400px] mx-auto px-6">

          <RevealUp className="mb-10">
            <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-4">
              For brands and agencies
            </p>
            <h2 className="text-[36px] sm:text-[44px] font-black tracking-[-0.025em] leading-tight text-white max-w-xl">
              Pay for verified views.<br />Not for promises.
            </h2>
          </RevealUp>

          {/* Bento grid — 3 cols, 2 rows, mixed cell sizes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">

            {/* Large hero cell — spans 2 rows on lg */}
            <RevealUp className="sm:row-span-2 bg-zinc-900 rounded-2xl p-8 flex flex-col justify-between min-h-[280px] sm:min-h-0 border border-white/[0.05]">
              <div>
                <p className="text-[48px] sm:text-[56px] font-black text-white tracking-tight leading-none mb-3">
                  4.8<span className="text-green-500">×</span>
                </p>
                <p className="text-[15px] font-semibold text-zinc-400 leading-snug max-w-[200px]">
                  Average ROI vs. display advertising
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-zinc-900 font-black px-6 py-3 text-[14px] hover:bg-zinc-100 active:scale-[0.98] transition-all"
                >
                  Launch a campaign <ArrowRight size={15} weight="bold" />
                </Link>
              </div>
            </RevealUp>

            {/* Cell: fraud protection */}
            <RevealStagger delay={0.05} className="bg-zinc-900 rounded-2xl p-7 border border-white/[0.05] flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                <Shield size={20} weight="fill" className="text-green-500" />
              </div>
              <div>
                <p className="text-[17px] font-black text-white mb-1.5">Fraud detection built in</p>
                <p className="text-[13px] text-zinc-500 leading-relaxed">
                  Every submission is screened for fake views, bot traffic, and inflated metrics before your budget moves.
                </p>
              </div>
            </RevealStagger>

            {/* Cell: verified views */}
            <RevealStagger delay={0.09} className="bg-zinc-900 rounded-2xl p-7 border border-white/[0.05] flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                <ChartLineUp size={20} weight="fill" className="text-green-500" />
              </div>
              <div>
                <p className="text-[17px] font-black text-white mb-1.5">Real-time campaign dashboard</p>
                <p className="text-[13px] text-zinc-500 leading-relaxed">
                  Track verified views, creator performance, spend rate, and remaining budget live, per campaign.
                </p>
              </div>
            </RevealStagger>

            {/* Cell: network stat — spans 2 cols on sm */}
            <RevealStagger delay={0.13} className="sm:col-span-2 lg:col-span-1 relative bg-zinc-900 rounded-2xl border border-white/[0.05] overflow-hidden min-h-[180px]">
              <Image
                src="https://d8j0ntlcm91z4.cloudfront.net/user_3GSqHKoPVu8jjSvOXL6Aq0ehOQc/hf_20260809_113747_c2dbb2cb-6111-4373-b2f0-cbc3cb060c6f.png"
                alt=""
                fill
                className="object-cover opacity-20"
              />
              <div className="relative z-10 p-7 flex flex-col justify-end h-full">
                <p className="text-[36px] font-black text-white tracking-tight leading-none">50,000+</p>
                <p className="text-[13px] font-semibold text-zinc-400 mt-1.5">
                  verified creators across KSA, UAE and Kuwait
                </p>
              </div>
            </RevealStagger>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          TESTIMONIALS — large pull-quote + compact creator grid
          Layout family: single dominant quote + supporting name list
          Different from asymmetric masonry
      ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-[1400px] mx-auto px-6">

          <RevealUp className="mb-10">
            <h2 className="text-[36px] sm:text-[44px] font-black tracking-[-0.025em] leading-tight">
              Creators who are winning.
            </h2>
          </RevealUp>

          {/* Large pull quote */}
          <RevealUp>
            <div className="relative rounded-2xl overflow-hidden mb-4">
              <Image
                src="https://d8j0ntlcm91z4.cloudfront.net/user_3GSqHKoPVu8jjSvOXL6Aq0ehOQc/hf_20260809_113747_57786853-8f6d-4075-9d00-b4801ba72701.png"
                alt=""
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-zinc-950/70" />
              <div className="relative z-10 p-10 sm:p-14 max-w-[780px]">
                <p className="text-[22px] sm:text-[28px] font-semibold text-white leading-snug mb-6">
                  "I made more from one campaign than I used to earn in a full month. The process is completely transparent."
                </p>
                <p className="text-[15px] font-black text-white">Sarah A.</p>
                <p className="text-[13px] text-white/50 mt-0.5">@saraha_ksa, TikTok</p>
                <p className="text-[28px] font-black text-green-400 mt-3">SAR 18,400 earned</p>
              </div>
            </div>
          </RevealUp>

          {/* Compact creator grid — 4 col, no images, just name + earnings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { name: 'Mohammed K.', handle: '@mkgaming, YouTube',      amount: 'SAR 32,000', quote: 'Completely transparent CPM tracking.' },
              { name: 'Khalid M.',   handle: '@khalidm_sa, TikTok',     amount: 'SAR 24,500', quote: 'Joined three campaigns at once, easy.' },
              { name: 'Lana R.',     handle: '@lanarlife, Instagram',    amount: 'SAR 9,700',  quote: 'Payments always on time, no chasing.' },
              { name: 'Faisal T.',   handle: '@faisaltech, YouTube',     amount: 'SAR 41,800', quote: 'Long-form tech reviews pay incredibly well.' },
            ].map(({ name, handle, amount, quote }, i) => (
              <RevealStagger key={name} delay={i * 0.06}>
                <div className="bg-white border border-zinc-200 rounded-xl p-5 flex flex-col justify-between h-full gap-4">
                  <p className="text-[13px] text-zinc-500 leading-relaxed">"{quote}"</p>
                  <div>
                    <p className="text-[20px] font-black text-green-600">{amount}</p>
                    <p className="text-[13px] font-semibold text-zinc-900 mt-1">{name}</p>
                    <p className="text-[11px] text-zinc-400">{handle}</p>
                  </div>
                </div>
              </RevealStagger>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FAQ — 2-col split: header left, accordion right
          Layout family: header-left / content-right split
          Different from current centered max-width accordion
      ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 bg-white border-b border-zinc-100">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16">
            <RevealUp>
              <h2 className="text-[36px] sm:text-[40px] font-black tracking-[-0.025em] leading-tight sticky top-28">
                Common questions.
              </h2>
            </RevealUp>
            <RevealUp delay={0.05}>
              <FAQAccordion />
            </RevealUp>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CTA — stark full-width, zinc-950 dark
          Layout family: monochromatic dark manifesto, left-aligned
          Different from the current centered green section
      ───────────────────────────────────────────────────────────── */}
      <section className="py-28 bg-zinc-950">
        <div className="max-w-[1400px] mx-auto px-6">
          <RevealUp>
            <p className="text-[13px] font-black text-green-500 uppercase tracking-[0.18em] mb-6">
              Get started today
            </p>
            <h2 className="text-[48px] sm:text-[64px] lg:text-[76px] font-black tracking-[-0.04em] leading-[0.95] text-white mb-8 max-w-3xl">
              Your content is already worth money.
            </h2>
          </RevealUp>
          <RevealUp delay={0.06}>
            <p className="text-[18px] text-zinc-400 mb-12 max-w-[480px] leading-relaxed">
              Takes 2 minutes. Join 50,000 Saudi creators already earning on their terms.
            </p>
          </RevealUp>
          <RevealUp delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-black px-8 py-4 text-[16px] transition-all"
              >
                Create Free Account <ArrowRight size={18} weight="bold" />
              </Link>
              <Link
                href="/discover"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-zinc-300 font-semibold px-8 py-4 text-[16px] transition-all"
              >
                Browse campaigns
              </Link>
            </div>
          </RevealUp>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="bg-zinc-950 border-t border-white/[0.05] py-14">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10 pb-10 border-b border-white/[0.06]">
            <div>
              <p className="font-black text-[18px] text-white tracking-tight">
                Content<span className="text-green-500">Rewards</span>
              </p>
              <p className="text-[13px] text-zinc-600 mt-1.5">Saudi Arabia's creator performance platform</p>
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
          <p className="text-[12px] text-zinc-700 mt-8">
            &copy; {new Date().getFullYear()} Content Rewards. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
