import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
  user: { id: string; name?: string | null; email: string; role: string }
}

export default function CreatorHome({ user }: Props) {
  const firstName = user.name?.split(' ')[0] ?? null

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-lg">Content Rewards</span>
          <Badge variant="secondary">Creator</Badge>
        </div>
      </nav>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-28">
        <div>
          <h1 className="text-2xl font-bold">
            {firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Here&apos;s your performance overview</p>
        </div>

        {/* Earnings summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Earned', value: 'SAR 0' },
            { label: 'Available', value: 'SAR 0' },
            { label: 'Pending', value: 'SAR 0' },
          ].map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="pt-4 pb-3 px-3">
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Discover CTA */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-5 pb-5 text-center space-y-3">
            <p className="font-semibold">Start earning from campaigns</p>
            <p className="text-sm opacity-80">Discover campaigns that match your audience</p>
            <Link
              href="/discover"
              className={buttonVariants({ variant: 'secondary' })}
            >
              Discover Campaigns
            </Link>
          </CardContent>
        </Card>

        {/* Active campaigns */}
        <div>
          <h2 className="font-semibold mb-3">My Active Campaigns</h2>
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground text-sm">
              No active campaigns yet.{' '}
              <Link href="/discover" className="text-primary hover:underline">
                Browse campaigns
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 inset-x-0 border-t bg-background">
        <div className="max-w-lg mx-auto grid grid-cols-5 py-2">
          {[
            { label: 'Home', href: '/dashboard' },
            { label: 'Discover', href: '/discover' },
            { label: 'Campaigns', href: '/my-campaigns' },
            { label: 'Earnings', href: '/earnings' },
            { label: 'Profile', href: '/profile' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="w-5 h-5 rounded bg-muted" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
