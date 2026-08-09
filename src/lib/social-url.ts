export type SocialPlatform = 'TIKTOK' | 'INSTAGRAM' | 'YOUTUBE' | 'X'

interface PlatformPattern {
  platform: SocialPlatform
  patterns: RegExp[]
  label: string
  example: string
}

const PLATFORM_PATTERNS: PlatformPattern[] = [
  {
    platform: 'TIKTOK',
    label: 'TikTok',
    example: 'https://www.tiktok.com/@username/video/1234567890',
    patterns: [
      /^https?:\/\/(www\.)?tiktok\.com\/@[\w.]+\/video\/\d+/i,
      /^https?:\/\/vm\.tiktok\.com\/[\w]+/i,
      /^https?:\/\/vt\.tiktok\.com\/[\w]+/i,
    ],
  },
  {
    platform: 'INSTAGRAM',
    label: 'Instagram',
    example: 'https://www.instagram.com/p/ABC123/ or /reel/ABC123/',
    patterns: [
      /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[\w-]+/i,
    ],
  },
  {
    platform: 'YOUTUBE',
    label: 'YouTube',
    example: 'https://www.youtube.com/watch?v=... or https://youtu.be/...',
    patterns: [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/i,
      /^https?:\/\/youtu\.be\/[\w-]+/i,
      /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/i,
    ],
  },
  {
    platform: 'X',
    label: 'X (Twitter)',
    example: 'https://x.com/username/status/1234567890',
    patterns: [
      /^https?:\/\/(www\.)?(x\.com|twitter\.com)\/[\w]+\/status\/\d+/i,
    ],
  },
]

export function detectPlatform(url: string): SocialPlatform | null {
  for (const { platform, patterns } of PLATFORM_PATTERNS) {
    if (patterns.some((p) => p.test(url))) return platform
  }
  return null
}

export function validatePlatformUrl(url: string, platform: SocialPlatform): boolean {
  const def = PLATFORM_PATTERNS.find((p) => p.platform === platform)
  if (!def) return false
  return def.patterns.some((p) => p.test(url))
}

export function getPlatformLabel(platform: SocialPlatform): string {
  return PLATFORM_PATTERNS.find((p) => p.platform === platform)?.label ?? platform
}

export function getPlatformExample(platform: SocialPlatform): string {
  return PLATFORM_PATTERNS.find((p) => p.platform === platform)?.example ?? ''
}

export { PLATFORM_PATTERNS }
