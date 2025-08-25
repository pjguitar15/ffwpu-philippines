'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Wrench,
  CalendarClock,
  Mail,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

type UnderConstructionProps = {
  progress?: number // 0–100
  eta?: string // e.g. "September 2025"
  contactEmail?: string // kept for compatibility but unused now
  showNotifyButton?: boolean // kept for compatibility but unused now
}

export default function UnderConstruction({
  progress = 65,
  eta = 'Soon',
}: UnderConstructionProps) {
  const items = [
    {
      icon: <ShieldCheck className='size-4' />,
      text: 'Secure & fast on Vercel',
    },
    { icon: <CalendarClock className='size-4' />, text: `Target: ${eta}` },
  ]

  return (
    <section
      className='relative isolate overflow-hidden py-20 sm:py-28 
                 bg-gradient-to-b from-sky-50 via-white to-rose-50 
                 dark:from-slate-900 dark:via-slate-950 dark:to-fuchsia-950'
      aria-labelledby='uc-title'
    >
      {/* soft gradient accents */}
      <div className='pointer-events-none absolute inset-x-0 -top-40 -z-10 blur-3xl'>
        <div className='mx-auto h-64 w-[80%] bg-gradient-to-r from-indigo-400/30 via-sky-400/30 to-pink-400/30 rounded-full' />
      </div>

      <div className='container mx-auto px-6'>
        <motion.div
          initial='hidden'
          animate='show'
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.08, ease: 'easeOut' },
            },
          }}
          className='mx-auto max-w-3xl text-center'
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <Badge
              className='mb-4 bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow transition hover:opacity-95'
              variant='secondary'
            >
              UNDER CONSTRUCTION
            </Badge>
          </motion.div>

          <motion.h1
            id='uc-title'
            className='font-heading tracking-[0.14em] text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase
                       bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-sky-600 to-pink-600'
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0 },
            }}
          >
            COMING SOON: FFWPU PHILIPPINES
          </motion.h1>

          <motion.p
            className='mt-4 text-base sm:text-lg text-muted-foreground'
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0 },
            }}
          >
            We’re crafting a modern, prayerful home online—centered on Heavenly
            Parent, True Parents’ teachings, and the Philippine Providence.
            Please check back shortly.
          </motion.p>
        </motion.div>

        <motion.div
          className='mx-auto mt-10 max-w-xl'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className='border-slate-200/60 dark:border-slate-800/60 shadow-sm backdrop-blur'>
            <CardHeader className='space-y-1'>
              <CardTitle className='flex items-center gap-2'>
                <Wrench className='size-5 text-indigo-600 dark:text-sky-400' />
                Site progress
              </CardTitle>
              <CardDescription>
                We’re polishing pages, content, and media.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>Build status</span>
                <span className='font-medium'>{progress}%</span>
              </div>
              <Progress value={progress} aria-label='Site build progress' />
              <ul className='mt-3 grid gap-2 text-sm sm:grid-cols-2'>
                {items.map((it, i) => (
                  <li
                    key={i}
                    className='flex items-center gap-2 text-muted-foreground'
                  >
                    {it.icon} <span>{it.text}</span>
                  </li>
                ))}
              </ul>

              <div className='mt-4 flex justify-center'>
                <Button
                  asChild
                  className='group bg-gradient-to-r from-indigo-600 to-sky-500 text-white'
                >
                  <Link
                    href='https://www.facebook.com/ffwpuphils'
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='Visit FFWPU Philippines Facebook page'
                  >
                    Visit Facebook Page
                    <ArrowRight className='ml-2 size-4 transition-transform group-hover:translate-x-0.5' />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <div className='mt-16 text-center'>
          <p className='text-xs text-muted-foreground'>
            <span className='bg-clip-text text-gray-300 font-semibold'>
              In progress — built by Philcob Suzuki Josol
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
