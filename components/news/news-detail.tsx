'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Calendar, User, Home, ChevronRight, Eye, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ArticleBody } from './article-body'
import {
  FadeIn,
  FadeInItem,
  StaggerContainer,
  PopInItem,
} from '@/components/ui/motion'

// Tag gradient helpers moved to module scope to avoid hook ordering issues
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
function gradientFor(tag: string) {
  const key = (tag || '').toLowerCase()
  if (TAG_GRADIENTS[key]) return TAG_GRADIENTS[key]
  let hash = 5381
  for (let i = 0; i < key.length; i++) hash = (hash * 33) ^ key.charCodeAt(i)
  const idx = Math.abs(hash) % GRADIENT_POOL.length
  return GRADIENT_POOL[idx]
}

function pickRandom<T>(arr: T[], n: number) {
  const copy = arr.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

// Simple skeleton block
function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200/70 dark:bg-slate-700/50',
        className,
      )}
    />
  )
}

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
  const [newsItem, setNewsItem] = useState<NewsItem | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)
  const [allNews, setAllNews] = useState<NewsItem[]>([])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    ;(async () => {
      try {
        const res = await fetch(`/api/news/${slug}`)
        if (res.ok) {
          const data = await res.json()
          if (mounted) setNewsItem(data)
          if (mounted) setLoading(false)
          return
        }
      } catch {}
      // On failure, do not fallback to sample; show error UI
      if (mounted) setNewsItem(undefined)
      if (mounted) setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [slug])

  // Track views when news item is loaded
  useEffect(() => {
    if (newsItem && newsItem.slug) {
      // Only track views for articles from the API (not sample data)
      // Check if the item has an _id which indicates it's from the database
      const isFromDatabase = (newsItem as any)._id || (newsItem as any).id

      if (isFromDatabase) {
        const trackView = async () => {
          try {
            // Check if we've already viewed this article in this session
            const viewedKey = `viewed_${newsItem.slug}`
            const lastViewed = localStorage.getItem(viewedKey)
            const now = Date.now()
            
            // Only track if not viewed before, or if 30 minutes have passed
            const thirtyMinutes = 30 * 60 * 1000 // 30 minutes in milliseconds
            if (!lastViewed || (now - parseInt(lastViewed)) > thirtyMinutes) {
              console.log('Tracking view for:', newsItem.slug)
              const response = await fetch(`/api/news/${newsItem.slug}/views`, {
                method: 'POST',
              })
              const result = await response.json()
              console.log('View tracking result:', result)
              // Update local views count if API returned the new value
              if (result && typeof result.views === 'number') {
                setNewsItem((prev) =>
                  prev ? { ...prev, views: result.views } : prev,
                )
              }
              
              // Store the current timestamp
              localStorage.setItem(viewedKey, now.toString())
            } else {
              console.log('View already tracked recently for:', newsItem.slug)
            }
          } catch (error) {
            // Silently fail view tracking to not affect user experience
            console.log('Failed to track view:', error)
          }
        }

        // Track view after a short delay to ensure the user is actually reading
        const timer = setTimeout(trackView, 2000)
        return () => clearTimeout(timer)
      }
    }
  }, [newsItem]) // Load all news (for related/more sections)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/news', { cache: 'no-store' })
        if (res.ok) {
          const data = (await res.json()) as NewsItem[]
          const sorted = Array.isArray(data)
            ? [...data].sort(
                (a, b) =>
                  new Date(b.date || 0).getTime() -
                  new Date(a.date || 0).getTime(),
              )
            : []
          if (mounted) setAllNews(sorted)
          return
        }
      } catch {}
    })()
    return () => {
      mounted = false
    }
  }, [])

  const [shareUrl, setShareUrl] = useState('')
  useEffect(() => {
    if (typeof window !== 'undefined') setShareUrl(window.location.href)
  }, [])

  const related = useMemo(() => {
    if (!newsItem) return []
    const source = allNews
    const firstTag = newsItem.tags?.[0]
    const pool = source.filter((n) => n.slug !== newsItem.slug)
    const tagged = firstTag
      ? pool.filter((n) => (n.tags || []).includes(firstTag))
      : []
    return (tagged.length ? tagged : pool).slice(0, 3) as NewsItem[]
  }, [newsItem, allNews])

  const moreRandomBelow = useMemo(() => {
    if (!newsItem) return []
    const source = allNews
    const ids = new Set([newsItem.slug, ...related.map((r) => r.slug)])
    const pool = source.filter((n) => !ids.has(n.slug))
    return pickRandom(pool, 3) as NewsItem[]
  }, [newsItem, related, allNews])

  if (loading) {
    return (
      <div className='min-h-screen flex flex-col bg-background'>
        <main className='flex-1'>
          <div className='container mx-auto py-10 px-4 md:px-6 mb-12'>
            {/* Breadcrumb skeleton */}
            <div className='mb-4 flex items-center gap-2'>
              <SkeletonBlock className='h-8 w-20 rounded-full' />
              <SkeletonBlock className='h-8 w-16 rounded-full' />
              <SkeletonBlock className='h-8 w-40 rounded-full' />
            </div>

            {/* Hero skeleton */}
            <SkeletonBlock className='w-full h-[320px] md:h-[420px] rounded-xl ring-1 ring-black/10 shadow' />

            {/* Main + Sidebar skeleton */}
            <div className='mt-10 grid grid-cols-1 lg:grid-cols-4 gap-10'>
              {/* MAIN */}
              <div className='lg:col-span-3'>
                <SkeletonBlock className='h-4 w-56 mb-3' />
                <SkeletonBlock className='h-8 w-3/4 mb-2' />
                <SkeletonBlock className='h-8 w-2/3 mb-4' />
                <div className='flex gap-2 mb-6'>
                  <SkeletonBlock className='h-6 w-16 rounded-full' />
                  <SkeletonBlock className='h-6 w-20 rounded-full' />
                  <SkeletonBlock className='h-6 w-14 rounded-full' />
                </div>
                <div className='space-y-3'>
                  <SkeletonBlock className='h-4 w-[95%]' />
                  <SkeletonBlock className='h-4 w-[90%]' />
                  <SkeletonBlock className='h-4 w-[92%]' />
                  <SkeletonBlock className='h-4 w-[88%]' />
                  <SkeletonBlock className='h-4 w-[70%]' />
                </div>
              </div>

              {/* SIDEBAR */}
              <div className='lg:col-span-1'>
                <SkeletonBlock className='h-6 w-48 mb-4' />
                <div className='space-y-6'>
                  {[0, 1, 2].map((i) => (
                    <div key={i}>
                      <SkeletonBlock className='w-full h-32 rounded-lg ring-1 ring-black/10 shadow' />
                      <SkeletonBlock className='h-3 w-32 mt-2' />
                      <SkeletonBlock className='h-4 w-48 mt-1' />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!newsItem && !loading) {
    return (
      <div className='min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950'>
        <main className='flex-1 flex items-center justify-center'>
          <div className='max-w-md mx-auto text-center px-6'>
            <div className='mx-auto w-14 h-14 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 flex items-center justify-center shadow-sm ring-1 ring-rose-200/60 dark:ring-rose-900/40'>
              <AlertTriangle className='w-7 h-7' />
            </div>
            <h2 className='mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
              Something's wrong to the page
            </h2>
            <p className='mt-2 text-slate-600 dark:text-slate-300'>
              We couldn’t load this news article. It might be unavailable or there was a connection hiccup.
            </p>
            <div className='mt-6 flex items-center justify-center gap-3'>
              <Button variant='default' onClick={() => router.refresh()}>
                Try again
              </Button>
              <Link href='/news'>
                <Button variant='outline'>Back to news</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // At this point, loading is false and newsItem exists
  const item = newsItem as NewsItem

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <main className='flex-1'>
        <div className='container mx-auto py-10 px-4 md:px-6 mb-12'>
          {/* Breadcrumbs */}
          <FadeIn>
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
                    title={item.title}
                  >
                    {item.title}
                  </span>
                </li>
              </ol>
            </nav>
          </FadeIn>

          {/* HERO */}
          <PopInItem className='relative rounded-xl ring-1 ring-black/10 shadow'>
            <div className='flex items-stretch gap-4'>
              <div className='relative w-full rounded-xl overflow-hidden bg-black/5'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className='w-full h-[320px] md:h-[420px] object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent' />
              </div>
            </div>
          </PopInItem>

          {/* Main + Sidebar */}
          <div className='mt-10 grid grid-cols-1 lg:grid-cols-4 gap-10'>
            {/* MAIN */}
            <article className='lg:col-span-3'>
              <StaggerContainer delayChildren={0.05} stagger={0.08}>
                <FadeInItem>
                  <div className='text-sm text-slate-600 font-semibold mb-2'>
                    <span>{item.author}</span> •{' '}
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </FadeInItem>

                <FadeInItem>
                  <h1 className='text-3xl md:text-4xl font-extrabold leading-tight tracking-wide text-slate-900'>
                    {item.title}
                  </h1>
                </FadeInItem>

                <FadeInItem>
                  <div className='mt-3 flex items-center gap-4 text-slate-500 text-sm'>
                    <span className='inline-flex items-center gap-1'>
                      <User className='h-4 w-4' /> {item.author}
                    </span>
                    <span className='inline-flex items-center gap-1'>
                      <Calendar className='h-4 w-4' />{' '}
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    <span className='inline-flex items-center gap-1'>
                      <Eye className='h-4 w-4' /> {item.views ?? 0}
                    </span>
                  </div>
                </FadeInItem>
              </StaggerContainer>

              {/* Tags */}
              {item.tags?.length > 0 && (
                <StaggerContainer
                  className='mt-4 flex flex-wrap gap-2'
                  delayChildren={0.03}
                  stagger={0.06}
                >
                  {item.tags.map((tag) => (
                    <FadeInItem key={tag}>
                      <Badge
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
                    </FadeInItem>
                  ))}
                </StaggerContainer>
              )}

              {/* Content (no animation to avoid late render on mobile) */}
              <ArticleBody content={item.content} />
            </article>

            {/* SIDEBAR */}
            <aside className='lg:col-span-1'>
              <FadeIn>
                <h3 className='text-slate-900 font-extrabold tracking-wide uppercase'>
                  Related Updates{' '}
                  <span className='text-slate-500'>in this topic</span>
                </h3>
              </FadeIn>

              <StaggerContainer
                className='mt-4 space-y-6'
                delayChildren={0.05}
                stagger={0.08}
              >
                {related.map((item) => (
                  <PopInItem key={item.slug} className='block'>
                    <Link href={`/news/${item.slug}`} className='block group'>
                      <div className='relative rounded-lg overflow-hidden ring-1 ring-black/10 shadow bg-white'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className='w-full h-32 object-cover group-hover:scale-[1.02] transition'
                        />
                      </div>
                      <div className='mt-2 text-xs text-slate-600'>
                        {item.author} •{' '}
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                      <h4 className='mt-1 font-bold leading-snug group-hover:underline'>
                        {item.title}
                      </h4>
                    </Link>
                  </PopInItem>
                ))}
              </StaggerContainer>

              {related.length < 4 && (
                <div className='mt-8 border-t pt-6'>
                  <FadeIn>
                    <h4 className='text-slate-900 font-extrabold tracking-wide uppercase text-sm'>
                      More updates
                    </h4>
                  </FadeIn>
                  <StaggerContainer
                    className='mt-4 space-y-6'
                    delayChildren={0.05}
                    stagger={0.08}
                  >
                    {moreRandomBelow.map((item) => (
                      <PopInItem key={item.slug} className='block'>
                        <Link
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
                            {item.author} •{' '}
                            {new Date(item.date).toLocaleDateString()}
                          </div>
                          <h4 className='mt-1 font-bold leading-snug group-hover:underline'>
                            {item.title}
                          </h4>
                        </Link>
                      </PopInItem>
                    ))}
                  </StaggerContainer>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
