"use client"

import { images } from '@/data/movingImages'

type MovingImagesProps = {
  /** default desktop speed (ms) */
  speedMs?: number
  /** optional overrides */
  speedMsSm?: number
  speedMsMd?: number
  speedMsLg?: number
}

export function MovingImages({
  speedMs = 40000,
  speedMsSm = 12000, // 🚀 faster on mobile
  speedMsMd = 20000,
  speedMsLg, // defaults to speedMs if omitted
}: MovingImagesProps) {
  return (
    <div className='relative overflow-hidden h-80 sm:h-96 bg-muted/20'>
      {/* fade edges */}
      <div className='pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent z-10' />
      <div className='pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent z-10' />

      {/* track: two copies for seamless wrap */}
      <div className='marquee flex animate-marquee h-full items-center gap-2 transform-gpu will-change-transform'>
        {/* first copy */}
        <div className='flex items-center gap-1 shrink-0'>
          {images.map((src, i) => (
            <div key={`a-${i}`} className='shrink-0 relative overflow-hidden'>
              <img
                src={src || '/placeholder.svg'}
                alt={`slide ${i + 1}`}
                className='h-64 sm:h-80 w-72 sm:w-96 object-cover transition-transform duration-300 hover:scale-105'
                loading='lazy'
              />
            </div>
          ))}
        </div>

        {/* second copy (aria-hidden to avoid duplicate announcements) */}
        <div className='flex items-center gap-1 shrink-0' aria-hidden='true'>
          {images.map((src, i) => (
            <div key={`b-${i}`} className='shrink-0 relative overflow-hidden'>
              <img
                src={src || '/placeholder.svg'}
                alt=''
                className='h-64 sm:h-80 w-72 sm:w-96 object-cover transition-transform duration-300 hover:scale-105'
                loading='lazy'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Responsive speed + a11y preferences */}
      <style jsx>{`
        /* base (desktop fallback) */
        .marquee {
          --marquee-duration: ${speedMsLg ?? speedMs}ms !important;
        }
        /* mobile: much faster */
        @media (max-width: 640px) {
          .marquee {
            --marquee-duration: ${speedMsSm}ms !important;
          }
        }
        /* tablet */
        @media (min-width: 641px) and (max-width: 1024px) {
          .marquee {
            --marquee-duration: ${speedMsMd}ms !important;
          }
        }
        /* accessibility: slow it down if user prefers reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .marquee {
            --marquee-duration: calc((var(--marquee-duration)) * 2) !important;
          }
        }
      `}</style>
    </div>
  )
}
