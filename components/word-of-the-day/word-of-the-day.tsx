'use client'

import { useEffect, useMemo, useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import clsx from 'clsx'

/** =========================
 *  CONFIG (edit as needed)
 *  ========================= */
const SHOW_INTERVAL_HOURS = 5 // cooldown before auto-show again
const STORAGE_KEY = 'wotd_seen_meta_v1'
const SHOW_LAUNCHER = true // toggle floating launcher visibility

type WotdData = { id: string; title: string; text: string; attribution?: string }

/** Utility */
const hoursToMs = (h: number) => Math.max(0, h) * 60 * 60 * 1000

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-md',
        // base blocks (light + dark mode)
        'bg-slate-200/90 dark:bg-slate-700/60',
        className,
      )}
      aria-hidden='true'
    >
      {/* shimmer sweep */}
      <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/20 bg-[length:200%_100%] motion-safe:animate-[shimmer_1.6s_linear_infinite]' />
    </div>
  )
}

export default function WordOfTheDayModal() {
  const [open, setOpen] = useState(false)
  const [wotd, setWotd] = useState<WotdData | null>(null)
  const [loading, setLoading] = useState(true)
  const [revealed, setRevealed] = useState(false)

  // Compute once
  const intervalMs = useMemo(() => hoursToMs(SHOW_INTERVAL_HOURS), [])

  useEffect(() => {
    let cancelled = false
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const meta = raw ? (JSON.parse(raw) as { id: string; ts: number }) : null
      const now = Date.now()
      const expired = !meta || now - meta.ts > intervalMs
      if (expired) {
        // Open immediately with a blurred placeholder; reveal real text when fetched
        handleOpen()
      }

      // Load current WOTD
      fetch('/api/wotd/current')
        .then((r) => r.json())
        .then((data: any) => {
          if (cancelled) return
          if (data && data.id && data.text) {
            setWotd({
              id: String(data.id),
              title: data.title || 'Word of the Day',
              text: data.text,
              attribution: data.attribution || '',
            })
            // If not already open (not expired), open only if content changed
            if (!expired && (!meta || meta.id !== String(data.id))) {
              handleOpen()
            }
            // Slight delay so blur transition is visible
            requestAnimationFrame(() => setRevealed(true))
          }
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    } catch {
      // Parsing error: open once; still try to fetch
      handleOpen()
      fetch('/api/wotd/current')
        .then((r) => r.json())
        .then((data: any) => {
          if (cancelled) return
          if (data && data.id && data.text) {
            setWotd({
              id: String(data.id),
              title: data.title || 'Word of the Day',
              text: data.text,
              attribution: data.attribution || '',
            })
            requestAnimationFrame(() => setRevealed(true))
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }

    // ESC to close
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelled = true
      window.removeEventListener('keydown', onKey)
      // ensure scroll restored if unmounted while open
      document.documentElement.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpen = () => {
    setOpen(true)
    // lock scroll
    document.documentElement.style.overflow = 'hidden'
  }

  const handleClose = () => {
    try {
      const idToSave = wotd?.id || 'unknown'
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ id: idToSave, ts: Date.now() }),
      )
    } catch {}
    setOpen(false)
    // release scroll
    document.documentElement.style.overflow = ''
  }

  return (
    <>
      {/* Modal */}
      {open && (
        <div
          role='dialog'
          aria-modal='true'
          aria-labelledby='wotd-heading'
          className='fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6'
        >
          {/* Backdrop */}
          <button
            aria-label='Close word of the day'
            onClick={handleClose}
            className='absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity'
          />

          <div
            className={clsx(
              'relative w-full max-w-2xl rounded-3xl overflow-hidden',
              'ring-1 ring-slate-900/10 shadow-2xl bg-white',
            )}
          >
            {/* soft glow accents for light mode */}
            <div
              aria-hidden
              className='pointer-events-none absolute -inset-10'
              style={{
                background:
                  'radial-gradient(28rem 16rem at 85% 0%, rgba(99,102,241,0.12), transparent 60%), radial-gradient(26rem 14rem at 15% 100%, rgba(56,189,248,0.12), transparent 60%)',
              }}
            />
            {/* subtle gradient header bar */}
            <div className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 opacity-80' />

            <div className='relative'>
              {/* content */}
              <div className='px-6 sm:px-8 pt-6 sm:pt-8 pb-5'>
                <div className='flex items-center gap-2 text-sky-700/90'>
                  <Sparkles className='h-5 w-5' />
                  <p className='text-xs tracking-[0.2em] uppercase'>
                    {wotd?.title || 'Word of the Day'}
                  </p>
                </div>

                <h3
                  id='wotd-heading'
                  className='mt-2 text-2xl sm:text-[28px] font-extrabold tracking-tight bg-gradient-to-r from-sky-700 via-indigo-700 to-fuchsia-700 bg-clip-text text-transparent'
                >
                  Today’s Inspiration
                </h3>

                {/* Content area: blur -> clear reveal */}
                {!wotd || loading ? (
                  <div
                    className='mt-4 space-y-3'
                    role='status'
                    aria-busy='true'
                    aria-live='polite'
                  >
                    <Skeleton className='h-[24px]' />
                    <Skeleton className='h-[24px] w-11/12' />
                    <Skeleton className='h-[24px] w-9/12' />
                    <div className='pt-1'>
                      <Skeleton className='h-[14px] w-5/12' />
                    </div>
                  </div>
                ) : (
                  <div
                    className={clsx(
                      'transition-all duration-500 ease-out',
                      revealed ? 'blur-0 opacity-100' : 'blur-[6px] opacity-60',
                    )}
                  >
                    <p className='mt-4 text-base sm:text-lg leading-relaxed text-slate-700'>
                      {wotd.text}
                    </p>
                    <p className='mt-2 text-sm text-slate-500'>
                      {wotd.attribution}
                    </p>
                  </div>
                )}

                {/* actions */}
                <div className='mt-6 flex flex-wrap gap-3'>
                  <button
                    onClick={handleClose}
                    className='inline-flex items-center justify-center rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-medium ring-1 ring-slate-900/10 shadow-sm hover:bg-slate-800 transition cursor-pointer'
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

            {/* Close (X) button */}
            <button
              onClick={handleClose}
              aria-label='Close'
              className='absolute right-3.5 top-3.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 hover:bg-slate-100 ring-1 ring-slate-200/70 cursor-pointer'
            >
              <X className='h-4 w-4' />
            </button>
          </div>
        </div>
      )}

      {/* Floating launcher (large screens only) */}
      {SHOW_LAUNCHER && !open && (
        <button
          onClick={handleOpen}
          aria-label='Open Word of the Day'
          className={clsx(
            'flex fixed bottom-6 right-6 z-[90]',
            'items-center gap-2 rounded-full px-3.5 py-2.5',
            'bg-white/90 text-slate-800 shadow-md ring-1 ring-slate-900/10 backdrop-blur',
            'hover:bg-white hover:shadow-lg transition cursor-pointer hover:scale-105',
          )}
        >
          <span className='relative inline-flex h-6 w-6 items-center justify-center rounded-full ring-1 ring-sky-300/40 bg-sky-50/80'>
            <Sparkles className='h-3.5 w-3.5 text-sky-600 animate-[pulse_3s_ease-in-out_infinite]' />
          </span>
          <span className='text-sm font-medium'>Today’s Word</span>
        </button>
      )}
    </>
  )
}
