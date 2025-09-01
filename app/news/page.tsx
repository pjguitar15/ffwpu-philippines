import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { sampleNews } from '@/data/news'
import { NewsIndex } from '@/components/news/news-index'
import { Suspense } from 'react'
import { NewsIndexSkeleton } from '@/components/news/news-index-skeleton'
import { headers } from 'next/headers'

export async function NewsIndexServer() {
  try {
    const h = await headers()
    const proto = h.get('x-forwarded-proto') ?? 'http'
    const host = h.get('host') ?? 'localhost:3000'
    const base = `${proto}://${host}`
    const res = await fetch(`${base}/api/news`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length) return <NewsIndex items={data} />
    }
  } catch {}
  return <NewsIndex items={sampleNews} />
}
export default function NewsPage() {
  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-1'>
        <Suspense fallback={<NewsIndexSkeleton cards={9} />}>
          <NewsIndexServer />
        </Suspense>
      </main>
    </div>
  )
}
