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
import { Shield, Globe2, BookOpen, Users2, Crown, Sparkles } from 'lucide-react'

/* ── animation helpers ─────────────────────────────────────────────── */
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
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: easeOut } },
}

/* ── tiny UI ───────────────────────────────────────────────────────── */
function IconChip({ children }: { children: React.ReactNode }) {
  return (
    <span className='inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 via-blue-700 to-cyan-700 text-white px-3 py-1 text-xs ring-1 ring-indigo-300/40 shadow-sm'>
      {children}
    </span>
  )
}

/* ── sections ─────────────────────────────────────────────────────── */
export function TrueFatherHero() {
  return (
    <SectionShell dark className='relative overflow-hidden'>
      {/* Royal blue/gold glow */}
      <div
        aria-hidden
        className='absolute -inset-24 -z-10'
        style={{
          background:
            'radial-gradient(60rem 30rem at 70% 10%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(50rem 30rem at 0% 100%, rgba(99,102,241,0.2), transparent 60%)',
        }}
      />

      <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10'>
        <motion.div
          initial='hidden'
          animate='show'
          variants={container}
          className='space-y-5'
        >
          <Eyebrow>True Father • Rev. Sun Myung Moon</Eyebrow>

          <motion.div variants={fadeUp}>
            <HighlightTitle
              as='h1'
              text='Founder of the Family Federation and a Life for World Peace'
              highlightedText='Founder'
              className='text-4xl md:text-6xl text-white'
              uppercase
              gradientClassName='bg-gradient-to-r from-cyan-200 via-indigo-200 to-amber-200 bg-clip-text text-transparent'
            />
          </motion.div>

          <motion.p variants={fadeUp} className='text-white/85 max-w-xl'>
            Known as True Father (1920–2012), Rev. Sun Myung Moon founded the
            Unification movement in 1954 (today FFWPU) and launched global
            initiatives for family blessing, interfaith cooperation, and peace.
            His legacy continues worldwide.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className='flex flex-wrap items-center gap-2 pt-1'
          >
            <Badge className='rounded-full bg-gradient-to-r from-indigo-600 via-blue-700 to-cyan-700 text-white ring-1 ring-indigo-300/30 shadow-sm'>
              <Crown className='h-3.5 w-3.5' />
              Founder & Vision
            </Badge>
            <Badge className='rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white ring-1 ring-amber-300/30 shadow-sm'>
              <Users2 className='h-3.5 w-3.5' />
              Blessing & Families
            </Badge>
            <Badge className='rounded-full bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-700 text-white ring-1 ring-sky-300/30 shadow-sm'>
              <Globe2 className='h-3.5 w-3.5' />
              Peace & Cooperation
            </Badge>
          </motion.div>
        </motion.div>

        <motion.div
          variants={pop}
          initial='hidden'
          animate='show'
          className='relative'
        >
          <div className='absolute -inset-6 rounded-3xl bg-gradient-to-tr from-cyan-400/25 via-indigo-500/15 to-amber-300/25 blur-2xl' />
          <Image
            src='/true-father.webp'
            alt='Rev. Sun Myung Moon (True Father)'
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

export function TrueFatherEssentials() {
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
            text='Who is Rev. Sun Myung Moon?'
            highlightedText='Rev. Sun Myung Moon'
            className='text-3xl md:text-5xl'
            uppercase
            gradientClassName='bg-gradient-to-r from-indigo-700 via-blue-700 to-amber-600 bg-clip-text text-transparent'
          />
          <p className='text-muted-foreground max-w-2xl'>
            Founder of the Unification movement (1954) and co-founder of the
            Universal Peace Federation (2005) with Dr. Hak Ja Han Moon, True
            Father dedicated his life to God-centered families, interfaith
            cooperation, education, culture, and global peace.
          </p>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <motion.div
              variants={fadeUp}
              className='rounded-2xl border bg-white/70 backdrop-blur-sm p-5 ring-1 ring-indigo-200/40 hover:shadow-md transition'
            >
              <div className='flex flex-col items-start gap-3'>
                <IconChip>
                  <Shield className='h-4 w-4' /> Founder
                </IconChip>
                <div>
                  <h4 className='font-semibold'>HSA-UWC → FFWPU</h4>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Established the Holy Spirit Association for the Unification
                    of World Christianity (1954), today known as the Family
                    Federation for World Peace and Unification.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className='rounded-2xl border bg-white/70 backdrop-blur-sm p-5 ring-1 ring-indigo-200/40 hover:shadow-md transition'
            >
              <div className='flex flex-col items-start gap-3'>
                <IconChip>
                  <Globe2 className='h-4 w-4' /> UPF
                </IconChip>
                <div>
                  <h4 className='font-semibold'>Universal Peace Federation</h4>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Co-founded UPF in 2005 to advance interfaith collaboration,
                    peace education, and a world of One Family under God.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className='rounded-2xl border bg-white/70 backdrop-blur-sm p-5 ring-1 ring-indigo-200/40 hover:shadow-md transition'
            >
              <div className='flex flex-col items-start gap-3'>
                <IconChip>
                  <BookOpen className='h-4 w-4' /> Teaching
                </IconChip>
                <div>
                  <h4 className='font-semibold'>Divine Principle Mission</h4>
                  <p className='text-sm text-muted-foreground mt-1'>
                    From the 1950s, taught and wrote about God’s ideal, family,
                    and restoration— inspiring missionaries and educational work
                    worldwide.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className='rounded-2xl border bg-white/70 backdrop-blur-sm p-5 ring-1 ring-indigo-200/40 hover:shadow-md transition'
            >
              <div className='flex flex-col items-start gap-3'>
                <IconChip>
                  <Sparkles className='h-4 w-4' /> Culture
                </IconChip>
                <div>
                  <h4 className='font-semibold'>Little Angels & Sunhwa Arts</h4>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Founded the Little Angels (1962) and supported Sunhwa Arts
                    School—sharing Korea’s beauty and raising artistic talent
                    for peace.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={pop} className='relative'>
          <div className='absolute -inset-6 rounded-3xl bg-gradient-to-tr from-indigo-500/15 via-cyan-500/10 to-amber-500/15 blur-2xl' />
          <Image
            src='/old-true-father.webp'
            alt='True Father ministry montage'
            width={860}
            height={720}
            className='relative rounded-3xl ring-1 ring-black/10 object-cover w-full h-auto'
          />
        </motion.div>
      </motion.div>
    </SectionShell>
  )
}

export function TrueFatherToday() {
  const items = [
    {
      icon: <Users2 className='h-5 w-5' />,
      title: 'Blessing Movement',
      desc: 'Uplifting marriage and lineage through the Blessing—building God-centered families.',
    },
    {
      icon: <Globe2 className='h-5 w-5' />,
      title: 'Interfaith & Peace',
      desc: 'UPF networks of faith leaders and Ambassadors for Peace advancing dialogue and service.',
    },
    {
      icon: <BookOpen className='h-5 w-5' />,
      title: 'Education & Culture',
      desc: 'Seminars, schools, and arts initiatives (e.g., Little Angels, Sunhwa) that form character and bridge cultures.',
    },
    {
      icon: <Shield className='h-5 w-5' />,
      title: 'Public Mission',
      desc: 'A life offered for God and humanity—calling nations and families to live for the sake of others.',
    },
  ]
  return (
    <SectionShell dark className='overflow-hidden'>
      <div className='max-w-6xl mx-auto space-y-8'>
        <Eyebrow>Providence Today</Eyebrow>
        <HighlightTitle
          as='h2'
          text='How True Father’s vision continues to shape our movement'
          highlightedText='continues'
          className='text-3xl md:text-5xl text-white'
          uppercase
          gradientClassName='bg-gradient-to-r from-cyan-200 via-indigo-200 to-amber-200 bg-clip-text text-transparent'
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
                <span className='inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 text-white'>
                  {it.icon}
                </span>
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

export function TrueFatherTimeline() {
  const milestones = [
    {
      year: '1920',
      text: 'Birth in Jeongju, North Pyeongan Province (Jan 6 lunar / Feb 25 solar).',
    },
    {
      year: '1954',
      text: 'Founds the Holy Spirit Association for the Unification of World Christianity in Seoul.',
    },
    {
      year: '1962',
      text: 'Launches the Little Angels Children’s Folk Ballet to share Korea’s culture for peace.',
    },
    {
      year: '2005',
      text: 'With Dr. Hak Ja Han Moon, inaugurates the Universal Peace Federation (UPF).',
    },
    {
      year: '2012',
      text: 'Holy Ascension (Seonghwa); legacy continues through FFWPU and affiliated works.',
    },
  ]
  return (
    <SectionShell className='overflow-hidden'>
      <div className='max-w-5xl mx-auto'>
        <Eyebrow>Milestones</Eyebrow>
        <div className='relative mt-2'>
          <motion.div
            className='absolute left-4 inset-y-0 w-px bg-indigo-300/40'
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
                <div className='absolute -left-9 top-1.5 h-4 w-4 rounded-full bg-gradient-to-br from-cyan-400 to-amber-400 ring-4 ring-indigo-200/40' />
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

export function TrueFatherCTA() {
  return (
    <SectionShell className='overflow-hidden'>
      <div className='max-w-4xl mx-auto text-center space-y-4 relative'>
        <div
          aria-hidden
          className='pointer-events-none absolute -inset-24 -z-10'
          style={{
            background:
              'radial-gradient(36rem 20rem at 70% 10%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(36rem 20rem at 0% 100%, rgba(245,158,11,0.18), transparent 60%)',
          }}
        />
        <Eyebrow>Explore More</Eyebrow>
        <HighlightTitle
          as='h3'
          text='Walk with the Founder’s heart for God and humanity'
          highlightedText='Founder’s heart'
          className='text-3xl md:text-5xl'
          uppercase
          gradientClassName='bg-gradient-to-r from-cyan-700 via-indigo-700 to-amber-600 bg-clip-text text-transparent'
        />
        <p className='text-muted-foreground max-w-2xl mx-auto'>
          Read his teachings, timeline, and peace initiatives—and see how this
          vision lives on today.
        </p>
        <div className='pt-2 flex justify-center gap-3'>
          <Link
            href='https://familyfedihq.org/internal-guidance/'
            target='_blank'
          >
            <Button className='rounded-xl bg-gradient-to-r from-indigo-600 via-blue-700 to-cyan-700 hover:from-indigo-500 hover:to-cyan-600'>
              Father’s Speeches
            </Button>
          </Link>
          <Link
            href='https://familyfedihq.org/unification-movement-historical-timeline/'
            target='_blank'
          >
            <Button variant='outline' className='rounded-xl'>
              Historical Timeline
            </Button>
          </Link>
          <Link
            href='https://www.upf.org/about/founders/rev-dr-sun-myung-moon'
            target='_blank'
          >
            <Button variant='outline' className='rounded-xl'>
              UPF Founder Bio
            </Button>
          </Link>
        </div>
      </div>
    </SectionShell>
  )
}

/* ── page composer ─────────────────────────────────────────────────── */
export default function TrueFatherPage() {
  return (
    <main>
      <TrueFatherHero />
      <TrueFatherEssentials />
      <TrueFatherToday />
      <TrueFatherTimeline />
      <TrueFatherCTA />
    </main>
  )
}
