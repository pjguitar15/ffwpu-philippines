'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Wrench, CalendarClock, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { NewsletterSignup } from '@/components/newsletter-signup'
import { BackgroundCarousel } from '@/components/hero/background-carousel'
import { images as HERO_IMAGES } from '@/data/movingImages'

type UnderConstructionProps = {
  progress?: number // 0–100
  eta?: string // e.g. "September 2025"
  contactEmail?: string // kept for compatibility but unused now
  showNotifyButton?: boolean // kept for compatibility but unused now
}

export default function UnderConstruction({
  progress = 90,
  eta = 'Soon',
}: UnderConstructionProps) {
  const items = [
    {
      icon: <ShieldCheck className='size-4' />,
      text: 'Secure & fast',
    },
    { icon: <CalendarClock className='size-4' />, text: `Target: ${eta}` },
  ]

  return (
    <section
      className='relative isolate overflow-hidden min-h-[100vh]'
      aria-labelledby='uc-title'
    >
      {/* Background images (same system as hero) */}
      <BackgroundCarousel
        images={HERO_IMAGES}
        intervalMs={6000}
        dim
        respectReducedMotion={false}
      />
      {/* Hero-like background washes for brand feel */}
      <div className='pointer-events-none absolute inset-0 z-0'>
        {/* Base dark gradient for contrast */}
        <div className='absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/40 to-slate-950/80' />
        {/* Colorful radial washes (sky/cyan top-right, fuchsia bottom-left) */}
        <div className='absolute inset-0 opacity-80 [background:radial-gradient(720px_360px_at_85%_0%,rgba(56,189,248,0.22),transparent_60%),radial-gradient(820px_400px_at_0%_100%,rgba(236,72,153,0.20),transparent_60%)]' />
      </div>
      {/* Soft brand glows */}
      <div className='pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl bg-gradient-to-tr from-sky-400/25 to-indigo-400/15' />
      <div className='pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full blur-3xl bg-gradient-to-tr from-fuchsia-400/20 to-emerald-400/10' />

      <div className='container mx-auto px-6 relative z-10 min-h-[100vh] flex flex-col items-center justify-center text-center gap-8'>
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
            className='font-heading tracking-[0.14em] text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-fuchsia-400 [text-shadow:0_0_18px_rgba(56,189,248,0.55)]'
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0 },
            }}
          >
            COMING SOON: FFWPU PHILIPPINES
          </motion.h1>

          <motion.p
            className='mt-4 text-base sm:text-lg text-white/85'
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
          className='mx-auto w-full max-w-4xl md:max-w-5xl'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className='w-full bg-white/8 border-white/10 shadow-lg backdrop-blur-md text-white'>
            <CardHeader className='space-y-1'>
              <CardTitle className='flex items-center gap-2'>
                <Wrench className='size-5 text-sky-300' />
                Site progress
              </CardTitle>
              <CardDescription className='text-white/80'>
                We’re polishing pages, content, and media.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-white/70'>Build status</span>
                <span className='font-medium'>{progress}%</span>
              </div>
              <Progress
                value={progress}
                aria-label='Site build progress'
                className='mx-auto max-w-xs sm:max-w-sm md:max-w-md'
              />
              <ul className='mt-3 grid gap-2 text-sm sm:grid-cols-2'>
                {items.map((it, i) => (
                  <li key={i} className='flex items-center gap-2 text-white/80'>
                    {it.icon} <span>{it.text}</span>
                  </li>
                ))}
              </ul>

              {/* Newsletter moved to its own container below */}
            </CardContent>
          </Card>
        </motion.div>

        {/* Separate newsletter container */}
        <motion.div
          className='mx-auto mt-6 max-w-xl w-full'
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Card className='bg-white/8 border-white/10 shadow-lg backdrop-blur-md text-white'>
            <CardHeader className='space-y-1'>
              <CardTitle className='text-base'>Stay in the loop</CardTitle>
              <CardDescription className='text-white/80'>
                Get an email when we launch and occasional community updates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex justify-center'>
                <NewsletterSignup variant='default' />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
