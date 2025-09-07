'use client'

import * as React from 'react'
import { HighlightTitle } from '../ui/highlight-title'
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import {
  FadeIn,
  StaggerContainer,
  FadeInItem,
  PopInItem,
} from '@/components/ui/motion'

// lazy modal
const EventModal = dynamic(() => import('@/components/events/event-modal'), {
  ssr: false,
})

/* ──────────────────────────────────────────────────────────────────────────
   Areas (from your org chart)
   ────────────────────────────────────────────────────────────────────────── */
const AREA_LABEL: Record<string, string> = {
  'Area 1': 'NCR & Central Luzon',
  'Area 2': 'Northern Luzon',
  'Area 3': 'Southern Luzon',
  'Area 4': 'Visayas',
  'Area 5': 'Mindanao',
  Nationwide: 'Nationwide',
}

const AREA_PILL_CLASS: Record<string, string> = {
  'Area 1':
    'bg-gradient-to-r from-yellow-500/90 via-amber-500/90 to-orange-500/90 text-white',
  'Area 2':
    'bg-gradient-to-r from-sky-600/90 via-blue-600/90 to-indigo-600/90 text-white',
  'Area 3':
    'bg-gradient-to-r from-emerald-600/90 via-green-600/90 to-teal-600/90 text-white',
  'Area 4':
    'bg-gradient-to-r from-cyan-600/90 via-teal-600/90 to-sky-600/90 text-white',
  'Area 5':
    'bg-gradient-to-r from-fuchsia-600/90 via-rose-600/90 to-pink-600/90 text-white',
  Nationwide: 'bg-gray-900/85 text-white',
}

export type Event = {
  id: number | string
  _id?: string
  title: string
  date: string
  end?: string
  location: string
  area: 'Area 1' | 'Area 2' | 'Area 3' | 'Area 4' | 'Area 5' | 'Nationwide'
  region: string
  church?: string
  image: string
  button?: string
  href?: string
}

/** Stable order for tabs (always render them) */
const ORDERED_AREAS: Event['area'][] = [
  'Area 1',
  'Area 2',
  'Area 3',
  'Area 4',
  'Area 5',
  'Nationwide',
] as const

type AreaTab = 'All' | Event['area']

/* ──────────────────────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────────────────────── */
function fmtTime(d: Date) {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
function fmtDate(d: Date) {
  return d.toLocaleDateString([], { month: 'long', day: 'numeric' })
}

export function UpcomingEventsSection({
  eyebrow = 'Community Calendar',
}: {
  eyebrow?: string
}) {
  const [selected, setSelected] = React.useState<Event | null>(null)
  const [items, setItems] = React.useState<Event[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  /** Active tab — constant default */
  const [tab, setTab] = React.useState<AreaTab>('All')

  /** Counts (for dimming/disable) */
  const areaCounts = React.useMemo(() => {
    const m = new Map<Event['area'], number>()
    items.forEach((e) => m.set(e.area, (m.get(e.area) ?? 0) + 1))
    return m
  }, [items])

  /** Always render all tabs */
  const areaTabs: AreaTab[] = ['All', ...ORDERED_AREAS]
  const hasEvents = (a: Event['area']) => (areaCounts.get(a) ?? 0) > 0

  /** Filtered list for the current tab */
  const filtered = tab === 'All' ? items : items.filter((e) => e.area === tab)

  const railRef = React.useRef<HTMLDivElement>(null)
  const scroll = (dir: 'left' | 'right') => {
    const el = railRef.current
    if (!el) return
    const delta = Math.round(el.clientWidth * 0.8) * (dir === 'left' ? -1 : 1)
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  // Load events
  const load = React.useCallback(async () => {
    let cancelled = false
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/events', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as any[]

      if (!cancelled && Array.isArray(data)) {
        const normalized: Event[] = data.map((d, i) => {
          const normArea = String(d.area || '')
            .replace(/\s+/g, ' ')
            .trim()
          const safeArea = (
            ORDERED_AREAS.includes(normArea as any)
              ? (normArea as Event['area'])
              : 'Nationwide'
          ) as Event['area']
          return {
            ...d,
            id: d._id ?? d.id ?? `${d.title}-${d.date}-${i}`,
            area: safeArea,
          }
        })
        setItems(normalized)
      }
    } catch (e: any) {
      console.error('[home] failed to load /api/events', e)
      if (!cancelled) setError(e?.message || 'Failed to load events')
    } finally {
      if (!cancelled) setLoading(false)
    }
    return () => {
      cancelled = true
    }
  }, [])

  React.useEffect(() => {
    const cancel = load()
    return () => {
      if (typeof cancel === 'function') (cancel as any)()
    }
  }, [load])

  // Fallback image data URI
  const FALLBACK_EVENT_IMAGE_DATA_URI =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 630' preserveAspectRatio='xMidYMid slice'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#0ea5e9'/>
      <stop offset='50%' stop-color='#6366f1'/>
      <stop offset='100%' stop-color='#111827'/>
    </linearGradient>
  </defs>
  <rect width='1200' height='630' fill='url(#g)'/>
</svg>`)

  function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget
    if (img.dataset.fallbackTried !== '1') {
      img.dataset.fallbackTried = '1'
      img.src = FALLBACK_EVENT_IMAGE_DATA_URI
    }
  }

  return (
    <section className='relative overflow-hidden'>
      {/* Top angled accent */}
      <svg
        className='absolute -top-24 left-0 w-full h-40 text-[#2f4b4e]'
        viewBox='0 0 1440 160'
        preserveAspectRatio='none'
      >
        <path d='M0,160 L1440,0 L1440,160 Z' fill='currentColor' />
      </svg>

      <div className='relative bg-gray-800'>
        <div className='container mx-auto px-4 md:px-6 py-16'>
          {/* Eyebrow */}
          <FadeIn y={10} delay={0.02}>
            <div className='mb-2 flex items-center justify-center gap-2'>
              <Sparkles className='h-3.5 w-3.5 text-amber-300' />
              <span className='text-[11px] md:text-xs font-extrabold tracking-[0.25em] uppercase text-amber-300'>
                {eyebrow}
              </span>
            </div>
          </FadeIn>

          <FadeIn y={12} delay={0.08}>
            <div className='flex items-center justify-center gap-3 mb-2'>
              <HighlightTitle
                text="Events you don't want to miss"
                highlightedText="don't want to miss"
                as='h2'
                className='text-2xl md:text-4xl text-white text-center tracking-wider'
                uppercase
                gradientClassName='bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent'
              />
            </div>
          </FadeIn>
          <FadeIn y={10} delay={0.14}>
            <p className='text-center text-[rgba(204,250,241,0.9)] max-w-2xl mx-auto mb-8'>
              Filter by area to find gatherings near you.
            </p>
          </FadeIn>

          {/* Area Tabs (always visible) */}
          <StaggerContainer
            className='flex flex-wrap justify-center gap-2 md:gap-3 mb-8'
            delayChildren={0.04}
            stagger={0.05}
          >
            {areaTabs.map((a) => {
              const active = a === tab
              const disabled = a !== 'All' && !hasEvents(a as Event['area'])
              const label =
                a === 'All'
                  ? 'All Areas'
                  : `${a} • ${AREA_LABEL[a as keyof typeof AREA_LABEL] ?? ''}`
              return (
                <FadeInItem key={a}>
                  <button
                    onClick={() => !disabled && setTab(a)}
                    disabled={disabled}
                    aria-pressed={active}
                    className={[
                      'cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-extrabold tracking-wider uppercase transition-colors ring-1 backdrop-blur-sm',
                      active
                        ? 'bg-amber-300 text-gray-900 ring-amber-200'
                        : 'bg-white/10 text-white ring-white/20 hover:bg-white/20',
                      disabled ? 'opacity-45 cursor-not-allowed' : '',
                    ].join(' ')}
                  >
                    {label}
                    {a !== 'All' && (
                      <span className='ml-2 text-[10px] opacity-80'>
                        ({areaCounts.get(a as Event['area']) ?? 0})
                      </span>
                    )}
                  </button>
                </FadeInItem>
              )
            })}
          </StaggerContainer>

          {/* Carousel */}
          <div className='relative'>
            <div
              key={tab as string}
              ref={railRef}
              className='flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-2'
            >
              {/* Loading skeletons */}
              {loading && items.length === 0 && (
                <>
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className='snap-start w-[290px] md:w-[300px] lg:w-[320px] flex-shrink-0'
                    >
                      <div className='rounded-xl overflow-hidden ring-1 ring-black/10'>
                        <Skeleton className='h-44 w-full' />
                        <div className='p-4'>
                          <Skeleton className='h-4 w-40 mb-2' />
                          <Skeleton className='h-3 w-64 mb-1' />
                          <Skeleton className='h-3 w-52' />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Empty state for a tab */}
              {!loading && filtered.length === 0 && (
                <div className='px-2 py-10 text-center w-full'>
                  <div className='inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold bg-white/10 text-white ring-1 ring-white/20 backdrop-blur'>
                    No events in this area yet.
                  </div>
                </div>
              )}

              {filtered.map((event, idx) => {
                const start = new Date(event.date)
                const end = event.end ? new Date(event.end) : null
                const areaClass =
                  AREA_PILL_CLASS[event.area] || 'bg-black/80 text-white'
                const key =
                  (event as any)._id ??
                  (event as any).id ??
                  `${event.title}-${event.date}-${idx}`

                return (
                  <PopInItem
                    key={key}
                    delay={idx * 0.07}
                    duration={0.26}
                    className='snap-start w-[290px] md:w-[300px] lg:w-[320px] flex-shrink-0'
                  >
                    <div
                      role='button'
                      tabIndex={0}
                      onClick={() => setSelected(event)}
                      onKeyDown={(e) =>
                        (e.key === 'Enter' || e.key === ' ') &&
                        setSelected(event)
                      }
                      className='cursor-pointer group'
                    >
                      <div className='rounded-xl bg-white/95 shadow-xl overflow-hidden ring-1 ring-black/5 border-2 border-gray-800/70 group-hover:border-white duration-300'>
                        {/* Image */}
                        <div className='h-44 relative overflow-hidden'>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={event.image}
                            onError={handleImgError}
                            alt={event.title || 'Event image'}
                            loading='lazy'
                            decoding='async'
                            className='absolute inset-0 w-full h-full object-cover'
                          />
                          {/* subtle overlay */}
                          <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />
                          {/* Area pill */}
                          <div
                            className={[
                              'absolute top-2 left-2 rounded-full text-[10px] font-bold px-2 py-0.5 tracking-wider',
                              areaClass,
                            ].join(' ')}
                            title={AREA_LABEL[event.area] ?? event.area}
                          >
                            {event.area}
                          </div>
                        </div>

                        {/* Body */}
                        <div className='p-4'>
                          {/* Date + Time */}
                          <div className='flex items-center gap-3 text-xs text-slate-700 mb-2'>
                            <span className='inline-flex items-center gap-1.5'>
                              <Calendar className='h-4 w-4' />
                              {fmtDate(start)}
                            </span>
                            <span className='inline-flex items-center gap-1.5'>
                              <Clock className='h-4 w-4' />
                              {fmtTime(start)}
                              {end ? ` – ${fmtTime(end)}` : ''}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className='text-sm font-extrabold tracking-wider text-slate-900 uppercase'>
                            {event.title}
                          </h3>

                          {/* Location */}
                          <p className='mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest text-slate-500 uppercase'>
                            <MapPin className='h-3.5 w-3.5' />
                            {event.location}
                          </p>

                          {/* Chips: Region + Church */}
                          <div className='mt-3 flex flex-wrap gap-2'>
                            <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200 px-2 py-0.5 text-[10px] font-semibold'>
                              {event.region}
                            </span>
                            {event.church && (
                              <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200 px-2 py-0.5 text-[10px] font-semibold'>
                                <Building2 className='h-3 w-3' />
                                {event.church}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </PopInItem>
                )
              })}
            </div>

            {/* Error banner */}
            {error && !loading && (
              <div className='mt-4 mx-2 rounded-lg bg-red-50 text-red-800 border border-red-200 px-4 py-3 flex items-center justify-between'>
                <p className='text-sm'>Failed to load events. {error}</p>
                <button
                  className='cursor-pointer text-xs font-bold px-3 py-1.5 rounded-full border border-red-300 hover:bg-red-100'
                  onClick={() => load()}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Arrows */}
            <button
              aria-label='Previous'
              onClick={() => scroll('left')}
              className='hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white/85 text-slate-800 shadow hover:bg-white cursor-pointer'
            >
              <ChevronLeft className='h-5 w-5' />
            </button>

            <button
              aria-label='Next'
              onClick={() => scroll('right')}
              className='hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white/85 text-slate-800 shadow hover:bg-white cursor-pointer'
            >
              <ChevronRight className='h-5 w-5' />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom angled accent */}
      <svg
        className='absolute -bottom-24 left-0 w-full h-48 text-gray-700'
        viewBox='0 0 1440 160'
        preserveAspectRatio='none'
      >
        <path d='M0,0 L0,160 L1440,160 Z' fill='currentColor' />
      </svg>

      {selected && (
        <EventModal isOpen event={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  )
}
