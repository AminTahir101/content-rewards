import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import BrandNav from '@/components/brand/BrandNav'
import NewCampaignWizard from '@/components/brand/NewCampaignWizard'

export const dynamic = 'force-dynamic'

export default async function NewCampaignPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/brand/campaigns/new')
  }

  if (
    session.user.role !== 'BRAND' &&
    session.user.role !== 'AGENCY' &&
    session.user.role !== 'ADMIN'
  ) {
    redirect('/dashboard')
  }

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id, isActive: true },
    select: {
      organizationId: true,
      organization: { select: { name: true } },
    },
  })

  const orgId = membership?.organizationId ?? null
  const orgName = membership?.organization?.name ?? null

  return (
    <div className="min-h-screen bg-page">
      <BrandNav orgName={orgName} userLabel={session.user.email} />
      <NewCampaignWizard orgId={orgId} />
    </div>
  )
}
