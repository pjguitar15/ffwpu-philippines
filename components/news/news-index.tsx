'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Calendar,
  Eye,
  Heart,
  Grid3X3,
  Rows,
  Search,
  Tag as TagIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eyebrow } from '@/components/ui/eyebrow'
import { HighlightTitle } from '@/components/ui/highlight-title'
import { SectionShell } from '@/components/ui/section-shell'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { excerptFromHtml } from '@/lib/text'
import { PopInItem } from '@/components/ui/motion'

// Small testimonials preview component for news cards
function TestimonialsPreview({ items }: { items: Array<{ name: string; role?: string; avatar?: string; quote: string }> }) {
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
      </div>
    </div>
  )
}

export type NewsItem = {
  id: string
  slug: string
  title: string
  author: string
  date: string
  image: string
  tags: string[]
  status?: string
  views?: number
  likes?: number
  content?: string
  testimonials?: Array<{
    name: string
    role?: string
    avatar?: string
    quote: string
  }>
}

type Props = {
  items: NewsItem[]
  initialLimit?: number
  title?: string
  eyebrow?: string
}

export function NewsIndex({
  items,
  initialLimit = 12,
  title = 'Latest Updates & Stories',
  eyebrow = 'Updates • News & Events',
}: Props) {
  const [q, setQ] = useState('')
  const [activeTag, setActiveTag] = useState<string>('All')
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [limit, setLimit] = useState(initialLimit)
  const [showAllTags, setShowAllTags] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setQ(searchParams.get('q') || '')
  }, [searchParams])

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      if (q) params.set('q', q)
      else params.delete('q')
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  // Available tags sorted by frequency (most used first)
  const allTags = useMemo(() => {
    // Calculate frequency (count) for each tag
    const tagCounts = new Map<string, number>()

    items.forEach((item) => {
      if (item.status === 'published' || !item.status) {
        item.tags?.forEach((tag) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
        })
      }
    })

    // Sort tags by frequency (descending) - most used first
    const sortedTags = Array.from(tagCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([tag]) => tag)

    return ['All', ...sortedTags]
  }, [items])

  // Filter + sort
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    let list = items
      // Only show published items if status provided; otherwise assume published
      .filter((i) => (i.status ? i.status === 'published' : true))
      .filter((i) =>
        !needle
          ? true
          : i.title.toLowerCase().includes(needle) ||
            (i.content ?? '').toLowerCase().includes(needle) ||
            (i.tags || []).some((t) => t.toLowerCase().includes(needle)),
      )
      .filter((i) =>
        activeTag === 'All' ? true : (i.tags || []).includes(activeTag),
      )

    const time = (d: string) => new Date(d).getTime() || 0

    list = list.sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return time(a.date) - time(b.date) // oldest first
        case 'newest':
        default:
          return time(b.date) - time(a.date) // newest first
      }
    })
    return list
  }, [items, q, activeTag, sort])

  const visible = filtered.slice(0, limit)
  const canLoadMore = visible.length < filtered.length

  // Deterministic gradient per tag (matches homepage)
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
    <SectionShell className='overflow-hidden'>
      {/* Header */}
      <div className='container mx-auto space-y-6'>
        <div className='space-y-3 text-center md:text-left'>
          <Eyebrow>{eyebrow}</Eyebrow>
          <HighlightTitle
            as='h1'
            text={title}
            highlightedText='Updates'
            uppercase
            className='text-2xl md:text-4xl'
            gradientClassName='bg-gradient-to-r from-indigo-900 via-blue-800 to-sky-700 bg-clip-text text-transparent'
          />
        </div>

        {/* Controls */}
        <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          {/* Search */}
          <div className='relative w-full md:max-w-md'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500' />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                setLimit(initialLimit)
              }}
              placeholder='Search updates, tags, people…'
              className='w-full rounded-xl border bg-white px-9 py-2.5 text-sm outline-none ring-0 focus:border-slate-300'
            />
          </div>

          {/* Sort + View */}
          <div className='flex items-center gap-2'>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className='rounded-xl border bg-white px-3 py-2 text-sm cursor-pointer'
            >
              <option className='cursor-pointer' value='newest'>
                Newest
              </option>
              <option className='cursor-pointer' value='oldest'>
                Oldest
              </option>
              {/* <option value='views'>Most viewed</option>
              <option value='likes'>Most liked</option> */}
            </select>

            <div className='ml-1 inline-flex rounded-xl border overflow-hidden'>
              <button
                aria-label='Grid view'
                onClick={() => setView('grid')}
                className={`cursor-pointer px-3 py-2 ${
                  view === 'grid' ? 'bg-slate-100' : ''
                }`}
              >
                <Grid3X3 className='h-4 w-4' />
              </button>
              <button
                aria-label='List view'
                onClick={() => setView('list')}
                className={`cursor-pointer px-3 py-2 ${
                  view === 'list' ? 'bg-slate-100' : ''
                }`}
              >
                <Rows className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className='flex items-center gap-2 overflow-x-auto pt-1 pb-2'>
          <span className='inline-flex items-center gap-1 text-xs uppercase tracking-wide text-slate-500'>
            <TagIcon className='h-3.5 w-3.5' /> Tags:
          </span>
          {/* Show first 8 tags when collapsed, all when expanded */}
          {(showAllTags ? allTags : allTags.slice(0, 9)).map((t) => (
            <button
              key={t}
              onClick={() => {
                setActiveTag(t)
                setLimit(initialLimit)
              }}
              className={`capitalize whitespace-nowrap rounded-full border px-3 py-1.5 text-xs md:text-sm cursor-pointer hover:shadow-sm transition ${
                activeTag === t
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white hover:bg-slate-50'
              }`}
            >
              {t}
            </button>
          ))}
          {/* Show more/less button */}
          {allTags.length > 9 && (
            <button
              onClick={() => setShowAllTags(!showAllTags)}
              className='whitespace-nowrap rounded-full border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs md:text-sm cursor-pointer hover:bg-slate-200 transition flex items-center gap-1'
            >
              {showAllTags ? (
                'Show less'
              ) : (
                <>
                  <span>+{allTags.length - 9} more</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className='rounded-2xl border bg-white p-10 text-center'>
            <p className='text-slate-700 font-semibold'>
              No updates match your filters.
            </p>
            <p className='text-slate-500 text-sm mt-1'>
              Try clearing the search or switching tags.
            </p>
          </div>
        ) : view === 'grid' ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {visible.map((item, i) => (
              <PopInItem
                key={item.slug}
                delay={(i % 3) * 0.04 + Math.random() * 0.06}
                duration={0.22}
                className='group relative rounded-md overflow-hidden ring-1 ring-black/10 hover:shadow-lg transition'
              >
                <Link href={`/news/${item.slug}`} className='block bg-white'>
                  <div className='relative h-44 md:h-52'>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, 33vw'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent' />
                    <div className='absolute bottom-2 left-2 flex gap-2'>
                      {(item.tags || []).slice(0, 1).map((tag) => (
                        <Badge
                          key={tag}
                          className={`capitalize border-0 ${tagGradient(tag)}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {/* Add testimonials preview */}
                    {item.testimonials && item.testimonials.length > 0 && (
                      <TestimonialsPreview items={item.testimonials} />
                    )}
                  </div>
                  <div className='p-4'>
                    <div className='text-xs text-slate-500 flex items-center gap-3'>
                      <span className='inline-flex items-center gap-1'>
                        <Calendar className='h-3.5 w-3.5' />
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                      <span className='inline-flex items-center gap-1'>
                        <Eye className='h-3.5 w-3.5' /> {item.views ?? 0}
                      </span>
                      {/* <span className='inline-flex items-center gap-1'>
                      <Heart className='h-3.5 w-3.5' /> {item.likes ?? 0}
                    </span> */}
                    </div>
                    <h3 className='mt-2 font-extrabold leading-snug tracking-wide cursor-pointer hover:underline transition-all duration-200 ease-in-out'>
                      {item.title}
                    </h3>
                    <p className='mt-1 text-sm text-slate-600 line-clamp-2'>
                      {/* this too */}
                      {excerptFromHtml(item?.content || '', 180)}
                    </p>
                  </div>
                </Link>
              </PopInItem>
            ))}
          </div>
        ) : (
          // List view
          <div className='space-y-4'>
            {visible.map((item, i) => (
              <PopInItem
                key={item.slug}
                delay={(i % 4) * 0.05 + Math.random() * 0.08}
                duration={0.22}
                className='group grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 rounded-md overflow-hidden ring-1 ring-black/10 hover:shadow-lg transition'
              >
                <Link href={`/news/${item.slug}`} className='contents bg-white'>
                  <div className='relative h-44 md:h-full'>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className='object-cover'
                      sizes='260px'
                    />
                    <div className='absolute bottom-2 left-2 flex gap-2'>
                      {(item.tags || []).slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          className={`capitalize border-0 ${tagGradient(tag)}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {/* Add testimonials preview */}
                    {item.testimonials && item.testimonials.length > 0 && (
                      <TestimonialsPreview items={item.testimonials} />
                    )}
                  </div>
                  <div className='p-4'>
                    <div className='text-xs text-slate-500 flex items-center gap-3'>
                      <span className='inline-flex items-center gap-1'>
                        <Calendar className='h-3.5 w-3.5' />
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                      <span className='inline-flex items-center gap-1'>
                        <Eye className='h-3.5 w-3.5' /> {item.views ?? 0}
                      </span>
                      {/* <span className='inline-flex items-center gap-1'>
                      <Heart className='h-3.5 w-3.5' /> {item.likes ?? 0}
                    </span> */}
                    </div>
                    <h3 className='mt-1 font-extrabold tracking-wide cursor-pointer hover:underline transition-all duration-200 ease-in-out'>
                      {item.title}
                    </h3>
                    <p className='mt-1 text-sm text-slate-600 line-clamp-2'>
                      {excerptFromHtml(item?.content || '', 180)}
                    </p>
                  </div>
                </Link>
              </PopInItem>
            ))}
          </div>
        )}

        {/* Pager */}
        {canLoadMore && (
          <div className='flex justify-center pt-6'>
            <Button
              onClick={() => setLimit((n) => n + initialLimit)}
              className='rounded-xl'
            >
              Load more
            </Button>
          </div>
        )}
      </div>
    </SectionShell>
  )
}
