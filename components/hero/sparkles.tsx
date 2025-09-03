'use client'

import * as React from 'react'
import clsx from 'clsx'

type SparklesProps = {
  count?: number
  className?: string
  color?: string // CSS color or rgba
  minSize?: number
  maxSize?: number
}

export function SparklesOverlay({ count = 22, className = '', color = 'rgba(255,255,255,0.9)', minSize = 2, maxSize = 5 }: SparklesProps) {
  // Render nothing on server to avoid hydration mismatch.
  const [mounted, setMounted] = React.useState(false)
  const seedsRef = React.useRef<
    Array<{ id: number; top: number; left: number; size: number; delay: number; duration: number; driftX: number; driftY: number }> | null
  >(null)

  React.useEffect(() => {
    if (!seedsRef.current) {
      seedsRef.current = Array.from({ length: count }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.max(1, minSize) + Math.random() * Math.max(0, maxSize - minSize),
        delay: Math.random() * 4,
        duration: 2.2 + Math.random() * 2.2,
        driftX: (Math.random() - 0.5) * 12,
        driftY: (Math.random() - 0.5) * 10,
      }))
    }
    setMounted(true)
  }, [count, minSize, maxSize])

  if (!mounted) return null
  const seeds = seedsRef.current ?? []

  return (
  <div className={clsx('pointer-events-none absolute inset-0', className)} aria-hidden>
      {seeds.map((s) => (
        <span
          key={s.id}
          className='sparkle absolute rounded-full will-change-transform'
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            background: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0.5) 38%, rgba(255,255,255,0.12) 60%, transparent 70%)`,
            filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.35))',
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            // Use CSS variables for drift per sparkle
            // @ts-ignore - CSS custom properties
            ['--dx' as any]: `${s.driftX}px`,
            ['--dy' as any]: `${s.driftY}px`,
          }}
        />
      ))}
    <style jsx>{`
        .sparkle {
          animation-name: sparkleTwinkle, sparkleDrift;
          animation-timing-function: ease-in-out, ease-in-out;
          animation-iteration-count: infinite, infinite;
          animation-direction: alternate, alternate;
      mix-blend-mode: screen;
        }
        @keyframes sparkleTwinkle {
      0% { opacity: 0.35; transform: scale(0.7); }
      30% { opacity: 1.0; transform: scale(1); }
      60% { opacity: 0.75; transform: scale(0.9); }
      100% { opacity: 0.35; transform: scale(0.7); }
        }
        @keyframes sparkleDrift {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(var(--dx), var(--dy), 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sparkle { animation: none; opacity: 0.25; }
        }
      `}</style>
    </div>
  )
}

export default SparklesOverlay
