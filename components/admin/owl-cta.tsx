"use client"

import Link from 'next/link'
import React from 'react'

type Props = {
  title: string
  subtitle?: string
  buttonLabel: string
  href: string
  className?: string
}

export function OwlCta({ title, subtitle, buttonLabel, href, className = '' }: Props) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-2xl border shadow-sm',
        'bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 dark:from-sky-900/20 dark:via-indigo-900/20 dark:to-emerald-900/20',
        'px-5 md:px-6 py-5 md:py-6',
        className,
      ].join(' ')}
    >
      <div className='flex items-center gap-4 md:gap-5'>
        {/* Owl avatar */}
        <div className='h-12 w-12 md:h-14 md:w-14 rounded-full ring-2 ring-sky-300 bg-white flex items-center justify-center overflow-hidden'>
          <svg viewBox='0 0 64 64' className='h-9 w-9 md:h-10 md:w-10'>
            <defs>
              <clipPath id='adminOwl'>
                <circle cx='32' cy='32' r='28' />
              </clipPath>
            </defs>
            <g clipPath='url(#adminOwl)'>
              <circle cx='32' cy='36' r='24' fill='#fde68a' />
              <ellipse cx='32' cy='40' rx='18' ry='16' fill='#f59e0b' />
              <circle cx='24' cy='28' r='9' fill='#fff' />
              <circle cx='40' cy='28' r='9' fill='#fff' />
              <circle cx='24' cy='28' r='4' fill='#0f172a' />
              <circle cx='40' cy='28' r='4' fill='#0f172a' />
              <polygon points='32,34 28,42 36,42' fill='#e11d48' />
              <path
                d='M12 20 Q24 8 32 20 Q40 8 52 20'
                fill='none'
                stroke='#0ea5e9'
                strokeWidth='3'
                strokeLinecap='round'
              />
            </g>
          </svg>
        </div>

        <div className='flex-1'>
          <div className='text-slate-900 dark:text-slate-100 font-semibold'>
            {title}
          </div>
          {subtitle && (
            <p className='text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-0.5'>
              {subtitle}
            </p>
          )}
        </div>

        <Link
          href={href}
          className='group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 text-white text-xs md:text-sm hover:from-indigo-700 hover:via-sky-700 hover:to-emerald-700 active:scale-[0.99] transition shadow-sm'
          aria-label={buttonLabel}
        >
          {buttonLabel}
          <span aria-hidden className='transition-transform group-hover:translate-x-0.5'>
            →
          </span>
        </Link>
      </div>

      <style jsx>{`
        div :global(.owl-float) { animation: owlFloat 5.5s ease-in-out infinite; }
        @keyframes owlFloat {
          0% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default OwlCta
