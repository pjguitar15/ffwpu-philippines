'use client'

import Link from 'next/link'
import { EpicButton } from '../ui/epic-button'
import { HighlightTitle } from '../ui/highlight-title'
import { images as HERO_IMAGES } from '@/data/movingImages'
import { BackgroundCarousel } from '../hero/background-carousel'
import { Sparkles, ArrowRight, ChevronDown, Mail } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { NewsletterSignup } from '@/components/newsletter-signup'

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

      {/* Readability + color wash overlays */}
      <div className='pointer-events-none absolute inset-0'>
        {/* Base dark vignette for contrast */}
        <div className='absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/40 to-slate-950/80' />
        {/* Colorful radial washes (sky/cyan top-right, fuchsia bottom-left) */}
        <div className='absolute inset-0 opacity-80 [background:radial-gradient(720px_360px_at_85%_0%,rgba(56,189,248,0.22),transparent_60%),radial-gradient(820px_400px_at_0%_100%,rgba(236,72,153,0.20),transparent_60%)]' />
      </div>
      {/* Soft brand glows */}
      <div className='pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl bg-gradient-to-tr from-sky-400/25 to-indigo-400/15' />
      <div className='pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full blur-3xl bg-gradient-to-tr from-fuchsia-400/20 to-emerald-400/10' />

      {/* Content */}
      <div className='container mx-auto px-4 md:px-6 min-h-[56vh] md:min-h-[60vh] grid place-items-center py-14 md:py-16'>
        <div className='relative z-10 mx-auto max-w-5xl text-center space-y-7'>
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
              uppercase={true}
              className='text-4xl md:text-5xl font-extrabold leading-tight tracking-wide text-white [text-shadow:0_1px_0_rgba(0,0,0,0.28)]'
              gradientClassName='bg-gradient-to-r from-sky-300 via-cyan-200 to-fuchsia-300 bg-clip-text text-transparent'
            />

            <p className='mx-auto mt-4 max-w-3xl text-base md:text-lg text-white/90 font-medium leading-relaxed'>
              FFWPU Philippines is a
              <span className='mx-1 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-rose-200 to-violet-300 font-semibold'>
                Heavenly Parent–centered
              </span>
              family, deepening faith through
              <span className='mx-1 bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-teal-200 to-emerald-300 font-semibold'>
                Cheon&nbsp;Shim&nbsp;Won
              </span>
              devotion,
              <span className='mx-1 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-rose-300 to-red-300 font-semibold'>
                cherishing the Blessing
              </span>
              as the foundation of true families, advancing the Philippine
              Providence, and living
              <span className='mx-1 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 font-semibold'>
                True Parents’ vision
              </span>
              .
            </p>
          </div>

          {/* CTAs */}
          <div className='flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4'>
            <Link href='/about' className='inline-block'>
              <EpicButton className='bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 ring-1 ring-white/10 shadow-[0_8px_30px_rgba(34,211,238,0.35)]'>
                <span className='inline-flex items-center gap-2'>
                  About Us <ArrowRight className='h-4 w-4' />
                </span>
              </EpicButton>
            </Link>

            <Dialog>
              <DialogTrigger asChild>
                <button className='group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-6 py-3 text-base font-semibold text-white transition duration-300 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 cursor-pointer'>
                  <Mail className='h-4 w-4 opacity-90 transition-transform group-hover:-translate-y-0.5' />
                  Get weekly updates
                </button>
              </DialogTrigger>
              <DialogContent className='border-white/10 bg-slate-900/90 backdrop-blur-md'>
                <DialogHeader>
                  <DialogTitle className='text-left'>
                    <span className='bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-cyan-200 to-fuchsia-300'>
                      Subscribe to our newsletter
                    </span>
                  </DialogTitle>
                  <DialogDescription className='text-left text-white'>
                    Get weekly highlights, community news, and upcoming events
                    straight to your inbox.
                  </DialogDescription>
                </DialogHeader>
                <div className='mt-2'>
                  <NewsletterSignup className='w-full' />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href='#updates'
        aria-label='Scroll to recent news'
        className='group absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 text-white/80 transition hover:text-white'
      >
        <ChevronDown className='h-5 w-5 animate-bounce' />
      </a>
    </section>
  )
}
