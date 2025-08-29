'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Users, Award } from 'lucide-react'
import { Eyebrow } from '@/components/ui/eyebrow'
import { HighlightTitle } from '@/components/ui/highlight-title'
import {
  motion,
  type Variants,
  type Easing,
  type Transition,
} from 'framer-motion'
import { TitleBlock } from '@/components/ui/title-block'
import { HistoryHeader } from '@/components/history/history-header'
import { TIMELINE } from '@/data/historyData'

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

const ICONS = {
  calendar: Calendar,
  map: MapPin,
  users: Users,
  award: Award,
} as const

// ——— Data-driven timeline ———

export default function HistoryPage() {
  return (
    <div className='min-h-screen flex flex-col bg-slate-950 text-slate-100 px-4 md:px-0'>
      <main className='flex-1'>
        <div className='container py-12 mx-auto'>
          {/* Page Header */}
          <div className='relative text-center space-y-4 mb-16'>
            {/* dark glow wash */}
            <div
              aria-hidden
              className='pointer-events-none absolute -inset-10 -z-10'
              style={{
                background:
                  'radial-gradient(60rem 30rem at 70% 10%, rgba(56,189,248,0.08), transparent 60%), radial-gradient(50rem 30rem at 0% 100%, rgba(99,102,241,0.10), transparent 60%)',
              }}
            />
            <HistoryHeader />
          </div>

          {/* Timeline */}
          <div className='space-y-8 mb-16'>
            <div className='relative max-w-[900px] mx-auto'>
              {/* vertical line */}
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
                {TIMELINE.map((t) => {
                  const Icon = ICONS[t.icon]
                  return (
                    <motion.div
                      key={t.id}
                      className='relative flex items-start gap-6'
                      variants={item}
                    >
                      <motion.div
                        className='flex-shrink-0 w-8 h-8 rounded-full grid place-items-center bg-amber-500 text-slate-950 ring-4 ring-amber-500/15 shadow-sm'
                        variants={dot}
                      >
                        <Icon className='h-4 w-4' />
                      </motion.div>

                      <Card className='flex-1 bg-slate-900/60 border border-slate-800'>
                        <CardHeader>
                          <CardTitle className='font-heading text-slate-100'>
                            {t.year} — {t.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className='text-slate-300'>{t.content}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </div>
          <motion.div
            className='relative rounded-2xl p-8 text-center border border-slate-800 bg-slate-900/60'
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <div className='absolute -inset-8 -z-10 bg-[radial-gradient(30rem_16rem_at_20%_0%,rgba(56,189,248,0.10),transparent),radial-gradient(30rem_16rem_at_80%_100%,rgba(99,102,241,0.10),transparent)] blur-2xl rounded-3xl' />
            <h2 className='font-heading text-3xl font-bold mb-6 text-slate-100'>
              Our Impact Today
            </h2>
            <motion.div
              className='grid grid-cols-1 md:grid-cols-3 gap-8'
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.05 },
                },
              }}
              initial='hidden'
              whileInView='show'
              viewport={{ once: true, amount: 0.3 }}
            >
              {[
                { value: '50+', label: 'Local Centers' },
                { value: '10,000+', label: 'Blessed Families' },
                { value: '45+', label: 'Years of Service' },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <div className='text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent'>
                    {s.value}
                  </div>
                  <p className='text-slate-300'>{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
