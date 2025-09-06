'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import clsx from 'clsx'

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
  // ─────────────────────────────────────────
  // National (by order)
  // ─────────────────────────────────────────
  {
    name: 'Rev. Ronnie Sodusta',
    title: 'National Leader / Regional Director',
    photoUrl: '/leaders/ronnie-sodusta.png',
    level: 'National',
    tag: 'Head Office',
    order: 1,
  },
  {
    name: 'Rev. John Rhodbert Gregorio',
    title: 'Secretary General',
    photoUrl: '/leaders/john-rhodbert-gregorio.png',
    level: 'National',
    tag: 'Head Office',
    order: 2,
  },

  // ─────────────────────────────────────────
  // Departments (chart order)
  // ─────────────────────────────────────────
  {
    name: 'Mary Grace A. Carumba',
    title: 'Director, Database Management & Membership Department',
    photoUrl: '/leaders/mary-grace-carumba.png',
    level: 'Department',
    tag: 'Membership / Data',
    order: 1,
  },
  {
    name: 'Angelito Cainday',
    title: 'Director, Church Growth Department',
    photoUrl: '/leaders/angelito-cainday.png',
    level: 'Department',
    tag: 'Growth',
    order: 2,
  },
  {
    name: 'Venus Agustin',
    title:
      'Director, General Affairs & PR Department (UPF Philippines Regional Director)',
    photoUrl: '/leaders/venus-agustin.png',
    level: 'Department',
    tag: 'PR / UPF',
    order: 3,
  },
  {
    name: 'Jun Young Teves',
    title: 'Director, Youth / Future Generation Department',
    photoUrl: '/leaders/jun-young-teves.png',
    level: 'Department',
    tag: 'Youth',
    order: 4,
  },
  {
    name: 'Catherine Gregorio',
    title: 'Director, Blessed Family Department',
    photoUrl: '/leaders/catherine-gregorio.png',
    level: 'Department',
    tag: 'BFD',
    order: 5,
  },
  {
    name: 'Edgar Tanate',
    title: 'Head, Education, Spirituality & Leadership Development Department',
    photoUrl: '/leaders/edgar-tanate.png',
    level: 'Department',
    tag: 'Education',
    order: 6,
  },

  // ─────────────────────────────────────────
  // Areas (1 → 5)
  // ─────────────────────────────────────────
  {
    name: 'Rev. John Rhodbert Gregorio',
    title: 'Area 1 Leader • NCR & Central Luzon',
    photoUrl: '/leaders/john-rhodbert-gregorio.png',
    level: 'Area',
    tag: 'Area 1',
    order: 1,
  },
  {
    name: 'Rene T. Lansangan',
    title: 'Area 2 Leader • Northern Luzon',
    photoUrl: '/leaders/rene-lansangan.png',
    level: 'Area',
    tag: 'Area 2',
    order: 2,
  },
  {
    name: 'Rev. Froilan Matbagan',
    title: 'Area 3 Leader • Southern Luzon',
    photoUrl: '/leaders/froilan-matbagan.jpg',
    level: 'Area',
    tag: 'Area 3',
    order: 3,
  },
  {
    name: 'Angelito Cainday',
    title: 'Area 4 Leader • Visayas',
    photoUrl: '/leaders/angelito-cainday.png',
    level: 'Area',
    tag: 'Area 4',
    order: 4,
  },
  {
    name: 'Mrs. Nobue Caballero',
    title: 'Area 5 Leader • Mindanao',
    photoUrl: '/leaders/nobue-caballero.png',
    level: 'Area',
    tag: 'Area 5',
    order: 5,
  },

  // ─────────────────────────────────────────
  // Regions / Local Churches (ordered within each Area)
  // ─────────────────────────────────────────
  // AREA 1 → NCR, R3
  {
    name: 'Rev. John Rhodbert Gregorio',
    title: 'Metro Manila Church',
    photoUrl: '/leaders/john-rhodbert-gregorio.png',
    level: 'Region',
    tag: 'NCR',
    order: 1, // within Area 1
  },
  {
    name: 'Rev. Froilan Ramos',
    title: 'Cabanatuan Church',
    photoUrl: '/leaders/froilan-ramos.png',
    level: 'Region',
    tag: 'R3',
    order: 2, // within Area 1
  },

  // AREA 2 → R1, R2, CAR
  {
    name: 'Blessie Belle T. Ramos',
    title: 'La Union Church',
    photoUrl: '/leaders/blessie-ramos.png',
    level: 'Region',
    tag: 'R1',
    order: 1, // within Area 2
  },
  {
    name: 'Rene T. Lansangan',
    title: 'Cauayan Church',
    photoUrl: '/leaders/rene-lansangan.png',
    level: 'Region',
    tag: 'R2',
    order: 2, // within Area 2
  },
  {
    name: 'Rev. Concepcion “Connie” Gawec',
    title: 'Baguio Church',
    photoUrl: '/leaders/concepcion-gawec.png',
    level: 'Region',
    tag: 'CAR',
    order: 3, // within Area 2
  },

  // AREA 3 → R4A, R4A, R4B, R5
  {
    name: 'Rev. Froilan Matbagan',
    title: 'Antipolo Church',
    photoUrl: '/leaders/froilan-matbagan.jpg',
    level: 'Region',
    tag: 'R4A',
    order: 1, // within Area 3
  },
  {
    name: 'Rev. Reynaldo Estoce',
    title: 'Cavite Church',
    photoUrl: '/leaders/reynaldo-estoce.png',
    level: 'Region',
    tag: 'R4A',
    order: 2, // within Area 3
  },
  {
    name: 'Rev. Leopoldo Uba',
    title: 'Puerto Princesa Church',
    photoUrl: '/leaders/leopoldo-uba.png',
    level: 'Region',
    tag: 'R4B',
    order: 3, // within Area 3
  },
  {
    name: 'Rev. Ariel Villafuerte',
    title: 'Legazpi Church',
    photoUrl: '/leaders/ariel-villafuerte.png',
    level: 'Region',
    tag: 'R5',
    order: 4, // within Area 3
  },

  // AREA 4 → R6, R7, R8
  {
    name: 'Rev. Carlo Niño Bartolo',
    title: 'Iloilo Church',
    photoUrl: '/leaders/carlo-bartolo.png',
    level: 'Region',
    tag: 'R6',
    order: 1, // within Area 4
  },
  {
    name: 'Rev. Romel Pinson',
    title: 'Cebu Church',
    photoUrl: '/leaders/romel-pinson.png',
    level: 'Region',
    tag: 'R7',
    order: 2, // within Area 4
  },
  {
    name: 'Rev. Editha Cipriano',
    title: 'Leyte Church',
    photoUrl: '/leaders/editha-cipriano.png',
    level: 'Region',
    tag: 'R8',
    order: 3, // within Area 4
  },

  // AREA 5 → R9, R10, (R11 Davao—tbd), R12, R13
  {
    name: 'Rev. Elsa Catbay',
    title: 'Zamboanga Church',
    photoUrl: '/leaders/elsa-catbay.png',
    level: 'Region',
    tag: 'R9',
    order: 1, // within Area 5
  },
  {
    name: 'Rev. Sylvia Deapera',
    title: 'Cagayan de Oro Church',
    photoUrl: '/leaders/sylvia-deapera.png',
    level: 'Region',
    tag: 'R10',
    order: 2, // within Area 5
  },
  // R11 Davao — leader not confirmed in sources; add when known.
  {
    name: 'Rev. John C. Bastol',
    title: 'General Santos (SOCSKSARGEN) Church',
    photoUrl: '/leaders/john-bastol.png',
    level: 'Region',
    tag: 'R12',
    order: 3, // within Area 5
  },
  {
    name: 'Rev. Percinita Apas',
    title: 'Butuan Church',
    photoUrl: '/leaders/percinita-apas.png',
    level: 'Region',
    tag: 'R13',
    order: 4, // within Area 5
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
        <div className='mx-auto max-w-3xl text-center mb-8'>
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
        </div>

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
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-7'>
          {filtered.map((p, i) => (
            <div key={`${p.name}-${i}`}>
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
            </div>
          ))}
        </div>

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

function LeaderPortrait({ src, name }: { src?: string; name: string }) {
  return (
    <Image
      src={src as string}
      alt={name}
      fill
      sizes='220px'
      className='object-cover object-center'
      priority={false}
    />
  )
}

