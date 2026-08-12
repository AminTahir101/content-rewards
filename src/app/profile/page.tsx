import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ProfileClient from '@/components/profile/ProfileClient'

export const dynamic = 'force-dynamic'

async function getProfileData(userId: string) {
  const [user, campaignCount, submissionCount, wallet] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        profile: {
          select: {
            displayName: true,
            bio: true,
            avatarUrl: true,
            country: true,
            city: true,
            language: true,
            phone: true,
            website: true,
            isComplete: true,
          },
        },
        creatorProfile: {
          select: {
            handle: true,
            niche: true,
            totalFollowers: true,
            verifiedFollowers: true,
            score: true,
            isVerified: true,
            isEligible: true,
            isSuspended: true,
          },
        },
      },
    }),
    prisma.campaignParticipant.count({ where: { userId } }),
    prisma.submission.count({ where: { userId } }),
    prisma.wallet.findUnique({
      where: { userId },
      select: { totalEarned: true, availableBalance: true },
    }),
  ])

  return { user, campaignCount, submissionCount, wallet }
}

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/profile')

  const data = await getProfileData(session.user.id)
  if (!data.user) redirect('/dashboard')

  return (
    <ProfileClient
      user={{
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        image: data.user.image,
        role: data.user.role,
        createdAt: data.user.createdAt.toISOString(),
      }}
      profile={data.user.profile}
      creatorProfile={data.user.creatorProfile}
      stats={{
        campaignCount: data.campaignCount,
        submissionCount: data.submissionCount,
        totalEarned: data.wallet?.totalEarned.toString() ?? null,
        availableBalance: data.wallet?.availableBalance.toString() ?? null,
      }}
    />
  )
}
