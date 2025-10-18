'use client'

import * as React from 'react'
import {
  X,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
const MotionDiv = motion.div

// Custom scrollbar styles
const scrollbarStyles = `
  .event-modal-scroll {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db #f3f4f6;
  }
  .event-modal-scroll::-webkit-scrollbar {
    width: 6px;
  }
  .event-modal-scroll::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
  }
  .event-modal-scroll::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }
  .event-modal-scroll::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`

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
  const [showImageCard, setShowImageCard] = React.useState(true)

  if (!isOpen || !event) return null

  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onEsc)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    
    // Add custom scrollbar styles
    const styleElement = document.createElement('style')
    styleElement.textContent = scrollbarStyles
    document.head.appendChild(styleElement)
    
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = prev
      document.head.removeChild(styleElement)
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
              {/* Mobile: Two-card flip design, Desktop: Two-column layout */}
              <div className='md:hidden'>
                {/* Mobile Card Container */}
                <div className='relative h-[70vh] max-h-[600px] min-h-[400px] perspective-1000'>
                  <AnimatePresence mode='wait'>
                    {showImageCard ? (
                      /* Image Card */
                      <MotionDiv
                        key='image-card'
                        className='absolute inset-0 w-full h-full'
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -90, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <div className='relative border w-full h-full rounded-3xl overflow-hidden shadow-2xl'>
                          <img
                            src={event.image}
                            alt={event.title}
                            className='w-full h-full object-cover'
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

                          {/* Info peek card - slanted bottom */}
                          <button
                            onClick={() => setShowImageCard(false)}
                            className='absolute bottom-0 right-0 w-24 h-20 cursor-pointer group'
                            style={{
                              clipPath: 'polygon(0% 100%, 100% 30%, 100% 100%)',
                            }}
                          >
                            <div className='w-full h-full bg-white/98 backdrop-blur-sm group-hover:bg-white group-active:bg-gray-50 transition-all duration-300 flex items-end justify-end pr-3 pb-3 shadow-lg group-hover:shadow-xl'>
                              <div className='relative'>
                                <ChevronLeft className='h-6 w-6 text-blue-600 group-hover:text-blue-700 transform group-hover:scale-125 transition-all duration-300 drop-shadow-sm' />
                                <div className='absolute inset-0 bg-blue-500/20 rounded-full blur-sm animate-pulse group-hover:bg-blue-500/30'></div>
                              </div>
                            </div>
                          </button>

                          {/* Tap indicator for info */}
                          <div className='absolute bottom-32 -right-16 text-white text-xs font-medium bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full opacity-75 animate-pulse pointer-events-none transform -rotate-90 origin-center tracking-wider whitespace-nowrap'>
                            👈 Tap to see more info
                          </div>

                          {/* Title overlay */}
                          <div className='absolute bottom-0 left-0 right-20 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent'>
                            <h3 className='text-white font-bold text-lg leading-tight'>
                              {event.title}
                            </h3>
                          </div>
                        </div>
                      </MotionDiv>
                    ) : (
                      /* Info Card */
                      <MotionDiv
                        key='info-card'
                        className='absolute inset-0 w-full h-full'
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -90, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <div className='relative w-full h-full rounded-3xl bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 ring-1 ring-slate-200 shadow-2xl overflow-hidden'>
                          {/* Image peek card - slanted top */}
                          <button
                            onClick={() => setShowImageCard(true)}
                            className='absolute top-0 left-0 w-24 h-20 cursor-pointer group z-10'
                            style={{
                              clipPath: 'polygon(0% 0%, 100% 0%, 0% 70%)',
                            }}
                          >
                            <div className='w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 group-hover:from-blue-500 group-hover:to-indigo-600 group-active:from-blue-700 group-active:to-indigo-800 transition-all duration-300 flex items-start justify-start pl-3 pt-3 shadow-lg group-hover:shadow-xl'>
                              <div className='relative'>
                                <ChevronRight className='h-6 w-6 text-white transform group-hover:scale-125 transition-all duration-300 drop-shadow-sm' />
                                <div className='absolute inset-0 bg-white/30 rounded-full blur-sm animate-pulse group-hover:bg-white/40'></div>
                              </div>
                            </div>
                          </button>

                          {/* Tap indicator for poster */}
                          <div className='absolute top-1 left-28 text-slate-700 text-xs font-medium bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full opacity-75 animate-pulse pointer-events-none'>
                            👈 Tap to see the poster
                          </div>

                          {/* Content */}
                          <div className='p-6 pt-20 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                            <h3 className='text-2xl font-extrabold tracking-wide text-slate-900 leading-tight mb-6'>
                              {event.title}
                            </h3>

                            {/* Meta chips */}
                            <div className='flex flex-col gap-3 text-sm mb-6'>
                              <div className='inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 ring-1 ring-slate-200 text-slate-700 w-fit'>
                                <Calendar className='h-4 w-4' />
                                <span>
                                  {new Intl.DateTimeFormat('en-PH', {
                                    timeZone: 'Asia/Manila',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  }).format(start)}
                                </span>
                              </div>

                              <div className='inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 ring-1 ring-slate-200 text-slate-700 w-fit'>
                                <Clock className='h-4 w-4' />
                                <span>
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

                              <div className='inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 ring-1 ring-slate-200 text-slate-700 w-fit'>
                                <MapPin className='h-4 w-4 shrink-0' />
                                <span className='truncate'>
                                  {event.location}
                                </span>
                              </div>
                            </div>

                            {/* Description */}
                            {event.description && (
                              <div className='text-slate-700 text-sm mb-6 leading-relaxed space-y-3 lg:max-h-64 overflow-y-auto event-modal-scroll pr-2'>
                                {event.description
                                  .split('\n')
                                  .map((line, index) => (
                                    <p
                                      key={index}
                                      className='whitespace-pre-wrap break-words'
                                    >
                                      {line}
                                    </p>
                                  ))}
                              </div>
                            )}

                            {/* Footer actions */}
                            <div className='flex flex-col gap-3 mt-auto'>
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
                                    className='inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-white/15 transition hover:opacity-95'
                                  >
                                    {buttonLabel}{' '}
                                    <ArrowRight className='h-4 w-4' />
                                  </a>
                                ) : (
                                  <button
                                    className='inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-white/15 transition hover:opacity-95 cursor-pointer'
                                    onClick={onClose}
                                  >
                                    {buttonLabel}{' '}
                                    <ArrowRight className='h-4 w-4' />
                                  </button>
                                ))}

                              <button
                                onClick={onClose}
                                className='inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 cursor-pointer'
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </MotionDiv>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Desktop: Original two-column layout */}
              <div className='hidden md:block'>
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
                                        <div className='rounded-xl md:rounded-2xl bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 ring-1 ring-slate-200 shadow-lg p-4 md:p-7 text-slate-800 max-h-[80vh] event-modal-scroll'>
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
                        <div className='mt-4 text-slate-700 text-sm leading-relaxed space-y-3 lg:max-h-64 overflow-y-auto event-modal-scroll pr-2'>
                          {event.description.split('\n').map((line, index) => (
                            <p key={index} className='whitespace-pre-wrap break-words'>
                              {line}
                            </p>
                          ))}
                        </div>
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
              </div>
            </MotionDiv>
          </div>
        </div>
      </div>
    </MotionDiv>
  )
}
