'use client'

import { useState } from 'react'
import SectionGlare from '@/components/ui/section-glare'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiArrowRight,
  FiPhone,
  FiChevronDown,
  FiMail,
} from 'react-icons/fi'
import { BiBuilding } from 'react-icons/bi'
import { StaggerContainer, FadeInItem } from '@/components/ui/motion'
import { CHURCH_BRANCHES, sortBranches } from '@/data/branches'

export function ChurchBranchesSection() {
  // Filter to only rows whose name includes 'Church' (exclude centers or other facilities)
  const allChurches = CHURCH_BRANCHES.filter((b) => /church/i.test(b.name))

  // Define priority order for first 4 churches
  const priorityOrder = ['metro-manila', 'antipolo', 'cavite', 'davao']

  // Sort with priority churches first, then alphabetically for the rest
  const branches = [
    // Priority churches in specified order
    ...priorityOrder
      .map((slug) => allChurches.find((b) => b.slug === slug))
      .filter(
        (church): church is NonNullable<typeof church> => church !== undefined,
      ),
    // Remaining churches sorted alphabetically
    ...sortBranches(allChurches.filter((b) => !priorityOrder.includes(b.slug))),
  ]

  // State for progressive loading
  const [visibleCount, setVisibleCount] = useState(4)
  const ITEMS_PER_LOAD = 4

  const visibleBranches = branches.slice(0, visibleCount)
  const hasMore = visibleCount < branches.length

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_LOAD, branches.length))
  }

  return (
    <section id='branches' className='relative py-16 sm:py-20'>
      {/* soft background accent */}
      <SectionGlare />

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
        <StaggerContainer
          delayChildren={0.35}
          stagger={0.3}
          viewportAmount={0.25}
          once={true}
          className='mt-10 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]'
        >
          {visibleBranches.map((b, idx) => {
            const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${b.venue || ''} ${b.address}`.trim(),
            )}`
            const telHref = b.phone
              ? `tel:${b.phone.replace(/[^+\d]/g, '')}`
              : undefined
            const delayIdx = idx

            return (
              <FadeInItem
                key={b.slug}
                duration={0.55}
                y={20}
                className='rounded-2xl ring-1 ring-slate-900/5'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  ease: 'easeInOut',
                  delay: 0.04 * delayIdx,
                }}
              >
                <Card className='group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 p-0 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg'>
                  <div className='p-5 sm:p-6 flex-1'>
                    <div className='flex items-center justify-between gap-3'>
                      <h3 className='font-heading text-lg font-bold text-slate-900'>
                        {b.name}
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
                        <FiClock
                          size={16}
                          className='shrink-0 text-slate-600'
                        />
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
                          {b.venue || '—'}
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
                      {b.leaderName && (
                        <div className='flex items-start gap-2 text-slate-700'>
                          <BiBuilding
                            size={16}
                            className='mt-0.5 shrink-0 text-slate-500'
                          />
                          <div>
                            <span className='font-semibold text-slate-800'>
                              Leader:
                            </span>{' '}
                            {b.leaderName}
                            {b.leaderRole && (
                              <span className='text-slate-500'>
                                {' '}
                                — {b.leaderRole}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      <div className='flex items-start gap-2 text-slate-700'>
                        <FiPhone
                          size={16}
                          className='mt-0.5 shrink-0 text-slate-500'
                        />
                        <div>
                          <span className='font-semibold text-slate-800'>
                            Contact:
                          </span>{' '}
                          {b.phone ? (
                            telHref ? (
                              <a
                                href={telHref}
                                className='text-slate-900 underline-offset-2 hover:underline'
                                aria-label={`Call ${b.name} at ${b.phone}`}
                              >
                                {b.phone}
                              </a>
                            ) : (
                              b.phone
                            )
                          ) : (
                            <span className='text-slate-500'>—</span>
                          )}
                        </div>
                      </div>
                      {b.email && (
                        <div className='flex items-start gap-2 text-slate-700'>
                          <FiMail
                            size={16}
                            className='mt-0.5 shrink-0 text-slate-500'
                          />
                          <div>
                            <span className='font-semibold text-slate-800'>
                              Email:
                            </span>{' '}
                            <a
                              href={`mailto:${b.email}`}
                              className='text-slate-900 underline-offset-2 hover:underline'
                              aria-label={`Email ${b.name} at ${b.email}`}
                            >
                              {b.email}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='p-5 pt-0 sm:px-6 sm:pt-0'>
                    {b.address && (
                      <Button
                        className='w-full cursor-pointer rounded-full bg-slate-800 text-white shadow-sm transition hover:bg-slate-900 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2'
                        asChild
                      >
                        <a
                          href={mapsHref}
                          target='_blank'
                          rel='noopener noreferrer'
                          aria-label={`Get directions to ${b.venue || b.name}`}
                        >
                          <FiArrowRight size={16} className='mr-2' />
                          GET DIRECTIONS
                        </a>
                      </Button>
                    )}
                  </div>
                </Card>
              </FadeInItem>
            )
          })}
        </StaggerContainer>

        {/* Show More Button */}
        {hasMore && (
          <div className='mt-10 flex justify-center'>
            <Button
              onClick={handleShowMore}
              variant='outline'
              className='cursor-pointer rounded-full border-slate-300 bg-white/90 px-8 py-3 font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2'
            >
              <FiChevronDown size={16} className='mr-2' />
              Show More Churches ({branches.length - visibleCount} remaining)
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
