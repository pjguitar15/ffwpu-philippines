'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function ChurchBranchesSection() {
  const branches = [
    {
      title: 'Metro Manila',
      venue: 'FFWPU Manila Center',
      address: '123 Quezon Ave, Quezon City, Metro Manila',
    },
    {
      title: 'Cebu',
      venue: 'FFWPU Cebu Center',
      address: '456 Colon St, Cebu City, Cebu',
    },
    {
      title: 'Davao',
      venue: 'FFWPU Davao Center',
      address: '789 Rizal St, Davao City, Davao del Sur',
    },
  ]

  return (
    <section className='relative space-y-10'>
      {/* soft background accent */}
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='absolute inset-0 bg-gradient-to-b from-sky-50/50 via-slate-50/40 to-white' />
        <div className='absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-200/20 blur-3xl' />
      </div>

      {/* heading */}
      <div className='text-center space-y-4'>
        <h2 className='font-heading text-3xl md:text-4xl font-extrabold tracking-wide'>
          <span className='bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-900 bg-clip-text text-transparent'>
            VISIT US ON SUNDAY
          </span>
        </h2>
        {/* keep header bar if you like; it’s subtle and not on the cards */}
        <div className='mx-auto h-1 w-20 rounded-full bg-slate-300' />
        <p className='mx-auto max-w-2xl text-slate-600'>
          Join our worship and fellowship across our Philippine branches.
          Everyone is welcome.
        </p>
      </div>

      {/* cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {branches.map((b) => {
          const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${b.venue} ${b.address}`,
          )}`
          return (
            <Card
              key={b.title}
              className='group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 p-0 shadow-sm ring-1 ring-slate-900/5 transition-all hover:-translate-y-1 hover:shadow-xl'
            >
              {/* removed yellow/amber top bar */}

              <div className='p-6'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-heading text-xl font-bold text-slate-900'>
                    {b.title}
                  </h3>
                  {/* removed FFWPU PH chip */}
                </div>

                <div className='mt-4 space-y-3 text-sm'>
                  {/* day/time chips */}
                  <div className='flex flex-wrap gap-2'>
                    <span className='inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-800 ring-1 ring-slate-200'>
                      <CalendarIcon className='h-4 w-4 text-slate-600' />
                      Every Sunday
                    </span>
                    <span className='inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-800 ring-1 ring-slate-200'>
                      <ClockIcon className='h-4 w-4 text-slate-600' />
                      10:00am–12:00pm
                    </span>
                  </div>

                  <div className='flex items-start gap-2 text-slate-700'>
                    <BuildingIcon className='mt-0.5 h-4 w-4 text-slate-500' />
                    <div>
                      <span className='font-semibold text-slate-800'>
                        Venue:
                      </span>{' '}
                      {b.venue}
                    </div>
                  </div>

                  <div className='flex items-start gap-2 text-slate-700'>
                    <MapPinIcon className='mt-0.5 h-4 w-4 text-slate-500' />
                    <div>
                      <span className='font-semibold text-slate-800'>
                        Address:
                      </span>{' '}
                      {b.address}
                    </div>
                  </div>
                </div>

                <div className='mt-6'>
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
                      <ArrowRightIcon className='mr-2 h-4 w-4' />
                      GET DIRECTIONS
                    </a>
                  </Button>
                </div>
              </div>

              {/* removed amber corner glow */}
            </Card>
          )
        })}
      </div>
    </section>
  )
}

/* --- tiny inline icons (no extra deps) --- */
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' fill='none' {...props}>
      <rect
        x='3'
        y='4'
        width='18'
        height='18'
        rx='2'
        className='stroke-current'
        strokeWidth='1.5'
      />
      <path
        d='M8 2v4M16 2v4M3 10h18'
        className='stroke-current'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  )
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' fill='none' {...props}>
      <circle
        cx='12'
        cy='12'
        r='9'
        className='stroke-current'
        strokeWidth='1.5'
      />
      <path
        d='M12 7v5l3 2'
        className='stroke-current'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  )
}

function BuildingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' fill='none' {...props}>
      <rect
        x='4'
        y='3'
        width='16'
        height='18'
        rx='2'
        className='stroke-current'
        strokeWidth='1.5'
      />
      <path
        d='M8 7h2M8 11h2M8 15h2M14 7h2M14 11h2M14 15h2'
        className='stroke-current'
        strokeWidth='1.5'
      />
    </svg>
  )
}

function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' fill='none' {...props}>
      <path
        d='M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z'
        className='stroke-current'
        strokeWidth='1.5'
      />
      <circle
        cx='12'
        cy='10'
        r='2.5'
        className='stroke-current'
        strokeWidth='1.5'
      />
    </svg>
  )
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path d='M13.172 12 8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z' />
    </svg>
  )
}
