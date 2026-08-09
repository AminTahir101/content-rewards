'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  detectPlatform,
  getPlatformLabel,
  getPlatformExample,
  type SocialPlatform,
} from '@/lib/social-url'

const PLATFORM_LABELS: Record<string, string> = {
  TIKTOK: 'TikTok',
  INSTAGRAM: 'Instagram',
  YOUTUBE: 'YouTube',
  X: 'X (Twitter)',
}

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

export default function SubmitForm({ campaign }: Props) {
  const [step, setStep] = useState<Step>('brief')
  const [url, setUrl] = useState('')
  const [detectedPlatform, setDetectedPlatform] = useState<SocialPlatform | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null)
  const [urlError, setUrlError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const isNotActive = campaign.status !== 'ACTIVE'

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
    if (!trimmed) {
      setUrlError('Please paste your content URL')
      return
    }

    try {
      new URL(trimmed)
    } catch {
      setUrlError('Please enter a valid URL starting with https://')
      return
    }

    const platform = selectedPlatform ?? detectedPlatform
    if (!platform) {
      setUrlError('Could not detect platform. Please select one below.')
      return
    }

    if (!campaign.platforms.includes(platform)) {
      setUrlError(
        `${getPlatformLabel(platform)} is not supported for this campaign. Supported: ${campaign.platforms.map((p) => PLATFORM_LABELS[p] ?? p).join(', ')}`
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

  const effectivePlatform = selectedPlatform ?? detectedPlatform

  // ── Done state ─────────────────────────────────────────────────────────────
  if (step === 'done') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <nav className="border-b bg-background">
          <div className="max-w-lg mx-auto px-4 py-3">
            <span className="font-bold text-lg">Content Rewards</span>
          </div>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold">Submission received!</h1>
          <p className="text-muted-foreground max-w-xs">
            Your content is being verified. We&apos;ll notify you once it&apos;s approved and
            tracking begins.
          </p>
          <div className="pt-2 flex flex-col gap-2 w-full max-w-xs">
            <Link href="/my-campaigns" className={buttonVariants({ size: 'lg' }) + ' w-full text-center'}>
              View My Campaigns
            </Link>
            <Link
              href="/discover"
              className={buttonVariants({ variant: 'outline', size: 'lg' }) + ' w-full text-center'}
            >
              Discover More
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href={`/campaigns/${campaign.slug}`}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            ← Back
          </Link>
          <span className="text-sm font-medium truncate text-muted-foreground">
            {campaign.organization.name} · {campaign.name}
          </span>
        </div>
      </nav>

      <main className="max-w-lg mx-auto px-4 py-5 pb-36 space-y-5">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {(['brief', 'url', 'confirm'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s
                    ? 'bg-primary text-primary-foreground'
                    : ['url', 'confirm'].indexOf(step) > ['url', 'confirm'].indexOf(s)
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i + 1}
              </div>
              {i < 2 && <div className="h-px w-6 bg-border" />}
            </div>
          ))}
          <span className="ms-2 text-sm text-muted-foreground">
            {step === 'brief' ? 'Review Brief' : step === 'url' ? 'Submit URL' : 'Confirm'}
          </span>
        </div>

        {/* ── Step 1: Brief ──────────────────────────────────────────────── */}
        {step === 'brief' && (
          <>
            <div>
              <h1 className="text-xl font-bold">Review the brief</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Read carefully before creating your content.
              </p>
            </div>

            {/* Reward reminder */}
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">You can earn up to</p>
                  <p className="text-xl font-bold text-primary">
                    {campaign.maxCreatorPayout
                      ? `SAR ${parseFloat(campaign.maxCreatorPayout).toLocaleString()}`
                      : '—'}
                  </p>
                </div>
                {campaign.cpm && (
                  <div className="text-end">
                    <p className="text-xs text-muted-foreground">Rate</p>
                    <p className="font-semibold">SAR {campaign.cpm} CPM</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Platforms */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Supported Platforms
              </p>
              <div className="flex flex-wrap gap-2">
                {campaign.platforms.map((p) => (
                  <Badge key={p} variant="secondary">
                    {PLATFORM_LABELS[p] ?? p}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Content Brief */}
            {campaign.contentBrief && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Content Brief
                </p>
                <div className="rounded-xl bg-muted/50 border p-4 text-sm leading-relaxed whitespace-pre-wrap">
                  {campaign.contentBrief}
                </div>
              </div>
            )}

            {/* Do / Don't */}
            {(campaign.contentDos.length > 0 || campaign.contentDonts.length > 0) && (
              <div className="grid grid-cols-2 gap-3">
                {campaign.contentDos.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Do</p>
                    <ul className="space-y-1.5">
                      {campaign.contentDos.map((d) => (
                        <li key={d} className="flex items-start gap-1.5 text-xs">
                          <span className="text-green-600 font-bold mt-0.5 shrink-0">✓</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {campaign.contentDonts.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Don&apos;t</p>
                    <ul className="space-y-1.5">
                      {campaign.contentDonts.map((d) => (
                        <li key={d} className="flex items-start gap-1.5 text-xs">
                          <span className="text-destructive font-bold mt-0.5 shrink-0">✗</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Required tags */}
            {(campaign.requiredHashtags.length > 0 || campaign.requiredMentions.length > 0) && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Required in your post
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {campaign.requiredHashtags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 text-primary px-2.5 py-1 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {campaign.requiredMentions.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="h-2" />
          </>
        )}

        {/* ── Step 2: URL ────────────────────────────────────────────────── */}
        {step === 'url' && (
          <>
            <div>
              <h1 className="text-xl font-bold">Paste your post URL</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Publish your content first, then come back and paste the link.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="content-url" className="text-sm font-medium">
                Content URL
              </label>
              <Input
                id="content-url"
                type="url"
                placeholder="https://www.tiktok.com/@you/video/..."
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className={urlError ? 'border-destructive' : ''}
              />
              {urlError && (
                <p className="text-xs text-destructive">{urlError}</p>
              )}
            </div>

            {/* Auto-detected platform */}
            {detectedPlatform && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2.5 text-sm text-green-800">
                <span className="font-medium">✓</span>
                <span>Detected: <strong>{getPlatformLabel(detectedPlatform)}</strong></span>
              </div>
            )}

            {/* Manual platform selector — shown when URL entered but no match, or if user wants to override */}
            {url.trim() && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  {detectedPlatform ? 'Platform (auto-detected)' : 'Select platform'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {campaign.platforms.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSelectedPlatform(p as SocialPlatform)}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-medium text-start transition-colors ${
                        (selectedPlatform ?? detectedPlatform) === p
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      {PLATFORM_LABELS[p] ?? p}
                      <span className="block text-xs font-normal text-muted-foreground mt-0.5 truncate">
                        {getPlatformExample(p as SocialPlatform).split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {submitError && (
              <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {submitError}
              </div>
            )}
          </>
        )}

        {/* ── Step 3: Confirm ────────────────────────────────────────────── */}
        {step === 'confirm' && (
          <>
            <div>
              <h1 className="text-xl font-bold">Confirm submission</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Review your details before submitting. You cannot change the URL after submission.
              </p>
            </div>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Campaign</p>
                  <p className="font-medium">{campaign.name}</p>
                  <p className="text-xs text-muted-foreground">{campaign.organization.name}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Platform</p>
                  <Badge variant="secondary">
                    {effectivePlatform ? (PLATFORM_LABELS[effectivePlatform] ?? effectivePlatform) : '—'}
                  </Badge>
                </div>

                <Separator />

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Content URL</p>
                  <p className="text-sm break-all font-mono text-primary">{url.trim()}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Reward rate</p>
                    <p className="font-medium">
                      {campaign.cpm ? `SAR ${campaign.cpm} CPM` : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Max earning</p>
                    <p className="font-medium">
                      {campaign.maxCreatorPayout
                        ? `SAR ${parseFloat(campaign.maxCreatorPayout).toLocaleString()}`
                        : '—'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground">
              By submitting, you confirm this is your original content, it follows the campaign
              brief, and includes all required hashtags and mentions. False submissions may result
              in account suspension.
            </p>

            {submitError && (
              <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {submitError}
              </div>
            )}
          </>
        )}
      </main>

      {/* Sticky bottom actions */}
      <div className="fixed bottom-0 inset-x-0 border-t bg-background/95 backdrop-blur">
        <div className="max-w-lg mx-auto px-4 py-4">
          {step === 'brief' && (
            <div className="flex gap-3">
              <Link
                href={`/campaigns/${campaign.slug}`}
                className={buttonVariants({ variant: 'outline' }) + ' flex-1 text-center'}
              >
                Back
              </Link>
              <button
                onClick={() => {
                  if (isNotActive) return
                  setStep('url')
                }}
                disabled={isNotActive}
                className={
                  buttonVariants() +
                  ' flex-1 disabled:opacity-50 disabled:pointer-events-none'
                }
              >
                {isNotActive ? `Campaign ${campaign.status.toLowerCase()}` : 'I understand — continue'}
              </button>
            </div>
          )}

          {step === 'url' && (
            <div className="flex gap-3">
              <button
                onClick={() => setStep('brief')}
                className={buttonVariants({ variant: 'outline' }) + ' flex-1'}
              >
                Back
              </button>
              <button
                onClick={handleUrlNext}
                disabled={!url.trim()}
                className={
                  buttonVariants() +
                  ' flex-1 disabled:opacity-50 disabled:pointer-events-none'
                }
              >
                Review submission
              </button>
            </div>
          )}

          {step === 'confirm' && (
            <div className="flex gap-3">
              <button
                onClick={() => setStep('url')}
                className={buttonVariants({ variant: 'outline' }) + ' flex-1'}
                disabled={isPending}
              >
                Edit
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className={
                  buttonVariants() +
                  ' flex-1 disabled:opacity-60 disabled:pointer-events-none'
                }
              >
                {isPending ? 'Submitting...' : 'Submit content'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
