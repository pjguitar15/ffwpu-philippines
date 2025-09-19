'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { TimelineItem } from '@/constants/history.constants'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  years: string[]
  setForceYear: (year: string) => void
  timeline: TimelineItem[]
}

export function TimelineNavigator({ years, setForceYear, timeline }: Props) {
  const [activeYear, setActiveYear] = useState<string | null>(null)
  const [visible, setVisible] = useState(true)
  const navRef = useRef<HTMLDivElement>(null)

  // --- helpers ---
  const orderedYears = useMemo(() => {
    // Ensure ascending numeric sort even if strings
    return [...years].sort((a, b) => Number(a) - Number(b))
  }, [years])

  const idxByYear = useMemo(() => {
    const map = new Map<string, number>()
    orderedYears.forEach((y, i) => map.set(y, i))
    return map
  }, [orderedYears])

  const goToYear = (year: string) => {
    setForceYear(year)
    document
      .getElementById(`year-${year}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const goPrev = () => {
    if (!activeYear) return
    const i = idxByYear.get(activeYear) ?? 0
    const prev = orderedYears[Math.max(0, i - 1)]
    if (prev) goToYear(prev)
  }

  const goNext = () => {
    if (!activeYear) return
    const i = idxByYear.get(activeYear) ?? 0
    const next = orderedYears[Math.min(orderedYears.length - 1, i + 1)]
    if (next) goToYear(next)
  }

  // Track active year + show/hide
  useEffect(() => {
    const handler = () => {
      let current: string | null = null
      for (const year of years) {
        const el = document.getElementById(`year-${year}`)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.3) current = year
      }
      if (current && current !== activeYear) setActiveYear(current)

      const end = document.getElementById('timeline-end-marker')
      if (end) {
        const r = end.getBoundingClientRect()
        setVisible(r.top > 0)
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [years, activeYear])

  // --- Desktop (unchanged, xl+) ---
  const desktopList = (
    <div
      ref={navRef}
      className='hidden xl:flex flex-col gap-2 text-xs font-medium 
               max-h-[90vh] overflow-y-auto pr-1 
               scrollbar-hidden max-w-[10rem]'
    >
      {years.map((year: string) => {
        const details = timeline.filter(
          (t: TimelineItem) => String(t.year).split('.')[0] === year,
        )
        const tooltipText = details
          .map((t: TimelineItem) => `${t.title}: ${t.content}`)
          .join('\n')
        return (
          <Tooltip key={year}>
            <TooltipTrigger asChild>
              <button
                onClick={() => goToYear(year)}
                className={`px-5 py-2 w-28 text-center hover:text-white hover:scale-110 duration-300  transition-colors cursor-pointer ${
                  activeYear === year
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-500 hover:bg-slate-700'
                }`}
                aria-label={tooltipText}
                tabIndex={0}
              >
                {year}
              </button>
            </TooltipTrigger>
            {details.length > 0 && (
              <TooltipContent
                side='left'
                sideOffset={8}
                className='w-64 max-w-xs'
              >
                {details.map((t: TimelineItem, idx: number) => {
                  const words = t.content.split(/\s+/)
                  const limited =
                    words.length > 10
                      ? words.slice(0, 10).join(' ') + '...'
                      : t.content
                  return (
                    <div key={idx} className='mb-2 last:mb-0'>
                      <span className='font-semibold'>{t.title}</span>
                      <div className='text-slate-300'>{limited}</div>
                    </div>
                  )
                })}
              </TooltipContent>
            )}
          </Tooltip>
        )
      })}
    </div>
  )

  // --- Mobile bar (bottom, xl:hidden) ---
  const railRef = useRef<HTMLDivElement>(null)

  // Auto-center active chip in the rail
  useEffect(() => {
    const container = railRef.current
    if (!container || !activeYear) return
    const el = container.querySelector<HTMLButtonElement>(
      `button[data-year="${activeYear}"]`,
    )
    if (!el) return
    const cRect = container.getBoundingClientRect()
    const eRect = el.getBoundingClientRect()
    const offset = eRect.left - cRect.left - (cRect.width / 2 - eRect.width / 2)
    container.scrollBy({ left: offset, behavior: 'smooth' })
  }, [activeYear])

  const mobileBar = (
    <div className='xl:hidden'>
      {/* Bottom sticky container */}
      <div
        className='fixed bottom-3 left-1/2 -translate-x-1/2 z-[100]
                   w-[calc(100%-1.5rem)] max-w-screen-md
                   rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800
                   shadow-lg'
        role='navigation'
        aria-label='Timeline year navigator'
      >
        {/* Side fades */}
        <div className='pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-slate-900/85 to-transparent rounded-l-2xl' />
        <div className='pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-slate-900/85 to-transparent rounded-r-2xl' />

        <div className='flex items-center gap-2 px-2 py-2'>
          {/* Prev */}
          <button
            onClick={goPrev}
            className='shrink-0 p-2 rounded-xl bg-slate-800/70 text-slate-200 active:scale-95'
            aria-label='Previous year'
          >
            <ChevronLeft className='h-5 w-5' />
          </button>

          {/* Horizontal rail of year chips */}
          <div
            ref={railRef}
            className='relative flex-1 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-px-3'
          >
            <style jsx>{`
              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className='flex items-center gap-1.5 px-1'>
              {orderedYears.map((y) => (
                <button
                  key={y}
                  data-year={y}
                  onClick={() => goToYear(y)}
                  className={`snap-start px-3 py-1.5 rounded-full text-sm
                              transition-colors active:scale-95
                              ${
                                activeYear === y
                                  ? 'bg-sky-500 text-white'
                                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
                              }`}
                  aria-current={activeYear === y ? 'true' : undefined}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Next */}
          <button
            onClick={goNext}
            className='shrink-0 p-2 rounded-xl bg-slate-800/70 text-slate-200 active:scale-95'
            aria-label='Next year'
          >
            <ChevronRight className='h-5 w-5' />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div
      className='relative'
      style={{
        position: 'fixed',
        right: '2rem',
        top: '80px',
        zIndex: 100,
        display: visible ? undefined : 'none',
      }}
    >
      {/* Desktop column */}
      {desktopList}

      {/* Desktop glare fades */}
      <div
        className='pointer-events-none absolute bottom-0 left-0 right-0 h-16 
                      bg-gradient-to-t from-slate-900/95 via-slate-900/80 to-transparent xl:block hidden'
      />
      <div
        className='pointer-events-none absolute top-0 left-0 right-0 h-12 
                      bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-transparent xl:block hidden'
      />

      {/* Mobile bottom bar */}
      {mobileBar}
    </div>
  )
}
