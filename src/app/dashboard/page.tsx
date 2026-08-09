import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import CreatorHome from '@/components/dashboard/CreatorHome'
import BrandHome from '@/components/dashboard/BrandHome'
import AgencyHome from '@/components/dashboard/AgencyHome'
import AdminHome from '@/components/dashboard/AdminHome'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const role = session.user.role

  if (role === 'CREATOR') return <CreatorHome user={session.user} />
  if (role === 'BRAND') return <BrandHome user={session.user} />
  if (role === 'AGENCY') return <AgencyHome user={session.user} />
  if (role === 'ADMIN') return <AdminHome user={session.user} />

  redirect('/login')
}
