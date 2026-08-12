'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Flame,
  GameController,
  Desktop,
  BowlFood,
  TShirt,
  Sparkle,
  Airplane,
  Trophy,
  GraduationCap,
  CurrencyCircleDollar,
  Question,
  Heart,
  FilmSlate,
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  Check,
  Warning,
} from '@phosphor-icons/react'

// ── Types ──────────────────────────────────────────────────────────────────────

type CampaignCategory =
  | 'LIFESTYLE' | 'ENTERTAINMENT' | 'GAMING' | 'TECHNOLOGY'
  | 'FOOD' | 'FASHION' | 'BEAUTY' | 'TRAVEL' | 'SPORTS'
  | 'EDUCATION' | 'FINANCE' | 'OTHER'

type RewardModel = 'CPM' | 'CPV' | 'CPA' | 'FIXED' | 'HYBRID' | 'MILESTONE'
type SocialPlatform = 'TIKTOK' | 'INSTAGRAM' | 'YOUTUBE' | 'X'

interface FormData {
  // Step 1
  name: string
  category: CampaignCategory | ''
  description: string
  objective: string
  // Step 2
  platforms: SocialPlatform[]
  // Step 3
  minFollowers: number
  countries: string[]
  languages: string[]
  // Step 4
  contentBrief: string
  contentDos: string[]
  contentDonts: string[]
  requiredHashtags: string[]
  requiredMentions: string[]
  // Step 5
  coverUrl: string
  // Step 6
  rewardModel: RewardModel | ''
  cpm: string
  minPayout: string
  maxCreatorPayout: string
  // Step 7
  totalBudget: string
  maxSubmissions: string
  startDate: string
  endDate: string
}

const INITIAL_FORM: FormData = {
  name: '',
  category: '',
  description: '',
  objective: '',
  platforms: [],
  minFollowers: 0,
  countries: ['SA'],
  languages: ['Arabic'],
  contentBrief: '',
  contentDos: [''],
  contentDonts: [''],
  requiredHashtags: [],
  requiredMentions: [],
  coverUrl: '',
  rewardModel: '',
  cpm: '',
  minPayout: '0',
  maxCreatorPayout: '',
  totalBudget: '',
  maxSubmissions: '',
  startDate: '',
  endDate: '',
}

// ── Config ─────────────────────────────────────────────────────────────────────

const STEPS = [
  'Campaign Info',
  'Platforms',
  'Requirements',
  'Content Brief',
  'Assets',
  'Reward',
  'Budget & Schedule',
  'Review & Launch',
]

const CATEGORIES: { value: CampaignCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'LIFESTYLE',      label: 'Lifestyle',      icon: <Heart size={18} weight="fill" /> },
  { value: 'ENTERTAINMENT',  label: 'Entertainment',  icon: <FilmSlate size={18} weight="fill" /> },
  { value: 'GAMING',         label: 'Gaming',         icon: <GameController size={18} weight="fill" /> },
  { value: 'TECHNOLOGY',     label: 'Technology',     icon: <Desktop size={18} weight="fill" /> },
  { value: 'FOOD',           label: 'Food',           icon: <BowlFood size={18} weight="fill" /> },
  { value: 'FASHION',        label: 'Fashion',        icon: <TShirt size={18} weight="fill" /> },
  { value: 'BEAUTY',         label: 'Beauty',         icon: <Sparkle size={18} weight="fill" /> },
  { value: 'TRAVEL',         label: 'Travel',         icon: <Airplane size={18} weight="fill" /> },
  { value: 'SPORTS',         label: 'Sports',         icon: <Trophy size={18} weight="fill" /> },
  { value: 'EDUCATION',      label: 'Education',      icon: <GraduationCap size={18} weight="fill" /> },
  { value: 'FINANCE',        label: 'Finance',        icon: <CurrencyCircleDollar size={18} weight="fill" /> },
  { value: 'OTHER',          label: 'Other',          icon: <Question size={18} weight="fill" /> },
]

const PLATFORMS: { value: SocialPlatform; label: string; icon: string; color: string }[] = [
  { value: 'TIKTOK',    label: 'TikTok',    icon: '🎵', color: 'from-black to-zinc-900' },
  { value: 'INSTAGRAM', label: 'Instagram', icon: '📸', color: 'from-purple-900 to-pink-900' },
  { value: 'YOUTUBE',   label: 'YouTube',   icon: '▶️', color: 'from-red-900 to-red-800' },
  { value: 'X',         label: 'X',         icon: '✕',  color: 'from-zinc-900 to-zinc-800' },
]

const COUNTRIES: { code: string; label: string }[] = [
  { code: 'SA',        label: '🇸🇦 Saudi Arabia' },
  { code: 'AE',        label: '🇦🇪 UAE' },
  { code: 'KW',        label: '🇰🇼 Kuwait' },
  { code: 'QA',        label: '🇶🇦 Qatar' },
  { code: 'BH',        label: '🇧🇭 Bahrain' },
  { code: 'OM',        label: '🇴🇲 Oman' },
  { code: 'EG',        label: '🇪🇬 Egypt' },
  { code: 'WORLDWIDE', label: '🌍 Worldwide' },
]

const LANGUAGES = ['Arabic', 'English']

const REWARD_MODELS: { value: RewardModel; label: string; desc: string }[] = [
  { value: 'CPM',   label: 'CPM',   desc: 'Pay per 1,000 verified views' },
  { value: 'CPV',   label: 'CPV',   desc: 'Pay per individual verified view' },
  { value: 'CPA',   label: 'CPA',   desc: 'Pay per conversion or action' },
  { value: 'FIXED', label: 'Fixed', desc: 'Fixed payment per approved submission' },
]

// ── Shared UI ──────────────────────────────────────────────────────────────────

const labelCls = 'text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500 mb-3 block'
const inputCls =
  'w-full rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] px-4 py-3 text-[15px] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-600'
const textareaCls = inputCls + ' resize-none'
const cardSelectedCls =
  'border-green-500 bg-green-500/10 ring-1 ring-green-500'
const cardCls =
  'border border-zinc-200 dark:border-white/[0.1] rounded-xl cursor-pointer transition-all hover:border-zinc-400 dark:hover:border-white/[0.2]'

// ── Step Indicator ─────────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1
        const done = step < current
        const active = step === current
        return (
          <div key={step} className="flex items-center gap-2 shrink-0">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${
                done
                  ? 'bg-green-500 text-black'
                  : active
                  ? 'bg-green-500 text-black ring-4 ring-green-500/20'
                  : 'border border-zinc-300 dark:border-white/[0.15] text-zinc-500'
              }`}
            >
              {done ? <Check size={12} weight="bold" /> : step}
            </div>
            {i < total - 1 && (
              <div
                className={`h-px w-6 rounded-full transition-all ${
                  done ? 'bg-green-500' : 'bg-zinc-200 dark:bg-white/[0.1]'
                }`}
              />
            )}
          </div>
        )
      })}
      <div className="ms-3 text-[12px] text-zinc-500 shrink-0">
        Step {current} of {total} — {STEPS[current - 1]}
      </div>
    </div>
  )
}

// ── Tag Input ──────────────────────────────────────────────────────────────────

function TagInput({
  tags,
  onChange,
  placeholder,
}: {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}) {
  const [input, setInput] = useState('')

  function addTag(raw: string) {
    const parts = raw.split(/[\s,#@]+/).map((s) => s.trim()).filter(Boolean)
    if (parts.length === 0) return
    const next = [...new Set([...tags, ...parts])]
    onChange(next)
    setInput('')
  }

  function removeTag(idx: number) {
    onChange(tags.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2 min-h-[36px]">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-bold bg-zinc-100 dark:bg-white/[0.08] text-zinc-800 dark:text-zinc-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="text-zinc-400 hover:text-red-400 transition-colors"
            >
              <X size={10} weight="bold" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
            e.preventDefault()
            addTag(input)
          }
        }}
        onBlur={() => addTag(input)}
        placeholder={placeholder}
        className={inputCls}
      />
    </div>
  )
}

// ── Dynamic List ───────────────────────────────────────────────────────────────

function DynamicList({
  items,
  onChange,
  placeholder,
  addLabel,
  accentColor,
}: {
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
  addLabel: string
  accentColor: 'green' | 'red'
}) {
  function updateItem(idx: number, val: string) {
    const next = [...items]
    next[idx] = val
    onChange(next)
  }
  function removeItem(idx: number) {
    onChange(items.filter((_, i) => i !== idx))
  }
  function addItem() {
    onChange([...items, ''])
  }

  const addBtnCls =
    accentColor === 'green'
      ? 'text-green-500 hover:text-green-400 border-green-500/40 hover:border-green-500'
      : 'text-red-500 hover:text-red-400 border-red-500/40 hover:border-red-500'

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            placeholder={placeholder}
            className={inputCls}
          />
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="shrink-0 w-10 h-12 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-white/[0.1] text-zinc-400 hover:text-red-400 hover:border-red-400 transition-all"
          >
            <X size={14} weight="bold" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg border transition-all ${addBtnCls}`}
      >
        <Plus size={12} weight="bold" />
        {addLabel}
      </button>
    </div>
  )
}

// ── Review Row ─────────────────────────────────────────────────────────────────

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-3 border-b border-zinc-100 dark:border-white/[0.06] last:border-0">
      <span className="w-36 shrink-0 text-[12px] font-bold text-zinc-500">{label}</span>
      <span className="text-[13px] text-zinc-900 dark:text-white break-words min-w-0">{value || '—'}</span>
    </div>
  )
}

// ── Main Wizard ────────────────────────────────────────────────────────────────

interface Props {
  orgId: string | null
}

export default function NewCampaignWizard({ orgId }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = useCallback(<K extends keyof FormData>(key: K, val: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }))
  }, [])

  // ── Validation per step ────────────────────────────────────────────────────

  function stepValid(s: number): boolean {
    switch (s) {
      case 1: return form.name.trim().length > 0 && form.category !== ''
      case 2: return form.platforms.length > 0
      case 3: return form.countries.length > 0 && form.languages.length > 0
      case 4: return true
      case 5: return true
      case 6: return form.rewardModel !== '' && parseFloat(form.totalBudget || '0') >= 0
      case 7: return parseFloat(form.totalBudget || '0') > 0
      default: return true
    }
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function submit(action: 'draft' | 'launch') {
    if (!orgId) {
      setError('No organization found. Please set up your organization first.')
      return
    }
    setSubmitting(true)
    setError(null)

    const payload = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim() || undefined,
      objective: form.objective.trim() || undefined,
      platforms: form.platforms,
      minFollowers: form.minFollowers,
      countries: form.countries,
      languages: form.languages,
      requiredHashtags: form.requiredHashtags,
      requiredMentions: form.requiredMentions,
      contentBrief: form.contentBrief.trim() || undefined,
      contentDos: form.contentDos.filter(Boolean),
      contentDonts: form.contentDonts.filter(Boolean),
      rewardModel: form.rewardModel,
      cpm: form.cpm ? parseFloat(form.cpm) : undefined,
      minPayout: parseFloat(form.minPayout || '0'),
      maxCreatorPayout: form.maxCreatorPayout ? parseFloat(form.maxCreatorPayout) : undefined,
      totalBudget: parseFloat(form.totalBudget),
      maxSubmissions: form.maxSubmissions ? parseInt(form.maxSubmissions, 10) : undefined,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      coverUrl: form.coverUrl.trim() || undefined,
    }

    try {
      const res = await fetch('/api/brand/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string }
        setError(body.error ?? `Error ${res.status}`)
        return
      }

      // If launch: in a real flow, you'd PATCH status to ACTIVE afterward.
      // For now, both draft and launch go to DRAFT (API default).
      // Navigate to campaign list.
      router.push('/brand/campaigns')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Step renders ───────────────────────────────────────────────────────────

  function renderStep() {
    switch (step) {
      case 1: return <Step1 form={form} update={update} />
      case 2: return <Step2 form={form} update={update} />
      case 3: return <Step3 form={form} update={update} />
      case 4: return <Step4 form={form} update={update} />
      case 5: return <Step5 form={form} update={update} />
      case 6: return <Step6 form={form} update={update} />
      case 7: return <Step7 form={form} update={update} />
      case 8: return <Step8 form={form} onDraft={() => submit('draft')} onLaunch={() => submit('launch')} submitting={submitting} error={error} />
      default: return null
    }
  }

  return (
    <div className="max-w-[640px] mx-auto px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.18em] mb-2">Brand</p>
        <h1 className="text-[36px] font-black text-zinc-900 dark:text-white tracking-[-0.03em] leading-none">
          New Campaign
        </h1>
      </div>

      <StepIndicator current={step} total={STEPS.length} />

      {/* Step content */}
      <div className="mb-8">{renderStep()}</div>

      {/* Navigation — hide on step 8 (has its own buttons) */}
      {step < 8 && (
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-white/[0.1] px-5 py-3 text-[13px] font-bold text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-white/[0.25] hover:text-zinc-900 dark:hover:text-white transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <ArrowLeft size={14} weight="bold" />
            Back
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
            disabled={!stepValid(step)}
            className="inline-flex items-center gap-2 rounded-xl bg-green-500 hover:bg-green-400 text-black px-6 py-3 text-[13px] font-black transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Next
            <ArrowRight size={14} weight="bold" />
          </button>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Campaign Info
// ─────────────────────────────────────────────────────────────────────────────

function Step1({
  form,
  update,
}: {
  form: FormData
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void
}) {
  return (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <label className={labelCls}>Campaign Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="e.g. Riyadh Season 2025"
          className={inputCls}
          maxLength={200}
        />
      </div>

      {/* Category */}
      <div>
        <label className={labelCls}>Category *</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => {
            const selected = form.category === cat.value
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => update('category', cat.value)}
                className={`${cardCls} p-3 flex flex-col items-center gap-1.5 text-center ${selected ? cardSelectedCls : ''}`}
              >
                <span className={selected ? 'text-green-400' : 'text-zinc-500'}>{cat.icon}</span>
                <span className={`text-[11px] font-bold ${selected ? 'text-green-400' : 'text-zinc-600 dark:text-zinc-400'}`}>
                  {cat.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Brief overview of the campaign..."
          className={textareaCls}
          maxLength={5000}
        />
      </div>

      {/* Objective */}
      <div>
        <label className={labelCls}>Campaign Objective</label>
        <textarea
          rows={2}
          value={form.objective}
          onChange={(e) => update('objective', e.target.value)}
          placeholder="What do you want to achieve?"
          className={textareaCls}
          maxLength={2000}
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Platforms
// ─────────────────────────────────────────────────────────────────────────────

function Step2({
  form,
  update,
}: {
  form: FormData
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void
}) {
  function toggle(p: SocialPlatform) {
    const current = form.platforms
    if (current.includes(p)) {
      update('platforms', current.filter((x) => x !== p))
    } else {
      update('platforms', [...current, p])
    }
  }

  return (
    <div>
      <label className={labelCls}>Select Platforms * (choose at least one)</label>
      <div className="grid grid-cols-2 gap-3">
        {PLATFORMS.map((p) => {
          const selected = form.platforms.includes(p.value)
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => toggle(p.value)}
              className={`${cardCls} p-5 flex flex-col items-center gap-3 ${selected ? cardSelectedCls : ''}`}
            >
              <span className="text-3xl leading-none">{p.icon}</span>
              <span className={`text-[15px] font-black ${selected ? 'text-green-400' : 'text-zinc-700 dark:text-white'}`}>
                {p.label}
              </span>
              {selected && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-green-500">
                  <Check size={10} weight="bold" />
                  Selected
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — Creator Requirements
// ─────────────────────────────────────────────────────────────────────────────

function Step3({
  form,
  update,
}: {
  form: FormData
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void
}) {
  function toggleCountry(code: string) {
    if (form.countries.includes(code)) {
      if (form.countries.length === 1) return
      update('countries', form.countries.filter((c) => c !== code))
    } else {
      update('countries', [...form.countries, code])
    }
  }

  function toggleLanguage(lang: string) {
    if (form.languages.includes(lang)) {
      if (form.languages.length === 1) return
      update('languages', form.languages.filter((l) => l !== lang))
    } else {
      update('languages', [...form.languages, lang])
    }
  }

  return (
    <div className="space-y-6">
      {/* Min followers */}
      <div>
        <label className={labelCls}>Minimum Followers</label>
        <input
          type="number"
          min={0}
          value={form.minFollowers}
          onChange={(e) => update('minFollowers', Math.max(0, parseInt(e.target.value || '0', 10)))}
          className={inputCls}
          placeholder="0"
        />
        <p className="mt-1.5 text-[12px] text-zinc-500">Set to 0 for no minimum requirement</p>
      </div>

      {/* Countries */}
      <div>
        <label className={labelCls}>Target Countries *</label>
        <div className="flex flex-wrap gap-2">
          {COUNTRIES.map((c) => {
            const sel = form.countries.includes(c.code)
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => toggleCountry(c.code)}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-bold border transition-all ${
                  sel
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : 'border-zinc-200 dark:border-white/[0.1] text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-white/[0.25]'
                }`}
              >
                {c.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Languages */}
      <div>
        <label className={labelCls}>Content Languages *</label>
        <div className="flex gap-2">
          {LANGUAGES.map((lang) => {
            const sel = form.languages.includes(lang)
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguage(lang)}
                className={`px-4 py-2 rounded-lg text-[13px] font-bold border transition-all ${
                  sel
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : 'border-zinc-200 dark:border-white/[0.1] text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-white/[0.25]'
                }`}
              >
                {lang}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — Content Brief
// ─────────────────────────────────────────────────────────────────────────────

function Step4({
  form,
  update,
}: {
  form: FormData
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void
}) {
  return (
    <div className="space-y-6">
      {/* Content brief */}
      <div>
        <label className={labelCls}>Content Brief</label>
        <textarea
          rows={5}
          value={form.contentBrief}
          onChange={(e) => update('contentBrief', e.target.value)}
          placeholder="Describe what creators should make, the tone, style, key messages..."
          className={textareaCls}
          maxLength={10000}
        />
      </div>

      {/* Dos */}
      <div>
        <label className={labelCls}>Content Do&apos;s</label>
        <DynamicList
          items={form.contentDos}
          onChange={(val) => update('contentDos', val)}
          placeholder="e.g. Show the product clearly"
          addLabel="Add Do"
          accentColor="green"
        />
      </div>

      {/* Don'ts */}
      <div>
        <label className={labelCls}>Content Don&apos;ts</label>
        <DynamicList
          items={form.contentDonts}
          onChange={(val) => update('contentDonts', val)}
          placeholder="e.g. Do not mention competitors"
          addLabel="Add Don't"
          accentColor="red"
        />
      </div>

      {/* Hashtags */}
      <div>
        <label className={labelCls}>Required Hashtags</label>
        <TagInput
          tags={form.requiredHashtags}
          onChange={(val) => update('requiredHashtags', val)}
          placeholder="Type hashtag and press Enter or comma..."
        />
      </div>

      {/* Mentions */}
      <div>
        <label className={labelCls}>Required Mentions</label>
        <TagInput
          tags={form.requiredMentions}
          onChange={(val) => update('requiredMentions', val)}
          placeholder="Type @handle and press Enter or comma..."
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 — Assets
// ─────────────────────────────────────────────────────────────────────────────

function Step5({
  form,
  update,
}: {
  form: FormData
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void
}) {
  const isImageUrl = (url: string) =>
    /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|avif|svg)(\?.*)?$/i.test(url)

  return (
    <div className="space-y-6">
      <div>
        <label className={labelCls}>Campaign Cover Image URL</label>
        <input
          type="url"
          value={form.coverUrl}
          onChange={(e) => update('coverUrl', e.target.value)}
          placeholder="https://images.unsplash.com/photo-..."
          className={inputCls}
        />
        <p className="mt-1.5 text-[12px] text-zinc-500">
          Paste a direct image URL (Unsplash, your CDN, etc.)
        </p>
      </div>

      {form.coverUrl && isImageUrl(form.coverUrl) && (
        <div>
          <label className={labelCls}>Preview</label>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={form.coverUrl}
            alt="Campaign cover preview"
            className="w-full max-h-48 object-cover rounded-xl border border-zinc-200 dark:border-white/[0.1]"
          />
        </div>
      )}

      {form.coverUrl && !isImageUrl(form.coverUrl) && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[13px] text-amber-500">
          <Warning size={16} weight="fill" />
          URL doesn&apos;t look like a direct image link. Make sure it ends in .jpg, .png, .webp, etc.
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6 — Reward
// ─────────────────────────────────────────────────────────────────────────────

function Step6({
  form,
  update,
}: {
  form: FormData
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void
}) {
  const cpmVal = parseFloat(form.cpm || '0')
  const estimatedViews = 100000
  const estimatedEarning = cpmVal > 0 ? ((estimatedViews / 1000) * cpmVal).toFixed(2) : null

  return (
    <div className="space-y-6">
      {/* Reward model */}
      <div>
        <label className={labelCls}>Reward Model *</label>
        <div className="grid grid-cols-2 gap-3">
          {REWARD_MODELS.map((rm) => {
            const selected = form.rewardModel === rm.value
            return (
              <button
                key={rm.value}
                type="button"
                onClick={() => update('rewardModel', rm.value)}
                className={`${cardCls} p-4 text-start ${selected ? cardSelectedCls : ''}`}
              >
                <p className={`text-[15px] font-black mb-1 ${selected ? 'text-green-400' : 'text-zinc-900 dark:text-white'}`}>
                  {rm.label}
                </p>
                <p className={`text-[12px] ${selected ? 'text-green-500/80' : 'text-zinc-500'}`}>
                  {rm.desc}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* CPM input — only if CPM selected */}
      {form.rewardModel === 'CPM' && (
        <div>
          <label className={labelCls}>CPM Rate (SAR per 1,000 verified views)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-zinc-500">SAR</span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={form.cpm}
              onChange={(e) => update('cpm', e.target.value)}
              placeholder="0.00"
              className={inputCls + ' pl-14'}
            />
          </div>
          {estimatedEarning && (
            <div className="mt-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-[13px] text-green-500">
              A creator with 100K verified views earns <strong>SAR {estimatedEarning}</strong>
            </div>
          )}
        </div>
      )}

      {/* Min payout */}
      <div>
        <label className={labelCls}>Minimum Payout per Creator (SAR)</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-zinc-500">SAR</span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={form.minPayout}
            onChange={(e) => update('minPayout', e.target.value)}
            placeholder="0.00"
            className={inputCls + ' pl-14'}
          />
        </div>
      </div>

      {/* Max creator payout */}
      <div>
        <label className={labelCls}>Maximum Payout per Creator (SAR) — optional</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-zinc-500">SAR</span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={form.maxCreatorPayout}
            onChange={(e) => update('maxCreatorPayout', e.target.value)}
            placeholder="No limit"
            className={inputCls + ' pl-14'}
          />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 7 — Budget & Schedule
// ─────────────────────────────────────────────────────────────────────────────

function Step7({
  form,
  update,
}: {
  form: FormData
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void
}) {
  const budget = parseFloat(form.totalBudget || '0')
  const cpm = parseFloat(form.cpm || '0')
  const estimatedViews =
    budget > 0 && cpm > 0 ? Math.floor((budget / cpm) * 1000) : null

  return (
    <div className="space-y-6">
      {/* Total budget */}
      <div>
        <label className={labelCls}>Total Campaign Budget (SAR) *</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] font-black text-zinc-400">SAR</span>
          <input
            type="number"
            min={0}
            step={100}
            value={form.totalBudget}
            onChange={(e) => update('totalBudget', e.target.value)}
            placeholder="10,000"
            className="w-full rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] pl-16 pr-4 py-4 text-[28px] font-black text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
          />
        </div>
        {estimatedViews !== null && (
          <div className="mt-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-[13px] text-green-500">
            At SAR {form.cpm} CPM, this budget supports approximately{' '}
            <strong>{estimatedViews.toLocaleString()}</strong> verified views
          </div>
        )}
      </div>

      {/* Max submissions */}
      <div>
        <label className={labelCls}>Max Submissions — optional</label>
        <input
          type="number"
          min={1}
          value={form.maxSubmissions}
          onChange={(e) => update('maxSubmissions', e.target.value)}
          placeholder="Unlimited"
          className={inputCls}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Start Date</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => update('startDate', e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>End Date</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => update('endDate', e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 8 — Review & Launch
// ─────────────────────────────────────────────────────────────────────────────

function Step8({
  form,
  onDraft,
  onLaunch,
  submitting,
  error,
}: {
  form: FormData
  onDraft: () => void
  onLaunch: () => void
  submitting: boolean
  error: string | null
}) {
  const categoryLabel = CATEGORIES.find((c) => c.value === form.category)?.label ?? form.category
  const platformLabels = form.platforms
    .map((p) => PLATFORMS.find((x) => x.value === p)?.label ?? p)
    .join(', ')
  const rewardLabel = REWARD_MODELS.find((r) => r.value === form.rewardModel)?.label ?? form.rewardModel

  const countryLabels = form.countries
    .map((code) => COUNTRIES.find((c) => c.code === code)?.label ?? code)
    .join(', ')

  const dos = form.contentDos.filter(Boolean)
  const donts = form.contentDonts.filter(Boolean)

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 px-4 py-4 rounded-xl bg-red-500/10 border border-red-500/30 text-[13px] text-red-500">
          <Warning size={16} weight="fill" className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary cards */}
      <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-100 dark:border-white/[0.06]">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">Campaign Info</p>
        </div>
        <div className="px-5 py-2">
          <ReviewRow label="Name" value={form.name} />
          <ReviewRow label="Category" value={categoryLabel} />
          <ReviewRow label="Description" value={form.description || '—'} />
          <ReviewRow label="Objective" value={form.objective || '—'} />
        </div>
      </div>

      <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-100 dark:border-white/[0.06]">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">Distribution</p>
        </div>
        <div className="px-5 py-2">
          <ReviewRow label="Platforms" value={platformLabels} />
          <ReviewRow label="Countries" value={countryLabels} />
          <ReviewRow label="Languages" value={form.languages.join(', ')} />
          <ReviewRow label="Min Followers" value={form.minFollowers.toLocaleString()} />
        </div>
      </div>

      <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-100 dark:border-white/[0.06]">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">Content</p>
        </div>
        <div className="px-5 py-2">
          <ReviewRow label="Brief" value={form.contentBrief || '—'} />
          <ReviewRow label="Do's" value={dos.length > 0 ? dos.join(' · ') : '—'} />
          <ReviewRow label="Don'ts" value={donts.length > 0 ? donts.join(' · ') : '—'} />
          <ReviewRow
            label="Hashtags"
            value={form.requiredHashtags.length > 0 ? form.requiredHashtags.join(', ') : '—'}
          />
          <ReviewRow
            label="Mentions"
            value={form.requiredMentions.length > 0 ? form.requiredMentions.join(', ') : '—'}
          />
        </div>
      </div>

      <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-100 dark:border-white/[0.06]">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">Reward & Budget</p>
        </div>
        <div className="px-5 py-2">
          <ReviewRow label="Reward Model" value={rewardLabel} />
          {form.cpm && <ReviewRow label="CPM Rate" value={`SAR ${form.cpm}`} />}
          <ReviewRow label="Min Payout" value={`SAR ${form.minPayout}`} />
          {form.maxCreatorPayout && (
            <ReviewRow label="Max Payout" value={`SAR ${form.maxCreatorPayout}`} />
          )}
          <ReviewRow label="Total Budget" value={`SAR ${parseFloat(form.totalBudget || '0').toLocaleString()}`} />
          {form.maxSubmissions && (
            <ReviewRow label="Max Submissions" value={parseInt(form.maxSubmissions, 10).toLocaleString()} />
          )}
          {form.startDate && <ReviewRow label="Start Date" value={form.startDate} />}
          {form.endDate && <ReviewRow label="End Date" value={form.endDate} />}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onDraft}
          disabled={submitting}
          className="flex-1 rounded-xl border border-zinc-200 dark:border-white/[0.1] px-5 py-3 text-[14px] font-black text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-white/[0.25] hover:text-zinc-900 dark:hover:text-white transition-all disabled:opacity-40 disabled:pointer-events-none"
        >
          {submitting ? 'Saving…' : 'Save as Draft'}
        </button>
        <button
          type="button"
          onClick={onLaunch}
          disabled={submitting}
          className="flex-1 rounded-xl bg-green-500 hover:bg-green-400 text-black px-5 py-3 text-[14px] font-black transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          {submitting ? 'Launching…' : 'Launch Campaign'}
        </button>
      </div>

      <p className="text-[12px] text-zinc-500 text-center">
        Both actions save a DRAFT. You can activate the campaign from the campaign list.
      </p>
    </div>
  )
}
