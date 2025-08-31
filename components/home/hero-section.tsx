'use client'

import Link from 'next/link'
import { EpicButton } from '../ui/epic-button'
import { HighlightTitle } from '../ui/highlight-title'
import { images as HERO_IMAGES } from '@/data/movingImages'
import { BackgroundCarousel } from '../hero/background-carousel'

export function HeroSection() {
  return (
    <section className='relative isolate overflow-hidden'>
      <BackgroundCarousel
        images={HERO_IMAGES}
        intervalMs={6000}
        dim={true}
        respectReducedMotion={false} // ensure it moves
      />

      <div className='container mx-auto px-4 py-16 md:py-20 min-h-[720px] grid place-items-center'>
        <div className='relative z-10 max-w-5xl mx-auto text-center space-y-8'>
          <div className='space-y-2'>
            <p className='text-white/80 font-semibold tracking-wide uppercase text-sm'>
              FFWPU Philippines
            </p>

            <h1
              className={[
                'text-4xl md:text-6xl font-extrabold leading-tight tracking-wide',
                'text-white',
                // tiny, crisp shadow
                '[text-shadow:0_1px_0_rgba(0,0,0,0.28)]',
              ].join(' ')}
            >
              A Heavenly Parent
              <br />
              Centered Family
            </h1>

            <p className='text-lg md:text-xl text-white/90 font-medium max-w-5xl mx-auto leading-relaxed mt-6'>
              FFWPU Philippines is a Heavenly Parent–centered family, deepening
              faith through Cheon Shim Won devotion, advancing the Philippine
              Providence, and living True Parents’ vision.
            </p>
          </div>

          <div className='flex gap-3 mx-auto items-center justify-center'>
            <Link href='/about' className='inline-block'>
              <EpicButton className='bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#3b82f6] '>
                About Us
              </EpicButton>
            </Link>
            <Link href='#news-letter-banner' className='inline-block'>
              <button className='text-white border border-white rounded-full px-8 py-3 font-semibold text-lg cursor-pointer hover:bg-white hover:text-slate-900 transition duration-300'>
                Get weekly updates
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
