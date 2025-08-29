import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { NewsDetailSkeleton } from '@/components/news/news-detail-skeleton'

const NewsDetailClient = dynamic(() => import('@/components/news/news-detail'))

export default function Page() {
  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <main className='flex-1'>
        <Suspense fallback={<NewsDetailSkeleton />}>
          <NewsDetailClient />
        </Suspense>
      </main>
    </div>
  )
}
