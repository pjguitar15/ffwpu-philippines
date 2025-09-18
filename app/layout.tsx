import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Inter } from "next/font/google"
import { Suspense } from "react"
import './globals.css'
import UnderConstruction from '@/components/under-construction'
import { SiteShell } from '@/components/layout/site-shell'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider'
import { OgAuto } from '@/components/og-auto'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const siteUrl = 'https://ffwpuph.com/'

export const metadata: Metadata = {
  title:
    'FFWPU Philippines - Family Federation for World Peace and Unification',
  description:
    'Official website of the Family Federation for World Peace and Unification Philippines. Join us in building a world of peace, love, and unity through the teachings of True Parents - Rev. Sun Myung Moon and Hak Ja Han Moon (Holy Mother Han).',
  generator: 'v0.app',
  keywords: [
    'FFWPU Philippines',
    'Family Federation for World Peace and Unification',
    'True Parents',
    'Rev. Sun Myung Moon',
    'Hak Ja Han Moon',
    'Holy Mother Han',
    'True Mother',
    'Unification Church Philippines',
    'Peace',
    'Unity',
    'Cheon Il Guk',
    'World Peace',
    'Interfaith',
    'Philippines Church',
    'Spiritual Community',
    'Divine Principle',
    'True Love',
    'True Life',
    'True Lineage',
  ].join(', '),
  authors: [{ name: 'FFWPU Philippines' }],
  creator: 'FFWPU Philippines',
  publisher: 'Family Federation for World Peace and Unification Philippines',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: 'https://ffwpu-philippines.vercel.app',
    siteName: 'FFWPU Philippines',
    title: 'FFWPU Philippines - Building World Peace and Unity',
    description:
      "Join the Family Federation for World Peace and Unification Philippines in creating a world of peace, love, and unity through True Parents' teachings.",
    images: [
      {
        url: '/true-parents-portrait.png',
        width: 1200,
        height: 630,
        alt: 'True Parents - Rev. Sun Myung Moon and Hak Ja Han Moon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FFWPU Philippines - Building World Peace and Unity',
    description:
      "Join us in creating a world of peace, love, and unity through True Parents' teachings.",
    images: ['/true-parents-portrait.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'religion',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${montserrat.variable} ${inter.variable} antialiased scrollbar-thin scroll-smooth light`}
    >
      <head>
        {/* Favicons */}
        <link rel='icon' type='image/png' href='/ffwpu-ph-logo.png' />
        <link rel='icon' type='image/webp' href='/favicon.webp' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/ffwpu-ph-logo.png'
        />
        <link rel='manifest' href='/site.webmanifest' />

        {/* Theme + viewport */}
        <meta name='theme-color' content='#3b82f6' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, interactive-widget=resizes-content'
        />
      </head>
      <body className='font-body page-transition'>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem={false}
          forcedTheme='light'
          enableColorScheme={false}
        >
          <Suspense fallback={null}>
            <OgAuto />
          </Suspense>
          <SiteShell
            isUnderConstruction={process.env.IS_UNDER_CONSTRUCTION === 'true'}
          >
            {children}
          </SiteShell>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
