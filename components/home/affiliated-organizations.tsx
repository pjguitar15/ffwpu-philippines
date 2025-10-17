'use client'

import Image from 'next/image'
import clsx from 'clsx'

type AffiliatedOrg = {
  name: string
  logoUrl: string
  href?: string
  contribution?: string
}

const DEFAULT_ORGS: AffiliatedOrg[] = [
  {
    name: 'UPF',
    logoUrl: '/logos/upf-logo.webp',
    href: 'https://www.upf.org',
    contribution: 'Peace',
  },
  {
    name: 'WFWP',
    logoUrl: '/logos/wfwp-logo.webp',
    href: 'https://www.wfwp.org',
    contribution: 'Women',
  },
  {
    name: 'IAYSP (YSP)',
    logoUrl: '/logos/ysp-logo.png',
    href: 'https://iaysp.org',
    contribution: 'Youth',
  },
  {
    name: 'CARP',
    logoUrl: '/logos/wcarp-logo.webp',
    href: 'https://www.wcarp.org',
    contribution: 'Campus',
  },
  {
    name: 'HJ CheonBo',
    logoUrl: '/logos/hj-cheonbo.webp',
    href: 'https://en.hjcbt.org',
    contribution: 'Spiritual',
  },
  {
    name: 'PCLC',
    logoUrl: '/logos/pclc-logo.webp',
    href: 'https://pclc-asiapacific.org',
    contribution: 'Clergy',
  },
  {
    name: 'Tong-Il Moo-Do',
    logoUrl: '/logos/timd-logo.webp',
    href: 'https://tongilmoodo.org/',
    contribution: 'Culture',
  },
  {
    name: 'Sun Hwa International Academy',
    logoUrl: '/logos/shia-logo.webp',
    contribution: 'Education',
    href: 'https://www.facebook.com/sunhwaacademyph',
  },
  {
    name: 'IPLC (Intl. Peace Leadership College)',
    logoUrl: '/logos/iplc-logo.webp',
    contribution: 'Higher Ed',
    href: 'https://www.facebook.com/profile.php?id=100063610582473',
  },
]

export default function AffiliatedOrganizations({
  className,
  orgs = DEFAULT_ORGS,
  heading = 'Our Affiliated Organizations',
  eyebrow = 'FFWPU Family',
  blurb = 'These affiliated ministries and partners advance FFWPU’s vision — strengthening families, campuses, clergy, and communities for a world of lasting peace.',
}: {
  className?: string
  orgs?: AffiliatedOrg[]
  heading?: string
  eyebrow?: string
  blurb?: string
}) {
  return (
    <section
      className={clsx('w-full pb-14', className)}
      aria-labelledby='affiliates-heading'
    >
      <div className='mx-auto max-w-7xl px-6'>
        {/* Header */}
        <div className='mx-auto max-w-3xl text-center mb-10'>
          <p className='mb-2 text-xs tracking-widest uppercase text-gray-500 dark:text-gray-400'>
            {eyebrow}
          </p>
          <h2
            id='affiliates-heading'
            className='text-2xl md:text-3xl font-extrabold leading-tight'
          >
            {heading}
          </h2>
          <p className='mt-3 text-sm md:text-base text-gray-600 dark:text-gray-300'>
            {blurb}
          </p>
        </div>

        {/* Logos grid */}
        <div
          className={clsx(
            'grid gap-6',
            'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
            'justify-items-stretch items-stretch auto-rows-fr', // stretch items so cards are equal width/height per row
          )}
        >
          {orgs.map((org) => {
            const Card = (
              <div
                key={org.name}
                className='flex h-full w-full flex-col items-center text-center rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-sm shadow-sm hover:shadow-md transition'
              >
                <div className='flex items-center justify-center p-4'>
                  <Image
                    src={org.logoUrl}
                    alt={org.name}
                    width={160}
                    height={80}
                    className='h-14 w-auto object-contain'
                    loading='lazy'
                  />
                </div>
                <div className='px-3 pb-4'>
                  <span className='block text-sm font-semibold text-slate-800 dark:text-slate-100'>
                    {org.name}
                  </span>
                  {org.contribution && (
                    <span className='mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] tracking-wide uppercase text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/5'>
                      {org.contribution}
                    </span>
                  )}
                </div>
              </div>
            )

            return org.href ? (
              <a
                key={org.name}
                href={org.href}
                target='_blank'
                rel='noreferrer noopener'
                className='block h-full w-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400'
              >
                {Card}
              </a>
            ) : (
              Card
            )
          })}
        </div>
      </div>
    </section>
  )
}
