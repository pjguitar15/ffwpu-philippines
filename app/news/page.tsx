// app/news/page.tsx
import { Suspense } from 'react'
import { NewsIndex } from '@/components/news/news-index'
import { NewsIndexSkeleton } from '@/components/news/news-index-skeleton' // (only used by loading.tsx)
import { headers } from 'next/headers'
import { sampleNews } from '@/data/news'

export async function NewsIndexServer() {
  try {
    const h = await headers() // keeps route dynamic/streaming
    const proto = h.get('x-forwarded-proto') ?? 'http'
    const host = h.get('host') ?? 'localhost:3000'
    const base = `${proto}://${host}`

    const res = await fetch(`${base}/api/news`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length) return <NewsIndex items={data} />
    }
  } catch {}
  // graceful fallback if the API fails
  return <NewsIndex items={sampleNews} />
}

export default function NewsPage() {
  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-1'>
        {/* Route-level loading.tsx shows instantly; avoid double skeleton here */}
        <Suspense fallback={null}>
          <NewsIndexServer />
        </Suspense>
      </main>
    </div>
  )
}
