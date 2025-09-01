'use client'

import Link from 'next/link'
import { EpicButton } from '../ui/epic-button'
import { HighlightTitle } from '../ui/highlight-title'
import { images as HERO_IMAGES } from '@/data/movingImages'
import { BackgroundCarousel } from '../hero/background-carousel'
import { Sparkles, ArrowRight, ChevronDown } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      id='hero'
      aria-labelledby='hero-title'
      className='relative isolate overflow-hidden'
    >
      {/* Background images */}
      <BackgroundCarousel
        images={HERO_IMAGES}
        intervalMs={6000}
        dim={true}
        respectReducedMotion={false}
      />

      {/* Readability / brand overlay */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/30 to-slate-900/80' />
      {/* Soft brand glows */}
      <div className='pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl' />

      {/* Content */}
      <div className='container mx-auto px-4 md:px-6 min-h-[72vh] md:min-h-[80vh] grid place-items-center py-16 md:py-20'>
        <div className='relative z-10 mx-auto max-w-5xl text-center space-y-8'>
          {/* Eyebrow */}
          <p className='mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-white/80 ring-1 ring-white/20 backdrop-blur'>
            <Sparkles className='h-3.5 w-3.5' />
            FFWPU Philippines
          </p>

          {/* Title */}
          <div className='space-y-3'>
            <h1 id='hero-title' className='sr-only'>
              A Heavenly Parent Centered Family
            </h1>
            <HighlightTitle
              as='div'
              text='Families Centered on Heavenly Parent'
              highlightedText='Heavenly Parent'
              uppercase={false}
              className='text-4xl md:text-6xl font-extrabold leading-tight tracking-wide text-white [text-shadow:0_1px_0_rgba(0,0,0,0.28)]'
              gradientClassName='bg-gradient-to-r from-sky-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent'
            />

            <p className='mx-auto mt-4 max-w-4xl text-lg md:text-xl text-white/90 font-medium leading-relaxed'>
              FFWPU Philippines is a Heavenly Parent–centered family, deepening
              faith through Cheon&nbsp;Shim&nbsp;Won devotion, advancing the
              Philippine Providence, and living True Parents’ vision.
            </p>
          </div>

          {/* CTAs */}
          <div className='flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4'>
            <Link href='/about' className='inline-block'>
              <EpicButton className='bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#3b82f6]'>
                <span className='inline-flex items-center gap-2'>
                  About Us <ArrowRight className='h-4 w-4' />
                </span>
              </EpicButton>
            </Link>

            <Link href='#news-letter-banner' className='inline-block'>
              <button className='cursor-pointer rounded-full border border-white/80 bg-white/0 px-8 py-3 text-lg font-semibold text-white transition duration-300 hover:bg-white hover:text-slate-900'>
                Get weekly updates
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href='#recent-news'
        aria-label='Scroll to recent news'
        className='group absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 text-white/80 transition hover:text-white'
      >
        <ChevronDown className='h-5 w-5 animate-bounce' />
      </a>
    </section>
  )
}
