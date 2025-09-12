'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SectionShell } from '@/components/ui/section-shell'
import { Eyebrow } from '@/components/ui/eyebrow'
import { HighlightTitle } from '@/components/ui/highlight-title'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  Crown,
  Globe2,
  BookOpen,
  Sparkles,
  Handshake,
} from 'lucide-react'
import {
  motion,
  type Variants,
  type Easing,
  type Transition,
} from 'framer-motion'

// ---------- Animations (typed so TS is happy)
const easeOut: Easing = [0.16, 1, 0.3, 1]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.28, delayChildren: 0.18 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeOut } satisfies Transition,
  },
}

const pop: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: easeOut },
  },
}

function IconBubble({ children }: { children: React.ReactNode }) {
  return (
    <div
      className='inline-flex h-10 w-10 items-center justify-center rounded-2xl
      bg-gradient-to-br from-amber-500/15 via-rose-500/15 to-fuchsia-500/15
      ring-1 ring-amber-400/25'
    >
      <div className='text-amber-600'>{children}</div>
    </div>
  )
}

export default function TrueParentsPage() {
  return (
    <div className='min-h-screen flex flex-col'>
      {/* HERO (royal dark) */}
      <SectionShell dark className='relative overflow-hidden'>
        <div
          aria-hidden
          className='absolute -inset-24 -z-10'
          style={{
            background:
              'radial-gradient(60rem 30rem at 70% 10%, rgba(251,191,36,0.22), transparent 60%), radial-gradient(50rem 30rem at 0% 100%, rgba(244,114,182,0.22), transparent 60%)',
          }}
        />
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10'>
          <motion.div
            initial='hidden'
            animate='show'
            variants={container}
            className='space-y-5'
          >
            <Eyebrow>True Parents • Our Founders</Eyebrow>
            <motion.div variants={fadeUp}>
              <HighlightTitle
                as='h1'
                text='Rev. Sun Myung Moon & Dr. Hak Ja Han Moon'
                highlightedText='True Parents'
                className='text-4xl md:text-6xl text-white'
                uppercase
                gradientClassName='bg-gradient-to-r from-amber-200 via-rose-200 to-fuchsia-200 bg-clip-text text-transparent'
              />
            </motion.div>
            <motion.p variants={fadeUp} className='text-white/85 max-w-xl'>
              True Parents dedicated their lives to establishing Heavenly
              Parent’s ideal of true love, raising true families, and building
              one family under God.
            </motion.p>

            {/* theme badges */}
            <motion.div
              variants={fadeUp}
              className='flex flex-wrap items-center gap-2 pt-1'
            >
              <Badge className='inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white ring-1 ring-amber-300/30 shadow-sm'>
                <Heart className='h-3.5 w-3.5' /> True Love
              </Badge>
              <Badge className='inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 text-white ring-1 ring-violet-300/30 shadow-sm'>
                <Crown className='h-3.5 w-3.5' /> True Family
              </Badge>
              <Badge className='inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-red-500 text-white ring-1 ring-rose-300/30 shadow-sm'>
                <Globe2 className='h-3.5 w-3.5' /> One Family Under God
              </Badge>
            </motion.div>
          </motion.div>

          <motion.div
            variants={pop}
            initial='hidden'
            animate='show'
            className='relative'
          >
            <div className='absolute -inset-6 rounded-3xl bg-gradient-to-tr from-amber-500/25 via-rose-500/15 to-fuchsia-500/25 blur-2xl' />
            <Image
              src='/true-parents-portrait.jpg' // your asset
              alt='True Parents - Rev. Sun Myung Moon and Dr. Hak Ja Han Moon'
              width={900}
              height={720}
              className='relative rounded-3xl ring-1 ring-white/15 object-cover w-full h-auto'
              priority
            />
          </motion.div>
        </div>
      </SectionShell>

      {/* CORE TEACHINGS (light) */}
      <SectionShell className='overflow-hidden'>
        <motion.div
          className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8'
          variants={container}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.35 }}
        >
          {/* Cards left */}
          <motion.div variants={fadeUp} className='grid grid-cols-1 gap-8'>
            <Card className='relative overflow-hidden ring-1 ring-black/10'>
              <div className='absolute -inset-10 bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-fuchsia-500/10 blur-2xl' />
              <CardHeader className='relative'>
                <Heart className='h-8 w-8 text-amber-600 mb-4' />
                <CardTitle className='font-heading'>True Love</CardTitle>
              </CardHeader>
              <CardContent className='relative'>
                <p className='text-muted-foreground'>
                  True love gives and forgets, seeking others’ good first—the
                  heart of God’s ideal for humanity.
                </p>
              </CardContent>
            </Card>

            <Card className='relative overflow-hidden ring-1 ring-black/10'>
              <div className='absolute -inset-10 bg-gradient-to-tr from-fuchsia-500/10 via-violet-500/10 to-indigo-500/10 blur-2xl' />
              <CardHeader className='relative'>
                <Crown className='h-8 w-8 text-fuchsia-600 mb-4' />
                <CardTitle className='font-heading'>True Family</CardTitle>
              </CardHeader>
              <CardContent className='relative'>
                <p className='text-muted-foreground'>
                  Families centered on Heavenly Parent—parents and children
                  living in harmony—become the seed of a peaceful world.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cards right */}
          <motion.div variants={fadeUp} className='grid grid-cols-1 gap-8'>
            <Card className='relative overflow-hidden ring-1 ring-black/10'>
              <div className='absolute -inset-10 bg-gradient-to-tr from-rose-500/10 via-pink-500/10 to-red-500/10 blur-2xl' />
              <CardHeader className='relative'>
                <Globe2 className='h-8 w-8 text-rose-600 mb-4' />
                <CardTitle className='font-heading'>
                  One Family Under God
                </CardTitle>
              </CardHeader>
              <CardContent className='relative'>
                <p className='text-muted-foreground'>
                  A vision that transcends race, religion, and nation—calling
                  all people to live as one family under God.
                </p>
              </CardContent>
            </Card>

            <Card className='relative overflow-hidden ring-1 ring-black/10'>
              <div className='absolute -inset-10 bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-fuchsia-500/10 blur-2xl' />
              <CardHeader className='relative'>
                <BookOpen className='h-8 w-8 text-amber-600 mb-4' />
                <CardTitle className='font-heading'>Divine Principle</CardTitle>
              </CardHeader>
              <CardContent className='relative'>
                <p className='text-muted-foreground'>
                  Revelation that explains God’s purpose of creation, the human
                  fall, and the path of restoration through true love.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </SectionShell>

      {/* LEGACY (side-by-side light) */}
      <SectionShell className='overflow-hidden'>
        <motion.div
          className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_1fr] items-center gap-10 md:gap-16'
          variants={container}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.35 }}
        >
          <motion.div variants={fadeUp} className='space-y-6'>
            <Eyebrow>Legacy</Eyebrow>
            <HighlightTitle
              as='h2'
              text='A life poured out for peace, families, and Heavenly Parent'
              highlightedText='peace'
              className='text-3xl md:text-5xl'
              uppercase
              gradientClassName='bg-gradient-to-r from-amber-700 via-rose-700 to-fuchsia-700 bg-clip-text text-transparent'
            />
            <blockquote className='rounded-2xl border p-5 bg-white/70 ring-1 ring-amber-200/40'>
              <p className='text-slate-700 italic'>
                “We have come as the True Parents to teach true love—so you can
                form true families and build a true nation and world.”
              </p>
            </blockquote>
            <p className='text-muted-foreground max-w-2xl'>
              Through their teachings and example, True Parents have guided
              millions toward the path of true love and service. Their legacy
              continues through blessed families, devotion in Cheon Shim Won,
              and global initiatives for peace.
            </p>
            <div className='flex flex-wrap gap-2'>
              <Badge className='bg-gradient-to-r from-amber-500 to-rose-600 text-white ring-1 ring-amber-300/30'>
                <Sparkles className='h-3.5 w-3.5 mr-1' /> Hyojeong Culture
              </Badge>
              <Badge className='bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 text-white ring-1 ring-violet-300/30'>
                <Handshake className='h-3.5 w-3.5 mr-1' /> Interfaith & Service
              </Badge>
            </div>
          </motion.div>

          <motion.div variants={pop} className='relative'>
            <div className='absolute -inset-6 rounded-3xl bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-fuchsia-500/15 blur-2xl' />
            <Image
              src='https://i0.wp.com/familyfedcommunity.org.uk/wp-content/uploads/2021/06/true-parents-singing.jpg?fit=800%2C450&ssl=1'
              alt='True Parents legacy events'
              width={880}
              height={720}
              className='relative rounded-3xl ring-1 ring-black/10 object-cover w-full h-auto'
            />
          </motion.div>
        </motion.div>
      </SectionShell>

      {/* MISSION ACCOMPLISHMENTS (dark, animated stats) */}
      <SectionShell dark className='overflow-hidden'>
        <div className='max-w-6xl mx-auto text-center space-y-6'>
          <Eyebrow>Mission Accomplishments</Eyebrow>
          <HighlightTitle
            as='h2'
            text='Fruits of devotion across nations'
            highlightedText='Fruits'
            className='text-3xl md:text-5xl text-white'
            uppercase
            gradientClassName='bg-gradient-to-r from-amber-200 via-rose-200 to-fuchsia-200 bg-clip-text text-transparent'
          />
          <motion.div
            className='grid grid-cols-1 md:grid-cols-3 gap-8'
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.2, delayChildren: 0.15 },
              },
            }}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, amount: 0.3 }}
          >
            {[
              {
                value: 'Millions+',
                label: 'Blessing Ceremonies',
                sub: 'Couples blessed in marriage',
              },
              {
                value: '190+',
                label: 'Nations',
                sub: 'Countries with FFWPU presence',
              },
              { value: '70+', label: 'Years', sub: 'Of global peace mission' },
            ].map((s) => (
              <motion.div
                key={s.label}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8, ease: easeOut },
                  },
                }}
                className='rounded-2xl border border-white/10 bg-white/5 p-6'
              >
                <div className='text-4xl font-extrabold bg-gradient-to-r from-amber-200 via-rose-200 to-fuchsia-200 bg-clip-text text-transparent'>
                  {s.value}
                </div>
                <p className='text-white mt-1'>{s.label}</p>
                <p className='text-white/80 text-sm'>{s.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </SectionShell>

      {/* CTA */}
      <SectionShell className='overflow-hidden'>
        <div className='max-w-4xl mx-auto text-center space-y-4 relative'>
          <div
            aria-hidden
            className='pointer-events-none absolute -inset-24 -z-10'
            style={{
              background:
                'radial-gradient(36rem 20rem at 70% 10%, rgba(251,191,36,0.18), transparent 60%), radial-gradient(36rem 20rem at 0% 100%, rgba(244,114,182,0.18), transparent 60%)',
            }}
          />
          <Eyebrow>Walk the Path</Eyebrow>
          <HighlightTitle
            as='h3'
            text='Live the culture of true love—begin in your family'
            highlightedText='true love'
            className='text-3xl md:text-5xl'
            uppercase
            gradientClassName='bg-gradient-to-r from-amber-700 via-rose-700 to-fuchsia-700 bg-clip-text text-transparent'
          />
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Join a Blessing preparation class, participate in Peace Road, or
            support youth and family programs.
          </p>
        </div>
      </SectionShell>
    </div>
  )
}
