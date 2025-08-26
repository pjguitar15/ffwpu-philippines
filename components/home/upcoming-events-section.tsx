'use client'

import * as React from 'react'
import { HighlightTitle } from '../ui/highlight-title'
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import dynamic from 'next/dynamic'

const EventModal = dynamic(
  () => import('@/components/events/event-modal'),
  { ssr: false }, // <-- avoids creating an SSR client boundary placeholder
)

export const events = [
  {
    id: 1,
    title: 'Community Teaching (Antipolo City)',
    date: '2025-02-15T09:00:00',
    end: '2025-02-15T12:00:00',
    location: 'Sitio Upper Hinapao, Antipolo City, Rizal',
    region: 'Region IV-A',
    image:
      'https://familyfedihq.org/wp-content/uploads/2025/02/ph-cm-tc-2-1024x613.jpg',
    button: 'Read Report',
  }, // :contentReference[oaicite:0]{index=0}

  {
    id: 2,
    title: 'Fusion Fest 2025 — CIG Asia Pacific Youth Assembly',
    date: '2025-07-27T09:00:00',
    end: '2025-07-27T21:00:00',
    location: 'Metrotent Convention Center, Pasig City',
    region: 'NCR',
    image: 'https://familyfedihq.org/wp-content/uploads/2025/07/3-1024x576.jpg',
    button: 'Event Recap',
  }, // :contentReference[oaicite:1]{index=1}

  {
    id: 3,
    title: 'National Unified Sunday Service',
    date: '2024-03-03T10:00:00',
    end: '2024-03-03T12:00:00',
    location: 'FFWPU Metro Manila Family Church, Quezon City',
    region: 'NCR',
    image:
      'https://familyfedihq.org/wp-content/uploads/2024/03/ph-ss-1024x558.jpg',
    button: 'Read Report',
  }, // :contentReference[oaicite:2]{index=2}

  {
    id: 4,
    title: 'HJ CheonBo Special Event (Metro Manila)',
    date: '2024-07-20T09:00:00',
    end: '2024-07-21T17:00:00',
    location: 'FFWPU Metro Manila Family Church',
    region: 'NCR',
    image:
      'https://familyfedihq.org/wp-content/uploads/2024/07/cwsp4-1024x544.jpg',
    button: 'Highlights',
  }, // :contentReference[oaicite:3]{index=3}

  {
    id: 5,
    title: 'HJ CheonBo Special Event (La Union)',
    date: '2024-04-07T09:00:00',
    end: '2024-04-07T17:00:00',
    location: 'La Union, Philippines',
    region: 'Region I',
    image:
      'https://familyfedihq.org/wp-content/uploads/2024/04/cwsp1-1024x576.jpg',
    button: 'View Report',
  }, // :contentReference[oaicite:4]{index=4}

  {
    id: 6,
    title: 'CARP Healing Café (Homegroup Session)',
    date: '2024-10-06T14:00:00',
    end: '2024-10-06T17:00:00',
    location: 'FFWPU Philippines National HQ',
    region: 'NCR',
    image:
      'https://familyfedihq.org/wp-content/uploads/2024/10/CARP-ph-1024x576.jpg',
    button: 'See Story',
  }, // :contentReference[oaicite:5]{index=5}

  {
    id: 7,
    title: 'Hyojeong U-20 Youth Witnessing Festival',
    date: '2024-10-12T09:00:00',
    end: '2024-10-12T17:00:00',
    location: 'Philippines (CARP / Youth)',
    region: 'Nationwide',
    image:
      'https://familyfedihq.org/wp-content/uploads/2024/10/U-20-Philippines-4-1024x576.jpg',
    button: 'See Photos',
  }, // :contentReference[oaicite:6]{index=6}
]

type Event = {
  id: number
  title: string
  date: string
  end?: string
  location: string
  image: string
  button?: string
  region: string
}

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
  const [show, setShow] = React.useState(false)
  const [selected, setSelected] = React.useState<Event | null>(null)

  const regions = React.useMemo(() => {
    const set = new Set<string>()
    events.forEach((e) => e.region && set.add(e.region))
    return Array.from(set)
  }, [events])

  const TABS = ['All', ...regions]
  const [tab, setTab] = React.useState(TABS[0])

  const filtered =
    tab === 'All'
      ? events
      : events.filter((e) =>
          (e.region || '').toLowerCase().includes(tab.toLowerCase()),
        )

  const railRef = React.useRef<HTMLDivElement>(null)
  const scroll = (dir: 'left' | 'right') => {
    const el = railRef.current
    if (!el) return
    const delta = Math.round(el.clientWidth * 0.8) * (dir === 'left' ? -1 : 1)
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  React.useEffect(() => {
    if (railRef.current) railRef.current.scrollTo({ left: 0, behavior: 'auto' })
    setShow(false)
    const t = setTimeout(() => setShow(true), 30)
    return () => clearTimeout(t)
  }, [tab])

  // at top of the file (or a config/constants file)
  const DEFAULT_EVENT_IMAGE =
    // Unsplash gradient (free to hotlink; license allows it)
    'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1600&q=80'

  // final fallback: inline SVG gradient (never 404s)
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

  // helper to swap in safe fallbacks on error
  function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget
    if (img.dataset.fallbackTried !== '1') {
      img.dataset.fallbackTried = '1'
      img.src = FALLBACK_EVENT_IMAGE_DATA_URI // last-resort, always-available
    }
  }

  return (
    <section className='relative overflow-hidden'>
      {/* Top angled SVG */}
      <svg
        className='absolute -top-24 left-0 w-full h-40 text-[#2f4b4e]'
        viewBox='0 0 1440 160'
        preserveAspectRatio='none'
      >
        <path d='M0,160 L1440,0 L1440,160 Z' fill='currentColor' />
      </svg>

      {/* Background */}
      <div className='relative bg-gray-800'>
        <div className='container mx-auto px-4 md:px-6 py-16'>
          {/* Eyebrow */}
          <div className='mb-2 flex items-center justify-center gap-2'>
            <Sparkles className='h-3.5 w-3.5 text-amber-300' />
            <span className='text-[11px] md:text-xs font-extrabold tracking-[0.25em] uppercase text-amber-300/90'>
              {eyebrow}
            </span>
          </div>

          <HighlightTitle
            text="Events you don't want to miss"
            highlightedText="don't want to miss"
            as='h2'
            className='text-2xl md:text-4xl text-white text-center mb-2 tracking-wider'
            uppercase
            gradientClassName='bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent'
          />
          <p className='text-center text-teal-100/90 max-w-2xl mx-auto mb-8'>
            Stay in the loop with upcoming gatherings and opportunities to
            connect.
          </p>

          {/* Tabs */}
          <div className='flex justify-center gap-6 md:gap-10 mb-8'>
            {TABS.map((t) => {
              const active = t === tab
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative uppercase tracking-wider text-xs md:text-sm font-extrabold transition-colors cursor-pointer
                    ${
                      active
                        ? 'text-amber-300'
                        : 'text-teal-100/80 hover:text-white'
                    }`}
                >
                  {t}
                  <span
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 rounded 
                    ${
                      active ? 'w-10 bg-amber-300' : 'w-0 bg-transparent'
                    } transition-all`}
                  />
                </button>
              )
            })}
          </div>

          {/* Carousel */}
          <div className='relative'>
            {/* Rail */}
            <div
              key={tab}
              ref={railRef}
              className='flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory
                         [scrollbar-width:none] [-ms-overflow-style:none] 
                         [&::-webkit-scrollbar]:hidden px-2'
            >
              {filtered.map((event, idx) => {
                const start = new Date(event.date)
                const end = event.end ? new Date(event.end) : null
                return (
                  <div
                    key={event.id}
                    role='button'
                    tabIndex={0}
                    onClick={() => setSelected(event)}
                    onKeyDown={(e) =>
                      (e.key === 'Enter' || e.key === ' ') && setSelected(event)
                    }
                    className={[
                      'snap-start w-[290px] md:w-[300px] lg:w-[320px] flex-shrink-0 cursor-pointer group',
                      'motion-safe:transition-[opacity,transform,filter] motion-safe:duration-300 motion-safe:ease-out',
                      show
                        ? 'opacity-100 translate-y-0 blur-0'
                        : 'opacity-0 translate-y-2 blur-[1px]',
                    ].join(' ')}
                    style={{ transitionDelay: `${idx * 70}ms` }}
                  >
                    <div className='rounded-xl bg-white/95 shadow-xl overflow-hidden ring-1 ring-black/5 border-2 border-gray-800 group-hover:border-white duration-300'>
                      {/* Image */}
                      <div className='h-44 relative overflow-hidden'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={event.image || DEFAULT_EVENT_IMAGE}
                          onError={handleImgError}
                          alt={event.title || 'Event image'}
                          loading='lazy'
                          decoding='async'
                          className='absolute inset-0 w-full h-full object-cover'
                        />
                        {/* Region pill */}
                        <div className='absolute top-2 left-2 rounded-full bg-gray-900/80 text-white text-[10px] font-semibold px-2 py-0.5 tracking-wider'>
                          {event.region}
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
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Arrows */}
            <button
              aria-label='Previous'
              onClick={() => scroll('left')}
              className='hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center
                         rounded-full bg-white/85 text-slate-800 shadow hover:bg-white cursor-pointer'
            >
              <ChevronLeft className='h-5 w-5' />
            </button>
            <button
              aria-label='Next'
              onClick={() => scroll('right')}
              className='hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center
                         rounded-full bg-white/85 text-slate-800 shadow hover:bg-white cursor-pointer'
            >
              <ChevronRight className='h-5 w-5' />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom angled SVG */}
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
