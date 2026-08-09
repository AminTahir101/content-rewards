import type { Metadata } from 'next'
import { Source_Sans_3, Source_Code_Pro } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { cookies } from 'next/headers'
import './globals.css'

const sourceSans = Source_Sans_3({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '900'],
})

const sourceMono = Source_Code_Pro({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '600'],
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
      className={`${sourceSans.variable} ${sourceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={validLocale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
