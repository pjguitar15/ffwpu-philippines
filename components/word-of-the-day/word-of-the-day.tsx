'use client'

import { useEffect, useMemo, useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import clsx from 'clsx'

/** =========================
 *  CONFIG (edit as needed)
 *  ========================= */
const WOTD_ID = '2025-09-01' // change when the message changes
const SHOW_INTERVAL_HOURS = 5 // cooldown before auto-show again
const STORAGE_KEY = 'wotd_seen_meta_v1'
const SHOW_LAUNCHER = true // toggle floating launcher visibility

// Hardcoded content for now (can be swapped to backend later)
const WORD_OF_THE_DAY = {
  title: 'Word of the Day',
  text: '“Live for the sake of others, and your life will overflow with purpose.”',
  attribution: '— True Parents',
}

/** Utility */
const hoursToMs = (h: number) => Math.max(0, h) * 60 * 60 * 1000

export default function WordOfTheDayModal() {
  const [open, setOpen] = useState(false)

  // Compute once
  const intervalMs = useMemo(() => hoursToMs(SHOW_INTERVAL_HOURS), [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const meta = raw ? (JSON.parse(raw) as { id: string; ts: number }) : null
      const now = Date.now()

      const shouldShow =
        !meta || // never seen
        meta.id !== WOTD_ID || // new day/message, show again
        now - meta.ts > intervalMs // last seen expired

      if (shouldShow) {
        handleOpen()
      }
    } catch {
      handleOpen() // Fallback: show once if parsing fails
    }

    // ESC to close
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
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
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ id: WOTD_ID, ts: Date.now() }),
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
                    {WORD_OF_THE_DAY.title}
                  </p>
                </div>

                <h3
                  id='wotd-heading'
                  className='mt-2 text-2xl sm:text-[28px] font-extrabold tracking-tight bg-gradient-to-r from-sky-700 via-indigo-700 to-fuchsia-700 bg-clip-text text-transparent'
                >
                  Today’s Inspiration
                </h3>

                <p className='mt-4 text-base sm:text-lg leading-relaxed text-slate-700'>
                  {WORD_OF_THE_DAY.text}
                </p>
                <p className='mt-2 text-sm text-slate-500'>
                  {WORD_OF_THE_DAY.attribution}
                </p>

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
