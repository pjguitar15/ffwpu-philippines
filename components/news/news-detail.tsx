'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Calendar, User, Home, ChevronRight } from 'lucide-react'
import { sampleNews } from '@/data/news' // ⬅️ use alias to avoid brittle relative paths
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ArticleBody } from './article-body'

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

export default function NewsDetailClient() {
  const params = useParams()
  const router = useRouter()
  const slug = params.id as string
  const newsItem = sampleNews.find((item) => item.slug === slug) as
    | NewsItem
    | undefined

  const [shareUrl, setShareUrl] = useState('')
  useEffect(() => {
    if (typeof window !== 'undefined') setShareUrl(window.location.href)
  }, [])

  const related = useMemo(() => {
    if (!newsItem) return []
    const firstTag = newsItem.tags?.[0]
    const pool = sampleNews.filter((n) => n.slug !== newsItem.slug)
    const tagged = firstTag
      ? pool.filter((n) => n.tags?.includes(firstTag))
      : []
    return (tagged.length ? tagged : pool).slice(0, 3) as NewsItem[]
  }, [newsItem])

  const more = useMemo(() => {
    if (!newsItem) return []
    const ids = new Set([newsItem.slug, ...related.map((r) => r.slug)])
    return sampleNews.filter((n) => !ids.has(n.slug)).slice(0, 8) as NewsItem[]
  }, [newsItem, related])

  if (!newsItem) {
    return (
      <div className='min-h-screen flex flex-col'>
        <main className='flex-1 flex items-center justify-center'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold mb-4'>Update Not Found</h2>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </main>
      </div>
    )
  }

  const TAG_GRADIENTS: Record<string, string> = {
    youth: 'from-sky-600 via-cyan-600 to-emerald-600',
    leadership: 'from-indigo-600 via-violet-600 to-fuchsia-600',
    service: 'from-emerald-600 via-teal-600 to-cyan-600',
    community: 'from-slate-700 via-slate-800 to-slate-900',
    'disaster-relief': 'from-amber-700 via-orange-700 to-rose-700',
    iaysp: 'from-sky-700 via-cyan-700 to-indigo-700',
    carp: 'from-fuchsia-700 via-pink-700 to-rose-700',
    upf: 'from-amber-700 via-yellow-700 to-orange-700',
  }
  const GRADIENT_POOL = Object.values(TAG_GRADIENTS)

  function useGradientForTag() {
    return React.useCallback((tag: string) => {
      const key = tag.toLowerCase()
      if (TAG_GRADIENTS[key]) return TAG_GRADIENTS[key]
      let hash = 5381
      for (let i = 0; i < key.length; i++)
        hash = (hash * 33) ^ key.charCodeAt(i)
      const idx = Math.abs(hash) % GRADIENT_POOL.length
      return GRADIENT_POOL[idx]
    }, [])
  }
  const gradientFor = useGradientForTag()

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <main className='flex-1'>
        <div className='container mx-auto py-10 px-4 md:px-6 mb-12'>
          {/* Breadcrumbs */}
          <nav
            aria-label='Breadcrumb'
            className='mb-4 -mx-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
          >
            <ol className='mx-2 inline-flex items-center gap-1 text-sm text-slate-600'>
              <li>
                <Link
                  href='/'
                  className='inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 hover:bg-slate-100 hover:text-slate-900 transition'
                >
                  <Home className='h-4 w-4' />
                  <span className='hidden sm:inline'>Home</span>
                </Link>
              </li>
              <li aria-hidden='true'>
                <ChevronRight className='h-4 w-4 text-slate-400' />
              </li>
              <li>
                <Link
                  href='/news'
                  className='inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 hover:bg-slate-100 hover:text-slate-900 transition'
                >
                  News
                </Link>
              </li>
              <li aria-hidden='true'>
                <ChevronRight className='h-4 w-4 text-slate-400' />
              </li>
              <li className='inline-flex items-center'>
                <span
                  aria-current='page'
                  className='rounded-md px-2.5 py-1.5 bg-slate-100/70 text-slate-900 max-w-[60vw] md:max-w-none truncate'
                  title={newsItem.title}
                >
                  {newsItem.title}
                </span>
              </li>
            </ol>
          </nav>

          {/* HERO */}
          <div className='relative'>
            <div className='flex items-stretch gap-4'>
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
          <div className='mt-10 grid grid-cols-1 lg:grid-cols-4 gap-10'>
            {/* MAIN */}
            <article className='lg:col-span-3'>
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
              </div>

              {/* Tags */}
              {newsItem.tags?.length > 0 && (
                <div className='mt-4 flex flex-wrap gap-2'>
                  {newsItem.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className={cn(
                        'bg-gradient-to-r',
                        gradientFor(tag),
                        'text-white border-0 rounded-full',
                        'px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase',
                        'shadow-sm ring-1 ring-white/15 hover:ring-white/25 transition-colors',
                      )}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Content */}
              <ArticleBody content={newsItem.content} />
            </article>

            {/* SIDEBAR */}
            <aside className='lg:col-span-1'>
              <h3 className='text-slate-900 font-extrabold tracking-wide uppercase'>
                Related Updates{' '}
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
        </div>
      </main>
    </div>
  )
}
