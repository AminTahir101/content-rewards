'use client'

import { useLocale } from 'next-intl'

interface LogoProps {
  /** Height in px — width scales automatically from the SVG aspect ratio */
  height?: number
  className?: string
}

export default function Logo({ height = 36, className }: LogoProps) {
  const locale = useLocale()
  const src = locale === 'ar' ? '/logo-ar.svg' : '/logo-en.svg'
  const alt = 'ContentRewards'

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      height={height}
      style={{ height, width: 'auto' }}
      className={className}
    />
  )
}
