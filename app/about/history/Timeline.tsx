"use client"

import { motion, type Variants, type Easing, type Transition } from 'framer-motion'
import Image from 'next/image'
import { TimelineNavigator } from './TimelineNavigator'
import { LazyMount } from './LazyMount'
import { ICONS, TimelineItem, getInitials } from '@/constants/history.constants'

const easeOut: Easing = [0.16, 1, 0.3, 1]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.35, delayChildren: 0.25 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.0, ease: easeOut } satisfies Transition,
  },
}

const dot: Variants = {
  hidden: { scale: 0.4, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 150, damping: 26, mass: 1.1 },
  },
}

interface TimelineProps {
  timeline: TimelineItem[]
  forceYear: string | null
  setForceYear: (year: string | null) => void
}

export function Timeline({ timeline, forceYear, setForceYear }: TimelineProps) {
  return (
    <div className='space-y-8 mb-16'>
      <div className='relative max-w-[900px] mx-auto'>
        <motion.div
          className='absolute left-4 inset-y-0 w-px bg-slate-700/60'
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          style={{ transformOrigin: 'top' }}
        />
        <motion.div
          className='space-y-12 mx-auto'
          variants={container}
          initial='hidden'
          animate='show'
        >
          {timeline.map((t) => {
            const Icon = ICONS[t.icon]
            const isLeader = t.type === 'leader'
            const year = String(t.year).split('.')[0]
            return (
              <LazyMount key={t.id} force={forceYear === year}>
                <motion.div
                  id={`year-${year}`}
                  className='relative flex items-start gap-6 scroll-mt-24'
                  variants={item}
                >
                  <motion.div
                    className={`flex-shrink-0 w-8 h-8 rounded-full grid place-items-center ${
                      isLeader
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/15'
                        : 'bg-sky-400 text-slate-950 ring-4 ring-sky-400/15'
                    } shadow-sm`}
                    variants={dot}
                  >
                    <Icon className='h-4 w-4' />
                  </motion.div>
                  <div className='flex-1 bg-slate-900/60 border border-slate-800 overflow-hidden rounded-xl'>
                    <div className='p-4'>
                      <div className='font-heading text-slate-100 text-lg font-bold'>
                        {String(t.year)} —{' '}
                        {isLeader
                          ? `${t.title} (Appointed National Leader)`
                          : t.title}
                      </div>
                    </div>
                    <div className='px-4 pb-4'>
                      {isLeader ? (
                        <div className='flex items-start gap-4'>
                          <div className='relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden ring-1 ring-slate-800/70 bg-slate-800/40 shrink-0'>
                            {t.imageUrl ? (
                              <Image
                                src={t.imageUrl}
                                alt={t.title}
                                fill
                                sizes='96px'
                                className='object-cover object-top'
                                loading='lazy'
                                placeholder='blur'
                                blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
                              />
                            ) : (
                              <div className='absolute inset-0 grid place-items-center'>
                                <div className='h-10 w-10 rounded-lg bg-slate-800/80 ring-1 ring-slate-700/60 grid place-items-center text-slate-300 font-semibold'>
                                  {getInitials(t.title)}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className='min-w-0'>
                            <p className='text-slate-300'>
                              <span className='font-semibold'>{t.title}</span>{' '}
                              was appointed{' '}
                              <span className='font-medium'>
                                National Leader
                              </span>
                              .
                            </p>
                            <p className='text-slate-400 text-sm mt-1'>
                              Tenure: {t.content.split('• Tenure: ')[1] || ''}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className='min-w-0'>
                          {t.imageUrl ? (
                            <div className='relative w-full aspect-[16/9] rounded-xl overflow-hidden ring-1 ring-slate-800/70 bg-slate-800/40 mb-3'>
                              <Image
                                src={t.imageUrl}
                                alt={t.title}
                                fill
                                sizes='(min-width: 768px) 720px, 100vw'
                                className='object-cover'
                                loading='lazy'
                                placeholder='blur'
                                blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
                              />
                              <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/10 via-transparent to-transparent' />
                            </div>
                          ) : null}
                          <p className='text-slate-300'>{t.content}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </LazyMount>
            )
          })}
        </motion.div>
        <TimelineNavigator
          years={[...new Set(timeline.map((t) => String(t.year).split('.')[0]))]}
          setForceYear={setForceYear}
          timeline={timeline}
        />
        {/* Marker for hiding TimelineNavigator when scrolled past */}
        <div id="timeline-end-marker" style={{ height: 1 }} />
      </div>
    </div>
  )
}
