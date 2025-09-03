'use client'

import * as React from 'react'

type EpicButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
}

export function EpicButton({ children, className = '', ...props }: EpicButtonProps) {
  const base = [
    // base layout
    'relative inline-flex items-center justify-center select-none overflow-hidden cursor-pointer',
    'rounded-full px-7 sm:px-8 py-3 font-semibold text-base sm:text-lg text-white tracking-wide',
    // motion & feedback
    'transition-all duration-300 ease-out will-change-transform',
    'hover:-translate-y-0.5 hover:scale-[1.015] active:translate-y-0 active:scale-[0.985]',
  // default gradient (two-color cyan → blue; can be overridden by className)
  'bg-gradient-to-r from-cyan-500 to-blue-600',
  // depth & ring tuned to cyan/blue
  'ring-1 ring-white/10 shadow-[0_10px_28px_rgba(34,211,238,0.35)]',
  'hover:shadow-[0_16px_40px_rgba(34,211,238,0.5)] hover:brightness-[1.03]',
  // accessible focus
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600',
    'epic-slice',
  ].join(' ')

  return (
    <>
      <button {...props} className={[base, className].join(' ').trim()}>
        {children}
      </button>

      <style jsx>{`
        /* angled shine sweep */
        .epic-slice::before {
          content: '';
          position: absolute;
          top: -30%;
          bottom: -30%;
          left: -35%;
          width: 40%;
          transform: rotate(14deg) translateX(-160%);
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
          opacity: 0;
          pointer-events: none;
          transition: opacity 150ms ease;
        }

        /* Run once, quickly, and stop */
        .epic-slice:hover::before {
          animation: slice-once 0.6s cubic-bezier(0.4, 0, 0.2, 1) 1 forwards;
        }

        @keyframes slice-once {
          0% { transform: rotate(14deg) translateX(-160%); opacity: 0; }
          15% { opacity: 0.75; }
          55% { opacity: 0.75; }
          100% { transform: rotate(14deg) translateX(260%); opacity: 0; }
        }

        /* soft inner highlight for depth */
        .epic-slice::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(120% 120% at 50% 10%, rgba(255,255,255,0.35), transparent 40%);
          opacity: 0.25;
          pointer-events: none;
          mix-blend-mode: soft-light;
          transition: opacity 200ms ease;
        }

        .epic-slice:hover::after { opacity: 0.35; }
        .epic-slice:active::after { opacity: 0.22; }
      `}</style>
    </>
  )
}
