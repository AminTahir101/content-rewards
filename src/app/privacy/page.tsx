import Link from 'next/link'
import { getLocale } from 'next-intl/server'
import MarketingNav from '@/components/marketing/MarketingNav'

export const metadata = {
  title: 'Privacy Policy — ContentRewards',
  description: 'Privacy Policy for ContentRewards, the Saudi creator performance marketing platform.',
}

const LAST_UPDATED = 'August 10, 2026'

const SECTIONS = [
  { id: 'data-collected',    label: 'Data We Collect' },
  { id: 'how-data-used',     label: 'How We Use Your Data' },
  { id: 'data-sharing',      label: 'Data Sharing' },
  { id: 'pdpl-compliance',   label: 'Saudi PDPL Compliance' },
  { id: 'data-retention',    label: 'Data Retention' },
  { id: 'your-rights',       label: 'Your Rights' },
  { id: 'cookies',           label: 'Cookies' },
  { id: 'contact',           label: 'Contact Us' },
]

export default async function PrivacyPage() {
  const locale = await getLocale()

  return (
    <div className="min-h-screen bg-white dark:bg-page text-zinc-900 dark:text-white">
      <MarketingNav locale={locale} />

      <div className="max-w-[1400px] mx-auto px-6 py-16">
        {/* ── Page title ──────────────────────────────────────────────────────── */}
        <div className="mb-12 pb-10 border-b border-zinc-100 dark:border-white/[0.06]">
          <p className="text-[11px] font-black text-green-600 dark:text-green-500 uppercase tracking-[0.18em] mb-3">
            Legal
          </p>
          <h1 className="text-[42px] sm:text-[56px] font-black tracking-[-0.03em] leading-[0.92] mb-4">
            Privacy Policy
          </h1>
          <p className="text-[14px] text-zinc-500">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12">

          {/* ── Sidebar ToC ─────────────────────────────────────────────────────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.14em] mb-4">
                Contents
              </p>
              <nav className="space-y-1">
                {SECTIONS.map(({ id, label }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="block text-[13px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white py-1.5 border-s-2 border-transparent hover:border-green-500 ps-3 transition-all"
                  >
                    {label}
                  </a>
                ))}
              </nav>

              <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-white/[0.06]">
                <p className="text-[12px] text-zinc-500 leading-relaxed">
                  Also read our{' '}
                  <Link href="/terms" className="text-green-600 dark:text-green-400 hover:underline">
                    Terms of Service
                  </Link>
                </p>
              </div>
            </div>
          </aside>

          {/* ── Main content ────────────────────────────────────────────────────── */}
          <div>

            {/* Intro */}
            <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10 pb-10 border-b border-zinc-100 dark:border-white/[0.06]">
              ContentRewards is committed to protecting your personal data. This Privacy Policy explains what data we collect, how we use it, and your rights under Saudi Arabian law. By using the ContentRewards platform you agree to the practices described in this policy.
            </p>

            {/* Data Collected */}
            <section id="data-collected" className="mb-12 scroll-mt-28">
              <h2 className="text-[22px] font-black tracking-tight text-zinc-900 dark:text-white mb-4">
                1. Data We Collect
              </h2>

              <h3 className="text-[16px] font-black text-zinc-800 dark:text-zinc-200 mb-2 mt-6">
                1.1 Account Information
              </h3>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-2">
                When you register, we collect:
              </p>
              <ul className="list-disc ps-6 space-y-1.5 text-[15px] text-zinc-600 dark:text-zinc-400 mb-4">
                <li>Name and email address</li>
                <li>Password (stored as a one-way hash — never in plain text)</li>
                <li>Account role (Creator, Brand, Agency)</li>
                <li>Phone number if provided for verification</li>
                <li>Country and language preferences</li>
              </ul>

              <h3 className="text-[16px] font-black text-zinc-800 dark:text-zinc-200 mb-2 mt-6">
                1.2 Creator Profile Data
              </h3>
              <ul className="list-disc ps-6 space-y-1.5 text-[15px] text-zinc-600 dark:text-zinc-400 mb-4">
                <li>Social media usernames and platform handles</li>
                <li>Follower counts and engagement metrics from connected accounts</li>
                <li>Content submission URLs</li>
                <li>Campaign participation history</li>
                <li>Earnings and payout records</li>
              </ul>

              <h3 className="text-[16px] font-black text-zinc-800 dark:text-zinc-200 mb-2 mt-6">
                1.3 Social Account Connections
              </h3>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                When you connect a social account (TikTok, Instagram, YouTube, X), we receive limited access tokens from the platform's official OAuth process. These tokens are encrypted at rest and are used solely to verify account ownership and retrieve performance metrics for submitted content. We do not access your direct messages, contact lists, or personal social content beyond what is required for campaign verification.
              </p>

              <h3 className="text-[16px] font-black text-zinc-800 dark:text-zinc-200 mb-2 mt-6">
                1.4 Usage and Technical Data
              </h3>
              <ul className="list-disc ps-6 space-y-1.5 text-[15px] text-zinc-600 dark:text-zinc-400 mb-4">
                <li>IP address and approximate location</li>
                <li>Browser type and device information</li>
                <li>Pages visited and features used on the platform</li>
                <li>Session timestamps and duration</li>
              </ul>

              <h3 className="text-[16px] font-black text-zinc-800 dark:text-zinc-200 mb-2 mt-6">
                1.5 Financial Data
              </h3>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We collect payment information required to process payouts and campaign funding. Full payment card details are processed exclusively by our payment partners and are not stored on ContentRewards servers. We store transaction records, amounts, and status for accounting and dispute purposes.
              </p>
            </section>

            {/* How Data Is Used */}
            <section id="how-data-used" className="mb-12 scroll-mt-28">
              <h2 className="text-[22px] font-black tracking-tight text-zinc-900 dark:text-white mb-4">
                2. How We Use Your Data
              </h2>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                We use the data we collect for the following purposes:
              </p>
              <ul className="list-disc ps-6 space-y-2 text-[15px] text-zinc-600 dark:text-zinc-400 mb-4">
                <li>
                  <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Platform operation:</strong>{' '}
                  To provide and maintain the ContentRewards service, manage user accounts, and process campaign participation.
                </li>
                <li>
                  <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Content verification:</strong>{' '}
                  To verify that submitted content URLs are genuine, publicly accessible, and owned by the submitting creator.
                </li>
                <li>
                  <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Performance tracking:</strong>{' '}
                  To retrieve and store campaign metrics such as views, likes, shares, and comments from social platforms via official APIs.
                </li>
                <li>
                  <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Fraud detection:</strong>{' '}
                  To identify and prevent artificial inflation of metrics, account fraud, and platform abuse through automated risk analysis.
                </li>
                <li>
                  <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Reward calculation and payments:</strong>{' '}
                  To calculate creator earnings based on verified performance and process payouts to creator accounts.
                </li>
                <li>
                  <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Communications:</strong>{' '}
                  To send you notifications about submission status, reward availability, campaign updates, and platform announcements.
                </li>
                <li>
                  <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Analytics and improvement:</strong>{' '}
                  To understand platform usage patterns and improve the ContentRewards experience.
                </li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section id="data-sharing" className="mb-12 scroll-mt-28">
              <h2 className="text-[22px] font-black tracking-tight text-zinc-900 dark:text-white mb-4">
                3. Data Sharing
              </h2>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                ContentRewards does not sell your personal data. We may share limited data with the following categories of partners:
              </p>

              <h3 className="text-[16px] font-black text-zinc-800 dark:text-zinc-200 mb-2 mt-6">
                3.1 Payment Processors
              </h3>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                We share necessary financial information with licensed payment service providers to process creator payouts and brand campaign funding. These processors are contractually required to protect your data and use it only for payment processing.
              </p>

              <h3 className="text-[16px] font-black text-zinc-800 dark:text-zinc-200 mb-2 mt-6">
                3.2 Social Platforms
              </h3>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                We interact with TikTok, Instagram, YouTube, and X APIs using tokens you provide through OAuth. No personal data beyond what is required for API authentication is shared with these platforms. Data from social APIs is used only for campaign performance tracking.
              </p>

              <h3 className="text-[16px] font-black text-zinc-800 dark:text-zinc-200 mb-2 mt-6">
                3.3 Analytics Providers
              </h3>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                We may use analytics services to understand platform usage. Where analytics providers receive data, it is anonymized or pseudonymized to the extent technically possible.
              </p>

              <h3 className="text-[16px] font-black text-zinc-800 dark:text-zinc-200 mb-2 mt-6">
                3.4 Legal Requirements
              </h3>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We may disclose your data to Saudi authorities if required by law, court order, or to protect the legal rights, safety, or property of ContentRewards, our users, or the public.
              </p>
            </section>

            {/* PDPL Compliance */}
            <section id="pdpl-compliance" className="mb-12 scroll-mt-28">
              <h2 className="text-[22px] font-black tracking-tight text-zinc-900 dark:text-white mb-4">
                4. Saudi PDPL Compliance
              </h2>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                ContentRewards processes personal data in compliance with the Saudi Personal Data Protection Law (PDPL) (Royal Decree No. M/19, 1443H) and its implementing regulations. Our lawful bases for processing personal data include:
              </p>
              <ul className="list-disc ps-6 space-y-1.5 text-[15px] text-zinc-600 dark:text-zinc-400 mb-4">
                <li>Your explicit consent where required</li>
                <li>Performance of a contract with you (platform terms)</li>
                <li>Compliance with legal obligations</li>
                <li>Legitimate interests of ContentRewards in preventing fraud and operating the platform</li>
              </ul>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Cross-border data transfers are conducted in accordance with PDPL requirements. Where data is processed outside Saudi Arabia, we ensure appropriate contractual safeguards are in place.
              </p>
            </section>

            {/* Data Retention */}
            <section id="data-retention" className="mb-12 scroll-mt-28">
              <h2 className="text-[22px] font-black tracking-tight text-zinc-900 dark:text-white mb-4">
                5. Data Retention
              </h2>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                We retain your personal data for as long as your account is active and for a reasonable period afterward to meet legal and financial obligations. Specific retention periods:
              </p>
              <ul className="list-disc ps-6 space-y-1.5 text-[15px] text-zinc-600 dark:text-zinc-400 mb-4">
                <li>Account data: retained for the lifetime of the account plus 3 years after closure</li>
                <li>Financial transaction records: retained for 10 years as required by Saudi accounting regulations</li>
                <li>Campaign performance data: retained for 5 years for audit purposes</li>
                <li>Fraud investigation records: retained for the duration of any investigation plus 5 years</li>
                <li>Technical logs: retained for 12 months unless required longer by law</li>
              </ul>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                When data is no longer needed, it is securely deleted or anonymized.
              </p>
            </section>

            {/* Your Rights */}
            <section id="your-rights" className="mb-12 scroll-mt-28">
              <h2 className="text-[22px] font-black tracking-tight text-zinc-900 dark:text-white mb-4">
                6. Your Rights
              </h2>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                Under the Saudi PDPL, you have the following rights regarding your personal data:
              </p>
              <ul className="list-disc ps-6 space-y-2 text-[15px] text-zinc-600 dark:text-zinc-400 mb-4">
                <li>
                  <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Right of access:</strong>{' '}
                  Request a copy of the personal data we hold about you.
                </li>
                <li>
                  <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Right to correction:</strong>{' '}
                  Request correction of inaccurate or incomplete personal data.
                </li>
                <li>
                  <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Right to deletion:</strong>{' '}
                  Request deletion of your personal data, subject to our legal obligations to retain certain records.
                </li>
                <li>
                  <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Right to withdraw consent:</strong>{' '}
                  Where processing is based on consent, withdraw your consent at any time without affecting prior processing.
                </li>
                <li>
                  <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Right to object:</strong>{' '}
                  Object to processing of your personal data for specific purposes.
                </li>
              </ul>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                To exercise these rights, contact us at{' '}
                <a href="mailto:privacy@contentrewards.com" className="text-green-600 dark:text-green-400 hover:underline">
                  privacy@contentrewards.com
                </a>
                . We will respond within 30 days. We may need to verify your identity before processing your request.
              </p>
            </section>

            {/* Cookies */}
            <section id="cookies" className="mb-12 scroll-mt-28">
              <h2 className="text-[22px] font-black tracking-tight text-zinc-900 dark:text-white mb-4">
                7. Cookies
              </h2>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                ContentRewards uses cookies and similar tracking technologies to operate the platform and understand usage. Types of cookies we use:
              </p>
              <ul className="list-disc ps-6 space-y-2 text-[15px] text-zinc-600 dark:text-zinc-400 mb-4">
                <li>
                  <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Essential cookies:</strong>{' '}
                  Required for authentication, session management, and core platform functionality. Cannot be disabled.
                </li>
                <li>
                  <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Preference cookies:</strong>{' '}
                  Store your theme, language, and display preferences across sessions.
                </li>
                <li>
                  <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Analytics cookies:</strong>{' '}
                  Help us understand how users interact with the platform. These may be disabled without affecting core functionality.
                </li>
              </ul>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                You can manage cookie preferences through your browser settings. Disabling essential cookies will prevent you from logging in to the platform.
              </p>
            </section>

            {/* Contact */}
            <section id="contact" className="mb-12 scroll-mt-28">
              <h2 className="text-[22px] font-black tracking-tight text-zinc-900 dark:text-white mb-4">
                8. Contact Us
              </h2>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                For privacy questions, data access requests, or complaints, contact our Data Protection contact:
              </p>
              <div className="rounded-xl bg-zinc-50 dark:bg-surface border border-zinc-100 dark:border-white/[0.06] p-6 space-y-3">
                <div>
                  <p className="text-[12px] font-black text-zinc-500 uppercase tracking-wider mb-1">Privacy Contact</p>
                  <a href="mailto:privacy@contentrewards.com" className="text-[14px] text-green-600 dark:text-green-400 hover:underline">
                    privacy@contentrewards.com
                  </a>
                </div>
                <div>
                  <p className="text-[12px] font-black text-zinc-500 uppercase tracking-wider mb-1">Data Deletion Requests</p>
                  <a href="mailto:privacy@contentrewards.com" className="text-[14px] text-green-600 dark:text-green-400 hover:underline">
                    privacy@contentrewards.com
                  </a>
                  <p className="text-[12px] text-zinc-500 mt-0.5">Subject line: Data Deletion Request</p>
                </div>
                <div>
                  <p className="text-[12px] font-black text-zinc-500 uppercase tracking-wider mb-1">Response Time</p>
                  <p className="text-[14px] text-zinc-600 dark:text-zinc-400">Within 30 days as required by Saudi PDPL</p>
                </div>
              </div>
            </section>

            {/* Cross-link */}
            <div className="rounded-xl bg-zinc-50 dark:bg-surface border border-zinc-100 dark:border-white/[0.06] px-6 py-5 flex items-center justify-between gap-4">
              <p className="text-[14px] text-zinc-600 dark:text-zinc-400">
                See the full platform rules and creator obligations.
              </p>
              <Link
                href="/terms"
                className="shrink-0 text-[13px] font-bold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
              >
                Terms of Service →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────────── */}
      <footer className="mt-16 bg-zinc-950 border-t border-white/[0.05] py-10">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[12px] text-zinc-600">
            © {new Date().getFullYear()} ContentRewards. All rights reserved. Saudi Arabia.
          </p>
          <div className="flex items-center gap-6 text-[13px] text-zinc-500">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="text-white hover:text-green-400 transition-colors">Privacy</Link>
            <Link href="/discover" className="hover:text-white transition-colors">Campaigns</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
