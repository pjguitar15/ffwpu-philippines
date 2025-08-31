'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiArrowRight,
  FiPhone,
} from 'react-icons/fi'
import { BiBuilding } from 'react-icons/bi'

export function ChurchBranchesSection() {
  const branches = [
    {
      title: 'Metro Manila',
      venue: 'FFWPU Headquarters',
      address:
        '32 Samar Ave, South Triangle (Diliman), Quezon City, Metro Manila, Philippines',
      phone: '+63 917 111 1111',
    },
    {
      title: 'Cebu',
      venue: 'Visayas Peace Embassy (FFWPU Cebu Center)',
      address: '25 Urgello St, Sambag 1, Cebu City, Cebu, Philippines',
      phone: '+63 917 222 2222',
    },
    {
      title: 'Davao',
      venue: 'FFWPU Davao Center',
      address: 'Davao City, Davao del Sur, Philippines',
      phone: '+63 917 333 3333',
    },
    {
      title: 'Cavite',
      venue: 'FFWPU Cavite Church',
      address:
        'Blk. 17 Lot 1, Phase III, Brgy. Cabuco, Trece Martires City, Cavite, Philippines',
      phone: '+63 917 444 4444',
    },
    {
      title: 'Bicol (Legazpi)',
      venue: 'FFWPU Legazpi Family Church',
      address: 'Legazpi City, Albay, Philippines (contact for directions)',
      phone: '+63 917 555 5555',
    },
    {
      title: 'Antipolo (Rizal)',
      venue: 'FFWPU Antipolo Family Church',
      address:
        '126 M. Santos St., Brgy. San Jose, Antipolo City, Rizal, Philippines',
      phone: '+63 917 666 6666',
    },
    {
      title: 'Cauayan (Isabela)',
      venue: 'FFWPU Isabela / Cauayan Church',
      address: 'Cauayan City, Isabela, Philippines (contact for directions)',
      phone: '+63 917 777 7777',
    },
  ]

  const INITIAL_COUNT = 4
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? branches : branches.slice(0, INITIAL_COUNT)

  return (
    <section id='branches' className='relative py-16 sm:py-20'>
      {/* soft background accent */}
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='absolute inset-0 bg-gradient-to-b from-sky-50/60 via-slate-50/40 to-white' />
        <div className='absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-200/30 blur-3xl' />
      </div>

      {/* container */}
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        {/* heading */}
        <div className='text-center space-y-3'>
          <p className='text-xs font-semibold tracking-[0.2em] text-sky-700'>
            PHILIPPINE BRANCHES
          </p>
          <h2 className='font-heading text-3xl md:text-4xl font-extrabold tracking-wide'>
            <span className='bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-900 bg-clip-text text-transparent'>
              VISIT US ON SUNDAY
            </span>
          </h2>
        </div>

        {/* cards */}
        <div
          className='mt-10 grid gap-5
          [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]'
        >
          {visible.map((b) => {
            const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${b.venue} ${b.address}`,
            )}`
            const telHref = `tel:${b.phone.replace(/[^+\d]/g, '')}`

            return (
              <Card
                key={b.title}
                className='group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 p-0 shadow-sm ring-1 ring-slate-900/5 transition-all hover:-translate-y-0.5 hover:shadow-lg'
              >
                <div className='p-5 sm:p-6 flex-1'>
                  <div className='flex items-center justify-between gap-3'>
                    <h3 className='font-heading text-lg font-bold text-slate-900'>
                      {b.title}
                    </h3>
                  </div>

                  <div className='mt-3 flex flex-wrap gap-2 text-xs'>
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-800 ring-1 ring-slate-200'>
                      <FiCalendar
                        size={16}
                        className='shrink-0 text-slate-600'
                      />
                      Every Sunday
                    </span>
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-800 ring-1 ring-slate-200'>
                      <FiClock size={16} className='shrink-0 text-slate-600' />
                      10:00am–12:00pm
                    </span>
                  </div>

                  <div className='mt-4 space-y-2 text-sm'>
                    <div className='flex items-start gap-2 text-slate-700'>
                      <BiBuilding
                        size={16}
                        className='mt-0.5 shrink-0 text-slate-500'
                      />
                      <div>
                        <span className='font-semibold text-slate-800'>
                          Venue:
                        </span>{' '}
                        {b.venue}
                      </div>
                    </div>
                    <div className='flex items-start gap-2 text-slate-700'>
                      <FiMapPin
                        size={16}
                        className='mt-0.5 shrink-0 text-slate-500'
                      />
                      <div>
                        <span className='font-semibold text-slate-800'>
                          Address:
                        </span>{' '}
                        {b.address}
                      </div>
                    </div>
                    <div className='flex items-start gap-2 text-slate-700'>
                      <FiPhone
                        size={16}
                        className='mt-0.5 shrink-0 text-slate-500'
                      />
                      <div>
                        <span className='font-semibold text-slate-800'>
                          Contact:
                        </span>{' '}
                        <a
                          href={telHref}
                          className='text-slate-900 underline-offset-2 hover:underline'
                          aria-label={`Call ${b.title} branch at ${b.phone}`}
                        >
                          {b.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='p-5 pt-0 sm:px-6 sm:pt-0'>
                  <Button
                    className='w-full cursor-pointer rounded-full bg-slate-800 text-white shadow-sm transition hover:bg-slate-900 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2'
                    asChild
                  >
                    <a
                      href={mapsHref}
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-label={`Get directions to ${b.venue}, ${b.title}`}
                    >
                      <FiArrowRight size={16} className='mr-2' />
                      GET DIRECTIONS
                    </a>
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        {/* show more / less */}
        {branches.length > INITIAL_COUNT && (
          <div className='mt-8 flex justify-center'>
            <Button
              variant='outline'
              className='rounded-full cursor-pointer'
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
            >
              {showAll
                ? 'Show fewer branches'
                : `Show all branches (${branches.length})`}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
