'use client'

import * as React from 'react'

type EpicButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
}

export function EpicButton({
  children,
  className = '',
  ...props
}: EpicButtonProps) {
  return (
    <>
      <button
        {...props}
        className={[
          // layout / base
          'relative inline-flex items-center justify-center select-none overflow-hidden cursor-pointer',
          'rounded-full px-8 py-3 font-semibold text-lg text-white',
          'transition-transform duration-300 ease-out hover:scale-105',
          'bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500',
          // subtle depth
          'shadow-[0_8px_30px_rgba(59,130,246,0.35)]',
          className,
          'epic-slice', // for the shimmer pseudo-element
        ].join(' ')}
      >
        {children}
      </button>

      {/* slicing shimmer keyframes (scoped via styled-jsx) */}
      <style jsx>{`
        .epic-slice::before {
          content: '';
          position: absolute;
          top: -20%;
          bottom: -20%;
          left: -35%;
          width: 35%;
          transform: rotate(12deg) translateX(-150%);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.55),
            transparent
          );
          opacity: 0; /* start hidden */
          pointer-events: none;
          transition: opacity 150ms ease; /* optional tiny fade */
        }

        /* Run once, quickly, and stop */
        .epic-slice:hover::before {
          animation: slice-once 0.5s cubic-bezier(0.4, 0, 0.2, 1) 1 forwards;
        }

        @keyframes slice-once {
          0% {
            transform: rotate(12deg) translateX(-150%);
            opacity: 0;
          }
          10% {
            opacity: 0.9;
          }
          60% {
            opacity: 0.9;
          }
          100% {
            transform: rotate(12deg) translateX(250%);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
