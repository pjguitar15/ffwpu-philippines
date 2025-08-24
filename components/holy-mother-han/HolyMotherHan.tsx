'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  motion,
  type Variants,
  type Easing,
  type Transition,
} from 'framer-motion'
import { Eyebrow } from '@/components/ui/eyebrow'
import { HighlightTitle } from '@/components/ui/highlight-title'
import { SectionShell } from '@/components/ui/section-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Crown,
  Sparkles,
  Heart,
  BookOpen,
  Globe2,
  Building2,
  Flower2,
  Feather,
} from 'lucide-react'

// ----- animation helpers (typed to avoid TS errors)
const easeOut: Easing = [0.16, 1, 0.3, 1]

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.28, delayChildren: 0.18 },
  },
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
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: easeOut },
  },
}

// ----- tiny UI pieces
function IconBubble({ children }: { children: React.ReactNode }) {
  return (
    <div
      className='inline-flex h-10 w-10 items-center justify-center rounded-2xl
      bg-gradient-to-br from-pink-500/15 via-fuchsia-500/15 to-rose-500/15
      ring-1 ring-rose-400/20'
    >
      <div className='text-rose-600'>{children}</div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <motion.div
      variants={fadeUp}
      className='rounded-2xl border bg-white/70 backdrop-blur-sm p-5 ring-1 ring-rose-200/40
                 hover:shadow-md transition'
    >
      <div className='flex items-start gap-3'>
        <IconBubble>{icon}</IconBubble>
        <div>
          <h4 className='font-semibold tracking-wide'>{title}</h4>
          <p className='text-sm text-muted-foreground mt-1'>{desc}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ====== sections
export function HolyMotherHanHero() {
  return (
    <SectionShell dark className='relative overflow-hidden'>
      {/* Pink/violet royal glow */}
      <div
        aria-hidden
        className='absolute -inset-24 -z-10'
        style={{
          background:
            'radial-gradient(60rem 30rem at 70% 10%, rgba(236,72,153,0.25), transparent 60%), radial-gradient(50rem 30rem at 0% 100%, rgba(168,85,247,0.25), transparent 60%)',
        }}
      />
      <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10'>
        <motion.div
          initial='hidden'
          animate='show'
          variants={container}
          className='space-y-5'
        >
          <Eyebrow>True Mother • Holy Mother Han</Eyebrow>
          <motion.div variants={fadeUp}>
            <HighlightTitle
              as='h1'
              text='The Mother of Peace and the Only Begotten Daughter'
              highlightedText='Mother of Peace'
              className='text-4xl md:text-6xl text-white'
              uppercase
              gradientClassName='bg-gradient-to-r from-rose-200 via-pink-200 to-fuchsia-200 bg-clip-text text-transparent'
            />
          </motion.div>
          <motion.p variants={fadeUp} className='text-white/85 max-w-xl'>
            Holy Mother Han (Dr. Hak Ja Han Moon) is revered by our community as
            True Mother—co-founder of the movement with True Father Sun Myung
            Moon—and the central guide of today’s providence of Heavenly
            Parent’s love.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className='flex flex-wrap items-center gap-2 pt-1'
          >
            <Badge
              className='inline-flex items-center gap-1.5 rounded-full
               bg-gradient-to-r from-rose-500 to-pink-600 text-white
               ring-1 ring-rose-300/30 shadow-sm'
            >
              <Sparkles className='h-3.5 w-3.5' />
              Hyojeong Culture
            </Badge>

            <Badge
              className='inline-flex items-center gap-1.5 rounded-full
               bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 text-white
               ring-1 ring-violet-300/30 shadow-sm'
            >
              <Crown className='h-3.5 w-3.5' />
              Cheon Il Guk Vision
            </Badge>

            <Badge
              className='inline-flex items-center gap-1.5 rounded-full
               bg-gradient-to-r from-pink-600 via-rose-600 to-red-500 text-white
               ring-1 ring-rose-300/30 shadow-sm'
            >
              <Heart className='h-3.5 w-3.5' />
              Blessing & Families
            </Badge>
          </motion.div>
        </motion.div>

        <motion.div
          variants={pop}
          initial='hidden'
          animate='show'
          className='relative'
        >
          <div className='absolute -inset-6 rounded-3xl bg-gradient-to-tr from-rose-500/25 via-fuchsia-500/15 to-pink-500/25 blur-2xl' />
          <Image
            src='https://images.squarespace-cdn.com/content/v1/679d6376cc072a150074c5df/b3644cf1-8e31-4a76-8e00-caf5677cce59/4C8A2572.jpg'
            alt='Holy Mother Han (True Mother)'
            width={880}
            height={720}
            className='relative rounded-3xl ring-1 ring-white/15 object-cover w-full h-auto'
            priority
          />
        </motion.div>
      </div>
    </SectionShell>
  )
}

export function HolyMotherHanEssentials() {
  return (
    <SectionShell className='overflow-hidden'>
      <motion.div
        className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_1fr] items-center gap-10 md:gap-16'
        variants={container}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.35 }}
      >
        <motion.div variants={fadeUp} className='space-y-6'>
          <Eyebrow>Essentials</Eyebrow>
          <HighlightTitle
            as='h2'
            text='Who is Holy Mother Han?'
            highlightedText='Holy Mother Han'
            className='text-3xl md:text-5xl'
            uppercase
            gradientClassName='bg-gradient-to-r from-rose-700 via-fuchsia-700 to-pink-700 bg-clip-text text-transparent'
          />
          <p className='text-muted-foreground max-w-2xl'>
            Known as True Mother in the Family Federation, Holy Mother Han is
            honored as the Mother of Peace. Together with True Father, she
            devoted her life to raising families of filial heart, guiding the
            Blessing movement, and advancing a culture of hyojeong—filial love
            toward Heavenly Parent.
          </p>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <FeatureCard
              icon={<Crown className='h-5 w-5' />}
              title='Co-Founder & Leader'
              desc='Co-founded the movement with True Father; continues to lead the providence centered on Heavenly Parent.'
            />
            <FeatureCard
              icon={<Building2 className='h-5 w-5' />}
              title='Holy Temple & Legacy'
              desc='Guided the establishment of the Holy Temple in Korea and global centers that uplift family and faith.'
            />
            <FeatureCard
              icon={<BookOpen className='h-5 w-5' />}
              title='Mother of Peace'
              desc='A message emphasizing reconciliation, compassion, and living for the sake of others.'
            />
            <FeatureCard
              icon={<Globe2 className='h-5 w-5' />}
              title='Global Initiatives'
              desc='Inspires programs such as Peace Road, youth and women’s initiatives, and interfaith service.'
            />
          </div>
        </motion.div>

        <motion.div variants={pop} className='relative'>
          <div className='absolute -inset-6 rounded-3xl bg-gradient-to-tr from-pink-500/15 via-rose-500/10 to-fuchsia-500/15 blur-2xl' />
          <Image
            src='https://familyfedihq.org/wp-content/uploads/2023/11/TM2-1024x566.jpg'
            alt='Holy Mother Han leading a providential event'
            width={860}
            height={720}
            className='relative rounded-3xl ring-1 ring-black/10 object-cover w-full h-auto'
          />
        </motion.div>
      </motion.div>
    </SectionShell>
  )
}

export function HolyMotherHanToday() {
  const items = [
    {
      icon: <Heart className='h-5 w-5' />,
      title: 'Blessing & Families',
      desc: 'Strengthening marriages and lineage through the Blessing and a life of devotion at home.',
    },
    {
      icon: <Sparkles className='h-5 w-5' />,
      title: 'Cheon Shim Won Devotion',
      desc: 'Night-vigil jeongseong that nurtures healing, guidance, and filial heart.',
    },
    {
      icon: <Feather className='h-5 w-5' />,
      title: 'Hyojeong Culture',
      desc: 'A culture of beauty, gratitude, and respect that uplifts daily life and worship.',
    },
    {
      icon: <Flower2 className='h-5 w-5' />,
      title: 'Women & Youth',
      desc: 'Encouraging women and young leaders to build communities of service and peace.',
    },
  ]
  return (
    <SectionShell dark className='overflow-hidden'>
      <div className='max-w-6xl mx-auto space-y-8'>
        <Eyebrow>Providence Today</Eyebrow>
        <HighlightTitle
          as='h2'
          text='Why Holy Mother Han is central in the current providence'
          highlightedText='central'
          className='text-3xl md:text-5xl text-white'
          uppercase
          gradientClassName='bg-gradient-to-r from-rose-200 via-pink-200 to-fuchsia-200 bg-clip-text text-transparent'
        />
        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 gap-6'
          variants={container}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.35 }}
        >
          {items.map((it) => (
            <motion.div
              key={it.title}
              variants={fadeUp}
              className='rounded-2xl border border-white/10 bg-white/5 p-5'
            >
              <div className='flex items-start gap-3'>
                <IconBubble>{it.icon}</IconBubble>
                <div>
                  <h4 className='font-semibold text-white'>{it.title}</h4>
                  <p className='text-white/80 text-sm mt-1'>{it.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionShell>
  )
}

export function HolyMotherHanTimeline() {
  const milestones = [
    {
      year: 'Co-Founder',
      text: 'Stood with True Father to found and expand a global movement for peace and families.',
    },
    {
      year: 'Leadership',
      text: 'Guides the providence with a focus on devotion, education, and raising leaders of heart.',
    },
    {
      year: 'Holy Temple',
      text: 'Inspires sacred spaces and culture that honor Heavenly Parent and True Parents.',
    },
    {
      year: 'Global Peace',
      text: 'Advances interfaith, youth, and women’s initiatives serving communities worldwide.',
    },
  ]
  return (
    <SectionShell className='overflow-hidden'>
      <div className='max-w-5xl mx-auto'>
        <Eyebrow>Milestones</Eyebrow>
        <div className='relative mt-2'>
          <motion.div
            className='absolute left-4 inset-y-0 w-px bg-rose-300/40'
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
            style={{ transformOrigin: 'top' }}
          />
          <motion.ul
            className='space-y-8 pl-12'
            variants={container}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, amount: 0.35 }}
          >
            {milestones.map((m) => (
              <motion.li key={m.year} variants={fadeUp} className='relative'>
                <div className='absolute -left-9 top-1.5 h-4 w-4 rounded-full bg-gradient-to-br from-rose-400 to-fuchsia-500 ring-4 ring-rose-200/40' />
                <h4 className='font-semibold'>{m.year}</h4>
                <p className='text-muted-foreground'>{m.text}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </SectionShell>
  )
}

export function HolyMotherHanCTA() {
  return (
    <SectionShell className='overflow-hidden'>
      <div className='max-w-4xl mx-auto text-center space-y-4 relative'>
        <div
          aria-hidden
          className='pointer-events-none absolute -inset-24 -z-10'
          style={{
            background:
              'radial-gradient(36rem 20rem at 70% 10%, rgba(244,114,182,0.18), transparent 60%), radial-gradient(36rem 20rem at 0% 100%, rgba(217,70,239,0.18), transparent 60%)',
          }}
        />
        <Eyebrow>Get Involved</Eyebrow>
        <HighlightTitle
          as='h3'
          text='Walk with True Mother’s heart of love and service'
          highlightedText='love and service'
          className='text-3xl md:text-5xl'
          uppercase
          gradientClassName='bg-gradient-to-r from-rose-700 via-fuchsia-700 to-pink-700 bg-clip-text text-transparent'
        />
        <p className='text-muted-foreground max-w-2xl mx-auto'>
          Join a vigil, support family Blessings, or volunteer with youth and
          women’s initiatives. Your devotion can bless many.
        </p>
        <div className='pt-2 flex justify-center gap-3'>
          <Link href='/events'>
            <Button className='rounded-xl bg-gradient-to-r from-fuchsia-600 via-rose-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500'>
              See Upcoming Events
            </Button>
          </Link>
          <Link href='/donate'>
            <Button variant='outline' className='rounded-xl'>
              Donate / Volunteer
            </Button>
          </Link>
        </div>
      </div>
    </SectionShell>
  )
}

// ===== main composer (use this inside your page)
export default function HolyMotherHan() {
  return (
    <main>
      <HolyMotherHanHero />
      <HolyMotherHanEssentials />
      <HolyMotherHanToday />
      <HolyMotherHanTimeline />
      <HolyMotherHanCTA />
    </main>
  )
}
