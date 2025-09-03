'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { StaggerContainer, FadeInItem, FadeIn } from '@/components/ui/motion'

/** ──────────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────────────*/
type Level = 'National' | 'Department' | 'Area' | 'Region'

export type Leader = {
  name: string
  title: string // displayed under name (e.g., National Leader, Area 1 Leader)
  photoUrl: string // standing/portrait image (3:4 or 4:5 works best)
  level: Level
  tag?: string // e.g., “Area 1”, “R7”, “Youth Dept”
  order?: number // custom ordering within the level
}

/** ──────────────────────────────────────────────────────────────────────────
 * Sample data (DRAFT / placeholders)
 * Replace photoUrl with your real half-body portraits under /public/leaders
 * ──────────────────────────────────────────────────────────────────────────*/
const SAMPLE_LEADERS: Leader[] = [
  // National
  {
    name: 'Rev. Ronnie Sodusta',
    title: 'National Leader',
    photoUrl: '/leaders/ronnie-sodusta.webp',
    level: 'National',
    tag: 'Head Office',
    order: 1,
  },
  {
    name: '—',
    title: 'National Secretary',
    photoUrl: '/leaders/national-secretary.jpg',
    level: 'National',
    tag: 'Head Office',
    order: 2,
  },

  // Departments (examples; rename as needed)
  {
    name: '—',
    title: 'Head, Data Management Dept.',
    photoUrl: '/leaders/department-data.jpg',
    level: 'Department',
    tag: 'Data',
    order: 1,
  },
  {
    name: '—',
    title: 'Head, Church Growth Dept.',
    photoUrl: '/leaders/department-growth.jpg',
    level: 'Department',
    tag: 'Growth',
    order: 2,
  },
  {
    name: '—',
    title: 'Head, General Affairs & PR Dept.',
    photoUrl: '/leaders/department-pr.jpg',
    level: 'Department',
    tag: 'GA & PR',
    order: 3,
  },
  {
    name: '—',
    title: 'Head, Youth Department',
    photoUrl: '/leaders/department-youth.jpg',
    level: 'Department',
    tag: 'Youth',
    order: 4,
  },
  {
    name: '—',
    title: 'Head, Blessed Family Dept.',
    photoUrl: '/leaders/department-bfd.jpg',
    level: 'Department',
    tag: 'BFD',
    order: 5,
  },

  // Area Leaders (drafted from the reference you shared)
  {
    name: 'Rev. John Rhodbert Gregorio',
    title: 'Area 1 Leader • NCR & Central Luzon',
    photoUrl: '/leaders/area-1.jpg',
    level: 'Area',
    tag: 'Area 1',
    order: 1,
  },
  {
    name: 'Rev. Rene Lansangan',
    title: 'Area 2 Leader • Northern Luzon',
    photoUrl: '/leaders/area-2.jpg',
    level: 'Area',
    tag: 'Area 2',
    order: 2,
  },
  {
    name: 'Rev. Froilan Matbagan',
    title: 'Area 3 Leader • Southern Luzon',
    photoUrl: '/leaders/area-3.jpg',
    level: 'Area',
    tag: 'Area 3',
    order: 3,
  },
  {
    name: 'Rev. Romel Pinson',
    title: 'Area 4 Leader • Visayas',
    photoUrl: '/leaders/area-4.jpg',
    level: 'Area',
    tag: 'Area 4',
    order: 4,
  },
  {
    name: 'Mrs. Nobue Caballero',
    title: 'Area 5 Leader • Mindanao',
    photoUrl: '/leaders/area-5.jpg',
    level: 'Area',
    tag: 'Area 5',
    order: 5,
  },

  // Example Regional leaders (add as needed)
  {
    name: '—',
    title: 'Regional Leader • R1 La Union',
    photoUrl: '/leaders/region-r1.jpg',
    level: 'Region',
    tag: 'R1',
  },
  {
    name: '—',
    title: 'Regional Leader • R7 Cebu',
    photoUrl: '/leaders/region-r7.jpg',
    level: 'Region',
    tag: 'R7',
  },
  {
    name: '—',
    title: 'Regional Leader • R10 Iloilo',
    photoUrl: '/leaders/region-r10.jpg',
    level: 'Region',
    tag: 'R10',
  },
]

/** ──────────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────────────*/
export default function ChurchLeadershipGrid({
  leaders = SAMPLE_LEADERS,
  className,
  heading = 'Church Leadership',
  eyebrow = 'FFWPU Philippines',
  subtext = 'Overview of national, departmental, area, and regional leaders.',
  showFilter = true,
}: {
  leaders?: Leader[]
  className?: string
  heading?: string
  eyebrow?: string
  subtext?: string
  showFilter?: boolean
}) {
  const [level, setLevel] = useState<Level | 'All'>('All')
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    return leaders
      .filter((p) => (level === 'All' ? true : p.level === level))
      .filter((p) => {
        if (!q.trim()) return true
        const hay = `${p.name} ${p.title} ${p.tag ?? ''}`.toLowerCase()
        return hay.includes(q.toLowerCase())
      })
      .sort((a, b) => {
        const lp = levelPriority(a.level) - levelPriority(b.level)
        if (lp !== 0) return lp
        if ((a.order ?? 999) !== (b.order ?? 999)) {
          return (a.order ?? 999) - (b.order ?? 999)
        }
        return a.name.localeCompare(b.name)
      })
  }, [leaders, level, q])

  return (
    <section
      className={clsx('w-full py-12', className)}
      aria-labelledby='leadership-heading'
    >
      <div className='mx-auto max-w-7xl px-6'>
        {/* Header */}
        <FadeIn className='mx-auto max-w-3xl text-center mb-8'>
          <p className='mb-1 text-xs tracking-widest uppercase text-gray-500'>
            {eyebrow}
          </p>
          <h2
            id='leadership-heading'
            className='text-2xl md:text-3xl font-extrabold leading-tight'
          >
            {heading}
          </h2>
          <p className='mt-2 text-sm md:text-base text-gray-600'>{subtext}</p>
        </FadeIn>

        {/* Filter / Search */}
        {showFilter && (
          <div className='mx-auto mb-6 flex flex-wrap items-center justify-center gap-3'>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              className='rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm'
            >
              <option value='All'>All Levels</option>
              <option value='National'>National</option>
              <option value='Department'>Departments</option>
              <option value='Area'>Areas</option>
              <option value='Region'>Regions</option>
            </select>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='Search name, title, tag…'
              className='w-64 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm'
            />
          </div>
        )}

        {/* Cards */}
        <StaggerContainer className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-7'>
          {filtered.map((p, i) => (
            <FadeInItem key={`${p.name}-${i}`}>
              <article className='relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md pt-5 px-4'>
                <div className='absolute inset-0 pointer-events-none ring-1 ring-black/5 rounded-2xl' />
                <div className='pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500/70 opacity-70' />

                {/* Portrait frame */}
                <div
                  className='relative aspect-[3/4] overflow-hidden rounded-xl'
                  style={{
                    backgroundColor: 'white',
                    backgroundImage: `
                    radial-gradient(ellipse at 50% -20%, rgba(56,189,248,0.28), rgba(56,189,248,0) 60%),
                    linear-gradient(#e5e7eb 1px, transparent 1px),
                    linear-gradient(90deg, #e5e7eb 1px, transparent 1px)
                  `,
                    backgroundSize: 'auto, 14px 14px, 14px 14px',
                    backgroundPosition: 'center top, 0 0, 0 0',
                  }}
                >
                  <LeaderPortrait src={p.photoUrl} name={p.name} />
                  <div className='pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/70 to-transparent' />
                  <div className='pointer-events-none absolute inset-0 ring-1 ring-black/5 rounded-xl' />
                </div>

                {/* Caption */}
                <div className='px-3 py-3 text-center'>
                  <h3 className='text-sm font-semibold text-slate-900'>
                    {p.name}
                  </h3>
                  <p className='mt-0.5 text-xs text-slate-600'>{p.title}</p>
                  {p.tag && (
                    <span className='mt-2 inline-block rounded-full border bg-gray-50 px-2 py-0.5 text-[10px] tracking-wide uppercase text-gray-600'>
                      {p.tag}
                    </span>
                  )}
                </div>
              </article>
            </FadeInItem>
          ))}
        </StaggerContainer>

        <p className='mt-6 text-center text-xs text-gray-500'>
          Levels: <strong>National</strong> → <strong>Departments</strong> →{' '}
          <strong>Areas</strong> → <strong>Regions</strong>.
        </p>
      </div>
    </section>
  )
}

/* --- helpers ------------------------------------------------------------ */

function levelPriority(level: Level) {
  switch (level) {
    case 'National':
      return 0
    case 'Department':
      return 1
    case 'Area':
      return 2
    case 'Region':
      return 3
    default:
      return 9
  }
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

/** Renders the photo; falls back to a half-body silhouette/avatar if it fails or is missing */
function LeaderPortrait({ src, name }: { src?: string; name: string }) {
  const [broken, setBroken] = useState(!src)
  const FALLBACK_MASK = '/leaders/ronnie-sodusta.webp' // should have transparent bg

  // If we have a working photo, show it normally
  if (!broken && src) {
    return (
      <Image
        src={src}
        alt={name}
        fill
        sizes='220px'
        className='object-cover object-center'
        onError={() => setBroken(true)}
        priority={false}
      />
    )
  }

  // Fallback: silhouette using the mask from ronnie-sodusta.webp (no photo detail visible)
  return (
    <div className='absolute inset-0'>
      <div
        className='absolute inset-0'
        // The mask keeps only the subject’s shape; background stays transparent
        style={{
          WebkitMaskImage: `url(${FALLBACK_MASK})`,
          maskImage: `url(${FALLBACK_MASK})`,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskPosition: 'center bottom',
          maskPosition: 'center bottom',
          // Solid fill for the silhouette; tweak to brand-gray if you like
          background:
            'linear-gradient(180deg, rgba(148,163,184,0.95), rgba(100,116,139,0.98))',
          // A little lift so it doesn’t feel flat on light backgrounds
          filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.18))',
        }}
        aria-hidden='true'
      />
    </div>
  )
}

