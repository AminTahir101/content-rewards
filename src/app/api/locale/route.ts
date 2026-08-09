import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { locale } = await req.json()
  const validLocale = ['en', 'ar'].includes(locale) ? locale : 'en'

  const response = NextResponse.json({ locale: validLocale })
  response.cookies.set('locale', validLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  return response
}
