import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { sampleNews } from '@/data/news'
import { NewsIndex } from '@/components/news/news-index'
import { Suspense } from 'react'
import { NewsIndexSkeleton } from '@/components/news/news-index-skeleton'

export default function NewsPage() {
  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-1'>
        <Suspense fallback={<NewsIndexSkeleton cards={9} />}>
          <NewsIndex items={sampleNews} />
        </Suspense>
      </main>
    </div>
  )
}
