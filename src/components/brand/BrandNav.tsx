import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface Props {
  activeHref: string
  orgName?: string | null
  userEmail?: string | null
}

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Campaigns', href: '/brand/campaigns' },
  { label: 'Submissions', href: '/brand/submissions' },
  { label: 'Creators', href: '/brand/creators' },
  { label: 'Analytics', href: '/brand/analytics' },
]

export default function BrandNav({ activeHref, orgName, userEmail }: Props) {
  return (
    <nav className="border-b bg-background sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="font-bold text-lg shrink-0">
              Content Rewards
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeHref === item.href || activeHref.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {orgName && (
              <span className="text-sm text-muted-foreground hidden sm:block">{orgName}</span>
            )}
            <Badge variant="secondary">Brand</Badge>
          </div>
        </div>
      </div>
    </nav>
  )
}
