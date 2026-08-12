import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import EditProfileClient from '@/components/profile/EditProfileClient'

export const dynamic = 'force-dynamic'

export default async function EditProfilePage() {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/profile/edit')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profile: {
        select: {
          displayName: true,
          bio: true,
          country: true,
          city: true,
          language: true,
          phone: true,
          website: true,
        },
      },
      creatorProfile: {
        select: {
          handle: true,
          niche: true,
        },
      },
    },
  })

  if (!user) redirect('/dashboard')

  return (
    <EditProfileClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }}
      profile={user.profile}
      creatorProfile={user.creatorProfile}
    />
  )
}
