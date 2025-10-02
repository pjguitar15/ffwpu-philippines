'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  User,
  Home,
  ChevronRight,
  Eye,
  AlertTriangle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ArticleBody } from './article-body'
import {
  FadeIn,
  FadeInItem,
  StaggerContainer,
  PopInItem,
} from '@/components/ui/motion'
import CuteNewsCta from '../CuteNewsCta'

// Tag gradient helpers
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

type Testimonial = {
  name: string
  role?: string
  avatar?: string
  quote: string
}

type NewsItem = {
  id: string
  slug: string
  title: string
  subtitle?: string
  author: string
  date: string
  image: string
  gallery?: string[]
  tags: string[]
  status: string
  views: number
  likes: number
  content: string
  comments: any[]
  testimonials?: Testimonial[]
}

export function TestimonialsSection({ items }: { items: Testimonial[] }) {
  if (!items?.length) return null
  return (
    <section aria-labelledby='testimonials-title' className='mt-10 md:mt-12'>
      <div className='text-center mb-8 md:mb-10'>
        <p className='mt-2 text-sm md:text-base text-slate-600'>
          Reflections shared by participants during this event.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {items.slice(0, 3).map((t, i) => (
          <article
            key={i}
            className='relative rounded-xl border border-slate-200 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow'
          >
            <div className='absolute -top-7 left-1/2 -translate-x-1/2 h-14 w-14 rounded-full ring-4 ring-white overflow-hidden shadow'>
              {t.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.avatar}
                  alt={`${t.name} avatar`}
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='h-full w-full grid place-items-center bg-slate-200 text-slate-600 text-base font-semibold'>
                  {t.name?.[0]?.toUpperCase() ?? '⦿'}
                </div>
              )}
            </div>

            <div className='px-5 pb-5 pt-10'>
              <p className='text-slate-700 leading-relaxed'>
                <span className='text-amber-500 text-xl align-top'>“</span>
                {t.quote}
                <span className='text-amber-500 text-xl align-top'>”</span>
              </p>
              <div className='mt-4'>
                <p className='font-semibold text-amber-600'>{t.name}</p>
                {t.role && <p className='text-xs text-slate-500'>{t.role}</p>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function GallerySection({
  images,
  title,
}: {
  images: string[]
  title: string
}) {
  const items = (images || [])
    .map((src) => (typeof src === 'string' ? src.trim() : ''))
    .filter(Boolean)
    .slice(0, 12)

  if (!items.length) return null

  return (
    <section aria-labelledby='gallery-title' className='mt-10 md:mt-12'>
      <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-4'>
        <div>
          <h2
            id='gallery-title'
            className='text-xl font-semibold text-slate-900 tracking-wide uppercase'
          >
            Gallery
          </h2>
          <p className='text-sm text-slate-600'>
            Moments captured during this update.
          </p>
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {items.map((src, idx) => (
          <div
            key={`${src}-${idx}`}
            className='overflow-hidden rounded-lg ring-1 ring-black/10 shadow bg-white'
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${title} gallery image ${idx + 1}`}
              className='h-56 w-full object-cover'
            />
          </div>
        ))}
      </div>
    </section>
  )
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
      const isFromDatabase = (newsItem as any)._id || (newsItem as any).id
      if (isFromDatabase) {
        const trackView = async () => {
          try {
            const viewedKey = `viewed_${newsItem.slug}`
            const lastViewed = localStorage.getItem(viewedKey)
            const now = Date.now()
            const thirtyMinutes = 30 * 60 * 1000
            if (!lastViewed || now - parseInt(lastViewed) > thirtyMinutes) {
              const response = await fetch(`/api/news/${newsItem.slug}/views`, {
                method: 'POST',
              })
              const result = await response.json()
              if (result && typeof result.views === 'number') {
                setNewsItem((prev) =>
                  prev ? { ...prev, views: result.views } : prev,
                )
              }
              localStorage.setItem(viewedKey, now.toString())
            }
          } catch {}
        }
        const timer = setTimeout(trackView, 2000)
        return () => clearTimeout(timer)
      }
    }
  }, [newsItem])

  // Load all news (for related/more sections)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/news', { cache: 'no-store' })
        if (!res.ok) return

        const data = (await res.json()) as NewsItem[]
        const arr = Array.isArray(data) ? data.slice() : []

        // Fisher–Yates shuffle
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
        }

        if (mounted) setAllNews(arr)
      } catch {
        // noop
      }
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
              We couldn’t load this news article. It might be unavailable or
              there was a connection hiccup.
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

          <FadeIn>
            <header className='mb-4 md:mb-6'>
              <h1 className='text-3xl md:text-4xl font-extrabold leading-tight text-slate-900 uppercase tracking-[0.08em]'>
                {item.title}
              </h1>
              {item.subtitle && (
                <p className='mt-2 text-base md:text-lg text-slate-600 font-medium'>
                  {item.subtitle}
                </p>
              )}
            </header>
          </FadeIn>

          {/* HERO (title at the top, no meta on image) */}
          <PopInItem className='relative rounded-xl ring-1 ring-black/10 shadow overflow-hidden'>
            <div className='relative w-full'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className='w-full h-[320px] md:h-[420px] object-cover'
              />
            </div>
          </PopInItem>

          {/* Main + Sidebar */}
          <div className='mt-10 grid grid-cols-1 lg:grid-cols-4 gap-10'>
            {/* MAIN */}
            <article className='lg:col-span-3'>
              <StaggerContainer delayChildren={0.05} stagger={0.08}>
                {/* Title removed here (now in hero) */}

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

              {/* Content */}
              <ArticleBody content={item.content} />
              <GallerySection images={item.gallery || []} title={item.title} />
              <hr className='mt-8' />
              {/* Testimonials under the article body */}
              <TestimonialsSection items={item.testimonials || []} />
              <CuteNewsCta />
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

