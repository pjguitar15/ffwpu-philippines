import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { sampleNews } from '@/data/news'
import { NewsIndex } from '@/components/news/news-index'
import { Suspense } from 'react'

export default function NewsPage() {
  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-1'>
        <Suspense
          fallback={
            <div className='container mx-auto py-12 px-4'>Loading news…</div>
          }
        >
          <NewsIndex items={sampleNews} />
        </Suspense>
      </main>
    </div>
  )
}
