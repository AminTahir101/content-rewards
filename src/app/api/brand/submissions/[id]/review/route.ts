import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ReviewSchema = z.object({
  action: z.enum(['APPROVED', 'REJECTED', 'FLAGGED', 'HOLD']),
  reason: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
})

// Allowed transitions from brand review
const ALLOWED_TRANSITIONS: Record<string, string> = {
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  FLAGGED: 'FLAGGED',
  HOLD: 'PAYMENT_HOLD',
}

// States from which a brand can take action
const REVIEWABLE_STATES = ['PENDING_REVIEW', 'FLAGGED', 'PAYMENT_HOLD']

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (session.user.role !== 'BRAND' && session.user.role !== 'AGENCY' && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  const parsed = ReviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', issues: parsed.error.issues }, { status: 400 })
  }
  const { action, reason, notes } = parsed.data

  if (action === 'REJECTED' && !reason?.trim()) {
    return NextResponse.json({ error: 'A rejection reason is required' }, { status: 400 })
  }

  // Load submission and verify ownership
  const submission = await prisma.submission.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      campaign: {
        select: {
          organizationId: true,
        },
      },
    },
  })

  if (!submission) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
  }

  // Verify brand owns the campaign
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId: session.user.id,
      organizationId: submission.campaign.organizationId,
      isActive: true,
    },
  })
  if (!membership && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Validate state transition
  if (!REVIEWABLE_STATES.includes(submission.status)) {
    return NextResponse.json(
      { error: `Cannot review a submission in status: ${submission.status}` },
      { status: 409 }
    )
  }

  const newStatus = ALLOWED_TRANSITIONS[action]

  // Atomic: create review record + update submission status
  await prisma.$transaction([
    prisma.submissionReview.create({
      data: {
        submissionId: id,
        reviewerId: session.user.id,
        action,
        reason: reason ?? null,
        notes: notes ?? null,
      },
    }),
    prisma.submission.update({
      where: { id },
      data: {
        status: newStatus as any,
        reviewedAt: new Date(),
        ...(action === 'REJECTED' ? { rejectionReason: reason } : {}),
      },
    }),
  ])

  return NextResponse.json({ success: true, newStatus })
}
