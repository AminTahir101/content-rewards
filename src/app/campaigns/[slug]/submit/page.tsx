import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import SubmitForm from '@/components/submission/SubmitForm'

interface Props {
  params: Promise<{ slug: string }>
}

async function getSubmitContext(slug: string, userId: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      endDate: true,
      cpm: true,
      maxCreatorPayout: true,
      requiredHashtags: true,
      requiredMentions: true,
      contentBrief: true,
      contentDos: true,
      contentDonts: true,
      platforms: { select: { platform: true } },
      organization: { select: { name: true } },
      participants: {
        where: { userId },
        select: { id: true },
      },
      submissions: {
        where: {
          userId,
          status: { notIn: ['REJECTED', 'DISPUTED'] },
        },
        select: { id: true, status: true },
        take: 1,
      },
    },
  })

  return campaign
}

export default async function SubmitPage({ params }: Props) {
  const { slug } = await params
  const session = await auth()

  if (!session?.user) {
    redirect(`/login?callbackUrl=/campaigns/${slug}/submit`)
  }

  if (session.user.role !== 'CREATOR') {
    redirect(`/campaigns/${slug}`)
  }

  const campaign = await getSubmitContext(slug, session.user.id)

  if (!campaign || campaign.status === 'DRAFT') notFound()

  // Not joined → back to campaign detail
  if (campaign.participants.length === 0) {
    redirect(`/campaigns/${slug}`)
  }

  // Already has active submission
  if (campaign.submissions.length > 0) {
    redirect(`/my-campaigns`)
  }

  return (
    <SubmitForm
      campaign={{
        id: campaign.id,
        name: campaign.name,
        slug: campaign.slug,
        status: campaign.status,
        endDate: campaign.endDate?.toISOString() ?? null,
        cpm: campaign.cpm?.toString() ?? null,
        maxCreatorPayout: campaign.maxCreatorPayout?.toString() ?? null,
        requiredHashtags: campaign.requiredHashtags,
        requiredMentions: campaign.requiredMentions,
        contentBrief: campaign.contentBrief,
        contentDos: campaign.contentDos,
        contentDonts: campaign.contentDonts,
        platforms: campaign.platforms.map((p) => p.platform),
        organization: campaign.organization,
      }}
    />
  )
}
