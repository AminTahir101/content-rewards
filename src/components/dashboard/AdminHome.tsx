import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  user: { id: string; name?: string | null; email: string; role: string }
}

export default function AdminHome({ user }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-xl">Content Rewards — Admin</span>
          <div className="flex items-center gap-4">
            <Badge variant="destructive">Admin</Badge>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Platform Overview</h1>
        <p className="text-muted-foreground">Full platform administration.</p>
        <Card className="mt-8">
          <CardContent className="py-12 text-center text-muted-foreground">
            Admin panel under construction.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
