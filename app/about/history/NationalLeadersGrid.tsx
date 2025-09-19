"use client"

import { motion, type Variants, type Easing, type Transition } from 'framer-motion'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { LEADERS, getInitials, Leader } from '@/constants/history.constants'
import { useState, useEffect } from 'react'

const easeOut: Easing = [0.16, 1, 0.3, 1]
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut } satisfies Transition,
  },
}

export function NationalLeadersGrid() {
  const [isVisible, setIsVisible] = useState(false)

  // Fallback to show content after a delay if animation doesn't trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className='relative max-w-6xl mx-auto py-8'>
      <div
        aria-hidden
        className='pointer-events-none absolute -inset-x-10 -top-10 -bottom-16 -z-10 opacity-70'
        style={{
          background:
            'radial-gradient(60rem 30rem at 10% 0%, rgba(56,189,248,0.06), transparent 50%), radial-gradient(60rem 30rem at 90% 100%, rgba(250,204,21,0.06), transparent 50%)',
        }}
      />
      <div className='text-center mb-8'>
        <p className='text-amber-300/80 text-sm tracking-wider uppercase'>
          Leadership
        </p>
        <h2 className='font-heading text-3xl md:text-4xl font-bold text-slate-100'>
          National Leaders
        </h2>
        <p className='text-slate-400 mt-1'>
          A modern, responsive grid. Images and bios are placeholders for now.
        </p>
      </div>
      <motion.div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${
          isVisible ? 'opacity-100' : ''
        }`}
        variants={container}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.1, margin: '100px' }}
        onAnimationComplete={() => setIsVisible(true)}
      >
        {LEADERS.map((leader: Leader) => (
          <motion.div key={leader.id} variants={item}>
            <Card className='h-full overflow-hidden border-slate-800 bg-slate-900/60 hover:bg-slate-900/80 transition-colors'>
              <div className='relative aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 grid place-items-center'>
                {leader.imageUrl ? (
                  <Image
                    src={leader.imageUrl}
                    alt={leader.name}
                    fill
                    className='absolute inset-0 h-full w-full object-cover'
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'
                    loading='lazy'
                    placeholder='blur'
                    blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
                  />
                ) : (
                  <div className='h-16 w-16 rounded-xl bg-slate-800/80 ring-1 ring-slate-700/60 grid place-items-center text-slate-300 font-semibold'>
                    {getInitials(leader.name)}
                  </div>
                )}
                <span className='absolute top-3 left-3 text-[11px] px-2 py-1 rounded-full bg-slate-950/70 ring-1 ring-slate-800 text-slate-300 backdrop-blur-sm'>
                  {leader.tenure}
                </span>
              </div>
              <CardHeader className='pb-2'>
                <CardTitle className='font-heading text-lg leading-tight text-slate-100'>
                  {leader.name}
                </CardTitle>
                {leader.role && (
                  <p className='text-slate-400 text-sm'>{leader.role}</p>
                )}
              </CardHeader>
              <CardContent>
                <p className='text-slate-300 text-sm leading-relaxed'>
                  {leader.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
