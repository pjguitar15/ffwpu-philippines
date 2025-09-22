// components/hero/background-carousel.tsx
'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  images: string[]
  intervalMs?: number
  className?: string
  dim?: boolean
  /** If true, pause when user has reduced-motion ON. Default: false (always animate). */
  respectReducedMotion?: boolean
}

export function BackgroundCarousel({
  images,
  intervalMs = 5000,
  className = '',
  dim = true,
  respectReducedMotion = false,
}: Props) {
  const [index, setIndex] = useState(0)
  const shouldAnimateRef = useRef(true)

  useEffect(() => {
    if (!respectReducedMotion) {
      shouldAnimateRef.current = true
      return
    }
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      const update = () => (shouldAnimateRef.current = !mq.matches)
      update()
      mq.addEventListener?.('change', update)
      return () => mq.removeEventListener?.('change', update)
    }
  }, [respectReducedMotion])

  useEffect(() => {
    if (images.length <= 1) return
    let id: ReturnType<typeof setInterval> | null = null
    const start = () => {
      if (shouldAnimateRef.current) {
        id = setInterval(
          () => setIndex((i) => (i + 1) % images.length),
          intervalMs,
        )
      }
    }
    start()
    return () => {
      if (id) clearInterval(id)
    }
  }, [images.length, intervalMs])

  const ordered = useMemo(
    () => images.map((src, i) => ({ src, active: i === index })),
    [images, index],
  )

  return (
    <div
      className={[
        'absolute inset-0 -z-10 overflow-hidden',
        'pointer-events-none select-none',
        className,
      ].join(' ')}
      aria-hidden
    >
      {ordered.map(({ src, active }, i) => (
        <div
          key={`${src}-${i}`}
          className={[
            'absolute inset-0 transition-opacity duration-1000 ease-in-out',
            active ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        >
          <Image
            src={src}
            alt=''
            fill
            sizes='100vw'
            priority={i === 0}
            className={[
              'object-cover will-change-transform',
              dim ? 'brightness-[1]' : '',
              active ? 'animate-zoomout' : '',
            ].join(' ')}
            style={active ? undefined : { transform: 'scale(1)' }}
          />
        </div>
      ))}

      {/* Gentle readability overlays */}
      {/* <div className='absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/45' /> */}
      <div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent' />
      <style jsx global>{`
        @keyframes zoomout {
          from {
            transform: scale(1.15);
          }
          to {
            transform: scale(1);
          }
        }
        .animate-zoomout {
          animation: zoomout 5s linear forwards;
          animation-fill-mode: forwards;
          transform: scale(1.3);
        }
        /* Remove .zoomout-final, let animation finish naturally */
      `}</style>
    </div>
  )
}
