"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MovingImages } from "@/components/moving-images"
import { HighlightTitle } from '../ui/highlight-title'
import { EpicButton } from '../ui/epic-button'
import Image from 'next/image'

export function HeroSection() {
  return (
    <section className='relative bg-background'>
      <div className='container mx-auto px-4 py-16 text-center'>
        <div className='max-w-5xl mx-auto space-y-8'>
          <div className='space-y-2 z-10 relative'>
            <p className='text-primary font-semibold tracking-wide uppercase text-sm'>
              FFWPU Philippines
            </p>
            <HighlightTitle
              text='Cheon Won Gung Vision. Hearts United with Holy Mother Han'
              highlightedText='Holy Mother Han'
              as='h1'
              className='text-4xl md:text-6xl'
              uppercase
              gradientClassName='bg-gradient-to-r from-indigo-900 via-blue-800 to-sky-800 bg-clip-text text-transparent'
            />

            <p className='text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed mt-6'>
              FFWPU Philippines is a Heavenly Parent–centered family, deepening
              faith through Cheon Shim Won devotion, advancing the Philippine
              Providence, and living True Parents’ vision.
            </p>
          </div>
          <Image
            className='absolute lg:right-20 xl:right-80 2xl:right-100 top-50 opacity-20 hidden lg:block z-0'
            width={200}
            height={50}
            alt='ph'
            src='/philippines.svg'
          />

          <div className='pt-4'>
            <Link href='#cheon-shim-won' className='inline-block'>
              <EpicButton className='bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#3b82f6] hover:from-[#334155] hover:to-[#2563eb]'>
                LEARN MORE ABOUT FFWPU
              </EpicButton>
            </Link>
          </div>
        </div>
      </div>
      <MovingImages />
    </section>
  )
}
