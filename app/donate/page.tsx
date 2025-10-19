import type { Metadata } from 'next'
import React from 'react'
import { FiCreditCard, FiHeart, FiCheckCircle, FiGift, FiInfo, FiShield } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'
import { SideBySide } from '@/components/side-by-side'
import { bankAccounts, donationSteps, givingBenefits } from '@/constants/donation'

export const metadata: Metadata = {
  title: 'Donate & Tithes – FFWPU Philippines',
  description:
    'Support the mission of FFWPU Philippines. Learn how to donate, send your tithes, and empower activities that build a world of peace and true love.',
  openGraph: {
    title: 'Donate & Tithes – FFWPU Philippines',
    description:
      'Support the mission of FFWPU Philippines. Learn how to donate, send your tithes, and empower activities that build a world of peace and true love.',
    url: 'https://ffwpuph.com/donate',
  },
  alternates: { canonical: '/donate' },
}

// Additional local styling helpers
const subtlePanel = 'rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm'

export default function DonatePage() {
  return (
    <div className='min-h-screen bg-[linear-gradient(to_bottom,rgba(248,250,252,1),rgba(241,245,249,1))]'>
      <div className='relative overflow-hidden'>
        {/* Soft parchment glow */}
        <div className='absolute inset-0 -z-10 opacity-35 pointer-events-none bg-[radial-gradient(circle_at_55%_25%,rgba(234,179,8,0.18),transparent_70%)]' />
        <header className='container mx-auto px-4 md:px-8 pt-16 pb-10 text-center'>
          <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900'>Sacred Offering</h1>
          <p className='mt-5 max-w-3xl mx-auto text-slate-700 text-sm md:text-base leading-relaxed'>
            "The offering is not merely material. It is a token of the heart we return to Heaven—setting God first and dedicating all possessions for the sake of the providence." <span className='italic'>– True Parents</span>
          </p>
          <div className='mt-6 flex flex-wrap justify-center gap-3'>
            <a
              href='#bank'
              className='inline-flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-sm font-semibold shadow-sm scroll-smooth'
            >
              <FiCreditCard /> Bank & Wallet Details
            </a>
            <a
              href='#how-to'
              className='inline-flex items-center gap-2 rounded-full bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 text-sm font-semibold shadow-sm scroll-smooth'
            >
              <FiCheckCircle /> How to Donate
            </a>
            <a
              href='#purpose'
              className='inline-flex items-center gap-2 rounded-full bg-cyan-700 hover:bg-cyan-800 text-white px-5 py-2.5 text-sm font-semibold shadow-sm scroll-smooth'
            >
              <FiHeart /> Why Tithe?
            </a>
          </div>
        </header>
      </div>

      {/* Removed reflection section per request */}

      <div className='container mx-auto px-4 md:px-8 pb-24 space-y-20'>
        {/* Bank Information */}
        <section id='bank' className='scroll-mt-24'>
          <div className='mb-8'>
            <h2 className='text-3xl font-bold tracking-tight text-slate-900'>Channels of Giving</h2>
            <p className='mt-3 text-slate-600 max-w-2xl leading-relaxed text-sm'>Use one of the accounts below. Kindly add a brief note in the transfer (Tithe, Thanksgiving, Mission, Youth, Media, Construction). Each transaction is received with a prayer for Heaven&apos;s continued guidance.</p>
          </div>
          <div className='grid gap-6 md:grid-cols-3'>
            {bankAccounts.map((acct) => (
              <div
                key={acct.bank}
                className={subtlePanel + ' group relative p-5 hover:shadow-md transition-shadow'}
              >
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center gap-2'>
                    {acct.logo ? (
                      <Image src={acct.logo} alt={acct.bank + ' logo'} width={34} height={34} className='object-contain rounded-md' />
                    ) : (
                      <div className='h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center text-[10px] text-slate-500'>Logo</div>
                    )}
                    <span className='text-sm font-medium uppercase tracking-wide text-slate-600'>{acct.bank}</span>
                  </div>
                  <FiShield className='h-5 w-5 text-slate-400' />
                </div>
                <div className='space-y-1'>
                  <p className='font-semibold text-slate-900'>{acct.name}</p>
                  <p className='font-mono text-sm tracking-wider'>{acct.accountNumber}</p>
                  <p className='text-xs text-slate-500'>{acct.branch}</p>
                  {acct.note && <p className='text-xs text-amber-700/80 italic'>{acct.note}</p>}
                </div>
                <div className='mt-4 flex items-center justify-between'>
                  <span className='text-xs text-slate-500'>Screenshot after sending</span>
                  <span className='inline-block rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-[11px] font-semibold'>Tithes</span>
                </div>
                <div className='pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-violet-300 transition-all' />
              </div>
            ))}
          </div>

          {/* QR Codes Placeholder */}
            {/* <div className='mt-10 grid gap-6 md:grid-cols-3'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='rounded-2xl border border-slate-200 bg-white/70 p-5 flex flex-col items-center justify-center aspect-square relative shadow-sm'
                >
                  <div className='absolute inset-0 bg-[radial-gradient(circle_at_65%_40%,rgba(234,179,8,0.15),transparent_70%)] pointer-events-none rounded-2xl' />
                  <Image
                    src='/ffwpu-ph-logo.webp'
                    alt='QR placeholder'
                    width={120}
                    height={120}
                    className='opacity-90'
                  />
                  <p className='mt-4 text-sm font-medium text-slate-600'>QR Code Placeholder {i}</p>
                </div>
              ))}
            </div> */}
        </section>

        {/* How To Donate */}
        <section id='how-to' className='scroll-mt-24'>
          <div className='mb-8'>
            <h2 className='text-3xl font-bold tracking-tight text-slate-900'>How To Offer</h2>
            <p className='mt-3 text-slate-600 max-w-2xl leading-relaxed'>A reverent process helps transform a transaction into a vertical offering. Follow these guided steps.</p>
          </div>
          <div className='space-y-4'>
            {donationSteps.map((step, idx) => (
              <div
                key={idx}
                className='flex gap-4 items-start p-4 rounded-xl border border-slate-200 bg-white/70 hover:bg-white transition-colors'
              >
                <div className='h-10 w-10 shrink-0 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold shadow-sm'>
                  {idx + 1}
                </div>
                <div>
                  <h3 className='text-sm font-semibold tracking-wide text-slate-900'>{step.short}</h3>
                  <p className='mt-1 text-sm text-slate-600 leading-relaxed'>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Tithe / Purpose */}
        <section id='purpose' className='scroll-mt-24'>
          <div className='mb-8'>
            <h2 className='text-3xl font-bold tracking-tight text-slate-900'>Why Your Giving Matters</h2>
            <p className='mt-3 text-slate-600 max-w-2xl leading-relaxed'>Financial offerings sustain spiritual momentum. They empower outreach, pastoral care, national events, youth formation, media testimony production, and missionary deployment.</p>
          </div>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {givingBenefits.map((b, i) => (
              <div
                key={i}
                className='relative flex gap-4 p-5 rounded-2xl border border-slate-200 bg-white/80 shadow-sm hover:shadow-md transition-all'
              >
                <div className='w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 ring-1 ring-slate-200 flex items-center justify-center'>
                  <Image
                    src={b.image}
                    alt={b.title + ' image'}
                    width={160}
                    height={160}
                    className='object-cover w-full h-full'
                  />
                </div>
                <div className='flex-1'>
                  <h3 className='font-semibold text-slate-900 tracking-wide'>{b.title}</h3>
                  <p className='mt-2 text-sm text-slate-600 leading-relaxed'>{b.desc}</p>
                </div>
                <div className='pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent hover:ring-amber-300 transition-all' />
              </div>
            ))}
          </div>

          {/* Additional image gallery placeholder to emphasize sacred atmosphere */}
          {/* <div className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {[1,2,3,4,5,6].map((g) => (
              <div key={g} className='relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3] flex items-center justify-center border border-slate-200'>
                <span className='text-sm text-slate-500'>Image Placeholder {g}</span>
              </div>
            ))}
          </div> */}
        </section>

        {/* Call To Action */}
        <section className='mt-10 rounded-3xl bg-gradient-to-r from-indigo-800 via-sky-700 to-cyan-700 text-white p-10 md:p-14 relative overflow-hidden'>
          <div className='absolute inset-0 opacity-35 mix-blend-overlay bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.35),transparent_60%)]' />
          <div className='relative'>
            <h2 className='text-3xl md:text-4xl font-extrabold tracking-tight'>Become A Monthly Builder</h2>
            <p className='mt-4 max-w-2xl text-indigo-100'>Set aside your tithe first at the beginning of the month. Automate devotion and anchor your household in vertical alignment and providential partnership.</p>
            <div className='mt-6 flex flex-wrap gap-3'>
              <a href='#bank' className='inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur px-5 py-2.5 text-sm font-semibold shadow-sm scroll-smooth'>
                <FiCreditCard /> View Channels
              </a>
              <Link href='/about/true-parents' className='inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur px-5 py-2.5 text-sm font-semibold shadow-sm'>
                <FiHeart /> Study Deeper
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
