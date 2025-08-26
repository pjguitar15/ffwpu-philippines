'use client'

import * as React from 'react'
import { X, Calendar, Clock, MapPin } from 'lucide-react'

type EventItem = {
  id: number
  title: string
  date: string
  end?: string
  location: string
  image: string
  button?: string
  region: string
}

type EventModalProps = {
  isOpen: boolean
  event: EventItem | null
  onClose: () => void
}

export default function EventModal({
  isOpen,
  event,
  onClose,
}: EventModalProps) {
  if (!isOpen || !event) return null

  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onEsc)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const start = new Date(event.date)
  const end = event.end ? new Date(event.end) : undefined

  return (
    <div className='fixed inset-0 z-[100]'>
      {/* Backdrop: click OUTSIDE closes */}
      <div
        className='absolute inset-0 bg-black/70 backdrop-blur-sm'
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Dialog */}
      <div
        role='dialog'
        aria-modal='true'
        className='absolute inset-0 flex items-center justify-center p-4'
        onClick={onClose}
      >
        {/* NOTE: no onClick here so clicks inside DO NOT close */}
        <div
          className='relative w-full max-w-7xl h-[50vh] rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl bg-black'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Big image */}
          <img
            src={event.image}
            alt={event.title}
            className='absolute inset-0 w-full h-full object-cover'
            loading='eager'
            decoding='async'
            onError={(e) => {
              const FALLBACK =
                'data:image/svg+xml;utf8,' +
                encodeURIComponent(
                  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 630'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#0ea5e9'/><stop offset='50%' stop-color='#6366f1'/><stop offset='100%' stop-color='#0b1020'/></linearGradient></defs><rect width='1200' height='630' fill='url(#g)'/></svg>`,
                )
              const img = e.currentTarget as HTMLImageElement
              if (img.dataset.fallbackTried !== '1') {
                img.dataset.fallbackTried = '1'
                img.src = FALLBACK
              }
            }}
          />

          {/* Readability overlay */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10' />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label='Close'
            className='absolute top-4 right-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer'
          >
            <X className='h-5 w-5' />
          </button>

          {/* Details overlay */}
          <div className='absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10 text-white space-y-4'>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-[10px] md:text-xs font-semibold uppercase tracking-widest'>
              {event.region}
            </div>

            <h3 className='text-2xl md:text-4xl font-extrabold tracking-wide uppercase'>
              {event.title}
            </h3>

            <div className='flex flex-wrap items-center gap-4 text-sm text-white/90'>
              <span className='inline-flex items-center gap-2'>
                <Calendar className='h-4 w-4' />
                {new Intl.DateTimeFormat('en-PH', {
                  timeZone: 'Asia/Manila',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }).format(start)}
              </span>
              <span className='inline-flex items-center gap-2'>
                <Clock className='h-4 w-4' />
                {new Intl.DateTimeFormat('en-PH', {
                  timeZone: 'Asia/Manila',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(start)}
                {end
                  ? ` – ${new Intl.DateTimeFormat('en-PH', {
                      timeZone: 'Asia/Manila',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(end)}`
                  : ''}
              </span>
              <span className='inline-flex items-center gap-2'>
                <MapPin className='h-4 w-4' />
                {event.location}
              </span>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
