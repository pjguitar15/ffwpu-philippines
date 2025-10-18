'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { NewsItem } from '@/data/news'
import { HighlightTitle } from '../ui/highlight-title'
import Image from 'next/image'
import { ArrowRight, Newspaper, ChevronDown } from 'lucide-react'
import * as React from 'react'
import { excerptFromHtml } from '@/lib/text'
import { Skeleton } from '@/components/ui/skeleton'
import { AnimatePresence, motion } from 'framer-motion'

type Testimonial = {
  name: string
  role?: string
  avatar?: string
  quote: string
}

type ExtendedNewsItem = NewsItem & {
  testimonials?: Testimonial[]
}

type Props = {
  // Optional fallback while dynamic data loads
  sampleNews?: ExtendedNewsItem[]
}

// Small testimonials preview component for home page
function TestimonialsPreview({ items }: { items: Testimonial[] }) {
  if (!items?.length) return null

  return (
    <div className='group/tooltip relative'>
      <div className='absolute top-3 right-3 bg-gradient-to-r from-amber-400/90 to-orange-400/90 backdrop-blur-sm border border-amber-300/50 rounded-full px-2 py-1 flex items-center gap-1 shadow-sm z-20 cursor-help transition-all duration-200 hover:from-amber-500/95 hover:to-orange-500/95 hover:scale-105'>
        <div className='flex -space-x-1'>
          {items.slice(0, 2).map((t, i) => (
            <div
              key={i}
              className='h-4 w-4 rounded-full ring-1 ring-white overflow-hidden bg-amber-100'
            >
              {t.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.avatar}
                  alt={`${t.name} avatar`}
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='h-full w-full grid place-items-center bg-amber-200 text-amber-800 text-[8px] font-bold'>
                  {t.name?.[0]?.toUpperCase() ?? '⦿'}
                </div>
              )}
            </div>
          ))}
        </div>
        <span className='text-[10px] font-semibold text-white leading-none'>
          {items.length} reflection{items.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Tooltip */}
      <div className='absolute top-12 right-3 bg-white/95 backdrop-blur-lg border border-amber-200 rounded-lg shadow-xl p-3 min-w-[280px] max-w-[320px] opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-30'>
        <div className='text-xs font-semibold text-amber-700 mb-2 border-b border-amber-100 pb-1'>
          Participant Reflections
        </div>
        <div className='space-y-2 max-h-[200px] overflow-y-auto'>
          {items.slice(0, 4).map((t, i) => (
            <div key={i} className='flex gap-2'>
              <div className='h-6 w-6 rounded-full ring-1 ring-amber-200 overflow-hidden bg-amber-100 flex-shrink-0'>
                {t.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.avatar}
                    alt={`${t.name} avatar`}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <div className='h-full w-full grid place-items-center bg-amber-200 text-amber-700 text-[10px] font-bold'>
                    {t.name?.[0]?.toUpperCase() ?? '⦿'}
                  </div>
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='text-[10px] font-medium text-amber-600'>
                  {t.name}
                  {t.role && (
                    <span className='text-slate-500 ml-1'>• {t.role}</span>
                  )}
                </div>
                <p className='text-[11px] text-slate-600 leading-relaxed mt-0.5'>
                  <span className='text-amber-500'>"</span>
                  {t.quote.length > 60
                    ? `${t.quote.substring(0, 60)}...`
                    : t.quote}
                  <span className='text-amber-500'>"</span>
                </p>
              </div>
            </div>
          ))}
          {items.length > 4 && (
            <div className='text-[10px] text-center text-slate-500 pt-1 border-t border-slate-100'>
              and {items.length - 4} more reflection
              {items.length - 4 !== 1 ? 's' : ''}...
            </div>
          )}
        </div>

        {/* Tooltip arrow */}
        <div className='absolute -top-1 right-4 w-2 h-2 bg-white/95 border-l border-t border-amber-200 rotate-45'></div>
      </div>
    </div>
  )
}

export function RecentNewsSection({ sampleNews = [] }: Props) {
  const [items, setItems] = React.useState<ExtendedNewsItem[]>(sampleNews)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)

  // Show 3 initially (feature + 2)
  const [visible, setVisible] = React.useState(9)
  const canLoadMore = visible < items.length

  const sortByDateDesc = (arr: ExtendedNewsItem[]) =>
    [...arr].sort(
      (a, b) =>
        new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime(),
    )

  const load = React.useCallback(async () => {
    let cancelled = false
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/news', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as ExtendedNewsItem[]
      if (!cancelled && Array.isArray(data)) setItems(data)
    } catch (e: any) {
      console.error('[home] failed to load /api/news', e)
      if (!cancelled) setError(e?.message || 'Failed to load updates')
    } finally {
      if (!cancelled) setLoading(false)
    }
    return () => {
      cancelled = true
    }
  }, [])

  React.useEffect(() => {
    // If sample data is provided, ensure it's sorted so the feature is the latest
    if (Array.isArray(sampleNews) && sampleNews.length > 0) {
      setItems(sortByDateDesc(sampleNews))
    }
    const cancel = load()
    return () => {
      if (typeof cancel === 'function') (cancel as any)()
    }
  }, [load])

  const clampedVisible = Math.min(visible, items.length)
  const feature = items[0]
  const side = items.slice(1, Math.min(3, clampedVisible))
  const rest = items.slice(3, clampedVisible)

  // Deterministic gradient per tag
  const gradients = [
    'from-indigo-600 via-blue-500 to-sky-500',
    'from-violet-600 via-purple-500 to-fuchsia-500',
    'from-emerald-600 via-green-500 to-teal-500',
    'from-rose-500 via-pink-500 to-fuchsia-500',
    'from-amber-500 via-orange-500 to-rose-500',
    'from-cyan-600 via-sky-500 to-indigo-500',
  ]
  const hash = (s: string) =>
    Array.from(s).reduce((h, ch) => ((h << 5) - h + ch.charCodeAt(0)) | 0, 0)
  const tagGradient = (t?: string) =>
    `bg-gradient-to-r ${
      gradients[Math.abs(hash(t || '')) % gradients.length]
    } text-white`

  return (
    <section id='updates' className='space-y-8 px-4 md:px-0'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0'>
        <div className='space-y-2'>
          <span className='text-xs font-semibold text-white bg-gray-700 mx-auto px-4 py-1 rounded-full'>
            Local News Update
          </span>
          <HighlightTitle
            text='Updates on the Philippine Providence'
            highlightedText='Philippine Providence'
            as='h2'
            uppercase
            className='text-2xl md:text-4xl mt-3'
            gradientClassName='bg-gradient-to-r from-indigo-900 via-blue-800 to-sky-800 bg-clip-text text-transparent'
          />
          <p className='text-muted-foreground'>
            Stay updated with our community happenings
          </p>
        </div>

        <Button
          asChild
          variant='outline'
          className='group cursor-pointer rounded-full border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-slate-400 px-4'
        >
          <Link
            href='/news'
            aria-label='View all updates'
            className='inline-flex items-center'
          >
            <Newspaper className='mr-2 h-4 w-4' />
            View All Updates
            <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5' />
          </Link>
        </Button>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className='rounded-lg bg-red-50 text-red-800 border border-red-200 px-4 py-3'>
          <div className='flex items-center justify-between'>
            <p className='text-sm'>Failed to load updates. {error}</p>
            <Button
              variant='outline'
              size='sm'
              className='ml-3'
              onClick={() => load()}
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[1fr]'>
        {/* Loading skeletons */}
        {loading && items.length === 0 && (
          <>
            <div className='md:col-span-2 md:row-span-2 aspect-[16/9] md:aspect-auto md:h-[500px] rounded-lg overflow-hidden ring-1 ring-black/10'>
              <Skeleton className='w-full h-full' />
            </div>
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className='aspect-[16/10] md:aspect-auto md:h-[240px] rounded-lg overflow-hidden ring-1 ring-black/10'
              >
                <Skeleton className='w-full h-full' />
              </div>
            ))}
          </>
        )}
        {/* FEATURED (spans 2 cols & 2 rows) */}
        {feature && (
          <Link
            href={`/news/${feature.slug}`}
            className='relative group rounded-lg overflow-hidden ring-1 ring-black/10
                       md:col-span-2 md:row-span-2
                       aspect-[16/9] md:aspect-auto md:h-[500px] bg-black/80'
          >
            <Image
              src={feature.image}
              alt={feature.title}
              fill
              priority
              sizes='(max-width: 768px) 100vw, 66vw'
              className='object-cover object-center opacity-85 md:group-hover:scale-105 transition-transform duration-500'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent md:group-hover:from-black/90 md:group-hover:via-black/60 transition-colors duration-300' />

            {/* Testimonials preview for featured article */}
            <TestimonialsPreview items={feature.testimonials || []} />

            <div className='relative z-10 flex flex-col justify-end h-full p-5 md:p-8'>
              <div className='mb-2'>
                <Badge
                  className={`font-semibold capitalize border-0 ${tagGradient(
                    feature.tags?.[0],
                  )}`}
                >
                  {feature.tags?.[0]}
                </Badge>
              </div>
              <h3 className='text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5 md:mb-2 line-clamp-2'>
                {feature.title}
              </h3>
              <div className='text-white/85 text-xs sm:text-sm mb-2'>
                {feature.author} &middot;{' '}
                {new Date(feature.date).toLocaleDateString()}
              </div>
              <div className='overflow-hidden relative'>
                <p className='text-white/90 text-sm sm:text-base line-clamp-2 md:line-clamp-3 transition-[max-height] duration-300 md:group-hover:line-clamp-none md:group-hover:max-h-32 max-h-12'>
                  {excerptFromHtml(feature.content, 180)}
                </p>
                <div className='absolute left-0 right-0 bottom-0 h-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none md:group-hover:opacity-0 transition-opacity duration-300' />
              </div>
            </div>
          </Link>
        )}

        {/* TWO SIDE CARDS (to the right on desktop) */}
        {side.map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.slug}`}
            className='relative group rounded-lg overflow-hidden ring-1 ring-black/10
                       bg-black/80 min-h-0
                       aspect-[16/10] md:aspect-auto md:h-[240px]'
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes='(max-width: 768px) 100vw, 33vw'
              className='object-cover object-center opacity-85 md:group-hover:scale-105 transition-transform duration-500'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent md:group-hover:from-black/90 md:group-hover:via-black/60 transition-colors duration-300' />

            {/* Testimonials preview for side card */}
            <TestimonialsPreview items={item.testimonials || []} />

            <div className='relative z-10 flex flex-col justify-end h-full p-4'>
              <div className='mb-1'>
                <Badge
                  className={`font-semibold capitalize border-0 ${tagGradient(
                    item.tags?.[0],
                  )}`}
                >
                  {item.tags?.[0]}
                </Badge>
              </div>
              <h4 className='text-base sm:text-lg font-bold text-white mb-1 line-clamp-2'>
                {item.title}
              </h4>
              <div className='text-white/80 text-xs'>
                {item.author} &middot;{' '}
                {new Date(item.date).toLocaleDateString()}
              </div>
              <div className='overflow-hidden relative'>
                <p className='text-white/90 text-xs sm:text-sm line-clamp-1'>
                  {excerptFromHtml(item.content, 180)}
                </p>
                <div className='absolute left-0 right-0 bottom-0 h-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none md:opacity-0' />
              </div>
            </div>
          </Link>
        ))}

        {/* MORE CARDS (flow under the feature) */}
        <AnimatePresence initial={false}>
          {rest.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
              className='group rounded-lg overflow-hidden ring-1 ring-black/10'
            >
              <Link
                href={`/news/${item.slug}`}
                className='relative block bg-black/80 min-h-0 aspect-[16/10] md:aspect-auto md:h-[240px]'
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes='(max-width: 768px) 100vw, 33vw'
                  className='object-cover object-center opacity-85 md:group-hover:scale-105 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent md:group-hover:from-black/90 md:group-hover:via-black/60 transition-colors duration-300' />

                {/* Testimonials preview for rest cards */}
                <TestimonialsPreview items={item.testimonials || []} />

                <div className='relative z-10 flex flex-col justify-end h-full p-4'>
                  <div className='mb-1'>
                    <Badge
                      className={`font-semibold capitalize border-0 ${tagGradient(
                        item.tags?.[0],
                      )}`}
                    >
                      {item.tags?.[0]}
                    </Badge>
                  </div>
                  <h4 className='text-base sm:text-lg font-bold text-white mb-1 line-clamp-2'>
                    {item.title}
                  </h4>
                  <div className='text-white/80 text-xs'>
                    {item.author} &middot;{' '}
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                  <p className='text-white/90 text-xs sm:text-sm line-clamp-1'>
                    {excerptFromHtml(item.content, 180)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load more */}
      {canLoadMore && (
        <div className='flex justify-center'>
          <Button
            variant='outline'
            onClick={() => setVisible((v) => Math.min(v + 3, items.length))}
            className='rounded-full border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-slate-400 inline-flex items-center cursor-pointer'
          >
            View more updates
            <ChevronDown className='ml-2 h-4 w-4' />
          </Button>
        </div>
      )}
    </section>
  )
}
