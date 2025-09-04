'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SectionShell } from '@/components/ui/section-shell'
import { Eyebrow } from '@/components/ui/eyebrow'
import { HighlightTitle } from '@/components/ui/highlight-title'
import { Button } from '@/components/ui/button'
import { Heart, Crown, Sparkles, Star, Sun, Moon, Globe } from 'lucide-react'
import {
  motion,
  type Variants,
  type Easing,
  type Transition,
} from 'framer-motion'

const easeOut: Easing = [0.16, 1, 0.3, 1]

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 60 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: easeOut },
  },
}

const staggerContainer: Variants = {
  animate: {
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
}

const floatAnimation = {
  y: [-10, 10, -10],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: [0.445, 0.05, 0.55, 0.95] satisfies Easing,
  },
}

export default function TrueParentsPage() {
  return (
    <div className='min-h-screen flex flex-col overflow-hidden'>
      {/* CINEMATIC HERO - Full immersion */}
      <div className='relative min-h-screen flex items-center justify-center overflow-hidden'>
        {/* Dynamic background with multiple layers */}
        <div className='absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-rose-900' />

        {/* Majestic background image */}
        <div className='absolute inset-0 opacity-20'>
          <Image
            src='/true-parents-portrait.jpg'
            alt='True Parents of Heaven, Earth and Humankind'
            fill
            className='object-cover'
            priority
          />
        </div>

        {/* Additional sacred imagery layers */}
        <div className='absolute top-1/4 left-1/4 w-96 h-96 opacity-10'>
          <Image
            src='/true-father.webp'
            alt='True Father divine presence'
            width={400}
            height={400}
            className='rounded-full blur-2xl'
          />
        </div>

        <div className='absolute bottom-1/4 right-1/4 w-80 h-80 opacity-15'>
          <Image
            src='/true-parents-portrait.jpg'
            alt='True Parents sacred bond'
            width={320}
            height={320}
            className='rounded-full blur-xl'
          />
        </div>

        {/* Animated particles */}
        <div className='absolute inset-0'>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className='absolute w-1 h-1 bg-white/30 rounded-full'
              style={{
                left: `${(i * 47) % 100}%`,
                top: `${(i * 23) % 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: (i * 0.5) % 3,
              }}
            />
          ))}
        </div>

        {/* Ethereal glow effects */}
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12 -translate-y-1/2' />

        <div className='relative z-10 max-w-6xl mx-auto px-6 text-center'>
          <motion.div
            initial='initial'
            animate='animate'
            variants={staggerContainer}
            className='space-y-8'
          >
            {/* Sacred symbol */}
            <motion.div variants={fadeInUp} className='mx-auto w-20 h-20 mb-8'>
              <div className='relative w-full h-full'>
                <motion.div
                  animate={floatAnimation}
                  className='absolute inset-0 bg-gradient-to-br from-amber-300 via-rose-300 to-purple-300 rounded-full blur-sm opacity-70'
                />
                <div className='absolute inset-2 bg-gradient-to-br from-white via-yellow-100 to-rose-100 rounded-full flex items-center justify-center'>
                  <Crown className='w-8 h-8 text-amber-600' />
                </div>
              </div>
            </motion.div>

            {/* Title with cinematic reveal */}
            <motion.div variants={fadeInUp} className='space-y-4'>
              <Eyebrow className='text-white/70'>
                True Parents • Heaven, Earth & Humankind
              </Eyebrow>
              <HighlightTitle
                as='h1'
                text='True Parents Rev. Sun Myung Moon & Dr. Hak Ja Han Moon'
                highlightedText='True Parents'
                className='text-3xl md:text-5xl text-white'
                gradientClassName='bg-gradient-to-r from-white via-amber-100 to-rose-100 bg-clip-text text-transparent'
              />
            </motion.div>

            {/* Sacred essence description */}
            <motion.div variants={fadeInUp} className='max-w-6xl mx-auto'>
              <p className='text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto'>
                Through their{' '}
                <span className='text-amber-200 font-medium'>
                  Holy Wedding in 1960
                </span>
                , Heaven blessed them as the eternal True Parents—
                <span className='text-rose-200 font-medium'>
                  {' '}
                  the Messiah and his Bride
                </span>
                , sent to restore God's original family and establish
                <span className='text-purple-200 font-medium'>
                  {' '}
                  true love throughout Heaven, Earth, and Humankind
                </span>
              </p>
            </motion.div>

            {/* Mystical elements */}
            <motion.div
              variants={fadeInUp}
              className='flex justify-center items-center gap-8 pt-8'
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className='w-12 h-12 bg-gradient-to-br from-amber-400/30 to-transparent rounded-full border border-amber-300/30 flex items-center justify-center'
              >
                <Sun className='w-6 h-6 text-amber-300' />
              </motion.div>
              <div className='text-white/50 text-sm tracking-widest'>∞</div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className='w-12 h-12 bg-gradient-to-br from-blue-400/30 to-transparent rounded-full border border-blue-300/30 flex items-center justify-center'
              >
                <Moon className='w-6 h-6 text-blue-300' />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className='w-px h-12 bg-gradient-to-b from-white/50 to-transparent' />
        </motion.div>
      </div>

      {/* EARLY LIFE & DIVINE CALLING - Real History Section */}
      <div className='relative py-24 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100' />

        <div className='relative z-10 max-w-6xl mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <Eyebrow className='mb-6'>
              Real History • True Parents' Path
            </Eyebrow>
            <HighlightTitle
              as='h2'
              text='The Early Years - From humble beginnings to divine mission in North Korea 1920-1954'
              highlightedText='The Early Years'
              className='text-4xl md:text-6xl'
              gradientClassName='bg-gradient-to-r from-indigo-900 via-blue-800 to-sky-700 bg-clip-text text-transparent'
            />
          </motion.div>

          {/* Gallery Grid Layout */}
          <div className='grid lg:grid-cols-3 gap-12'>
            {/* Birth and Family Background with Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className='lg:col-span-2 space-y-8'
            >
              <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50'>
                <div className='flex items-start gap-4 mb-6'>
                  <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center'>
                    <Star className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-slate-800'>
                      Born in North Korea
                    </h3>
                    <p className='text-slate-600'>
                      January 6, 1920 - Sangsa-ri Village
                    </p>
                  </div>
                </div>
                <p className='text-lg text-muted-foreground leading-relaxed mb-6'>
                  Sun Myung Moon was born as Yong Myung Moon to a farming family
                  of thirteen children in modern-day North Pyong'an Province.
                  His family followed Confucian beliefs until he was around 10
                  years old, when they converted to Christianity and joined the
                  Presbyterian church.
                </p>

                {/* Young True Father Image */}
                <div className='relative'>
                  <div className='absolute -inset-4 bg-gradient-to-br from-blue-300/20 via-indigo-300/10 to-transparent rounded-3xl blur-xl' />
                  <div className='relative bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg'>
                    <Image
                      src='https://commons.wikimedia.org/wiki/File:Rev._Sun_Myung_Moon.jpg'
                      alt='Young Sun Myung Moon'
                      width={500}
                      height={300}
                      className='w-full rounded-xl object-cover'
                    />
                    <div className='mt-3 text-center'>
                      <p className='text-sm font-medium text-slate-700'>
                        Rev. Sun Myung Moon
                      </p>
                      <p className='text-xs text-slate-500'>
                        Historical photograph
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Side Image - North Korea Map/Historical Context */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className='space-y-6'
            >
              <div className='relative'>
                <div className='absolute -inset-4 bg-gradient-to-br from-slate-300/20 via-blue-300/10 to-transparent rounded-3xl blur-xl' />
                <div className='relative bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg'>
                  <Image
                    src='https://commons.wikimedia.org/wiki/File:Sunmyungmoon.jpg'
                    alt='True Father historical photo'
                    width={300}
                    height={400}
                    className='w-full rounded-xl object-cover'
                  />
                  <div className='mt-3 text-center'>
                    <p className='text-sm font-medium text-slate-700'>
                      Rev. Sun Myung Moon
                    </p>
                    <p className='text-xs text-slate-500'>
                      Historical portrait
                    </p>
                  </div>
                </div>
              </div>

              {/* Small timeline image */}
              <div className='bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 shadow-lg'>
                <h4 className='text-lg font-semibold text-slate-800 mb-4'>
                  Timeline
                </h4>
                <div className='space-y-3'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold'>
                      20
                    </div>
                    <p className='text-sm text-slate-700'>Born 1920</p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold'>
                      30
                    </div>
                    <p className='text-sm text-slate-700'>Family converts</p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold'>
                      35
                    </div>
                    <p className='text-sm text-slate-700'>Easter vision</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Easter Morning Vision Section with Multiple Images */}
          <div className='mt-16 space-y-12'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className='grid lg:grid-cols-2 gap-12 items-center'
            >
              {/* The Calling at 16 */}
              <div className='bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl p-8 shadow-xl border border-amber-200'>
                <div className='flex items-start gap-4 mb-6'>
                  <div className='w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center'>
                    <Sun className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-slate-800'>
                      The Easter Morning Vision
                    </h3>
                    <p className='text-slate-600'>April 17, 1935 - Age 16</p>
                  </div>
                </div>
                <blockquote className='text-lg italic text-slate-700 border-l-4 border-amber-400 pl-6 mb-4'>
                  "Jesus appeared to me and said: 'You must complete the mission
                  I could not fulfill. You must become the True Parent and find
                  the True Mother to establish the True Family.'"
                </blockquote>
                <p className='text-lg text-muted-foreground leading-relaxed'>
                  This profound spiritual experience changed the course of his
                  life forever, setting him on the path to understand God's will
                  for humanity's restoration.
                </p>
              </div>

              {/* Vision Image */}
              <div className='relative'>
                <div className='absolute -inset-6 bg-gradient-to-br from-amber-300/20 via-orange-300/10 to-transparent rounded-3xl blur-2xl' />
                <div className='relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl'>
                  <Image
                    src='https://commons.wikimedia.org/wiki/File:Sun_Myung_Moon_and_Hak_Ja_Han.jpg'
                    alt='True Parents divine calling'
                    width={500}
                    height={400}
                    className='w-full rounded-xl object-cover'
                  />
                  <div className='mt-4 text-center'>
                    <p className='text-lg font-semibold text-slate-800'>
                      True Parents
                    </p>
                    <p className='text-slate-600'>
                      Rev. Sun Myung Moon and Dr. Hak Ja Han Moon
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Suffering and Liberation Section with Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className='grid lg:grid-cols-3 gap-8'
            >
              {/* Hungnam Labor Camp */}
              <div className='lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50'>
                <div className='flex items-start gap-4 mb-6'>
                  <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center'>
                    <Heart className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-slate-800'>
                      Hungnam Labor Camp
                    </h3>
                    <p className='text-slate-600'>1948-1950 - North Korea</p>
                  </div>
                </div>
                <p className='text-lg text-muted-foreground leading-relaxed mb-6'>
                  Arrested by North Korean authorities for his religious
                  activities, True Father was sentenced to five years of hard
                  labor at Hungnam concentration camp. Despite brutal
                  conditions, he maintained his faith and continued to minister
                  to fellow prisoners.
                </p>
                <p className='text-lg text-muted-foreground leading-relaxed mb-6'>
                  He was liberated by UN forces during the Korean War in 1950,
                  walking hundreds of miles to South Korea to continue his
                  mission.
                </p>

                {/* Liberation moment image */}
                <div className='relative'>
                  <div className='absolute -inset-4 bg-gradient-to-br from-purple-300/20 via-indigo-300/10 to-transparent rounded-2xl blur-xl' />
                  <div className='relative bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg'>
                    <Image
                      src='https://commons.wikimedia.org/wiki/File:Sun_Myung_Moon_in_Waseda.jpg'
                      alt='True Father after liberation'
                      width={400}
                      height={250}
                      className='w-full rounded-lg object-cover'
                    />
                    <div className='mt-3 text-center'>
                      <p className='text-sm font-medium text-slate-700'>
                        Rev. Sun Myung Moon
                      </p>
                      <p className='text-xs text-slate-500'>
                        Historical photograph
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline with Images */}
              <div className='space-y-6'>
                <div className='bg-gradient-to-br from-slate-50 to-blue-100 rounded-3xl p-6 shadow-xl'>
                  <h4 className='text-lg font-semibold text-slate-800 mb-4'>
                    Historical Journey
                  </h4>
                  <div className='space-y-4'>
                    {[
                      {
                        year: '1941',
                        event: 'Studies in Japan',
                        image:
                          'https://commons.wikimedia.org/wiki/File:Sunmyungmoon_(cropped).jpg',
                      },
                      {
                        year: '1946',
                        event: 'Ministry begins',
                        image:
                          'https://commons.wikimedia.org/wiki/File:Rev._Sun_Myung_Moon_close-up_(cropped).png',
                      },
                      {
                        year: '1950',
                        event: 'Liberation',
                        image:
                          'https://commons.wikimedia.org/wiki/File:Sun_Myung_Moon_in_Waseda.jpg',
                      },
                      {
                        year: '1954',
                        event: 'Church founded',
                        image:
                          'https://commons.wikimedia.org/wiki/File:Rev._Sun_Myung_Moon.jpg',
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className='flex items-center gap-3 bg-white/80 rounded-lg p-3 shadow-sm'
                      >
                        <div className='w-12 h-12 rounded-lg overflow-hidden flex-shrink-0'>
                          <Image
                            src={item.image}
                            alt={item.event}
                            width={48}
                            height={48}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div>
                          <p className='font-semibold text-slate-800 text-sm'>
                            {item.year}
                          </p>
                          <p className='text-slate-600 text-xs'>{item.event}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional contextual image */}
                <div className='relative'>
                  <div className='absolute -inset-3 bg-gradient-to-br from-blue-300/20 to-transparent rounded-2xl blur-lg' />
                  <div className='relative bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg'>
                    <Image
                      src='https://commons.wikimedia.org/wiki/File:Sun_Myung_Moon_Budapest_Hungary_28-10-2005.jpg'
                      alt='True Father ministry'
                      width={200}
                      height={250}
                      className='w-full rounded-lg object-cover'
                    />
                    <div className='mt-3 text-center'>
                      <p className='text-xs font-medium text-slate-700'>
                        Global Ministry
                      </p>
                      <p className='text-xs text-slate-500'>
                        International work
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* FINDING TRUE MOTHER - Real History Section */}
      <div className='relative py-24 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100' />

        <div className='relative z-10 max-w-6xl mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <Eyebrow className='mb-6'>True Love • Divine Providence</Eyebrow>
            <HighlightTitle
              as='h2'
              text='Finding True Mother - The providential meeting with Hak Ja Han in 1959'
              highlightedText='Finding True Mother'
              className='text-4xl md:text-6xl'
              gradientClassName='bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent'
            />
          </motion.div>

          <div className='grid lg:grid-cols-2 gap-16 items-center'>
            {/* Left side - Story */}
            <div className='space-y-8'>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className='bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50'
              >
                <div className='space-y-6'>
                  <div className='flex items-start gap-4'>
                    <div className='w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center'>
                      <Heart className='w-6 h-6 text-white' />
                    </div>
                    <div>
                      <h3 className='text-xl font-semibold text-slate-800'>
                        The Divine Search
                      </h3>
                      <p className='text-slate-600'>
                        1954-1959 • Seoul, South Korea
                      </p>
                    </div>
                  </div>
                  <p className='text-lg text-muted-foreground leading-relaxed'>
                    After establishing the Holy Spirit Association for the
                    Unification of World Christianity in 1954, True Father knew
                    that finding the True Mother was essential to fulfill God's
                    providence. Through prayer and spiritual revelation, he
                    searched for the woman who would become humanity's True
                    Mother.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
                className='bg-gradient-to-br from-amber-50 to-rose-100 rounded-3xl p-8 shadow-xl border border-rose-200'
              >
                <div className='space-y-6'>
                  <div className='flex items-start gap-4'>
                    <div className='w-12 h-12 bg-gradient-to-br from-amber-500 to-rose-600 rounded-full flex items-center justify-center'>
                      <Star className='w-6 h-6 text-white' />
                    </div>
                    <div>
                      <h3 className='text-xl font-semibold text-slate-800'>
                        Meeting Hak Ja Han
                      </h3>
                      <p className='text-slate-600'>
                        1959 • 17-year-old daughter of a devoted Christian
                        family
                      </p>
                    </div>
                  </div>
                  <p className='text-lg text-muted-foreground leading-relaxed'>
                    Hak Ja Han, born in 1943, came from a deeply Christian
                    family. Her mother, Soon-ae Hong, was a devout Christian who
                    had been praying for the Messiah. When True Father met Hak
                    Ja Han, he recognized her as the woman chosen by God to be
                    the True Mother.
                  </p>
                  <blockquote className='text-lg italic text-slate-700 border-l-4 border-rose-400 pl-6'>
                    "From our first meeting, I knew that she was the one
                    prepared by Heaven to be the True Mother for all humanity."
                  </blockquote>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                viewport={{ once: true }}
                className='bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50'
              >
                <div className='space-y-6'>
                  <div className='flex items-start gap-4'>
                    <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center'>
                      <Crown className='w-6 h-6 text-white' />
                    </div>
                    <div>
                      <h3 className='text-xl font-semibold text-slate-800'>
                        The Holy Wedding
                      </h3>
                      <p className='text-slate-600'>
                        April 11, 1960 • Seoul, South Korea
                      </p>
                    </div>
                  </div>
                  <p className='text-lg text-muted-foreground leading-relaxed mb-4'>
                    On April 11, 1960, Rev. Sun Myung Moon (age 40) and Hak Ja
                    Han (age 17) were united in the Holy Wedding ceremony,
                    establishing them as the True Parents of Heaven, Earth and
                    Humankind. This was not merely a marriage, but the
                    restoration of the position that Adam and Eve lost in the
                    Garden of Eden.
                  </p>
                  <p className='text-lg text-muted-foreground leading-relaxed'>
                    This sacred union marked the beginning of the True Family
                    that would serve as the model for all families seeking to
                    return to God's original ideal.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right side - Images */}
            <div className='space-y-8'>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className='relative'
              >
                <div className='absolute -inset-4 bg-gradient-to-br from-rose-300/20 via-pink-300/10 to-transparent rounded-3xl blur-2xl' />
                <div className='relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/50'>
                  <Image
                    src='https://commons.wikimedia.org/wiki/File:Sun_Myung_Moon_and_Hak_Ja_Han.jpg'
                    alt='True Parents Holy Wedding portrait'
                    width={600}
                    height={400}
                    className='w-full rounded-2xl object-cover'
                  />
                  <div className='mt-4 text-center'>
                    <h4 className='text-lg font-semibold text-slate-800'>
                      True Parents
                    </h4>
                    <p className='text-slate-600'>
                      Rev. Sun Myung Moon & Dr. Hak Ja Han Moon
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
                className='bg-gradient-to-br from-rose-50 to-purple-100 rounded-3xl p-8 shadow-xl'
              >
                <h4 className='text-xl font-semibold text-slate-800 mb-6'>
                  The True Family Foundation
                </h4>
                <div className='space-y-6'>
                  {[
                    {
                      icon: Heart,
                      title: 'True Love',
                      desc: 'Love that gives endlessly for the sake of others',
                    },
                    {
                      icon: Star,
                      title: 'True Life',
                      desc: 'Life lived in accordance with Gods original design',
                    },
                    {
                      icon: Crown,
                      title: 'True Lineage',
                      desc: 'Pure bloodline connected directly to God',
                    },
                  ].map((item, i) => (
                    <div key={i} className='flex items-start gap-4'>
                      <div className='w-10 h-10 bg-gradient-to-br from-rose-500 to-purple-600 rounded-full flex items-center justify-center'>
                        <item.icon className='w-5 h-5 text-white' />
                      </div>
                      <div>
                        <h5 className='font-semibold text-slate-800'>
                          {item.title}
                        </h5>
                        <p className='text-slate-600 text-sm'>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* PEACE-LOVING GLOBAL CITIZEN MISSION - Enhanced Gallery */}
      <div className='relative py-24 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100' />

        <div className='relative z-10 max-w-6xl mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: easeOut }}
            viewport={{ once: true }}
            className='space-y-16'
          >
            {/* Header */}
            <div className='text-center space-y-8'>
              <div className='text-sm font-medium tracking-wide text-emerald-600 uppercase'>
                Global Peace Mission
              </div>
              <h2 className='text-4xl md:text-6xl font-light tracking-tight text-slate-800'>
                As Peace-Loving Global Citizens
                <span className='block text-xl md:text-2xl font-light text-slate-600 mt-4'>
                  True Parents' autobiography reveals their dedication to world
                  peace
                </span>
              </h2>
            </div>

            {/* Meeting Kim Il Sung - Enhanced with Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className='bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50'
            >
              <div className='grid lg:grid-cols-3 gap-8'>
                <div className='lg:col-span-2 space-y-6'>
                  <div className='flex items-start gap-4'>
                    <div className='w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center'>
                      <Globe className='w-6 h-6 text-white' />
                    </div>
                    <div>
                      <h3 className='text-2xl font-semibold text-slate-800'>
                        Meeting Kim Il Sung
                      </h3>
                      <p className='text-slate-600'>
                        December 1991 - Pyongyang, North Korea
                      </p>
                    </div>
                  </div>
                  <p className='text-lg text-slate-600 leading-relaxed'>
                    In December 1991, True Father made the historic visit to
                    North Korea to meet President Kim Il Sung. Despite being
                    branded an enemy of North Korea, he courageously crossed the
                    DMZ to discuss Korean reunification and world peace. Kim Il
                    Sung called him "the most patriotic person concerned about
                    the unification of Korea."
                  </p>
                  <blockquote className='text-lg italic text-slate-700 border-l-4 border-emerald-400 pl-6'>
                    "You are the most patriotic person concerned about the
                    unification of Korea."
                    <cite className='block mt-2 text-sm text-slate-600'>
                      - Kim Il Sung to Rev. Moon
                    </cite>
                  </blockquote>

                  {/* Historical moment images */}
                  <div className='grid md:grid-cols-2 gap-4 mt-6'>
                    <div className='relative'>
                      <div className='absolute -inset-2 bg-gradient-to-br from-emerald-200/30 to-transparent rounded-lg blur-md' />
                      <div className='relative bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md'>
                        <Image
                          src='https://commons.wikimedia.org/wiki/File:Rev._Sun_Myung_Moon_speaks,_Las_Vegas,_NV,_USA_on_April_4,_2010.png'
                          alt='True Father speaking'
                          width={250}
                          height={150}
                          className='w-full rounded-md object-cover'
                        />
                        <div className='mt-2 text-center'>
                          <p className='text-xs font-medium text-slate-700'>
                            Global Speaking
                          </p>
                          <p className='text-xs text-slate-500'>
                            Peace Mission Worldwide
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='relative'>
                      <div className='absolute -inset-2 bg-gradient-to-br from-teal-200/30 to-transparent rounded-lg blur-md' />
                      <div className='relative bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md'>
                        <Image
                          src='https://commons.wikimedia.org/wiki/File:Sun_Myung_Moon_Budapest_Hungary_28-10-2005_total.jpg'
                          alt='Peace negotiations'
                          width={250}
                          height={150}
                          className='w-full rounded-md object-cover'
                        />
                        <div className='mt-2 text-center'>
                          <p className='text-xs font-medium text-slate-700'>
                            European Peace
                          </p>
                          <p className='text-xs text-slate-500'>
                            International Diplomacy
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main portrait */}
                <div className='relative'>
                  <div className='absolute -inset-4 bg-gradient-to-br from-emerald-300/20 to-transparent rounded-2xl blur-xl' />
                  <div className='relative bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg'>
                    <Image
                      src='https://commons.wikimedia.org/wiki/File:Sun_Myung_Moon_in_Budapest_1995-11-10.jpg'
                      alt='True Father peace mission'
                      width={300}
                      height={400}
                      className='w-full rounded-lg object-cover'
                    />
                    <div className='mt-3 text-center'>
                      <p className='text-sm font-medium text-slate-700'>
                        Peace Ambassador
                      </p>
                      <p className='text-xs text-slate-500'>
                        International Peace Mission
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Media and Education Initiatives - Enhanced Gallery */}
            <div className='grid lg:grid-cols-2 gap-12'>
              {/* Washington Times */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
                className='bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50'
              >
                <div className='space-y-6'>
                  <div className='flex items-start gap-4'>
                    <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center'>
                      <Globe className='w-6 h-6 text-white' />
                    </div>
                    <div>
                      <h3 className='text-xl font-semibold text-slate-800'>
                        The Washington Times
                      </h3>
                      <p className='text-slate-600'>
                        Founded 1982 - Conservative Voice
                      </p>
                    </div>
                  </div>
                  <p className='text-lg text-slate-600 leading-relaxed'>
                    In 1982, True Father founded The Washington Times to provide
                    an alternative conservative voice in American media.
                    President Reagan called it his "favorite newspaper" and it
                    became influential in American political discourse,
                    supporting freedom and anti-communist values during the Cold
                    War.
                  </p>

                  {/* Media impact images */}
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='relative'>
                      <div className='absolute -inset-2 bg-gradient-to-br from-blue-200/30 to-transparent rounded-lg blur-sm' />
                      <div className='relative bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm'>
                        <Image
                          src='https://commons.wikimedia.org/wiki/File:Nixon_Moon.gif'
                          alt='Media influence'
                          width={150}
                          height={100}
                          className='w-full rounded-md object-cover'
                        />
                        <div className='mt-1 text-center'>
                          <p className='text-xs font-medium text-slate-700'>
                            Political Impact
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='relative'>
                      <div className='absolute -inset-2 bg-gradient-to-br from-indigo-200/30 to-transparent rounded-lg blur-sm' />
                      <div className='relative bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm'>
                        <Image
                          src='https://commons.wikimedia.org/wiki/File:Rev._Sun_Myung_Moon.jpg'
                          alt='American influence'
                          width={150}
                          height={100}
                          className='w-full rounded-md object-cover'
                        />
                        <div className='mt-1 text-center'>
                          <p className='text-xs font-medium text-slate-700'>
                            American Mission
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Universal Peace Federation */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                viewport={{ once: true }}
                className='bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50'
              >
                <div className='space-y-6'>
                  <div className='flex items-start gap-4'>
                    <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center'>
                      <Crown className='w-6 h-6 text-white' />
                    </div>
                    <div>
                      <h3 className='text-xl font-semibold text-slate-800'>
                        Universal Peace Federation
                      </h3>
                      <p className='text-slate-600'>Founded 2005 - Abel UN</p>
                    </div>
                  </div>
                  <p className='text-lg text-slate-600 leading-relaxed'>
                    Founded in 2005, the UPF brings together former heads of
                    state, religious leaders, and peace advocates. True Father's
                    vision was to create "Abel UN" - a spiritual counterpart to
                    the United Nations that would guide humanity toward lasting
                    peace.
                  </p>

                  {/* UPF leadership images */}
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='relative'>
                      <div className='absolute -inset-2 bg-gradient-to-br from-purple-200/30 to-transparent rounded-lg blur-sm' />
                      <div className='relative bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm'>
                        <Image
                          src='https://commons.wikimedia.org/wiki/File:Rev._Sun_Myung_Moon_speaks,_Las_Vegas,_NV,_USA_on_April_4,_2010.png'
                          alt='Global leadership'
                          width={150}
                          height={100}
                          className='w-full rounded-md object-cover'
                        />
                        <div className='mt-1 text-center'>
                          <p className='text-xs font-medium text-slate-700'>
                            Global Peace
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='relative'>
                      <div className='absolute -inset-2 bg-gradient-to-br from-pink-200/30 to-transparent rounded-lg blur-sm' />
                      <div className='relative bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm'>
                        <Image
                          src='https://commons.wikimedia.org/wiki/File:Sun_Myung_Moon_and_Hak_Ja_Han.jpg'
                          alt='Spiritual leadership'
                          width={150}
                          height={100}
                          className='w-full rounded-md object-cover'
                        />
                        <div className='mt-1 text-center'>
                          <p className='text-xs font-medium text-slate-700'>
                            Spiritual UN
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Breaking Racial Barriers - Full Width Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              viewport={{ once: true }}
              className='bg-gradient-to-br from-white/90 to-emerald-50/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50'
            >
              <div className='text-center mb-8'>
                <div className='flex items-center justify-center gap-4 mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-600 rounded-full flex items-center justify-center'>
                    <Heart className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='text-2xl font-semibold text-slate-800'>
                    Breaking Racial Barriers
                  </h3>
                </div>
                <p className='text-slate-600'>
                  International and Intercultural Marriage Movement
                </p>
              </div>

              <div className='grid lg:grid-cols-3 gap-8'>
                <div className='lg:col-span-2 space-y-6'>
                  <p className='text-lg text-slate-600 leading-relaxed'>
                    True Father courageously supported the civil rights movement
                    and spoke against racism when it was unpopular. He organized
                    international and intercultural marriages to break down
                    racial barriers, calling them "the quickest way to bring
                    about an ideal world of peace."
                  </p>
                  <blockquote className='text-xl italic text-slate-700 border-l-4 border-rose-400 pl-6'>
                    "International and intercultural marriages are the quickest
                    way to bring about an ideal world of peace."
                    <cite className='block mt-3 text-sm text-slate-600'>
                      — Rev. Sun Myung Moon
                    </cite>
                  </blockquote>

                  {/* Diversity showcase images */}
                  <div className='grid md:grid-cols-3 gap-4 mt-8'>
                    {[
                      {
                        src: '/true-parents-portrait.jpg',
                        label: 'Unity in Diversity',
                        desc: 'One Human Family',
                      },
                      {
                        src: '/true-father.webp',
                        label: 'Civil Rights Support',
                        desc: '1960s America',
                      },
                      {
                        src: '/old-true-father.webp',
                        label: 'Global Vision',
                        desc: 'Beyond Race & Religion',
                      },
                    ].map((image, i) => (
                      <div key={i} className='relative'>
                        <div className='absolute -inset-2 bg-gradient-to-br from-rose-200/30 to-transparent rounded-lg blur-md' />
                        <div className='relative bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md'>
                          <Image
                            src={image.src}
                            alt={image.label}
                            width={200}
                            height={150}
                            className='w-full rounded-md object-cover'
                          />
                          <div className='mt-2 text-center'>
                            <p className='text-xs font-medium text-slate-700'>
                              {image.label}
                            </p>
                            <p className='text-xs text-slate-500'>
                              {image.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main diversity image */}
                <div className='relative'>
                  <div className='absolute -inset-4 bg-gradient-to-br from-rose-300/20 via-orange-300/10 to-transparent rounded-2xl blur-xl' />
                  <div className='relative bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg'>
                    <Image
                      src='/true-parents-portrait.jpg'
                      alt='True Parents unified hearts for world peace'
                      width={400}
                      height={500}
                      className='w-full rounded-lg object-cover'
                    />
                    <div className='mt-4 text-center'>
                      <p className='text-lg font-semibold text-slate-700'>
                        One Family Under God
                      </p>
                      <p className='text-sm text-slate-500'>
                        Beyond race, religion, and nationality
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* BLESSING CEREMONIES HISTORY - Enhanced Gallery */}
      <SectionShell className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100' />

        <div className='relative z-10 max-w-6xl mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: easeOut }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <Eyebrow className='text-emerald-600'>
              Divine Providence • Marriage Blessing
            </Eyebrow>
            <HighlightTitle
              as='h2'
              text='The International Marriage Blessing Ceremonies - Uniting Humanity as One Family'
              highlightedText='Marriage Blessing'
              className='text-4xl md:text-6xl'
              gradientClassName='bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent'
            />
          </motion.div>

          {/* Main Blessing Gallery */}
          <div className='grid lg:grid-cols-2 gap-16 items-start mb-16'>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: easeOut }}
              viewport={{ once: true }}
              className='space-y-8'
            >
              {/* First Holy Wedding Image */}
              <div className='relative'>
                <div className='absolute -inset-6 bg-gradient-to-br from-emerald-300/20 via-teal-300/10 to-transparent rounded-3xl blur-2xl' />
                <div className='relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/50'>
                  <Image
                    src='https://commons.wikimedia.org/wiki/File:SunMyungMoonBlessing.jpg'
                    alt='True Parents blessing ceremony - Holy Wedding 1960'
                    width={600}
                    height={500}
                    className='w-full h-auto rounded-2xl object-cover'
                  />
                  <div className='mt-6 text-center'>
                    <h4 className='text-xl font-semibold text-slate-800'>
                      The Marriage Blessing Ceremony
                    </h4>
                    <p className='text-slate-600 mt-2'>
                      Historical photograph of Rev. Sun Myung Moon conducting
                      blessing ceremonies
                    </p>
                  </div>
                </div>
              </div>

              {/* Historical Gallery Grid */}
              <div className='grid md:grid-cols-2 gap-6'>
                {[
                  {
                    src: 'https://commons.wikimedia.org/wiki/File:TPblessing_ceremony.jpg',
                    year: '1960',
                    event: '36 Couples',
                    location: 'Seoul',
                  },
                  {
                    src: 'https://commons.wikimedia.org/wiki/File:Bodacolectivasectamoon.jpg',
                    year: '1970',
                    event: '777 Couples',
                    location: 'Korea',
                  },
                  {
                    src: 'https://commons.wikimedia.org/wiki/File:SunMyungMoonBlessing.jpg',
                    year: '1982',
                    event: '6,000 Couples',
                    location: 'Madison Square Garden',
                  },
                  {
                    src: 'https://commons.wikimedia.org/wiki/File:TPblessing_ceremony.jpg',
                    year: '1997',
                    event: '39,000 Couples',
                    location: 'RFK Stadium',
                  },
                ].map((blessing, i) => (
                  <div key={i} className='relative'>
                    <div className='absolute -inset-3 bg-gradient-to-br from-emerald-200/30 to-transparent rounded-xl blur-lg' />
                    <div className='relative bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg'>
                      <Image
                        src={blessing.src}
                        alt={`${blessing.year} Blessing Ceremony`}
                        width={250}
                        height={200}
                        className='w-full rounded-lg object-cover'
                      />
                      <div className='mt-3 text-center'>
                        <p className='text-sm font-semibold text-emerald-700'>
                          {blessing.year}
                        </p>
                        <p className='text-xs font-medium text-slate-700'>
                          {blessing.event}
                        </p>
                        <p className='text-xs text-slate-500'>
                          {blessing.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: easeOut }}
              viewport={{ once: true }}
              className='space-y-8'
            >
              {/* Detailed Blessing Cards */}
              <div className='space-y-6'>
                <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50'>
                  <div className='flex items-center mb-4'>
                    <Heart className='w-6 h-6 text-emerald-600 mr-3' />
                    <h3 className='text-lg font-semibold'>
                      1960: The First Blessing
                    </h3>
                  </div>
                  <p className='text-sm text-emerald-600 mb-3'>
                    36 Couples • Korea
                  </p>
                  <p className='text-base text-muted-foreground mb-4'>
                    True Parents blessed the first 36 couples, establishing the
                    foundation for God's lineage on Earth. These couples
                    represented 12 tribes, symbolically restoring the position
                    lost by the 12 tribes of Israel.
                  </p>
                  {/* Embedded gallery for 1960 */}
                  <div className='grid grid-cols-3 gap-2'>
                    {[
                      '/true-parents-portrait.jpg',
                      '/true-father.webp',
                      '/old-true-father.webp',
                    ].map((src, i) => (
                      <div key={i} className='relative'>
                        <div className='absolute -inset-1 bg-gradient-to-br from-emerald-200/40 to-transparent rounded-md blur-sm' />
                        <div className='relative'>
                          <Image
                            src={src}
                            alt={`1960 blessing ${i + 1}`}
                            width={80}
                            height={60}
                            className='w-full rounded-md object-cover'
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50'>
                  <div className='flex items-center mb-4'>
                    <Star className='w-6 h-6 text-teal-600 mr-3' />
                    <h3 className='text-lg font-semibold'>
                      1997: Washington D.C.
                    </h3>
                  </div>
                  <p className='text-sm text-teal-600 mb-3'>
                    39,000 Couples • RFK Stadium
                  </p>
                  <p className='text-base text-muted-foreground mb-4'>
                    The largest blessing ceremony ever held in America, bringing
                    together couples from all races, religions, and
                    nationalities to demonstrate True Parents' vision of "One
                    Family Under God."
                  </p>
                  {/* Embedded gallery for 1997 */}
                  <div className='grid grid-cols-3 gap-2'>
                    {[
                      '/true-parents-portrait.jpg',
                      '/true-father.webp',
                      '/old-true-father.webp',
                    ].map((src, i) => (
                      <div key={i} className='relative'>
                        <div className='absolute -inset-1 bg-gradient-to-br from-teal-200/40 to-transparent rounded-md blur-sm' />
                        <div className='relative'>
                          <Image
                            src={src}
                            alt={`1997 blessing ${i + 1}`}
                            width={80}
                            height={60}
                            className='w-full rounded-md object-cover'
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50'>
                  <div className='flex items-center mb-4'>
                    <Crown className='w-6 h-6 text-cyan-600 mr-3' />
                    <h3 className='text-lg font-semibold'>
                      2009: Global Peace Festival
                    </h3>
                  </div>
                  <p className='text-sm text-cyan-600 mb-3'>
                    Millions Worldwide
                  </p>
                  <p className='text-base text-muted-foreground mb-4'>
                    Through satellite technology, True Parents blessed millions
                    of couples simultaneously across all continents, fulfilling
                    their dream of creating one global family transcending all
                    barriers.
                  </p>
                  {/* Embedded gallery for 2009 */}
                  <div className='grid grid-cols-3 gap-2'>
                    {[
                      '/true-parents-portrait.jpg',
                      '/true-father.webp',
                      '/old-true-father.webp',
                    ].map((src, i) => (
                      <div key={i} className='relative'>
                        <div className='absolute -inset-1 bg-gradient-to-br from-cyan-200/40 to-transparent rounded-md blur-sm' />
                        <div className='relative'>
                          <Image
                            src={src}
                            alt={`2009 blessing ${i + 1}`}
                            width={80}
                            height={60}
                            className='w-full rounded-md object-cover'
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Global Impact Visualization */}
              <div className='bg-gradient-to-br from-emerald-50 to-teal-100 rounded-3xl p-6 shadow-xl border border-emerald-200'>
                <h4 className='text-lg font-semibold text-slate-800 mb-4 text-center'>
                  Global Impact
                </h4>
                <div className='grid grid-cols-2 gap-4 text-center'>
                  <div className='bg-white/80 rounded-xl p-4'>
                    <p className='text-2xl font-bold text-emerald-600'>200+</p>
                    <p className='text-xs text-slate-600'>Countries</p>
                  </div>
                  <div className='bg-white/80 rounded-xl p-4'>
                    <p className='text-2xl font-bold text-teal-600'>Millions</p>
                    <p className='text-xs text-slate-600'>Blessed Couples</p>
                  </div>
                  <div className='bg-white/80 rounded-xl p-4'>
                    <p className='text-2xl font-bold text-cyan-600'>50+</p>
                    <p className='text-xs text-slate-600'>Years</p>
                  </div>
                  <div className='bg-white/80 rounded-xl p-4'>
                    <p className='text-2xl font-bold text-blue-600'>One</p>
                    <p className='text-xs text-slate-600'>Human Family</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Historical Timeline Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className='bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 mb-16'
          >
            <h3 className='text-2xl font-semibold text-slate-800 mb-8 text-center'>
              Historic Blessing Ceremonies Timeline
            </h3>
            <div className='grid md:grid-cols-4 gap-6'>
              {[
                {
                  year: '1960',
                  couples: '36',
                  location: 'Seoul',
                  significance: 'Foundation',
                },
                {
                  year: '1970',
                  couples: '777',
                  location: 'Korea',
                  significance: 'Growth',
                },
                {
                  year: '1982',
                  couples: '6,000',
                  location: 'New York',
                  significance: 'International',
                },
                {
                  year: '1997',
                  couples: '39,000',
                  location: 'Washington',
                  significance: 'Massive Scale',
                },
              ].map((ceremony, i) => (
                <div key={i} className='text-center space-y-4'>
                  <div className='relative'>
                    <div className='absolute -inset-3 bg-gradient-to-br from-emerald-200/30 to-transparent rounded-xl blur-lg' />
                    <div className='relative bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg'>
                      <Image
                        src='/true-parents-portrait.jpg'
                        alt={`${ceremony.year} blessing ceremony`}
                        width={200}
                        height={150}
                        className='w-full rounded-lg object-cover'
                      />
                      <div className='mt-3'>
                        <p className='text-lg font-bold text-emerald-600'>
                          {ceremony.year}
                        </p>
                        <p className='text-sm font-semibold text-slate-700'>
                          {ceremony.couples} Couples
                        </p>
                        <p className='text-xs text-slate-500'>
                          {ceremony.location}
                        </p>
                        <p className='text-xs text-emerald-600 mt-1'>
                          {ceremony.significance}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Final Summary with Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
            className='text-center'
          >
            <div className='grid lg:grid-cols-3 gap-8 items-center'>
              <div className='lg:col-span-2'>
                <p className='text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed'>
                  Over five decades, True Parents conducted hundreds of blessing
                  ceremonies, blessing millions of couples from every nation,
                  race, and religion. These ceremonies represent the restoration
                  of the original blessing that God intended to give Adam and
                  Eve.
                </p>
              </div>
              <div className='relative'>
                <div className='absolute -inset-4 bg-gradient-to-br from-emerald-300/20 to-transparent rounded-2xl blur-xl' />
                <div className='relative bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg'>
                  <Image
                    src='/true-parents-portrait.jpg'
                    alt='True Parents eternal blessing mission'
                    width={300}
                    height={250}
                    className='w-full rounded-lg object-cover'
                  />
                  <div className='mt-3 text-center'>
                    <p className='text-sm font-medium text-slate-700'>
                      Eternal Blessing
                    </p>
                    <p className='text-xs text-slate-500'>
                      One Family Under God
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </SectionShell>

      {/* CHEONGPYEONG HEAVEN AND EARTH TRAINING CENTER */}
      <SectionShell className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100' />

        <div className='relative z-10 max-w-6xl mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: easeOut }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <Eyebrow className='text-violet-600'>
              Sacred Ground • Spiritual Training
            </Eyebrow>
            <HighlightTitle
              as='h2'
              text='Cheongpyeong Heaven and Earth Training Center - Sacred Ground of Spiritual Healing'
              highlightedText='Cheongpyeong Training Center'
              className='text-4xl md:text-6xl'
              gradientClassName='bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'
            />
            <p className='mt-6 text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed'>
              Now known as Cheonbo Heaven and Earth Training Center, this sacred
              site serves as a spiritual sanctuary where millions have
              experienced healing, liberation, and spiritual growth under True
              Parents' guidance.
            </p>
          </motion.div>

          {/* Main Content Gallery */}
          <div className='grid lg:grid-cols-2 gap-16 items-start mb-16'>
            {/* Left side - History and Purpose */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: easeOut }}
              viewport={{ once: true }}
              className='space-y-8'
            >
              {/* Foundation and Vision */}
              <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50'>
                <div className='flex items-start gap-4 mb-6'>
                  <div className='w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center'>
                    <Star className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-slate-800'>
                      Sacred Foundation
                    </h3>
                    <p className='text-slate-600'>
                      1995 - Gapyeong, South Korea
                    </p>
                  </div>
                </div>
                <p className='text-lg text-muted-foreground leading-relaxed mb-6'>
                  True Parents established this sacred training center in the
                  beautiful mountains of Gapyeong, Korea, as a place where
                  people from all walks of life could come to receive spiritual
                  training, healing, and liberation from ancestral burdens.
                </p>
                <p className='text-lg text-muted-foreground leading-relaxed'>
                  The center was originally called Cheongpyeong Heaven and Earth
                  Training Center and was later renamed to Cheonbo Heaven and
                  Earth Training Center, representing the eternal blessing and
                  spiritual transformation available to all humanity.
                </p>

                {/* Vision images grid */}
                <div className='grid md:grid-cols-2 gap-4 mt-6'>
                  <div className='relative'>
                    <div className='absolute -inset-2 bg-gradient-to-br from-violet-200/30 to-transparent rounded-lg blur-md' />
                    <div className='relative bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md'>
                      <Image
                        src='/true-parents-portrait.jpg'
                        alt='True Parents blessing the land'
                        width={200}
                        height={150}
                        className='w-full rounded-md object-cover'
                      />
                      <div className='mt-2 text-center'>
                        <p className='text-xs font-medium text-slate-700'>
                          Blessing the Sacred Land
                        </p>
                        <p className='text-xs text-slate-500'>
                          Gapyeong, Korea
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='relative'>
                    <div className='absolute -inset-2 bg-gradient-to-br from-purple-200/30 to-transparent rounded-lg blur-md' />
                    <div className='relative bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md'>
                      <Image
                        src='/true-father.webp'
                        alt='True Father at Cheongpyeong'
                        width={200}
                        height={150}
                        className='w-full rounded-md object-cover'
                      />
                      <div className='mt-2 text-center'>
                        <p className='text-xs font-medium text-slate-700'>
                          Spiritual Guidance
                        </p>
                        <p className='text-xs text-slate-500'>
                          Training Center Vision
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* True Mother's Role */}
              <div className='bg-gradient-to-br from-violet-50 to-purple-100 rounded-3xl p-8 shadow-xl border border-violet-200'>
                <div className='flex items-start gap-4 mb-6'>
                  <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center'>
                    <Heart className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-slate-800'>
                      True Mother's Leadership
                    </h3>
                    <p className='text-slate-600'>
                      Spiritual Mother of Humanity
                    </p>
                  </div>
                </div>
                <p className='text-lg text-muted-foreground leading-relaxed mb-6'>
                  True Mother has played a central role in developing the
                  spiritual programs and healing ministries at Cheongpyeong.
                  Through her maternal heart and spiritual insight, she has
                  guided millions in their journey of spiritual liberation and
                  growth.
                </p>
                <blockquote className='text-lg italic text-slate-700 border-l-4 border-purple-400 pl-6'>
                  "This is a place where the spirit world and physical world can
                  unite, where healing and liberation become possible for all
                  God's children."
                  <cite className='block mt-2 text-sm text-slate-600'>
                    - True Mother
                  </cite>
                </blockquote>
              </div>

              {/* Programs and Activities */}
              <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50'>
                <h3 className='text-xl font-semibold text-slate-800 mb-6'>
                  Spiritual Programs
                </h3>
                <div className='space-y-4'>
                  {[
                    {
                      title: '21-Day Special Grace Workshops',
                      desc: 'Intensive spiritual training and healing sessions',
                    },
                    {
                      title: 'Ancestor Liberation Ceremonies',
                      desc: 'Freeing ancestral spirits and receiving blessings',
                    },
                    {
                      title: 'Chanyang Sessions',
                      desc: 'Physical and spiritual healing through divine power',
                    },
                    {
                      title: 'International Workshops',
                      desc: 'Global families gathering for spiritual renewal',
                    },
                  ].map((program, i) => (
                    <div
                      key={i}
                      className='flex items-start gap-4 p-4 bg-violet-50/80 rounded-xl'
                    >
                      <div className='w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm'>
                        {i + 1}
                      </div>
                      <div>
                        <h4 className='font-semibold text-slate-800'>
                          {program.title}
                        </h4>
                        <p className='text-sm text-slate-600'>{program.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right side - Visual Gallery */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: easeOut }}
              viewport={{ once: true }}
              className='space-y-8'
            >
              {/* Main Training Center Image */}
              <div className='relative'>
                <div className='absolute -inset-6 bg-gradient-to-br from-violet-300/20 via-purple-300/10 to-transparent rounded-3xl blur-2xl' />
                <div className='relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/50'>
                  <Image
                    src='/true-parents-portrait.jpg'
                    alt='Cheongpyeong Training Center'
                    width={600}
                    height={500}
                    className='w-full h-auto rounded-2xl object-cover'
                  />
                  <div className='mt-6 text-center'>
                    <h4 className='text-xl font-semibold text-slate-800'>
                      Sacred Mountain Sanctuary
                    </h4>
                    <p className='text-slate-600 mt-2'>
                      Cheonbo Heaven and Earth Training Center in Gapyeong,
                      Korea
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className='grid md:grid-cols-2 gap-6'>
                {[
                  {
                    src: '/old-true-father.webp',
                    title: 'Healing Ceremonies',
                    desc: 'Spiritual Liberation',
                  },
                  {
                    src: '/true-parents-portrait.jpg',
                    title: 'Training Sessions',
                    desc: 'Divine Education',
                  },
                  {
                    src: '/true-father.webp',
                    title: 'Mountain Prayer',
                    desc: 'Sacred Meditation',
                  },
                  {
                    src: '/true-parents-portrait.jpg',
                    title: 'Global Gathering',
                    desc: 'One Family Unity',
                  },
                ].map((image, i) => (
                  <div key={i} className='relative'>
                    <div className='absolute -inset-3 bg-gradient-to-br from-violet-200/30 to-transparent rounded-xl blur-lg' />
                    <div className='relative bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg'>
                      <Image
                        src={image.src}
                        alt={image.title}
                        width={250}
                        height={200}
                        className='w-full rounded-lg object-cover'
                      />
                      <div className='mt-3 text-center'>
                        <p className='text-sm font-semibold text-slate-700'>
                          {image.title}
                        </p>
                        <p className='text-xs text-slate-500'>{image.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Global Impact Stats */}
              <div className='bg-gradient-to-br from-violet-50 to-purple-100 rounded-3xl p-6 shadow-xl border border-violet-200'>
                <h4 className='text-lg font-semibold text-slate-800 mb-4 text-center'>
                  Global Spiritual Impact
                </h4>
                <div className='grid grid-cols-2 gap-4 text-center'>
                  <div className='bg-white/80 rounded-xl p-4'>
                    <p className='text-2xl font-bold text-violet-600'>
                      Millions
                    </p>
                    <p className='text-xs text-slate-600'>Visitors Blessed</p>
                  </div>
                  <div className='bg-white/80 rounded-xl p-4'>
                    <p className='text-2xl font-bold text-purple-600'>28+</p>
                    <p className='text-xs text-slate-600'>Years of Service</p>
                  </div>
                  <div className='bg-white/80 rounded-xl p-4'>
                    <p className='text-2xl font-bold text-indigo-600'>194</p>
                    <p className='text-xs text-slate-600'>
                      Nations Represented
                    </p>
                  </div>
                  <div className='bg-white/80 rounded-xl p-4'>
                    <p className='text-2xl font-bold text-violet-600'>∞</p>
                    <p className='text-xs text-slate-600'>Spiritual Healings</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Spiritual Significance */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className='bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50'
          >
            <div className='text-center mb-8'>
              <h3 className='text-2xl font-semibold text-slate-800 mb-4'>
                Sacred Mission and Legacy
              </h3>
              <p className='text-slate-600'>
                A Holy Ground for Humanity's Spiritual Restoration
              </p>
            </div>

            <div className='grid lg:grid-cols-3 gap-8'>
              <div className='text-center space-y-4'>
                <div className='w-16 h-16 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center mx-auto'>
                  <Crown className='w-8 h-8 text-white' />
                </div>
                <h4 className='text-lg font-semibold text-slate-800'>
                  Ancestral Liberation
                </h4>
                <p className='text-slate-600'>
                  Through special ceremonies and spiritual works, participants
                  receive liberation for their ancestors and healing from
                  generational burdens.
                </p>
              </div>
              <div className='text-center space-y-4'>
                <div className='w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto'>
                  <Heart className='w-8 h-8 text-white' />
                </div>
                <h4 className='text-lg font-semibold text-slate-800'>
                  Spiritual Healing
                </h4>
                <p className='text-slate-600'>
                  The Chanyang sessions and special grace workshops provide
                  profound physical and spiritual healing through divine
                  intervention.
                </p>
              </div>
              <div className='text-center space-y-4'>
                <div className='w-16 h-16 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center mx-auto'>
                  <Sparkles className='w-8 h-8 text-white' />
                </div>
                <h4 className='text-lg font-semibold text-slate-800'>
                  Global Unity
                </h4>
                <p className='text-slate-600'>
                  Families from every nation gather here, experiencing True
                  Parents' love and building bonds that transcend all barriers.
                </p>
              </div>
            </div>

            {/* Final testimony */}
            <div className='mt-12 text-center'>
              <blockquote className='text-xl italic text-slate-700 max-w-4xl mx-auto'>
                "Cheongpyeong is not just a training center—it is a sacred
                ground where Heaven and Earth meet, where the spiritual and
                physical worlds unite in God's love, and where every person can
                experience true liberation and renewal."
              </blockquote>
              <cite className='block mt-4 text-slate-600 font-medium'>
                — The Sacred Mission of Cheonbo Heaven and Earth Training Center
              </cite>
            </div>
          </motion.div>
        </div>
      </SectionShell>

      {/* KOREA REUNIFICATION VISION */}
      <SectionShell className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100' />

        <div className='relative z-10 max-w-6xl mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: easeOut }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <Eyebrow className='text-blue-600'>
              Peace Mission • Korean Peninsula
            </Eyebrow>
            <HighlightTitle
              as='h2'
              text='Vision for Korean Reunification - One Korea Under God'
              highlightedText='Korean Reunification'
              className='text-4xl md:text-6xl'
              gradientClassName='bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent'
            />
          </motion.div>

          <div className='grid md:grid-cols-2 gap-16 items-center mb-16'>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: easeOut }}
              viewport={{ once: true }}
              className='space-y-8'
            >
              <div className='space-y-6'>
                <h3 className='text-2xl font-semibold'>
                  Meeting with Kim Il Sung (1991)
                </h3>
                <p className='text-lg text-muted-foreground'>
                  In a historic breakthrough, True Father became the first South
                  Korean religious leader to meet with North Korean President
                  Kim Il Sung. This courageous act opened dialogue between the
                  divided nations.
                </p>
                <blockquote className='text-lg md:text-xl text-muted-foreground italic border-l-4 border-blue-400 pl-6'>
                  &quot;We must love our enemies and unite as one people. The
                  Korean peninsula must become the model for world peace.&quot;
                  <cite className='block mt-2 text-base not-italic'>
                    — Rev. Sun Myung Moon
                  </cite>
                </blockquote>
              </div>

              <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50'>
                <h4 className='text-xl font-semibold mb-4'>
                  Peace Initiatives
                </h4>
                <ul className='space-y-3 text-base text-muted-foreground'>
                  <li className='flex items-start'>
                    <span className='text-blue-600 mr-2'>•</span>
                    Established businesses in North Korea to provide economic
                    aid
                  </li>
                  <li className='flex items-start'>
                    <span className='text-indigo-600 mr-2'>•</span>
                    Built Pyeonghwa Motors automotive plant
                  </li>
                  <li className='flex items-start'>
                    <span className='text-purple-600 mr-2'>•</span>
                    Created educational and cultural exchange programs
                  </li>
                  <li className='flex items-start'>
                    <span className='text-blue-600 mr-2'>•</span>
                    Promoted family reunification across the DMZ
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: easeOut }}
              viewport={{ once: true }}
              className='space-y-8'
            >
              <div className='relative'>
                <div className='absolute -inset-8 bg-gradient-to-br from-blue-300/20 via-indigo-300/10 to-transparent rounded-3xl blur-2xl' />
                <div className='relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50'>
                  <Image
                    src='/true-father.webp'
                    alt="True Father's vision for Korean reunification"
                    width={600}
                    height={400}
                    className='w-full h-auto rounded-2xl object-cover'
                  />
                  <div className='mt-6 text-center'>
                    <h4 className='text-lg font-semibold'>
                      True Father&apos;s Korean Vision
                    </h4>
                    <p className='text-muted-foreground mt-2'>
                      &quot;Korea will become the homeland of God, the nation
                      that brings peace to the world.&quot;
                    </p>
                  </div>
                </div>
              </div>

              <div className='relative'>
                <div className='absolute -inset-8 bg-gradient-to-br from-purple-300/20 via-blue-300/10 to-transparent rounded-3xl blur-2xl' />
                <div className='relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50'>
                  <Image
                    src='/true-parents-portrait.jpg'
                    alt='True Parents united for Korean peace'
                    width={600}
                    height={400}
                    className='w-full h-auto rounded-2xl object-cover'
                  />
                  <div className='mt-6 text-center'>
                    <h4 className='text-lg font-semibold'>United for Peace</h4>
                    <p className='text-muted-foreground mt-2'>
                      True Parents&apos; joint efforts to heal the divided
                      peninsula
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </SectionShell>

      {/* GLOBAL PEACE INITIATIVES */}
      <SectionShell className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-100' />

        <div className='relative z-10 max-w-6xl mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: easeOut }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <Eyebrow className='text-amber-600'>
              World Peace • Global Vision
            </Eyebrow>
            <HighlightTitle
              as='h2'
              text='Global Peace Rallies and Initiatives - Breaking Down Barriers Worldwide'
              highlightedText='Peace Rallies'
              className='text-4xl md:text-6xl'
              gradientClassName='bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent'
            />
          </motion.div>

          {/* Hero Image Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: easeOut }}
            viewport={{ once: true }}
            className='mb-16'
          >
            <div className='relative'>
              <div className='absolute -inset-8 bg-gradient-to-br from-amber-300/20 via-orange-300/10 to-transparent rounded-3xl blur-2xl' />
              <div className='relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50'>
                <Image
                  src='/old-true-father.webp'
                  alt='True Father at global peace rally'
                  width={1200}
                  height={400}
                  className='w-full h-64 md:h-80 rounded-2xl object-cover'
                />
                <div className='mt-6 text-center'>
                  <h3 className='text-2xl font-semibold mb-2'>
                    A Global Peace Mission
                  </h3>
                  <p className='text-lg text-muted-foreground'>
                    True Parents traveled the world, hosting massive peace
                    rallies and bringing together leaders from all nations,
                    races, and religions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className='grid md:grid-cols-2 gap-12 mb-16'>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className='space-y-8'
            >
              <div className='relative'>
                <div className='absolute -inset-4 bg-gradient-to-br from-amber-300/20 via-orange-300/10 to-transparent rounded-3xl blur-xl' />
                <div className='relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50'>
                  <div className='flex items-center mb-4'>
                    <Image
                      src='/true-father.webp'
                      alt='True Father at Madison Square Garden'
                      width={80}
                      height={80}
                      className='w-16 h-16 rounded-full object-cover mr-4'
                    />
                    <div>
                      <h3 className='text-xl font-semibold'>
                        Madison Square Garden (1974)
                      </h3>
                      <p className='text-sm text-amber-600'>
                        New York • God Bless America Rally
                      </p>
                    </div>
                  </div>
                  <p className='text-base text-muted-foreground mb-4'>
                    True Father&apos;s &quot;God Bless America&quot; rally
                    filled Madison Square Garden, calling for spiritual
                    awakening and national renewal during America&apos;s
                    bicentennial period.
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    This historic event demonstrated True Parents&apos;
                    commitment to America&apos;s role in God&apos;s providence
                    for world peace.
                  </p>
                </div>
              </div>

              <div className='relative'>
                <div className='absolute -inset-4 bg-gradient-to-br from-orange-300/20 via-red-300/10 to-transparent rounded-3xl blur-xl' />
                <div className='relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50'>
                  <div className='flex items-center mb-4'>
                    <Image
                      src='/true-parents-portrait.jpg'
                      alt='True Parents at Washington Monument'
                      width={80}
                      height={80}
                      className='w-16 h-16 rounded-full object-cover mr-4'
                    />
                    <div>
                      <h3 className='text-xl font-semibold'>
                        Washington Monument Rally (1976)
                      </h3>
                      <p className='text-sm text-orange-600'>
                        Washington D.C. • 300,000 Attendees
                      </p>
                    </div>
                  </div>
                  <p className='text-base text-muted-foreground mb-4'>
                    The &quot;God Bless America&quot; festival brought together
                    300,000 people on the National Mall, calling for spiritual
                    renewal and unity.
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    This massive gathering emphasized True Parents&apos; message
                    of God-centered patriotism and world peace.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className='space-y-8'
            >
              <div className='relative'>
                <div className='absolute -inset-4 bg-gradient-to-br from-red-300/20 via-pink-300/10 to-transparent rounded-3xl blur-xl' />
                <div className='relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50'>
                  <div className='flex items-center mb-4'>
                    <Image
                      src='/old-true-father.webp'
                      alt='True Father meeting with Gorbachev'
                      width={80}
                      height={80}
                      className='w-16 h-16 rounded-full object-cover mr-4'
                    />
                    <div>
                      <h3 className='text-xl font-semibold'>
                        Soviet Union Peace Mission (1990)
                      </h3>
                      <p className='text-sm text-red-600'>
                        Moscow • End of Cold War
                      </p>
                    </div>
                  </div>
                  <p className='text-base text-muted-foreground mb-4'>
                    True Parents visited Moscow during the Cold War&apos;s end,
                    meeting with President Gorbachev to promote peace and
                    reconciliation between East and West.
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    This bold initiative helped bridge ideological divides
                    during a crucial moment in world history.
                  </p>
                </div>
              </div>

              <div className='relative'>
                <div className='absolute -inset-4 bg-gradient-to-br from-pink-300/20 via-purple-300/10 to-transparent rounded-3xl blur-xl' />
                <div className='relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50'>
                  <div className='flex items-center mb-4'>
                    <Image
                      src='/true-parents-portrait.jpg'
                      alt='True Parents interfaith dialogue'
                      width={80}
                      height={80}
                      className='w-16 h-16 rounded-full object-cover mr-4'
                    />
                    <div>
                      <h3 className='text-xl font-semibold'>
                        Middle East Peace Initiatives
                      </h3>
                      <p className='text-sm text-pink-600'>
                        Holy Land • Interfaith Dialogue
                      </p>
                    </div>
                  </div>
                  <p className='text-base text-muted-foreground mb-4'>
                    True Parents organized numerous interfaith dialogues
                    bringing together Jewish, Christian, and Muslim leaders to
                    find common ground.
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    These efforts emphasized the shared Abrahamic heritage and
                    the possibility of peace in the Holy Land.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className='relative'
          >
            <div className='absolute -inset-8 bg-gradient-to-br from-amber-300/20 via-orange-300/10 to-transparent rounded-3xl blur-2xl' />
            <div className='relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/50'>
              <div className='text-center mb-8'>
                <Image
                  src='/true-parents-portrait.jpg'
                  alt='True Parents founding Universal Peace Federation'
                  width={120}
                  height={120}
                  className='w-24 h-24 rounded-full object-cover mx-auto mb-6'
                />
                <h3 className='text-2xl font-semibold mb-4'>
                  Universal Peace Federation (UPF)
                </h3>
                <p className='text-lg text-muted-foreground max-w-6xl mx-auto mb-6'>
                  In 2005, True Parents founded the Universal Peace Federation
                  as &quot;an Abel-type UN&quot; to serve the cause of peace
                  through moral and spiritual principles.
                </p>
              </div>
              <div className='grid md:grid-cols-3 gap-8'>
                <div className='text-center'>
                  <div className='text-4xl font-bold text-amber-600 mb-2'>
                    194
                  </div>
                  <p className='text-muted-foreground'>Nations Represented</p>
                </div>
                <div className='text-center'>
                  <div className='text-4xl font-bold text-orange-600 mb-2'>
                    1000+
                  </div>
                  <p className='text-muted-foreground'>Peace Ambassadors</p>
                </div>
                <div className='text-center'>
                  <div className='text-4xl font-bold text-red-600 mb-2'>
                    50+
                  </div>
                  <p className='text-muted-foreground'>Annual Peace Summits</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </SectionShell>

      {/* CALL TO ETERNITY */}
      <div className='relative min-h-screen flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900' />

        {/* Sacred background imagery */}
        <div className='absolute inset-0 opacity-15'>
          <Image
            src='/true-parents-portrait.jpg'
            alt='True Parents heavenly blessing'
            fill
            className='object-cover'
          />
        </div>

        {/* Mystical background effects */}
        <div className='absolute inset-0'>
          <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl' />
          <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-rose-500/20 to-amber-500/20 rounded-full blur-3xl' />
        </div>

        {/* Sacred imagery elements */}
        <div className='absolute top-1/3 left-1/6 opacity-20'>
          <Image
            src='/true-father.webp'
            alt='True Father divine calling'
            width={200}
            height={200}
            className='rounded-full blur-sm'
          />
        </div>

        <div className='absolute bottom-1/3 right-1/6 opacity-25'>
          <Image
            src='/old-true-father.webp'
            alt='True Father eternal wisdom'
            width={180}
            height={180}
            className='rounded-full blur-sm'
          />
        </div>

        <div className='relative z-10 max-w-6xl mx-auto px-6 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: easeOut }}
            viewport={{ once: true }}
            className='space-y-12'
          >
            <div className='space-y-6'>
              <div className='text-sm font-light tracking-[0.3em] text-white/70 uppercase'>
                Your Invitation
              </div>
              <h2 className='text-4xl md:text-6xl font-light tracking-tight text-white'>
                Come Home
                <span className='block text-xl md:text-2xl font-light text-white/80 mt-4'>
                  to True Parents' eternal family
                </span>
              </h2>
            </div>

            <div className='max-w-3xl mx-auto text-xl md:text-2xl font-light text-white/90 leading-relaxed'>
              Through the blessing of True Parents of Heaven, Earth & Humankind,
              the path to God's heart has been opened. Their love transcends
              time and space, guiding us back to our eternal home.
            </div>

            <motion.div
              className='pt-8'
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Link href='/contact'>
                <Button className='px-12 py-6 text-lg bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 hover:from-amber-400 hover:to-purple-400 rounded-full shadow-2xl border-0 cursor-pointer'>
                  <Sparkles className='w-5 h-5 mr-3' />
                  Begin Your Journey
                </Button>
              </Link>
            </motion.div>

            {/* Floating elements */}
            <div className='pt-16'>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className='absolute w-2 h-2 bg-white/20 rounded-full'
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${60 + Math.sin(i) * 10}%`,
                  }}
                  animate={{
                    y: [-20, 20, -20],
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    ease: [0.445, 0.05, 0.55, 0.95] satisfies Easing,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
