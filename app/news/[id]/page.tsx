'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CommentsSection } from '@/components/news/comments-section'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Heart,
  Link as LinkIcon,
} from 'lucide-react'
import { sampleNews } from '../../../data/news'

type NewsItem = {
  id: string
  slug: string
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
  const newsItem = sampleNews.find((item) => item.slug === slug) as
    | NewsItem
    | undefined

  // current page URL for sharing
  const [shareUrl, setShareUrl] = useState('')
  useEffect(() => {
    if (typeof window !== 'undefined') setShareUrl(window.location.href)
  }, [])

  // RELATED (sidebar): same first tag (fallback to recent)
  const related = useMemo(() => {
    if (!newsItem) return []
    const firstTag = newsItem.tags?.[0]
    const pool = sampleNews.filter((n) => n.slug !== newsItem.slug)
    const tagged = firstTag
      ? pool.filter((n) => n.tags?.includes(firstTag))
      : []
    const take = (tagged.length ? tagged : pool).slice(0, 3)
    return take as NewsItem[]
  }, [newsItem])

  // MORE (bottom row): everything else not shown yet
  const more = useMemo(() => {
    if (!newsItem) return []
    const ids = new Set([newsItem.slug, ...related.map((r) => r.slug)])
    return sampleNews.filter((n) => !ids.has(n.slug)).slice(0, 8) as NewsItem[]
  }, [newsItem, related])

  if (!newsItem) {
    return (
      <div className='min-h-screen flex flex-col'>
        <Header />
        <main className='flex-1 flex items-center justify-center'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold mb-4'>Update Not Found</h2>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl,
  )}`
  const xShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    shareUrl,
  )}&text=${encodeURIComponent(newsItem.title)}`
  const emailShare = `mailto:?subject=${encodeURIComponent(
    newsItem.title,
  )}&body=${encodeURIComponent(shareUrl)}`

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />

      <main className='flex-1'>
        <div className='max-w-6xl mx-auto py-10 px-4 md:px-6'>
          {/* Back link */}
          <button
            onClick={() => router.back()}
            className='mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900'
          >
            <ArrowLeft className='h-4 w-4' />
            Go Back
          </button>

          {/* HERO with share rail */}
          <div className='relative'>
            <div className='flex items-stretch gap-4'>
              {/* Share rail (desktop) */}
              <aside className='hidden md:flex flex-col items-center mr-2'>
                <span className='text-slate-700 font-extrabold tracking-[0.35em] uppercase [writing-mode:vertical-rl] rotate-180'>
                  Share
                </span>
                <div className='mt-3 flex flex-col gap-2'>
                  <a
                    href={fbShare}
                    target='_blank'
                    rel='noreferrer'
                    className='h-8 w-8 grid place-items-center rounded-full bg-slate-100 hover:bg-slate-200 transition'
                  >
                    <svg
                      viewBox='0 0 24 24'
                      width='16'
                      height='16'
                      fill='currentColor'
                    >
                      <path d='M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.2 3-3.2.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 3h-1.8v7A10 10 0 0 0 22 12' />
                    </svg>
                  </a>
                  <a
                    href={xShare}
                    target='_blank'
                    rel='noreferrer'
                    className='h-8 w-8 grid place-items-center rounded-full bg-slate-100 hover:bg-slate-200 transition'
                  >
                    <svg
                      viewBox='0 0 24 24'
                      width='16'
                      height='16'
                      fill='currentColor'
                    >
                      <path d='M18 2h3l-7.5 8.6L22 22h-6.6l-5.2-6.7L4 22H1l8.2-9.5L2 2h6.6l4.7 6.1L18 2z' />
                    </svg>
                  </a>
                  <a
                    href={emailShare}
                    className='h-8 w-8 grid place-items-center rounded-full bg-slate-100 hover:bg-slate-200 transition'
                  >
                    <svg
                      viewBox='0 0 24 24'
                      width='16'
                      height='16'
                      fill='currentColor'
                    >
                      <path d='M20 4H4c-1.1 0-2 .9-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-1.1-.9-2-2-2m0 4-8 5-8-5V6l8 5 8-5v2z' />
                    </svg>
                  </a>
                </div>
              </aside>

              {/* Media card */}
              <div className='relative w-full rounded-xl overflow-hidden ring-1 ring-black/10 shadow'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={newsItem.image}
                  alt={newsItem.title}
                  className='w-full h-[320px] md:h-[420px] object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent' />
              </div>
            </div>
          </div>

          {/* Main + Sidebar */}
          <div className='mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10'>
            {/* MAIN */}
            <article className='lg:col-span-2'>
              <div className='text-sm text-slate-600 font-semibold mb-2'>
                <span>{newsItem.author}</span> •{' '}
                <span>{new Date(newsItem.date).toLocaleDateString()}</span>
              </div>

              <h1 className='text-3xl md:text-4xl font-extrabold leading-tight tracking-wide text-slate-900'>
                {newsItem.title}
              </h1>

              <div className='mt-3 flex items-center gap-4 text-slate-500 text-sm'>
                <span className='inline-flex items-center gap-1'>
                  <User className='h-4 w-4' /> {newsItem.author}
                </span>
                <span className='inline-flex items-center gap-1'>
                  <Calendar className='h-4 w-4' />{' '}
                  {new Date(newsItem.date).toLocaleDateString()}
                </span>
                <span className='inline-flex items-center gap-1'>
                  <Eye className='h-4 w-4' /> {newsItem.views}
                </span>
                <span className='inline-flex items-center gap-1'>
                  <Heart className='h-4 w-4' /> {newsItem.likes}
                </span>
              </div>

              {/* Tags */}
              {newsItem.tags?.length > 0 && (
                <div className='mt-4 flex flex-wrap gap-2'>
                  {newsItem.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant='secondary'
                      className='bg-slate-100 text-slate-800'
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className='prose prose-lg max-w-none mt-6 text-slate-800 dark:text-slate-100'>
                {newsItem.content}
              </div>

              {/* Source / livestream link example (optional icon row) */}
              <div className='mt-6 flex items-center gap-2 text-sm text-slate-600'>
                <LinkIcon className='h-4 w-4' />
                <span>Share this update: </span>
                <a
                  className='underline underline-offset-4 hover:text-slate-900'
                  href={fbShare}
                  target='_blank'
                  rel='noreferrer'
                >
                  Facebook
                </a>
                <span>•</span>
                <a
                  className='underline underline-offset-4 hover:text-slate-900'
                  href={xShare}
                  target='_blank'
                  rel='noreferrer'
                >
                  X
                </a>
                <span>•</span>
                <a
                  className='underline underline-offset-4 hover:text-slate-900'
                  href={emailShare}
                >
                  Email
                </a>
              </div>

              {/* Comments */}
              <div className='mt-10 border-t pt-6'>
                <CommentsSection
                  comments={newsItem.comments}
                  onAddComment={() => {}}
                  onAddReply={() => {}}
                />
              </div>
            </article>

            {/* SIDEBAR */}
            <aside className='lg:col-span-1'>
              <h3 className='text-slate-900 font-extrabold tracking-wide uppercase'>
                Past Updates{' '}
                <span className='text-slate-500'>in this topic</span>
              </h3>

              <div className='mt-4 space-y-6'>
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/news/${item.slug}`}
                    className='block group'
                  >
                    <div className='relative rounded-lg overflow-hidden ring-1 ring-black/10 shadow bg-white'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className='w-full h-32 object-cover group-hover:scale-[1.02] transition'
                      />
                    </div>
                    <div className='mt-2 text-xs text-slate-600'>
                      {item.author} • {new Date(item.date).toLocaleDateString()}
                    </div>
                    <h4 className='mt-1 font-bold leading-snug group-hover:underline'>
                      {item.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </aside>
          </div>

          {/* Explore other updates */}
          <section className='mt-16'>
            <div className='flex items-baseline justify-between'>
              <h3 className='text-2xl md:text-3xl font-extrabold tracking-wide'>
                <span className='text-slate-800'>Explore</span>{' '}
                <span className='text-slate-500'>other updates</span>
              </h3>
              <Link
                href='/news'
                className='text-amber-600 font-extrabold tracking-wider uppercase text-sm hover:underline'
              >
                View All
              </Link>
            </div>

            <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {more.map((item) => (
                <Link
                  key={item.slug}
                  href={`/news/${item.slug}`}
                  className='group'
                >
                  <div className='relative rounded-xl overflow-hidden ring-1 ring-black/10 shadow bg-white'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className='w-full h-36 object-cover group-hover:scale-[1.02] transition'
                    />
                  </div>
                  <div className='mt-3 text-xs text-slate-600'>
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                  <h4 className='mt-1 font-extrabold tracking-wide group-hover:underline'>
                    {item.title}
                  </h4>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
