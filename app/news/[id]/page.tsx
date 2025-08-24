'use client'

import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CommentsSection } from '@/components/news/comments-section'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, User, Eye, Heart,  } from 'lucide-react'
import {  sampleNews } from '../../../data/news'

interface NewsItem {
  id: string
  title: string
  author: string
  date: string
  image: string
  tags: string[]
  status: string
  views: number
  likes: number
  content: string
  comments: any[]
}

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.id as string
  const newsItem = sampleNews.find((item) => item.slug === slug)

  if (!newsItem) {
    return (
      <div className='min-h-screen flex flex-col'>
        <Header />
        <main className='flex-1 flex items-center justify-center'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold mb-4'>News Not Found</h2>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />
      <main className='flex-1'>
        <div className='max-w-3xl mx-auto py-12 px-4'>
          <Button
            variant='ghost'
            className='mb-6'
            onClick={() => router.back()}
          >
            <ArrowLeft className='mr-2 h-4 w-4' /> Back to News
          </Button>
          <div className='rounded-xl overflow-hidden shadow-lg bg-white dark:bg-slate-900'>
            <img
              src={newsItem.image}
              alt={newsItem.title}
              className='w-full h-64 object-cover object-center'
            />
            <div className='p-8'>
              <div className='flex flex-wrap gap-2 mb-4'>
                {newsItem.tags.map((tag) => (
                  <Badge key={tag} variant='outline' className='text-xs'>
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className='font-heading text-3xl md:text-4xl font-bold mb-2 leading-tight'>
                {newsItem.title}
              </h1>
              <div className='flex items-center gap-4 text-muted-foreground text-sm mb-6'>
                <div className='flex items-center gap-1'>
                  <User className='h-4 w-4' />
                  <span>{newsItem.author}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-4 w-4' />
                  <span>{new Date(newsItem.date).toLocaleDateString()}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Eye className='h-4 w-4' />
                  <span>{newsItem.views}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Heart className='h-4 w-4' />
                  <span>{newsItem.likes}</span>
                </div>
              </div>
              <div className='prose prose-lg max-w-none text-gray-800 dark:text-gray-100 mb-8'>
                {newsItem.content}
              </div>
              <div className='border-t pt-6'>
                <CommentsSection
                  comments={newsItem.comments}
                  onAddComment={() => {}}
                  onAddReply={() => {}}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
