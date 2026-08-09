import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import EarningsClient from '@/components/earnings/EarningsClient'

export const dynamic = 'force-dynamic'

async function getEarningsData(userId: string) {
  const [wallet, submissionEarnings] = await Promise.all([
    prisma.wallet.findUnique({
      where: { userId },
      select: {
        totalEarned: true,
        pendingBalance: true,
        availableBalance: true,
        lifetimePaid: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 50,
          select: {
            id: true,
            type: true,
            direction: true,
            status: true,
            amount: true,
            currency: true,
            description: true,
            referenceType: true,
            referenceId: true,
            balanceAfter: true,
            createdAt: true,
            settledAt: true,
          },
        },
      },
    }),
    prisma.submission.findMany({
      where: {
        userId,
        earnedAmount: { not: null },
        status: { in: ['PAID', 'PAYOUT_PENDING', 'PERFORMANCE_LOCKED', 'TRACKING', 'APPROVED'] },
      },
      select: {
        id: true,
        status: true,
        earnedAmount: true,
        submittedAt: true,
        campaign: {
          select: {
            id: true,
            name: true,
            slug: true,
            cpm: true,
            organization: { select: { name: true } },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    }),
  ])

  return {
    wallet: wallet
      ? {
          totalEarned: wallet.totalEarned.toString(),
          pendingBalance: wallet.pendingBalance.toString(),
          availableBalance: wallet.availableBalance.toString(),
          lifetimePaid: wallet.lifetimePaid.toString(),
          transactions: wallet.transactions.map((tx) => ({
            ...tx,
            amount: tx.amount.toString(),
            balanceAfter: tx.balanceAfter?.toString() ?? null,
            createdAt: tx.createdAt.toISOString(),
            settledAt: tx.settledAt?.toISOString() ?? null,
          })),
        }
      : null,
    submissionEarnings: submissionEarnings.map((s) => ({
      id: s.id,
      status: s.status,
      earnedAmount: s.earnedAmount!.toString(),
      submittedAt: s.submittedAt.toISOString(),
      campaign: {
        id: s.campaign.id,
        name: s.campaign.name,
        slug: s.campaign.slug,
        cpm: s.campaign.cpm?.toString() ?? null,
        organization: s.campaign.organization,
      },
    })),
  }
}

export default async function EarningsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/earnings')
  if (session.user.role !== 'CREATOR') redirect('/dashboard')

  const data = await getEarningsData(session.user.id)

  return <EarningsClient {...data} userName={session.user.name ?? null} />
}
