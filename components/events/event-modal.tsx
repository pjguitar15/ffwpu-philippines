'use client'

import * as React from 'react'
import { X, Calendar, Clock, MapPin, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
const MotionDiv = motion.div

type EventItem = {
  id: number | string
  title: string
  date: string
  end?: string
  location: string
  image: string
  // If it looks like a URL (/ or http), we'll treat it as a link
  button?: string
  description?: string
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

  // Check if we have a URL in the href field
  const hasUrl = !!(event as any).href

  // Ensure external URLs have proper protocol
  const formatUrl = (url: string) => {
    if (url.startsWith('/')) return url // internal link
    if (url.startsWith('http://') || url.startsWith('https://')) return url // already has protocol
    return `https://${url}` // add https:// for external domains
  }

  // Button label is either the custom button text or default
  const buttonLabel = (event as any).href
    ? event.button || 'Open details'
    : event.button

  return (
    <MotionDiv
      className='fixed inset-0 z-[2000]'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Dialog - full screen content */}
      <div
        role='dialog'
        aria-modal='true'
        className='absolute inset-0'
        onClick={onClose}
      >
        <div className='relative h-full w-full overflow-y-auto'>
          {/* Full-screen blurred background (click to close) */}
          <MotionDiv
            className='absolute inset-0 z-0 overflow-hidden cursor-pointer'
            onClick={onClose}
            aria-hidden='true'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            <img
              src={event.image}
              alt=''
              className='w-full h-full object-cover scale-[1.18] blur-[26px] md:blur-[30px] lg:blur-[34px] opacity-85'
              aria-hidden='true'
            />
            {/* Gentle vignette and bottom wash for readability */}
            <div className='absolute inset-0 bg-[radial-gradient(900px_420px_at_80%_-10%,rgba(59,130,246,0.08),transparent_60%)]' />
            <div className='absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/90 via-white/70 to-transparent' />
          </MotionDiv>

          {/* Click-catcher over background, under content */}
          <button
            aria-hidden='true'
            onClick={onClose}
            className='absolute inset-0 z-[5] cursor-default bg-transparent'
            tabIndex={-1}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label='Close'
            className='fixed right-3 top-3 md:right-4 md:top-4 z-40 inline-flex h-12 w-12 md:h-10 md:w-10 items-center justify-center rounded-full bg-white text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer shadow-lg'
          >
            <X className='h-6 w-6 md:h-5 md:w-5' />
          </button>

          {/* Content stack (vertically centered). Avoid forcing scrollbar by not adding vertical padding here. */}
          <div className='relative z-10 min-h-[100svh] grid place-items-center'>
            <MotionDiv
              className='w-full max-w-6xl px-3 md:px-6 my-6 md:my-12'
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Two-column on large screens: image left, info right */}
              <div className='lg:grid lg:grid-cols-2 lg:items-start lg:gap-8'>
                {/* Media area (no background; rounded image) */}
                <div className='relative w-full'>
                  <div className='relative flex justify-center'></div>
                  <img
                    src={event.image}
                    alt={event.title}
                    className='max-h-[50vh] md:max-h-[70vh] lg:max-h-[75vh] xl:max-h-[80vh] w-auto h-auto object-contain select-none pointer-events-none rounded-2xl md:rounded-3xl shadow-sm'
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
                </div>
                {/* Info card overlaps image on md; side-by-side on lg */}
                <MotionDiv
                  className='relative mx-auto w-full md:max-w-3xl mt-4 md:-mt-16 md:-translate-y-3 lg:mt-0 lg:translate-y-0 lg:mx-0'
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.05,
                  }}
                >
                  <div className='rounded-xl md:rounded-2xl bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 ring-1 ring-slate-200 shadow-lg p-4 md:p-7 text-slate-800'>

                    {/* Title */}
                    <h3 className='mt-3 text-xl md:text-2xl lg:text-3xl font-extrabold tracking-wide text-slate-900 leading-tight'>
                      {event.title}
                    </h3>

                    {/* Meta chips */}
                    <div className='mt-4 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-3 text-sm'>
                      <div className='inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1.5 md:px-3 md:py-1 ring-1 ring-slate-200 text-slate-700 text-xs md:text-sm'>
                        <Calendar className='h-3.5 w-3.5 md:h-4 md:w-4' />
                        <span className='whitespace-nowrap'>
                          {new Intl.DateTimeFormat('en-PH', {
                            timeZone: 'Asia/Manila',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }).format(start)}
                        </span>
                      </div>

                      <div className='inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1.5 md:px-3 md:py-1 ring-1 ring-slate-200 text-slate-700 text-xs md:text-sm'>
                        <Clock className='h-3.5 w-3.5 md:h-4 md:w-4' />
                        <span className='whitespace-nowrap'>
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
                      </div>

                      <div className='inline-flex w-full sm:w-auto max-w-full items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1.5 md:px-3 md:py-1 ring-1 ring-slate-200 text-slate-700 text-xs md:text-sm'>
                        <MapPin className='h-3.5 w-3.5 md:h-4 md:w-4 shrink-0' />
                        <span className='truncate'>{event.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {event.description && (
                      <p className='mt-4 text-slate-700 text-sm'>
                        {event.description}
                      </p>
                    )}

                    {/* Footer actions */}
                    <div className='mt-5 md:mt-6 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3'>
                      {buttonLabel &&
                        (hasUrl ? (
                          <a
                            href={formatUrl((event as any).href!)}
                            target={
                              (event as any).href!.startsWith('/')
                                ? '_self'
                                : '_blank'
                            }
                            rel='noreferrer'
                            className='inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-rose-500 px-4 py-2.5 md:py-2 text-sm font-semibold text-white shadow-lg ring-1 ring-white/15 transition hover:opacity-95 text-center'
                          >
                            {buttonLabel} <ArrowRight className='h-4 w-4' />
                          </a>
                        ) : (
                          <button
                            className='inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-rose-500 px-4 py-2.5 md:py-2 text-sm font-semibold text-white shadow-lg ring-1 ring-white/15 transition hover:opacity-95 cursor-pointer'
                            onClick={onClose}
                          >
                            {buttonLabel} <ArrowRight className='h-4 w-4' />
                          </button>
                        ))}

                      <button
                        onClick={onClose}
                        className='inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 md:py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 cursor-pointer'
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </MotionDiv>
              </div>
            </MotionDiv>
          </div>
        </div>
      </div>
    </MotionDiv>
  )
}
