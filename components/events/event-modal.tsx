'use client'

import * as React from 'react'
import { X, Calendar, Clock, MapPin, ArrowRight } from 'lucide-react'

type EventItem = {
  id: number | string
  title: string
  date: string
  end?: string
  location: string
  image: string
  button?: string // if it looks like a URL (/ or http), we’ll render an <a>
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

  const isUrl =
    !!event.button &&
    (event.button.startsWith('http://') ||
      event.button.startsWith('https://') ||
      event.button.startsWith('/'))

  const buttonLabel = event.button
    ? isUrl
      ? 'Open details'
      : event.button
    : undefined

  return (
    <div className='fixed inset-0 z-[100]'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-[#0b1020]/80 backdrop-blur-sm'
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
        {/* Gradient frame */}
        <div
          className='relative w-full max-w-6xl rounded-3xl p-[1px] bg-gradient-to-br from-sky-500 via-blue-600 to-rose-500 shadow-[0_8px_40px_rgba(2,6,23,0.38)]'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glass body */}
          <div className='relative h-[60vh] rounded-[calc(theme(borderRadius.3xl)-1px)] overflow-hidden bg-[#0b1020]/90 ring-1 ring-white/10'>
            {/* Image */}
            <img
              src={event.image}
              alt={event.title}
              className='absolute inset-0 h-full w-full object-cover opacity-70'
              loading='eager'
              decoding='async'
              onError={(e) => {
                const FALLBACK =
                  'data:image/svg+xml;utf8,' +
                  encodeURIComponent(
                    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 630'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#0ea5e9'/><stop offset='50%' stop-color='#6366f1'/><stop offset='100%' stop-color='#e11d48'/></linearGradient></defs><rect width='1200' height='630' fill='url(#g)'/></svg>`,
                  )
                const img = e.currentTarget as HTMLImageElement
                if (img.dataset.fallbackTried !== '1') {
                  img.dataset.fallbackTried = '1'
                  img.src = FALLBACK
                }
              }}
            />

            {/* Readability overlays */}
            <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(59,130,246,0.25),transparent_60%)]' />
            <div className='absolute inset-0 bg-gradient-to-t from-[#0b1020]/90 via-[#0b1020]/40 to-transparent' />

            {/* Close */}
            <button
              onClick={onClose}
              aria-label='Close'
              className='absolute right-4 top-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer'
            >
              <X className='h-5 w-5' />
            </button>

            {/* Content */}
            <div className='absolute inset-x-0 bottom-0 z-20 p-6 md:p-10 text-white'>
              {/* Region pill */}
              <div className='inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ring-1 ring-white/15 md:text-xs'>
                {event.region}
              </div>

              {/* Title */}
              <h3 className='mt-3 text-2xl font-extrabold uppercase tracking-wide md:text-4xl'>
                {event.title}
              </h3>

              {/* Meta chips */}
              <div className='mt-4 flex flex-wrap items-center gap-3 text-sm'>
                <div className='inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15'>
                  <Calendar className='h-4 w-4' />
                  {new Intl.DateTimeFormat('en-PH', {
                    timeZone: 'Asia/Manila',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }).format(start)}
                </div>

                <div className='inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15'>
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
                </div>

                <div className='inline-flex max-w-full items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15'>
                  <MapPin className='h-4 w-4 shrink-0' />
                  <span className='truncate'>{event.location}</span>
                </div>
              </div>

              {/* Footer actions */}
              <div className='mt-6 flex flex-wrap items-center gap-3'>
                {buttonLabel &&
                  (isUrl ? (
                    <a
                      href={event.button!}
                      target={
                        event.button!.startsWith('/') ? '_self' : '_blank'
                      }
                      rel='noreferrer'
                      className='inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg ring-1 ring-white/15 transition hover:opacity-95'
                    >
                      {buttonLabel} <ArrowRight className='h-4 w-4' />
                    </a>
                  ) : (
                    <button
                      className='inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg ring-1 ring-white/15 transition hover:opacity-95 cursor-pointer'
                      onClick={onClose}
                    >
                      {buttonLabel} <ArrowRight className='h-4 w-4' />
                    </button>
                  ))}

                <button
                  onClick={onClose}
                  className='inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15 cursor-pointer'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
