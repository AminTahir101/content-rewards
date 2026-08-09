import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background text-center px-4">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Content Rewards</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-md">
        The creator performance marketing platform. Brands reach audiences. Creators earn real money.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/register" className={buttonVariants({ size: 'lg' })}>
          Get Started
        </Link>
        <Link href="/login" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
          Log In
        </Link>
      </div>
    </div>
  )
}
