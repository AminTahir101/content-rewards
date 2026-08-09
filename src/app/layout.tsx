import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { cookies } from 'next/headers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Content Rewards',
  description: 'Creator performance marketing platform',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const locale = cookieStore.get('locale')?.value ?? 'en'
  const validLocale = ['en', 'ar'].includes(locale) ? locale : 'en'
  const messages = (await import(`../../messages/${validLocale}.json`)).default
  const dir = validLocale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html
      lang={validLocale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={validLocale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
