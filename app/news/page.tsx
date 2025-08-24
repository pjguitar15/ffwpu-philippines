import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { sampleNews } from '@/data/news'
import { NewsIndex } from '@/components/news/news-index'

export default function NewsPage() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1'>
        <NewsIndex items={sampleNews} />
      </main>
      <Footer />
    </div>
  )
}
