'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowRight, TrendUp, Users, FileText, CalendarBlank } from '@phosphor-icons/react'

// ── Types ──────────────────────────────────────────────────────────────────────

export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'

export interface CampaignRow {
  id: string
  name: string
  slug: string
  status: CampaignStatus
  rewardModel: string
  cpm: string | null
  totalBudget: string
  reservedBudget: string
  settledBudget: string
  maxCreatorPayout: string | null
  participantCount: number
  submissionCount: number
  category: string
  endDate: string | null
  createdAt: string
  platforms: Array<{ platform: string }>
}

interface Props {
  campaigns: CampaignRow[]
}

// ── Config ─────────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<CampaignStatus, string> = {
  ACTIVE:    'bg-green-500/10 text-green-400',
  PAUSED:    'bg-amber-500/10 text-amber-400',
  COMPLETED: 'bg-blue-500/10 text-blue-400',
  DRAFT:     'bg-zinc-500/10 text-zinc-400',
  CANCELLED: 'bg-red-500/10 text-red-400',
}

const PLATFORM_SHORT: Record<string, string> = {
  TIKTOK: 'TT', INSTAGRAM: 'IG', YOUTUBE: 'YT', X: 'X',
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmt(n: string | number): string {
  return Number(n).toLocaleString('en-SA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-SA', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Campaign Card ──────────────────────────────────────────────────────────────

function CampaignCard({ campaign: c }: { campaign: CampaignRow }) {
  const tb = useTranslations('brand')
  const tcs = useTranslations('campaigns.status')
  const cfg = { label: tcs(c.status), badge: STATUS_BADGE[c.status] ?? 'bg-zinc-500/10 text-zinc-400' }

  const total    = parseFloat(c.totalBudget)
  const settled  = parseFloat(c.settledBudget)
  const reserved = parseFloat(c.reservedBudget)
  const spent    = settled + reserved
  const pct      = total > 0 ? Math.min((spent / total) * 100, 100) : 0

  return (
    <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-colors overflow-hidden">
      {/* Status accent */}
      <div className={`h-px ${
        c.status === 'ACTIVE'
          ? 'bg-gradient-to-r from-green-500 to-emerald-400'
          : c.status === 'PAUSED'
            ? 'bg-amber-500/50'
            : c.status === 'COMPLETED'
              ? 'bg-blue-500/50'
              : 'bg-zinc-700/50'
      }`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {c.platforms.map((p) => (
                <span
                  key={p.platform}
                  className="text-[9px] font-black px-1.5 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.06] text-zinc-500"
                >
                  {PLATFORM_SHORT[p.platform] ?? p.platform.slice(0, 2)}
                </span>
              ))}
              <span className="text-[10px] text-zinc-600 capitalize">{c.category.toLowerCase()}</span>
            </div>
            <p className="text-[15px] font-black text-zinc-900 dark:text-white truncate">{c.name}</p>
          </div>
          <span className={`shrink-0 text-[11px] font-black px-2.5 py-0.5 rounded-md ${cfg.badge}`}>
            {cfg.label}
          </span>
        </div>

        {/* CPM row */}
        {c.cpm && (
          <div className="flex items-center gap-1 mb-3">
            <TrendUp size={12} className="text-green-500" weight="bold" />
            <span className="text-[12px] font-bold text-green-500">SAR {c.cpm} CPM</span>
          </div>
        )}

        {/* Budget bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-zinc-600">{tb('budgetUsed')}</span>
            <span className="text-[11px] font-bold text-zinc-900 dark:text-white">
              SAR {fmt(spent)} <span className="font-normal text-zinc-600">/ {fmt(total)}</span>
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.06] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1 text-[11px] text-zinc-600">
            <Users size={10} weight="fill" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-300">{fmt(c.participantCount)}</span>
            <span>{tb('creators')}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-zinc-600">
            <FileText size={10} weight="fill" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-300">{fmt(c.submissionCount)}</span>
            <span>{tb('submissions')}</span>
          </div>
          {c.endDate && (
            <div className="flex items-center gap-1 text-[11px] text-zinc-600 ms-auto">
              <CalendarBlank size={10} weight="fill" />
              <span>{fmtDate(c.endDate)}</span>
            </div>
          )}
        </div>

        {/* Action */}
        <Link
          href={`/brand/campaigns/${c.slug}`}
          className="inline-flex items-center gap-1.5 rounded-lg text-[12px] font-bold px-3.5 py-1.5 border border-black/[0.1] dark:border-white/[0.1] text-zinc-700 dark:text-white/70 hover:border-black/20 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-white transition-all"
        >
          {tb('viewCampaigns')}
          <ArrowRight size={11} weight="bold" />
        </Link>
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function CampaignListClient({ campaigns }: Props) {
  const tb = useTranslations('brand')
  const tc = useTranslations('common')
  const tcs = useTranslations('campaigns.status')
  const [activeFilter, setActiveFilter] = useState('')

  const FILTER_TABS: { value: string; label: string }[] = [
    { value: '',          label: tc('all')          },
    { value: 'ACTIVE',    label: tcs('ACTIVE')    },
    { value: 'PAUSED',    label: tcs('PAUSED')    },
    { value: 'COMPLETED', label: tcs('COMPLETED') },
    { value: 'DRAFT',     label: tcs('DRAFT')     },
  ]

  const filtered = activeFilter
    ? campaigns.filter((c) => c.status === activeFilter)
    : campaigns

  return (
    <div>
      {/* Filter tabs */}
      <div
        className="flex items-center gap-1 border-b border-black/[0.06] dark:border-white/[0.06] pb-px mb-6 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {FILTER_TABS.map((t) => {
          const active = activeFilter === t.value
          return (
            <button
              key={t.value}
              onClick={() => setActiveFilter(t.value)}
              className={`relative shrink-0 px-4 py-2.5 text-[13px] font-bold transition-colors ${
                active ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {t.label}
              {active && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-px bg-zinc-900 dark:bg-white" />
              )}
            </button>
          )
        })}
        <span className="ms-auto shrink-0 text-[12px] text-zinc-700 pb-2.5 ps-4">
          {filtered.length !== 1 ? tb('campaignCountPlural', { count: filtered.length }) : tb('campaignCount', { count: filtered.length })}
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl bg-surface border border-black/[0.06] dark:border-white/[0.06] px-8 py-20 text-center">
          <p className="text-[15px] font-black text-zinc-900 dark:text-white mb-1">{tb('noCampaigns')}</p>
          <p className="text-[13px] text-zinc-600">
            {activeFilter
              ? tb('noCampaignsFiltered', { status: tcs(activeFilter as CampaignStatus) })
              : tb('noCampaignsCreate')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      )}
    </div>
  )
}
