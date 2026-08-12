import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/components/Logo'
import {
  ArrowRight,
  TrendUp,
  UsersThree,
  Shield,
  CurrencyDollar,
  ChartLineUp,
  Play,
} from '@phosphor-icons/react/dist/ssr'
import { getTranslations, getLocale } from 'next-intl/server'
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
  const [campaigns, t, locale] = await Promise.all([
    getHotCampaigns(),
    getTranslations('marketing'),
    getLocale(),
  ])
  const featured = campaigns[0]
  const rest = campaigns.slice(1)

  const faqItems = Array.from({ length: 6 }, (_, i) => ({
    q: t(`faq.items.${i}.q`),
    a: t(`faq.items.${i}.a`),
  }))

  return (
    <div className="min-h-[100dvh] bg-white dark:bg-page text-zinc-900 dark:text-white">
      <MarketingNav locale={locale} />

      {/* ─────────────────────────────────────────────────────────────
          HERO
      ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[100dvh] bg-white dark:bg-page flex items-center overflow-hidden">

        {/* Edge-bleeding photo — absolute, inline-end half */}
        <div className="absolute inset-y-0 end-0 w-[52%] hidden lg:block pointer-events-none">
          <Image
            src="https://d8j0ntlcm91z4.cloudfront.net/user_3GSqHKoPVu8jjSvOXL6Aq0ehOQc/hf_20260809_113747_e3163e91-2104-42c4-9bb8-2235df32edce.png"
            alt=""
            fill
            priority
            className="object-cover object-top"
          />
          {/* Start fade */}
          <div className="absolute inset-y-0 start-0 w-48 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-white dark:from-[#0d0d0d] to-transparent z-10" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 start-0 end-0 h-28 bg-gradient-to-t from-white dark:from-[#0d0d0d] to-transparent z-10" />
        </div>

        {/* Copy */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 w-full py-32 lg:py-0">
          <div className="max-w-[560px]">
            <RevealUp>
              <h1 className="text-[64px] sm:text-[80px] lg:text-[90px] font-black tracking-[-0.04em] leading-[0.93] rtl:leading-[1.15] text-zinc-950 dark:text-white mb-8">
                {t('hero.headline1')}<br />
                <em className="not-italic text-green-600 dark:text-green-400">{t('hero.headline2')}</em>
              </h1>
            </RevealUp>

            <RevealUp delay={0.06}>
              <p className="text-[18px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10 max-w-[440px]">
                {t('hero.subtext')}
              </p>
            </RevealUp>

            <RevealUp delay={0.1}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-black px-8 py-4 text-[16px] transition-all"
                >
                  {t('hero.ctaPrimary')}
                  <ArrowRight size={18} weight="bold" className="rtl:rotate-180" />
                </Link>
                <Link
                  href="/discover"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-white/[0.1] hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 font-semibold px-8 py-4 text-[16px] transition-all"
                >
                  {t('hero.ctaSecondary')}
                </Link>
              </div>
            </RevealUp>

            {/* Live indicator */}
            <RevealUp delay={0.14}>
              <div className="mt-12 inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-white/[0.04]">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[13px] font-semibold text-zinc-600 dark:text-zinc-400">
                  {t('hero.liveBadge', { count: campaigns.length > 0 ? campaigns.length : '40' })}
                </span>
              </div>
            </RevealUp>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden lg:block">
          <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-300 dark:from-white/20 to-transparent mx-auto" />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          BRAND STRIP — always dark
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-zinc-950 py-5">
        <div className="mb-4 px-6">
          <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.2em] text-center">
            {t('brandsStrip.label')}
          </p>
        </div>
        <BrandMarquee />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          STATS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-page">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-zinc-100 dark:divide-white/[0.06]">
            {([0, 1, 2, 3] as const).map((i) => (
              <RevealStagger key={i} delay={i * 0.07} className="px-8 first:ps-0 last:pe-0 py-6">
                <p className="text-[40px] sm:text-[48px] font-black text-zinc-950 dark:text-white tracking-[-0.03em] leading-none">
                  {t(`stats.${i}.value`)}
                </p>
                <p className="text-[14px] font-semibold text-zinc-700 dark:text-zinc-300 mt-3">{t(`stats.${i}.label`)}</p>
                <p className="text-[13px] text-zinc-400 dark:text-zinc-500 mt-0.5">{t(`stats.${i}.detail`)}</p>
              </RevealStagger>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CAMPAIGNS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-zinc-50 dark:bg-surface border-y border-zinc-100 dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6">

          <div className="flex items-end justify-between mb-10">
            <RevealUp>
              <h2 className="text-[36px] sm:text-[44px] font-black tracking-[-0.025em] leading-tight text-zinc-900 dark:text-white">
                {t('campaigns.title')}
              </h2>
            </RevealUp>
            <RevealUp delay={0.04}>
              <Link
                href="/discover"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
              >
                {t('campaigns.viewAll')} <ArrowRight size={15} weight="bold" className="rtl:rotate-180" />
              </Link>
            </RevealUp>
          </div>

          {/* Featured large card */}
          {featured && (
            <RevealUp className="mb-4">
              <Link
                href={`/campaigns/${featured.slug}`}
                className="group relative flex flex-col lg:flex-row rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#1a1a1a] hover:border-green-300 dark:hover:border-green-500/30 hover:shadow-lg hover:shadow-green-50 dark:hover:shadow-green-500/5 transition-all"
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
                      <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                      <span className="text-[11px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">
                        {CATEGORY_LABEL[featured.category] ?? featured.category}
                      </span>
                    </div>
                    <h3 className="text-[28px] lg:text-[32px] font-black tracking-tight text-zinc-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors leading-tight mb-4">
                      {featured.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {featured.platforms.map(({ platform }) => (
                        <span
                          key={platform}
                          className="text-[12px] font-semibold bg-zinc-100 dark:bg-white/[0.07] text-zinc-600 dark:text-zinc-400 px-3 py-1 rounded-lg"
                        >
                          {PLATFORM_LABEL[platform]}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end gap-8 mt-8 pt-8 border-t border-zinc-100 dark:border-white/[0.07]">
                    <div>
                      {featured.cpm && (
                        <>
                          <p className="text-[42px] font-black text-green-600 dark:text-green-400 tracking-tight leading-none">
                            SAR {featured.cpm}
                          </p>
                          <p className="text-[13px] font-semibold text-zinc-400 mt-1">{t('campaigns.perViews')}</p>
                        </>
                      )}
                    </div>
                    {featured.maxCreatorPayout && (
                      <div>
                        <p className="text-[13px] font-semibold text-zinc-400">{t('campaigns.maxPayout')}</p>
                        <p className="text-[18px] font-black text-zinc-800 dark:text-zinc-200">
                          SAR {parseFloat(featured.maxCreatorPayout).toLocaleString('en-SA')}
                        </p>
                      </div>
                    )}
                    <div className="ms-auto">
                      <span className="inline-flex items-center gap-2 bg-green-600 group-hover:bg-green-700 text-white font-bold px-5 py-3 rounded-xl text-[14px] transition-colors">
                        {t('campaigns.join')} <ArrowRight size={15} weight="bold" className="rtl:rotate-180" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </RevealUp>
          )}

          {/* Compact list rows */}
          {rest.length > 0 && (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-zinc-200 dark:border-white/[0.07] divide-y divide-zinc-100 dark:divide-white/[0.06] overflow-hidden">
              {rest.map((c, i) => {
                const remaining = parseFloat(c.totalBudget) - parseFloat(c.reservedBudget)
                return (
                  <RevealUp key={c.id} delay={i * 0.04}>
                    <Link
                      href={`/campaigns/${c.slug}`}
                      className="group flex items-center gap-4 sm:gap-6 px-6 py-5 hover:bg-zinc-50 dark:hover:bg-white/[0.03] transition-colors"
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
                        <p className="text-[15px] font-black text-zinc-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors truncate">
                          {c.name}
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                        {c.platforms.slice(0, 2).map(({ platform }) => (
                          <span key={platform} className="text-[11px] font-semibold bg-zinc-100 dark:bg-white/[0.07] text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded">
                            {PLATFORM_LABEL[platform]}
                          </span>
                        ))}
                      </div>
                      <div className="hidden lg:block shrink-0 text-end">
                        <p className="text-[11px] font-semibold text-zinc-400">{t('campaigns.budgetLeft')}</p>
                        <p className="text-[13px] font-bold text-zinc-700 dark:text-zinc-300">
                          SAR {remaining.toLocaleString('en-SA', { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                      {c.cpm && (
                        <div className="shrink-0 text-end">
                          <p className="text-[20px] font-black text-green-600 dark:text-green-400 leading-none">
                            SAR {c.cpm}
                          </p>
                          <p className="text-[10px] font-semibold text-zinc-400 mt-0.5">CPM</p>
                        </div>
                      )}
                      <ArrowRight size={16} weight="bold" className="shrink-0 text-zinc-300 dark:text-zinc-600 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors rtl:rotate-180" />
                    </Link>
                  </RevealUp>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          HOW IT WORKS
      ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-page border-b border-zinc-100 dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-16 items-center">

            {/* Steps */}
            <div>
              <RevealUp className="mb-12">
                <h2 className="text-[36px] sm:text-[44px] font-black tracking-[-0.025em] leading-tight text-zinc-900 dark:text-white whitespace-pre-line">
                  {t('howItWorks.title')}
                </h2>
              </RevealUp>

              <div className="space-y-0 divide-y divide-zinc-100 dark:divide-white/[0.06]">
                {([0, 1, 2] as const).map((i, idx) => {
                  const icons = [
                    <UsersThree key="users" size={20} weight="fill" className="text-green-600 dark:text-green-400" />,
                    <Play key="play" size={20} weight="fill" className="text-green-600 dark:text-green-400" />,
                    <CurrencyDollar key="dollar" size={20} weight="fill" className="text-green-600 dark:text-green-400" />,
                  ]
                  return (
                    <RevealUp key={i} delay={idx * 0.08}>
                      <div className="flex gap-6 py-8">
                        <div className="shrink-0 mt-0.5">
                          <p className="text-[11px] font-black text-zinc-300 dark:text-zinc-600 tracking-widest mb-3">
                            {t(`howItWorks.steps.${i}.num`)}
                          </p>
                          <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                            {icons[idx]}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-[18px] font-black tracking-tight text-zinc-900 dark:text-white mb-2">
                            {t(`howItWorks.steps.${i}.title`)}
                          </h3>
                          <p className="text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[380px]">
                            {t(`howItWorks.steps.${i}.body`)}
                          </p>
                        </div>
                      </div>
                    </RevealUp>
                  )
                })}
              </div>

              <RevealUp delay={0.3}>
                <div className="mt-10 pt-10 border-t border-zinc-100 dark:border-white/[0.06]">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-black px-7 py-3.5 text-[15px] transition-all"
                  >
                    {t('howItWorks.cta')} <ArrowRight size={16} weight="bold" className="rtl:rotate-180" />
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
                <div className="absolute bottom-6 start-6 end-6 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm rounded-xl px-5 py-4 border border-zinc-200/80 dark:border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        {t('howItWorks.latestPayout')}
                      </p>
                      <p className="text-[26px] font-black text-zinc-900 dark:text-white tracking-tight">SAR 3,840</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
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
          FOR BRANDS — always dark
      ───────────────────────────────────────────────────────────── */}
      <section id="for-brands" className="py-24 bg-zinc-950">
        <div className="max-w-[1400px] mx-auto px-6">

          <RevealUp className="mb-10">
            <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-4">
              {t('forBrands.eyebrow')}
            </p>
            <h2 className="text-[36px] sm:text-[44px] font-black tracking-[-0.025em] leading-tight text-white max-w-xl whitespace-pre-line">
              {t('forBrands.title')}
            </h2>
          </RevealUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">

            <RevealUp className="sm:row-span-2 bg-zinc-900 rounded-2xl p-8 flex flex-col justify-between min-h-[280px] sm:min-h-0 border border-white/[0.05]">
              <div>
                <p className="text-[48px] sm:text-[56px] font-black text-white tracking-tight leading-none mb-3">
                  4.8<span className="text-green-500">×</span>
                </p>
                <p className="text-[15px] font-semibold text-zinc-400 leading-snug max-w-[200px]">
                  {t('forBrands.roi')}
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-zinc-900 font-black px-6 py-3 text-[14px] hover:bg-zinc-100 active:scale-[0.98] transition-all"
                >
                  {t('forBrands.cta')} <ArrowRight size={15} weight="bold" className="rtl:rotate-180" />
                </Link>
              </div>
            </RevealUp>

            <RevealStagger delay={0.05} className="bg-zinc-900 rounded-2xl p-7 border border-white/[0.05] flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                <Shield size={20} weight="fill" className="text-green-500" />
              </div>
              <div>
                <p className="text-[17px] font-black text-white mb-1.5">{t('forBrands.fraudTitle')}</p>
                <p className="text-[13px] text-zinc-500 leading-relaxed">
                  {t('forBrands.fraudBody')}
                </p>
              </div>
            </RevealStagger>

            <RevealStagger delay={0.09} className="bg-zinc-900 rounded-2xl p-7 border border-white/[0.05] flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                <ChartLineUp size={20} weight="fill" className="text-green-500" />
              </div>
              <div>
                <p className="text-[17px] font-black text-white mb-1.5">{t('forBrands.dashTitle')}</p>
                <p className="text-[13px] text-zinc-500 leading-relaxed">
                  {t('forBrands.dashBody')}
                </p>
              </div>
            </RevealStagger>

            <RevealStagger delay={0.13} className="sm:col-span-2 lg:col-span-1 relative bg-zinc-900 rounded-2xl border border-white/[0.05] overflow-hidden min-h-[180px]">
              <Image
                src="https://d8j0ntlcm91z4.cloudfront.net/user_3GSqHKoPVu8jjSvOXL6Aq0ehOQc/hf_20260809_113747_c2dbb2cb-6111-4373-b2f0-cbc3cb060c6f.png"
                alt=""
                fill
                className="object-cover opacity-20"
              />
              <div className="relative z-10 p-7 flex flex-col justify-end h-full">
                <p className="text-[36px] font-black text-white tracking-tight leading-none">
                  {t('forBrands.networkStat')}
                </p>
                <p className="text-[13px] font-semibold text-zinc-400 mt-1.5">
                  {t('forBrands.networkLabel')}
                </p>
              </div>
            </RevealStagger>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          TESTIMONIALS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-zinc-50 dark:bg-surface border-b border-zinc-100 dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6">

          <RevealUp className="mb-10">
            <h2 className="text-[36px] sm:text-[44px] font-black tracking-[-0.025em] leading-tight text-zinc-900 dark:text-white">
              {t('testimonials.title')}
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
                  {t('testimonials.featuredQuote')}
                </p>
                <p className="text-[15px] font-black text-white">{t('testimonials.featuredName')}</p>
                <p className="text-[13px] text-white/50 mt-0.5">{t('testimonials.featuredHandle')}</p>
                <p className="text-[28px] font-black text-green-400 mt-3">{t('testimonials.featuredAmount')}</p>
              </div>
            </div>
          </RevealUp>

          {/* Compact creator grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {([0, 1, 2, 3] as const).map((i, idx) => (
              <RevealStagger key={i} delay={idx * 0.06}>
                <div className="bg-white dark:bg-[#1a1a1a] border border-zinc-200 dark:border-white/[0.07] rounded-xl p-5 flex flex-col justify-between h-full gap-4">
                  <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">"{t(`testimonials.cards.${i}.quote`)}"</p>
                  <div>
                    <p className="text-[20px] font-black text-green-600 dark:text-green-400">{t(`testimonials.cards.${i}.amount`)}</p>
                    <p className="text-[13px] font-semibold text-zinc-900 dark:text-white mt-1">{t(`testimonials.cards.${i}.name`)}</p>
                    <p className="text-[11px] text-zinc-400">{t(`testimonials.cards.${i}.handle`)}</p>
                  </div>
                </div>
              </RevealStagger>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FAQ
      ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 bg-white dark:bg-page border-b border-zinc-100 dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16">
            <RevealUp>
              <h2 className="text-[36px] sm:text-[40px] font-black tracking-[-0.025em] leading-tight text-zinc-900 dark:text-white sticky top-28">
                {t('faq.title')}
              </h2>
            </RevealUp>
            <RevealUp delay={0.05}>
              <FAQAccordion items={faqItems} />
            </RevealUp>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CTA — always dark
      ───────────────────────────────────────────────────────────── */}
      <section className="py-28 bg-zinc-950">
        <div className="max-w-[1400px] mx-auto px-6">
          <RevealUp>
            <p className="text-[13px] font-black text-green-500 uppercase tracking-[0.18em] mb-6">
              {t('cta.eyebrow')}
            </p>
            <h2 className="text-[48px] sm:text-[64px] lg:text-[76px] font-black tracking-[-0.04em] leading-[0.95] text-white mb-8 max-w-3xl">
              {t('cta.headline')}
            </h2>
          </RevealUp>
          <RevealUp delay={0.06}>
            <p className="text-[18px] text-zinc-400 mb-12 max-w-[480px] leading-relaxed">
              {t('cta.subtext')}
            </p>
          </RevealUp>
          <RevealUp delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-black px-8 py-4 text-[16px] transition-all"
              >
                {t('cta.primary')} <ArrowRight size={18} weight="bold" className="rtl:rotate-180" />
              </Link>
              <Link
                href="/discover"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-zinc-300 font-semibold px-8 py-4 text-[16px] transition-all"
              >
                {t('cta.secondary')}
              </Link>
            </div>
          </RevealUp>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER — always dark
      ───────────────────────────────────────────────────────────── */}
      <footer className="bg-zinc-950 border-t border-white/[0.05] py-14">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10 pb-10 border-b border-white/[0.06]">
            <div>
              <div className="mb-2">
                <Logo height={30} />
              </div>
              <p className="text-[13px] text-zinc-600">{t('footer.tagline')}</p>
            </div>
            <nav className="flex flex-wrap gap-x-8 gap-y-2 text-[14px] text-zinc-500">
              {[
                { label: t('nav.campaigns'),   href: '/discover' },
                { label: t('nav.howItWorks'),  href: '/#how-it-works' },
                { label: t('nav.forBrands'),   href: '/#for-brands' },
                { label: t('nav.faq'),         href: '/#faq' },
                { label: t('nav.login'),       href: '/login' },
                { label: t('nav.startEarning'),href: '/register' },
                { label: 'Terms',              href: '/terms' },
                { label: 'Privacy',            href: '/privacy' },
              ].map(({ label, href }) => (
                <Link key={href} href={href} className="hover:text-white transition-colors">{label}</Link>
              ))}
            </nav>
          </div>
          <p className="text-[12px] text-zinc-700 mt-8">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  )
}
