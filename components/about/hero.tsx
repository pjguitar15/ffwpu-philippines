'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface AboutHeroProps {
  id?: string
}

export function AboutHero({ id }: AboutHeroProps) {
  return (
    <section id={id} className='relative overflow-hidden bg-white'>
      <div className='relative'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src='/leaders.webp'
          alt='FFWPU Philippines community gathering'
          className='w-full h-[320px] md:h-[440px] object-cover brightness-75'
        />
        {/* darker overlay for contrast */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent pointer-events-none' />
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-center px-4'>
            <h1 className='text-white text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-md'>
              About FFWPU Philippines
            </h1>
            <p className='mt-3 text-white/90 max-w-2xl mx-auto text-base md:text-lg drop-shadow-sm'>
              Use your gifts to build God’s family. Join a team and make a
              difference in our community.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
