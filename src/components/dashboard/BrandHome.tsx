import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  user: { id: string; name?: string | null; email: string; role: string }
}

export default function BrandHome({ user }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-xl">Content Rewards</span>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">Brand</Badge>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Overview</h1>
            <p className="text-muted-foreground mt-1">Campaign performance at a glance</p>
          </div>
          <Link href="/brand/campaigns/new" className={buttonVariants()}>
            Create Campaign
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
          {[
            { label: 'Total Spend', value: 'SAR 0' },
            { label: 'Verified Views', value: '0' },
            { label: 'Active Campaigns', value: '0' },
            { label: 'Pending Reviews', value: '0' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No campaigns yet.{' '}
            <Link href="/brand/campaigns/new" className="text-primary hover:underline">
              Create your first campaign
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
