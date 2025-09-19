'use client'

import Head from 'next/head'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Automatically sets <meta property="og:image"> and <meta name="twitter:image">
 * to a live screenshot of the current page URL (1200x630).
 *
 * Uses NEXT_PUBLIC_SITE_URL as the canonical origin.
 */
export function OgAuto() {
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'https://ffwpuph.com'

  const pathname = usePathname() || '/'
  const searchParams = useSearchParams()
  const qs = searchParams?.toString()
  const pageUrl = `${origin}${pathname}${qs ? `?${qs}` : ''}`

  // Microlink API (direct screenshot image)
  const ogImage = `https://api.microlink.io/?url=${encodeURIComponent(
    pageUrl,
  )}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1200&viewport.height=630&waitUntil=networkidle2&colorScheme=light`

  return (
    <Head>
      {/* Open Graph */}
      <meta property='og:type' content='website' />
      <meta property='og:url' content={pageUrl} />
      <meta property='og:image' content={ogImage} />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />

      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:image' content={ogImage} />
    </Head>
  )
}
