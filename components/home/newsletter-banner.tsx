'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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

    // Try to find a <form> rendered by NewsletterSignup and ensure a hidden input exists
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

  // Helpers for radio UI
  const makeRadio = (value: Frequency, label: string, checked: boolean) => (
    <label className='flex items-center gap-2 cursor-pointer'>
      {/* Visually hidden actual radio for a11y/keyboard */}
      <input
        type='radio'
        name='newsletter-frequency'
        value={value}
        checked={checked}
        onChange={() => setFrequency(value)}
        className='sr-only'
      />
      {/* Custom radio visual */}
      <span
        aria-hidden
        className={[
          'inline-flex h-4 w-4 items-center justify-center rounded-full border-2',
          checked ? 'border-white bg-blue-600' : 'border-white bg-transparent',
        ].join(' ')}
      >
        {checked && (
          <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
            <circle cx='6' cy='6' r='6' fill='white' />
          </svg>
        )}
      </span>
      <span className='text-white text-sm'>{label}</span>
    </label>
  )

  return (
    <section
      id='news-letter-banner'
      className='newsletter-signup-gradient py-12 px-4 md:px-0 full-bleed'
    >
      <div className='container mx-auto flex flex-col md:flex-row items-center justify-between gap-8'>
        <div className='flex-1 min-w-[260px]'>
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

          {/* Host div lets us find the inner <form> of NewsletterSignup */}
          <div ref={signupHostRef}>
            <NewsletterSignup className='newsletter-signup-form' />
          </div>

          {/* Actual, working radio group */}
          <div
            className='mt-4 flex items-center gap-6'
            role='radiogroup'
            aria-label='Newsletter frequency'
          >
            {makeRadio('weekly', 'Weekly updates', frequency === 'weekly')}
            {makeRadio('monthly', 'Monthly updates', frequency === 'monthly')}
          </div>
        </div>

        <div className='flex-1 md:flex justify-center hidden md:justify-end mt-8 md:mt-0'>
          <img
            src='/white-ffwpu.png'
            alt='FFWPU Philippines Church Logo'
            className='max-w-[200px] w-full h-auto'
          />
        </div>
      </div>
    </section>
  )
}
