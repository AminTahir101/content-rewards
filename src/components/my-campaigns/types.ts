export type SubmissionStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'VERIFYING'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'TRACKING'
  | 'PERFORMANCE_LOCKED'
  | 'PAYOUT_PENDING'
  | 'PAID'
  | 'REJECTED'
  | 'FLAGGED'
  | 'DISPUTED'
  | 'PAYMENT_HOLD'

export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'

export interface MyCampaignSubmission {
  id: string
  status: SubmissionStatus
  contentUrl: string
  earnedAmount: string | null
  submittedAt: string
  rejectionReason: string | null
}

export interface MyCampaignEntry {
  joinedAt: string
  campaign: {
    id: string
    name: string
    slug: string
    coverUrl: string | null
    category: string
    status: CampaignStatus
    cpm: string | null
    maxCreatorPayout: string | null
    endDate: string | null
    platforms: string[]
    organization: { name: string }
  }
  submission: MyCampaignSubmission | null
}

// Which tab a given entry belongs to
export type CampaignTab = 'active' | 'submitted' | 'completed' | 'issues'

export function getTab(entry: MyCampaignEntry): CampaignTab {
  const { submission, campaign } = entry

  if (!submission) {
    // Joined but no submission yet
    if (campaign.status === 'COMPLETED' || campaign.status === 'CANCELLED') return 'completed'
    return 'active'
  }

  const s = submission.status
  if (s === 'PAID') return 'completed'
  if (s === 'PERFORMANCE_LOCKED' || s === 'PAYOUT_PENDING') return 'completed'
  if (s === 'REJECTED' || s === 'FLAGGED' || s === 'DISPUTED' || s === 'PAYMENT_HOLD') return 'issues'
  if (
    s === 'SUBMITTED' ||
    s === 'VERIFYING' ||
    s === 'PENDING_REVIEW' ||
    s === 'APPROVED' ||
    s === 'TRACKING'
  )
    return 'submitted'

  return 'active'
}

// What the creator should do next
export interface NextAction {
  label: string
  href: string
  variant: 'default' | 'outline' | 'secondary'
}

export function getNextAction(entry: MyCampaignEntry): NextAction {
  const { submission, campaign } = entry
  const base = `/campaigns/${campaign.slug}`

  if (!submission) {
    if (campaign.status !== 'ACTIVE') {
      return { label: 'View Campaign', href: base, variant: 'outline' }
    }
    return { label: 'Submit Content', href: `${base}/submit`, variant: 'default' }
  }

  const s = submission.status
  if (s === 'REJECTED') {
    return { label: 'View Rejection', href: base, variant: 'outline' }
  }
  if (s === 'DISPUTED') {
    return { label: 'View Dispute', href: base, variant: 'outline' }
  }
  if (s === 'FLAGGED' || s === 'PAYMENT_HOLD') {
    return { label: 'View Issue', href: base, variant: 'outline' }
  }
  if (s === 'PAID') {
    return { label: 'View Earnings', href: '/earnings', variant: 'secondary' }
  }
  return { label: 'View Submission', href: base, variant: 'outline' }
}
