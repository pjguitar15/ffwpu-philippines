'use client'

import Link from 'next/link'
import * as React from 'react'
import { HighlightTitle } from './ui/highlight-title'

type BottomLink = { label: string; href: string }

type SideBySideProps = {
  withSocials?: boolean
  reversed?: boolean
  imgUrl: string
  imgAlt?: string
  eyebrow?: string
  title: string
  description?: string
  bottomLinks?: BottomLink[]
  className?: string
  highlightedText?: string | string[]
  highlightedGradientClassName?: string
  sideText?: string
}

export function SideBySide({
  withSocials = false,
  reversed = false,
  imgUrl,
  imgAlt = 'cover image',
  eyebrow,
  title,
  description,
  bottomLinks = [],
  className = '',
  highlightedText,
  highlightedGradientClassName = 'bg-gradient-to-r from-violet-800 via-purple-800 to-fuchsia-800 bg-clip-text text-transparent',
  sideText = 'CHEON SHIM WON',
}: SideBySideProps) {
  const pairDir = reversed ? 'md:flex-row-reverse' : 'md:flex-row'

  const SideRail = (
    <aside className='hidden lg:flex flex-col items-center gap-4 pt-6'>
      {/* shown on lg+ only to avoid md crowding */}
      <span className='text-sm font-extrabold tracking-[0.35em] uppercase [writing-mode:vertical-rl] rotate-180 text-slate-800'>
        {sideText}
      </span>
    </aside>
  )

  return (
    <section className={`w-full ${className}`}>
      <div className='mx-auto px-4 md:px-0 py-12'>
        <div className='flex items-start gap-8 md:gap-8 lg:gap-12'>
          {withSocials && !reversed && SideRail}

          <div
            className={`flex flex-col ${pairDir} items-start md:items-stretch gap-8 md:gap-8 lg:gap-12 flex-1`}
          >
            {/* IMAGE */}
            <div className='w-full md:basis-1/2 md:max-w-none lg:max-w-[640px]'>
              <div className='relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={imgAlt}
                  className='w-full h-full object-cover aspect-[16/9] md:aspect-[4/3] lg:aspect-[16/9]'
                />
                <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent' />
              </div>
            </div>

            {/* TEXT */}
            <div className='w-full md:basis-1/2 md:max-w-none lg:flex-1 lg:max-w-2xl'>
              {eyebrow && (
                <div className='text-sm font-semibold text-slate-800/90 mb-3'>
                  {eyebrow}
                </div>
              )}

              <HighlightTitle
                text={title}
                highlightedText={highlightedText}
                gradientClassName={highlightedGradientClassName}
                as='h2'
                className='text-3xl md:text-4xl lg:text-5xl'
                uppercase
              />

              {description && (
                <p className='mt-6 text-slate-700 text-base md:text-lg'>
                  {description}
                </p>
              )}

              {bottomLinks.length > 0 && (
                <div className='mt-8 flex flex-wrap items-center gap-x-10 gap-y-4'>
                  {bottomLinks.map((l) => (
                    <Link
                      key={l.label}
                      href={l.href}
                      className='group relative inline-flex flex-col'
                    >
                      <span className='text-base md:text-lg font-extrabold tracking-wider uppercase text-slate-900'>
                        {l.label}
                      </span>
                      <span className='mt-2 h-1 w-10 bg-amber-300 transition-all group-hover:w-14' />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {withSocials && reversed && SideRail}
        </div>
      </div>
    </section>
  )
}
