'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  Warning,
  Link as LinkIcon,
} from '@phosphor-icons/react'
import {
  detectPlatform,
  getPlatformLabel,
  getPlatformExample,
  type SocialPlatform,
} from '@/lib/social-url'

// ── Constants ─────────────────────────────────────────────────────────────────

const PLATFORM_LABELS: Record<string, string> = {
  TIKTOK:    'TikTok',
  INSTAGRAM: 'Instagram',
  YOUTUBE:   'YouTube',
  X:         'X',
}

const PLATFORM_COLOR: Record<string, string> = {
  TIKTOK:    'bg-black/[0.07] dark:bg-white/[0.07] text-zinc-900 dark:text-white border-black/[0.1] dark:border-white/[0.1]',
  INSTAGRAM: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  YOUTUBE:   'bg-red-500/10 text-red-400 border-red-500/20',
  X:         'bg-black/[0.07] dark:bg-white/[0.07] text-zinc-900 dark:text-white border-black/[0.1] dark:border-white/[0.1]',
}

const PLATFORM_ACTIVE: Record<string, string> = {
  TIKTOK:    'bg-white text-black border-white',
  INSTAGRAM: 'bg-pink-500 text-white border-pink-500',
  YOUTUBE:   'bg-red-600 text-white border-red-600',
  X:         'bg-white text-black border-white',
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface CampaignProps {
  id: string
  name: string
  slug: string
  status: string
  endDate: string | null
  cpm: string | null
  maxCreatorPayout: string | null
  requiredHashtags: string[]
  requiredMentions: string[]
  contentBrief: string | null
  contentDos: string[]
  contentDonts: string[]
  platforms: string[]
  organization: { name: string }
}

interface Props {
  campaign: CampaignProps
}

type Step = 'brief' | 'url' | 'confirm' | 'done'

const STEP_LABELS: Record<Step, string> = {
  brief:   'Review Brief',
  url:     'Paste URL',
  confirm: 'Confirm',
  done:    'Done',
}

const STEPS: Step[] = ['brief', 'url', 'confirm']

// ── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const currentIdx = STEPS.indexOf(current)
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((s, i) => {
        const done   = currentIdx > i
        const active = currentIdx === i
        return (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-colors ${
              done
                ? 'bg-green-500 text-black'
                : active
                  ? 'bg-white text-black'
                  : 'bg-black/[0.08] dark:bg-white/[0.08] text-zinc-600'
            }`}>
              {done ? <Check size={10} weight="bold" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-6 transition-colors ${done ? 'bg-green-500' : 'bg-black/[0.08] dark:bg-white/[0.08]'}`} />
            )}
          </div>
        )
      })}
      <span className="ms-2 text-[12px] font-semibold text-zinc-500">
        {STEP_LABELS[current]}
      </span>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SubmitForm({ campaign }: Props) {
  const [step,             setStep]             = useState<Step>('brief')
  const [url,              setUrl]              = useState('')
  const [detectedPlatform, setDetectedPlatform] = useState<SocialPlatform | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null)
  const [urlError,         setUrlError]         = useState<string | null>(null)
  const [submitError,      setSubmitError]      = useState<string | null>(null)
  const [isPending,        startTransition]     = useTransition()

  const isNotActive      = campaign.status !== 'ACTIVE'
  const effectivePlatform = selectedPlatform ?? detectedPlatform

  function handleUrlChange(value: string) {
    setUrl(value)
    setUrlError(null)
    if (value.trim()) {
      const detected = detectPlatform(value.trim())
      setDetectedPlatform(detected)
      if (detected) setSelectedPlatform(detected)
    } else {
      setDetectedPlatform(null)
    }
  }

  function handleUrlNext() {
    const trimmed = url.trim()
    if (!trimmed) { setUrlError('Please paste your content URL'); return }
    try { new URL(trimmed) } catch { setUrlError('Please enter a valid URL starting with https://'); return }
    const platform = selectedPlatform ?? detectedPlatform
    if (!platform) { setUrlError('Could not detect platform. Please select one below.'); return }
    if (!campaign.platforms.includes(platform)) {
      setUrlError(
        `${getPlatformLabel(platform)} is not supported. Supported: ${campaign.platforms.map((p) => PLATFORM_LABELS[p] ?? p).join(', ')}`
      )
      return
    }
    setStep('confirm')
  }

  function handleSubmit() {
    const platform = selectedPlatform ?? detectedPlatform
    if (!platform) return
    setSubmitError(null)
    startTransition(async () => {
      const res = await fetch(`/api/campaigns/${campaign.slug}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentUrl: url.trim(), platform }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error ?? 'Submission failed. Please try again.')
        setStep('url')
        return
      }
      setStep('done')
    })
  }

  // ── Done ──────────────────────────────────────────────────────────────────

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-page flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
          <CheckCircle size={32} weight="fill" className="text-green-400" />
        </div>
        <h1 className="text-[28px] font-black text-zinc-900 dark:text-white tracking-tight mb-2">
          Submission received!
        </h1>
        <p className="text-[14px] text-zinc-500 max-w-xs leading-relaxed mb-8">
          Your content is being verified. We&apos;ll notify you once it&apos;s approved and tracking begins.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/my-campaigns"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-zinc-100 active:scale-[0.97] text-black font-black px-5 py-3 text-[14px] transition-all"
          >
            View My Campaigns
            <ArrowRight size={13} weight="bold" />
          </Link>
          <Link
            href="/discover"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/[0.1] dark:border-white/[0.1] text-zinc-700 dark:text-white/70 hover:border-black/20 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-white font-bold px-5 py-3 text-[13px] transition-all"
          >
            Discover More
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-page">

      {/* ── Top bar ──────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-page/90 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.06] h-14 flex items-center">
        <div className="max-w-[680px] mx-auto w-full px-6 flex items-center gap-4">
          <Link
            href={`/campaigns/${campaign.slug}`}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-zinc-600 hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft size={12} weight="bold" />
            Back
          </Link>
          <div className="h-4 w-px bg-black/[0.08] dark:bg-white/[0.08]" />
          <p className="text-[12px] text-zinc-600 truncate min-w-0">
            <span className="text-zinc-500">{campaign.organization.name}</span>
            <span className="text-zinc-700 mx-1.5">·</span>
            <span className="text-zinc-400">{campaign.name}</span>
          </p>
        </div>
      </div>

      <main className="max-w-[680px] mx-auto px-6 pt-8 pb-40">

        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator current={step} />
        </div>

        {/* ── Step 1: Brief ──────────────────────────────────────────────────── */}
        {step === 'brief' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-[32px] font-black text-zinc-900 dark:text-white tracking-tight mb-1">
                Review the brief
              </h1>
              <p className="text-[14px] text-zinc-600">
                Read carefully before creating your content.
              </p>
            </div>

            {/* Reward card */}
            <div className="rounded-xl bg-green-500/[0.07] border border-green-500/20 px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold text-green-600 uppercase tracking-wider mb-1">
                  You can earn up to
                </p>
                <p className="text-[28px] font-black text-green-400 tracking-tight leading-none">
                  {campaign.maxCreatorPayout
                    ? `SAR ${parseFloat(campaign.maxCreatorPayout).toLocaleString()}`
                    : '—'}
                </p>
              </div>
              {campaign.cpm && (
                <div className="text-end shrink-0">
                  <p className="text-[11px] font-bold text-green-600 uppercase tracking-wider mb-1">Rate</p>
                  <p className="text-[16px] font-black text-green-400">SAR {campaign.cpm} CPM</p>
                </div>
              )}
            </div>

            {/* Platforms */}
            <div>
              <p className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.14em] mb-3">
                Supported Platforms
              </p>
              <div className="flex flex-wrap gap-2">
                {campaign.platforms.map((p) => (
                  <span
                    key={p}
                    className={`rounded-lg border text-[12px] font-bold px-3 py-1.5 ${PLATFORM_COLOR[p] ?? 'bg-black/[0.07] dark:bg-white/[0.07] text-zinc-900 dark:text-white border-black/[0.1] dark:border-white/[0.1]'}`}
                  >
                    {PLATFORM_LABELS[p] ?? p}
                  </span>
                ))}
              </div>
            </div>

            {/* Content brief */}
            {campaign.contentBrief && (
              <div>
                <p className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.14em] mb-3">
                  Content Brief
                </p>
                <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-5 py-4 text-[13px] text-zinc-400 leading-relaxed whitespace-pre-wrap">
                  {campaign.contentBrief}
                </div>
              </div>
            )}

            {/* Do / Don't */}
            {(campaign.contentDos.length > 0 || campaign.contentDonts.length > 0) && (
              <div className="grid grid-cols-2 gap-3">
                {campaign.contentDos.length > 0 && (
                  <div className="rounded-xl bg-green-500/[0.05] border border-green-500/10 px-4 py-4">
                    <p className="text-[11px] font-black text-green-600 uppercase tracking-[0.14em] mb-3">Do</p>
                    <ul className="space-y-2">
                      {campaign.contentDos.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-[12px] text-zinc-400">
                          <Check size={11} weight="bold" className="text-green-500 shrink-0 mt-0.5" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {campaign.contentDonts.length > 0 && (
                  <div className="rounded-xl bg-red-500/[0.05] border border-red-500/10 px-4 py-4">
                    <p className="text-[11px] font-black text-red-600 uppercase tracking-[0.14em] mb-3">Don&apos;t</p>
                    <ul className="space-y-2">
                      {campaign.contentDonts.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-[12px] text-zinc-400">
                          <span className="text-red-500 font-black shrink-0 text-[10px] mt-0.5">✕</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Required tags / mentions */}
            {(campaign.requiredHashtags.length > 0 || campaign.requiredMentions.length > 0) && (
              <div>
                <p className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.14em] mb-3">
                  Required in your post
                </p>
                <div className="flex flex-wrap gap-2">
                  {campaign.requiredHashtags.map((tag) => (
                    <span key={tag} className="rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-[12px] font-bold px-3 py-1.5">
                      {tag}
                    </span>
                  ))}
                  {campaign.requiredMentions.map((m) => (
                    <span key={m} className="rounded-lg bg-black/[0.06] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.08] text-zinc-400 text-[12px] font-bold px-3 py-1.5">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: URL ────────────────────────────────────────────────────── */}
        {step === 'url' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-[32px] font-black text-zinc-900 dark:text-white tracking-tight mb-1">
                Paste your post URL
              </h1>
              <p className="text-[14px] text-zinc-600">
                Publish your content first, then come back and paste the link here.
              </p>
            </div>

            {/* URL input */}
            <div>
              <label htmlFor="content-url" className="block text-[12px] font-bold text-zinc-400 mb-2">
                Content URL
              </label>
              <div className="relative">
                <LinkIcon
                  size={13}
                  weight="bold"
                  className="absolute start-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
                />
                <input
                  id="content-url"
                  type="url"
                  placeholder="https://www.tiktok.com/@you/video/..."
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className={`w-full h-11 rounded-lg bg-black/[0.05] dark:bg-white/[0.05] border text-[13px] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 ps-9 pe-4 focus:outline-none focus:bg-black/[0.07] dark:focus:bg-white/[0.07] transition ${
                    urlError ? 'border-red-500/40 focus:border-red-500/60' : 'border-black/[0.08] dark:border-white/[0.08] focus:border-black/20 dark:focus:border-white/20'
                  }`}
                />
              </div>
              {urlError && (
                <p className="text-[12px] text-red-400 mt-2 flex items-start gap-1.5">
                  <Warning size={12} weight="fill" className="shrink-0 mt-0.5" />
                  {urlError}
                </p>
              )}
            </div>

            {/* Auto-detected platform */}
            {detectedPlatform && (
              <div className="flex items-center gap-2 rounded-xl bg-green-500/[0.07] border border-green-500/20 px-4 py-3">
                <CheckCircle size={14} weight="fill" className="text-green-400 shrink-0" />
                <p className="text-[13px] text-green-400 font-semibold">
                  Detected: {getPlatformLabel(detectedPlatform)}
                </p>
              </div>
            )}

            {/* Platform selector */}
            {url.trim() && (
              <div>
                <p className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.14em] mb-3">
                  {detectedPlatform ? 'Platform (auto-detected)' : 'Select platform'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {campaign.platforms.map((p) => {
                    const active = effectivePlatform === p
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSelectedPlatform(p as SocialPlatform)}
                        className={`rounded-xl border px-4 py-3 text-start transition-all ${
                          active
                            ? PLATFORM_ACTIVE[p] ?? 'bg-white text-black border-white'
                            : 'bg-black/[0.04] dark:bg-white/[0.04] border-black/[0.08] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                        }`}
                      >
                        <p className="text-[13px] font-black">{PLATFORM_LABELS[p] ?? p}</p>
                        <p className={`text-[11px] font-normal mt-0.5 truncate ${active ? 'opacity-60' : 'text-zinc-600'}`}>
                          {getPlatformExample(p as SocialPlatform).split(' ')[0]}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {submitError && (
              <div className="rounded-xl bg-red-500/[0.07] border border-red-500/20 px-4 py-3 flex items-start gap-2">
                <Warning size={14} weight="fill" className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-[13px] text-red-400">{submitError}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Confirm ────────────────────────────────────────────────── */}
        {step === 'confirm' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-[32px] font-black text-zinc-900 dark:text-white tracking-tight mb-1">
                Confirm submission
              </h1>
              <p className="text-[14px] text-zinc-600">
                Review your details. The URL cannot be changed after submission.
              </p>
            </div>

            {/* Summary card */}
            <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden divide-y divide-black/[0.05] dark:divide-white/[0.05]">
              <div className="px-5 py-4">
                <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">Campaign</p>
                <p className="text-[14px] font-black text-zinc-900 dark:text-white">{campaign.name}</p>
                <p className="text-[12px] text-zinc-600">{campaign.organization.name}</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-2">Platform</p>
                <span className={`rounded-lg border text-[12px] font-black px-3 py-1.5 ${
                  effectivePlatform
                    ? (PLATFORM_ACTIVE[effectivePlatform] ?? 'bg-white text-black border-white')
                    : 'bg-black/[0.07] dark:bg-white/[0.07] text-zinc-900 dark:text-white border-black/[0.1] dark:border-white/[0.1]'
                }`}>
                  {effectivePlatform ? (PLATFORM_LABELS[effectivePlatform] ?? effectivePlatform) : '—'}
                </span>
              </div>
              <div className="px-5 py-4">
                <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-2">Content URL</p>
                <p className="text-[12px] text-zinc-400 break-all font-mono leading-relaxed">{url.trim()}</p>
              </div>
              <div className="px-5 py-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">Reward rate</p>
                  <p className="text-[14px] font-black text-zinc-900 dark:text-white">
                    {campaign.cpm ? `SAR ${campaign.cpm} CPM` : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">Max earning</p>
                  <p className="text-[14px] font-black text-green-400">
                    {campaign.maxCreatorPayout
                      ? `SAR ${parseFloat(campaign.maxCreatorPayout).toLocaleString()}`
                      : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[12px] text-zinc-700 leading-relaxed">
              By submitting, you confirm this is your original content, it follows the campaign brief,
              and includes all required hashtags and mentions. False submissions may result in account suspension.
            </p>

            {submitError && (
              <div className="rounded-xl bg-red-500/[0.07] border border-red-500/20 px-4 py-3 flex items-start gap-2">
                <Warning size={14} weight="fill" className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-[13px] text-red-400">{submitError}</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Sticky bottom actions ─────────────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 bg-page/90 backdrop-blur-md border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-[680px] mx-auto px-6 py-4">

          {step === 'brief' && (
            <div className="flex gap-3">
              <Link
                href={`/campaigns/${campaign.slug}`}
                className="flex-1 inline-flex items-center justify-center rounded-xl border border-black/[0.1] dark:border-white/[0.1] text-zinc-700 dark:text-white/70 hover:border-black/20 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-white font-bold text-[13px] py-3 transition-all"
              >
                Back
              </Link>
              <button
                onClick={() => { if (!isNotActive) setStep('url') }}
                disabled={isNotActive}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-zinc-100 active:scale-[0.97] text-black font-black text-[13px] py-3 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {isNotActive
                  ? `Campaign ${campaign.status.toLowerCase()}`
                  : <>I understand — continue <ArrowRight size={12} weight="bold" /></>
                }
              </button>
            </div>
          )}

          {step === 'url' && (
            <div className="flex gap-3">
              <button
                onClick={() => setStep('brief')}
                className="flex-1 inline-flex items-center justify-center rounded-xl border border-black/[0.1] dark:border-white/[0.1] text-zinc-700 dark:text-white/70 hover:border-black/20 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-white font-bold text-[13px] py-3 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleUrlNext}
                disabled={!url.trim()}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-zinc-100 active:scale-[0.97] text-black font-black text-[13px] py-3 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                Review submission
                <ArrowRight size={12} weight="bold" />
              </button>
            </div>
          )}

          {step === 'confirm' && (
            <div className="flex gap-3">
              <button
                onClick={() => setStep('url')}
                disabled={isPending}
                className="flex-1 inline-flex items-center justify-center rounded-xl border border-black/[0.1] dark:border-white/[0.1] text-zinc-700 dark:text-white/70 hover:border-black/20 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-white font-bold text-[13px] py-3 transition-all disabled:opacity-50"
              >
                Edit
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 hover:bg-green-400 active:scale-[0.97] text-black font-black text-[13px] py-3 transition-all disabled:opacity-60 disabled:pointer-events-none"
              >
                {isPending ? 'Submitting…' : <>Submit content <CheckCircle size={14} weight="fill" /></>}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
