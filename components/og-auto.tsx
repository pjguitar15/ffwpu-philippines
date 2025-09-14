'use client'

import Head from 'next/head'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Automatically sets <meta property="og:image"> and <meta name="twitter:image">
 * to a live screenshot of the current page URL (1200x630).
 *
 * Uses NEXT_PUBLIC_SITE_URL as the canonical origin.
 * Works with the App Router (app/).
 */
export function OgAuto() {
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ffwpu-philippines.vercel.app'

  const pathname = usePathname() || '/'
  const search = useSearchParams()
  const qs = search?.toString()
  const pageUrl = origin.replace(/\/$/, '') + pathname + (qs ? `?${qs}` : '')

  // Option A: Microlink (returns a direct image via redirect)
  const og = `https://api.microlink.io/?url=${encodeURIComponent(
    pageUrl,
  )}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1200&viewport.height=630&waitUntil=networkidle2&colorScheme=light`

  // Option B (fallback): Thum.io (simple, often watermarked on free tier)
  // const og = `https://image.thum.io/get/width/1200/crop/630/noanimate/true/${encodeURIComponent(pageUrl)}`

  return (
    <Head>
      {/* Open Graph */}
      <meta property='og:image' content={og} />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:image' content={og} />
    </Head>
  )
}
