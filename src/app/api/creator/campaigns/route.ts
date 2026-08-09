import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  // Fetch all campaigns the creator has joined, with their latest submission
  const participants = await prisma.campaignParticipant.findMany({
    where: { userId },
    orderBy: { joinedAt: 'desc' },
    select: {
      joinedAt: true,
      campaign: {
        select: {
          id: true,
          name: true,
          slug: true,
          coverUrl: true,
          category: true,
          status: true,
          cpm: true,
          maxCreatorPayout: true,
          endDate: true,
          platforms: { select: { platform: true } },
          organization: { select: { name: true } },
          submissions: {
            where: { userId },
            orderBy: { submittedAt: 'desc' },
            take: 1,
            select: {
              id: true,
              status: true,
              contentUrl: true,
              earnedAmount: true,
              submittedAt: true,
              rejectionReason: true,
            },
          },
        },
      },
    },
  })

  const result = participants.map(({ joinedAt, campaign }) => {
    const submission = campaign.submissions[0] ?? null
    return {
      joinedAt: joinedAt.toISOString(),
      campaign: {
        id: campaign.id,
        name: campaign.name,
        slug: campaign.slug,
        coverUrl: campaign.coverUrl,
        category: campaign.category,
        status: campaign.status,
        cpm: campaign.cpm?.toString() ?? null,
        maxCreatorPayout: campaign.maxCreatorPayout?.toString() ?? null,
        endDate: campaign.endDate?.toISOString() ?? null,
        platforms: campaign.platforms.map((p) => p.platform),
        organization: campaign.organization,
      },
      submission: submission
        ? {
            id: submission.id,
            status: submission.status,
            contentUrl: submission.contentUrl,
            earnedAmount: submission.earnedAmount?.toString() ?? null,
            submittedAt: submission.submittedAt.toISOString(),
            rejectionReason: submission.rejectionReason,
          }
        : null,
    }
  })

  return NextResponse.json({ campaigns: result })
}
