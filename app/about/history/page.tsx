'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
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

const easeOut: Easing = [0.16, 1, 0.3, 1]

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.35,
      delayChildren: 0.25,
    },
  },
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

export default function HistoryPage() {
  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-1'>
        <div className='container py-12 mx-auto'>
          {/* Page Header */}
          <div className='relative text-center space-y-4 mb-16'>
            {/* soft gradient wash */}
            <div
              aria-hidden
              className='pointer-events-none absolute -inset-10 -z-10'
              style={{
                background:
                  'radial-gradient(60rem 30rem at 70% 10%, rgba(56,189,248,0.12), transparent 60%), radial-gradient(50rem 30rem at 0% 100%, rgba(99,102,241,0.14), transparent 60%)',
              }}
            />
            <Eyebrow>Timeline</Eyebrow>
            <HighlightTitle
              as='h1'
              text='Our History'
              highlightedText='History'
              className='text-4xl md:text-6xl'
              uppercase
              gradientClassName='bg-gradient-to-r from-indigo-900 via-blue-800 to-sky-700 bg-clip-text text-transparent'
            />
            <p className='text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto'>
              The journey of FFWPU Philippines began with the vision of True
              Parents to establish God&apos;s kingdom on earth, with the
              Philippines as a key nation in Asia.
            </p>
          </div>

          {/* Timeline */}
          <div className='space-y-8 mb-16'>
            <div className='relative max-w-[900px] mx-auto'>
              {/* vertical line grows down on load */}
              <motion.div
                className='absolute left-4 inset-y-0 w-px bg-primary/20'
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
                {/* 1975 */}
                <motion.div
                  className='relative flex items-start gap-6'
                  variants={item}
                >
                  <motion.div
                    className='flex-shrink-0 w-8 h-8 rounded-full grid place-items-center bg-primary text-primary-foreground ring-4 ring-primary/10 shadow-sm'
                    variants={dot}
                  >
                    <Calendar className='h-4 w-4' />
                  </motion.div>
                  <Card className='flex-1 ring-1 ring-black/10'>
                    <CardHeader>
                      <CardTitle className='font-heading'>
                        1975 — Foundation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='text-muted-foreground'>
                        FFWPU Philippines was established as part of True
                        Parents&apos; global mission to spread the Divine
                        Principle throughout Asia. The first missionaries
                        arrived to begin building the foundation.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* 1980s */}
                <motion.div
                  className='relative flex items-start gap-6'
                  variants={item}
                >
                  <motion.div
                    className='flex-shrink-0 w-8 h-8 rounded-full grid place-items-center bg-primary text-primary-foreground ring-4 ring-primary/10 shadow-sm'
                    variants={dot}
                  >
                    <MapPin className='h-4 w-4' />
                  </motion.div>
                  <Card className='flex-1 ring-1 ring-black/10'>
                    <CardHeader>
                      <CardTitle className='font-heading'>
                        1980s — Growth & Expansion
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='text-muted-foreground'>
                        The movement expanded throughout the Philippines with
                        centers established in major cities. Local Filipino
                        leaders emerged to guide the growing community of
                        blessed families.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* 1990s */}
                <motion.div
                  className='relative flex items-start gap-6'
                  variants={item}
                >
                  <motion.div
                    className='flex-shrink-0 w-8 h-8 rounded-full grid place-items-center bg-primary text-primary-foreground ring-4 ring-primary/10 shadow-sm'
                    variants={dot}
                  >
                    <Users className='h-4 w-4' />
                  </motion.div>
                  <Card className='flex-1 ring-1 ring-black/10'>
                    <CardHeader>
                      <CardTitle className='font-heading'>
                        1990s — Community Building
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='text-muted-foreground'>
                        Focus shifted to strengthening local communities and
                        families. Educational programs, youth initiatives, and
                        interfaith dialogue became central to our mission.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* 2000s - Present */}
                <motion.div
                  className='relative flex items-start gap-6'
                  variants={item}
                >
                  <motion.div
                    className='flex-shrink-0 w-8 h-8 rounded-full grid place-items-center bg-primary text-primary-foreground ring-4 ring-primary/10 shadow-sm'
                    variants={dot}
                  >
                    <Award className='h-4 w-4' />
                  </motion.div>
                  <Card className='flex-1 ring-1 ring-black/10'>
                    <CardHeader>
                      <CardTitle className='font-heading'>
                        2000s — Present
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='text-muted-foreground'>
                        Today, FFWPU Philippines continues to grow with
                        thousands of blessed families across the nation—focusing
                        on peace-building, family values, and serving society.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Current Impact (light stagger in) */}
          <motion.div
            className='relative bg-muted/30 rounded-2xl p-8 text-center ring-1 ring-black/10'
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <div className='absolute -inset-8 -z-10 bg-gradient-to-tr from-sky-500/10 via-blue-500/10 to-indigo-500/10 blur-2xl rounded-3xl' />
            <h2 className='font-heading text-3xl font-bold mb-6'>
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
                  <div className='text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-indigo-900 via-blue-800 to-sky-800 bg-clip-text text-transparent'>
                    {s.value}
                  </div>
                  <p className='text-muted-foreground'>{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
