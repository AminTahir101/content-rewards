import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const profileSchema = z.object({
  // User
  name:        z.string().min(2).max(80).optional(),
  // Profile
  displayName: z.string().min(2).max(80).optional(),
  bio:         z.string().max(500).optional(),
  country:     z.string().length(2).optional(),
  city:        z.string().max(80).optional(),
  language:    z.enum(['ar', 'en']).optional(),
  phone:       z.string().max(20).optional(),
  website:     z.string().url().max(200).optional().or(z.literal('')),
  // Creator profile
  handle:      z.string().min(2).max(40).regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers and underscores only').optional(),
  niche:       z.array(z.string()).max(5).optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      profile: {
        select: {
          displayName: true,
          bio: true,
          avatarUrl: true,
          country: true,
          city: true,
          language: true,
          phone: true,
          website: true,
          isComplete: true,
        },
      },
      creatorProfile: {
        select: {
          handle: true,
          niche: true,
          isVerified: true,
          isEligible: true,
          isSuspended: true,
        },
      },
    },
  })

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ user })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = profileSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { name, displayName, bio, country, city, language, phone, website, handle, niche } = parsed.data

  // Check handle uniqueness if changing
  if (handle) {
    const existing = await prisma.creatorProfile.findFirst({
      where: { handle, userId: { not: session.user.id } },
    })
    if (existing) {
      return NextResponse.json({ error: 'Handle already taken' }, { status: 409 })
    }
  }

  // Compute profile completeness after update
  const currentProfile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { displayName: true, bio: true, avatarUrl: true, country: true, city: true, phone: true },
  })

  const merged = {
    displayName: displayName ?? currentProfile?.displayName,
    bio:         bio         ?? currentProfile?.bio,
    avatarUrl:   currentProfile?.avatarUrl,
    country:     country     ?? currentProfile?.country,
    city:        city        ?? currentProfile?.city,
    phone:       phone       ?? currentProfile?.phone,
  }
  const isComplete = Object.values(merged).every(Boolean)

  const [updatedUser] = await prisma.$transaction([
    // Update user.name
    prisma.user.update({
      where: { id: session.user.id },
      data: { ...(name ? { name } : {}) },
      select: { id: true, name: true, email: true },
    }),
    // Upsert profile
    prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        displayName, bio, country, city, language,
        phone,
        website: website || null,
        isComplete,
      },
      update: {
        ...(displayName !== undefined ? { displayName } : {}),
        ...(bio         !== undefined ? { bio }         : {}),
        ...(country     !== undefined ? { country }     : {}),
        ...(city        !== undefined ? { city }        : {}),
        ...(language    !== undefined ? { language }    : {}),
        ...(phone       !== undefined ? { phone }       : {}),
        ...(website     !== undefined ? { website: website || null } : {}),
        isComplete,
      },
    }),
    // Upsert creator profile if role = CREATOR
    ...(session.user.role === 'CREATOR'
      ? [prisma.creatorProfile.upsert({
          where: { userId: session.user.id },
          create: {
            userId: session.user.id,
            ...(handle ? { handle } : {}),
            ...(niche  ? { niche }  : {}),
          },
          update: {
            ...(handle !== undefined ? { handle } : {}),
            ...(niche  !== undefined ? { niche }  : {}),
          },
        })]
      : []),
  ])

  return NextResponse.json({ user: updatedUser })
}
