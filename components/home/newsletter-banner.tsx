'use client'

import { useEffect, useRef, useState } from 'react'
import { NewsletterSignup } from '@/components/newsletter-signup'

type Frequency = 'weekly' | 'monthly'
const STORAGE_KEY = 'newsletter_frequency'

export function NewsletterBanner() {
  const [frequency, setFrequency] = useState<Frequency>('weekly')
  const signupHostRef = useRef<HTMLDivElement | null>(null)

  // Load saved choice on mount
  useEffect(() => {
    const saved =
      (localStorage.getItem(STORAGE_KEY) as Frequency | null) || 'weekly'
    setFrequency(saved)
  }, [])

  // Persist + inject hidden input into the inner form (inside NewsletterSignup)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, frequency)

    const host = signupHostRef.current
    if (!host) return
    const form = host.querySelector('form') as HTMLFormElement | null
    if (!form) return

    let hidden = form.querySelector(
      'input[name="frequency"]',
    ) as HTMLInputElement | null
    if (!hidden) {
      hidden = document.createElement('input')
      hidden.type = 'hidden'
      hidden.name = 'frequency'
      form.appendChild(hidden)
    }
    hidden.value = frequency
  }, [frequency])

  const makeRadio = (value: Frequency, label: string, checked: boolean) => (
    <label className='flex items-center gap-2 cursor-pointer'>
      <input
        type='radio'
        name='newsletter-frequency'
        value={value}
        checked={checked}
        onChange={() => setFrequency(value)}
        className='sr-only'
      />
      <span
        aria-hidden
        className={[
          'inline-flex h-4 w-4 items-center justify-center rounded-full border-2',
          checked
            ? 'border-white bg-blue-600'
            : 'border-white/70 bg-transparent',
        ].join(' ')}
      >
        {checked && (
          <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
            <circle cx='6' cy='6' r='6' fill='white' />
          </svg>
        )}
      </span>
      <span className='text-white/90 text-sm'>{label}</span>
    </label>
  )

  return (
    <section
      id='news-letter-banner'
      className='newsletter-signup-gradient py-12 md:py-16 px-4 full-bleed'
    >
      {/* Centered max width + grid for clean alignment */}
      <div className='mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] items-center gap-10 lg:gap-12'>
        {/* Left: content card */}
        <div className='flex-1'>
          <div className='mb-6'>
            <span className='inline-block bg-blue-900/80 text-white text-xs font-semibold rounded px-3 py-1 mb-3'>
              Our newsletters
            </span>
            <h2 className='font-heading text-3xl md:text-4xl font-bold text-white mb-2 text-left'>
              Join Our Spiritual Family
            </h2>
            <p className='text-blue-100 mb-6 text-left'>
              Receive {frequency === 'weekly' ? 'weekly' : 'monthly'}{' '}
              inspiration, community updates, and spiritual guidance directly to
              your inbox
            </p>
          </div>

          {/* Glass panel around the form */}
          <div className='rounded-xl border border-white/10 bg-white/5 backdrop-blur px-4 py-4 md:px-6 md:py-6 shadow-sm'>
            <div ref={signupHostRef}>
              <NewsletterSignup className='newsletter-signup-form' />
            </div>

            <div
              className='mt-4 flex flex-wrap items-center gap-6'
              role='radiogroup'
              aria-label='Newsletter frequency'
            >
              {makeRadio('weekly', 'Weekly updates', frequency === 'weekly')}
              {makeRadio('monthly', 'Monthly updates', frequency === 'monthly')}
            </div>
          </div>
        </div>

        {/* Right: logo — centered on small, right on large */}
        <div className='hidden lg:flex w-full place-self-center lg:place-self-end'>
          <div className='flex w-full justify-center lg:justify-end'>
            <img
              src='/white-ffwpu.png'
              alt='FFWPU Philippines Church Logo'
              className='w-[160px] md:w-[200px] lg:w-[240px] h-auto drop-shadow-lg'
            />
          </div>
        </div>
      </div>
    </section>
  )
}
