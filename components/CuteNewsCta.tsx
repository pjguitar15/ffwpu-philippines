import Link from 'next/link'
import React from 'react'

const CuteNewsCta = () => {
  return (
    <div className='relative mt-10'>
      <span className='hidden sm:block absolute -top-2 right-6 select-none cta-sparkle'>
        ✨
      </span>
      <span className='hidden sm:block absolute -bottom-3 left-10 select-none cta-sparkle delay-300'>
        ✨
      </span>

      <div className='rounded-2xl border border-sky-200/70 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-900/30 dark:to-indigo-900/20 p-4 sm:p-5 flex items-center gap-4 shadow-[0_8px_20px_-8px_rgba(2,132,199,0.35)]'>
        <div className='h-12 w-12 sm:h-14 sm:w-14 rounded-full ring-2 ring-sky-300 bg-white flex items-center justify-center overflow-hidden'>
          {/* owl svg */}
          <svg viewBox='0 0 64 64' className='h-10 w-10 sm:h-12 sm:w-12'>
            <defs>
              <clipPath id='owlCircle'>
                <circle cx='32' cy='32' r='28' />
              </clipPath>
            </defs>
            <g clipPath='url(#owlCircle)'>
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
          <div className='text-sm font-semibold text-slate-800 dark:text-slate-100'>
            Looking for more stories?
          </div>
          <p className='text-xs text-slate-600 dark:text-slate-300 mt-0.5'>
            We share updates, events, and inspiring testimonies ✨
          </p>
          <Link
            href='/news'
            aria-label='Explore more news'
            className='group inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 text-white text-xs sm:text-sm hover:from-indigo-700 hover:via-sky-700 hover:to-emerald-700 active:scale-[0.99] transition shadow-sm'
          >
            Explore more news
            <span
              aria-hidden
              className='transition-transform group-hover:translate-x-0.5'
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CuteNewsCta