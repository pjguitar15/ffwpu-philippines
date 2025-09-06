'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { LEADERS } from '@/constants/chruch-leaders'
import { JoinedLeader, Leader, Level, Role } from '@/types/church-leaders.type'

/** ──────────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────────────*/

function normalizeName(n: string) {
  return n.trim().toLowerCase().replace(/\s+/g, ' ')
}

// Tiny SVG shimmer used as blur placeholder
function shimmer(w: number, h: number) {
  return `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#f3f4f6" offset="0%" />
        <stop stop-color="#e5e7eb" offset="50%" />
        <stop stop-color="#f3f4f6" offset="100%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#f8fafc"/>
    <rect id="r" width="${w}" height="${h}" fill="url(#g)"/>
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite"  />
  </svg>`
}

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

/** ──────────────────────────────────────────────────────────────────────────
 * Sample data (DRAFT / placeholders)
 * Replace photoUrl with your real half-body portraits under /public/leaders
 * ──────────────────────────────────────────────────────────────────────────*/

/** ──────────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────────────*/
export default function ChurchLeadershipGrid({
  leaders = LEADERS,
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

  // NEW: build merged (deduped) people with roles
  const joined = useMemo(() => joinLeaders(leaders), [leaders])

  // NEW: filter/search/sort over joined people
  const filtered = useMemo(() => {
    return (
      joined
        // level filter: match if ANY role matches the selected level
        .filter((person) =>
          level === 'All' ? true : person.roles.some((r) => r.level === level),
        )
        // text search: search name OR any role title/tag
        .filter((person) => {
          if (!q.trim()) return true
          const hay = [
            person.name,
            ...person.roles.map((r) => `${r.title} ${r.tag ?? ''}`),
          ]
            .join(' ')
            .toLowerCase()
          return hay.includes(q.toLowerCase())
        })
        // sort by primary role rank → primary order → name
        .sort((a, b) => {
          const pa = getPrimaryRole(a.roles)
          const pb = getPrimaryRole(b.roles)
          const L = levelPriority(pa.level) - levelPriority(pb.level)
          if (L !== 0) return L
          const ao = pa.order ?? 999
          const bo = pb.order ?? 999
          if (ao !== bo) return ao - bo
          return a.name.localeCompare(b.name)
        })
    )
  }, [joined, level, q])

  return (
    <section
      className={clsx('w-full py-12', className)}
      aria-labelledby='leadership-heading'
    >
      <div className='mx-auto container px-6'>
        {/* Header (unchanged) */}
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

        {/* Filter / Search (unchanged UI) */}
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
          {filtered.map((person, i) => {
            const primary = getPrimaryRole(person.roles)
            const others = person.roles.filter((r) => r !== primary)
            return (
              <article
                key={`${person.name}-${i}`}
                className='relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md pt-5 px-4'
              >
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
                  <LeaderPortrait src={person.photoUrl} name={person.name} />
                  <div className='pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/70 to-transparent' />
                  <div className='pointer-events-none absolute inset-0 ring-1 ring-black/5 rounded-xl' />
                </div>

                {/* Caption */}
                <div className='px-3 py-3 text-center'>
                  <h3 className='text-sm font-semibold text-slate-900'>
                    {person.name}
                  </h3>

                  {/* Primary role */}
                  <p className='mt-0.5 text-xs text-slate-600'>
                    {primary.title}
                  </p>
                  {primary.tag && (
                    <span className='mt-1 inline-block rounded-full border bg-gray-50 px-2 py-0.5 text-[10px] tracking-wide uppercase text-gray-600'>
                      {primary.tag}
                    </span>
                  )}

                  {/* Other roles (badges) */}
                  {others.length > 0 && (
                    <div className='mt-2 flex flex-wrap justify-center gap-1.5'>
                      {others.map((r, idx) => (
                        <span
                          key={idx}
                          className='inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600 ring-1 ring-slate-200'
                          title={`${r.title}${r.tag ? ` • ${r.tag}` : ''}`}
                        >
                          {r.level}: {r.tag ? `${r.tag} — ` : ''}
                          {r.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        <p className='mt-6 text-center text-xs text-gray-500'>
          Levels: <strong>National</strong> → <strong>Departments</strong> →{' '}
          <strong>Areas</strong> → <strong>Regions</strong>.
        </p>
      </div>
    </section>
  )
}

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

function joinLeaders(leaders: Leader[]): JoinedLeader[] {
  const map = new Map<string, JoinedLeader>()

  for (const l of leaders) {
    const key = normalizeName(l.name)
    const role: Role = {
      level: l.level,
      title: l.title,
      tag: l.tag,
      order: l.order,
    }

    if (!map.has(key)) {
      map.set(key, { name: l.name, photoUrl: l.photoUrl, roles: [role] })
    } else {
      const existing = map.get(key)!
      // prefer the first non-empty photo, but allow later to replace empty
      if (!existing.photoUrl && l.photoUrl) existing.photoUrl = l.photoUrl
      // avoid exact duplicate roles
      const dup = existing.roles.some(
        (r) =>
          r.level === role.level &&
          r.title === role.title &&
          r.tag === role.tag,
      )
      if (!dup) existing.roles.push(role)
    }
  }

  // keep roles of each person in a consistent order
  for (const p of map.values()) {
    p.roles.sort((a, b) => {
      const L = levelPriority(a.level) - levelPriority(b.level)
      if (L !== 0) return L
      const ao = a.order ?? 999
      const bo = b.order ?? 999
      if (ao !== bo) return ao - bo
      // put National/Dept role tags before empties for readability
      return (a.tag ?? '').localeCompare(b.tag ?? '')
    })
  }

  return Array.from(map.values())
}

function getPrimaryRole(roles: Role[]): Role {
  // highest position = lowest priority number, then smallest order
  return roles.slice().sort((a, b) => {
    const L = levelPriority(a.level) - levelPriority(b.level)
    if (L !== 0) return L
    return (a.order ?? 999) - (b.order ?? 999)
  })[0]
}

function LeaderPortrait({ src, name }: { src?: string; name: string }) {
  const [loaded, setLoaded] = useState(false)

  // sensible sizes for your grid (tweak if needed)
  const sizes =
    '(max-width: 640px) 45vw, (max-width: 1024px) 28vw, (max-width: 1280px) 20vw, 220px'

  return (
    <Image
      src={(src || '/leaders/placeholder.png') as string}
      alt={name}
      fill
      sizes={sizes}
      // 🔹 Blur-up placeholder (SVG shimmer)
      placeholder='blur'
      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(300, 400))}`}
      // 🔹 Ensure lazy behavior (Next is lazy by default, this makes it explicit)
      loading='lazy'
      decoding='async'
      // 🔹 Smooth un-blur on load
      onLoadingComplete={() => setLoaded(true)}
      className={clsx(
        'object-cover object-center transition duration-500 will-change-transform',
        loaded
          ? 'opacity-100 blur-0 scale-100'
          : 'opacity-90 blur-[10px] scale-[1.02]',
      )}
    />
  )
}

