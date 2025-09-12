'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { LEADERS } from '@/constants/chruch-leaders'
import { JoinedLeader, Leader, Level, Role } from '@/types/church-leaders.type'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

/* ──────────────────────────────────────────────────────────────────────────
 * Utils
 * ──────────────────────────────────────────────────────────────────────────*/
function normalizeName(n: string) {
  return n.trim().toLowerCase().replace(/\s+/g, ' ')
}

/* ──────────────────────────────────────────────────────────────────────────
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
  const [q, setQ] = useState('') // (kept for future search UI)

  // Build merged (deduped) people with roles
  const joined = useMemo(() => joinLeaders(leaders), [leaders])

  // Counts per tab (for nice badges)
  const counts = useMemo(() => {
    const c: Record<'All' | Level, number> = {
      All: joined.length,
      National: 0,
      Department: 0,
      Area: 0,
      Region: 0,
    }
    for (const p of joined) {
      const seen = new Set<Level>()
      for (const r of p.roles) seen.add(r.level)
      for (const lv of seen) c[lv]++
    }
    return c
  }, [joined])

  // Filter/search/sort over joined people
  const filtered = useMemo(() => {
    return joined
      .filter((person) =>
        level === 'All' ? true : person.roles.some((r) => r.level === level),
      )
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
  }, [joined, level, q])

  return (
    <section
      className={clsx('w-full py-12', className)}
      aria-labelledby='leadership-heading'
    >
      <div className='mx-auto container px-6'>
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

        {/* Filter / Search — Tabs */}
        {showFilter && (
          <div className='mx-auto mb-8 flex flex-col items-center gap-3'>
            <Tabs
              value={level}
              onValueChange={(v) => setLevel(v as any)}
              className='w-full'
            >
              {/* NOTE: force height to auto so wrapped rows are visible on small screens */}
              <TabsList
                className={clsx(
                  'mx-auto w-full sm:max-w-3xl',
                  'flex flex-wrap justify-center gap-x-2 gap-y-2',
                  'rounded-2xl border bg-white p-1 shadow-sm',
                  '!h-auto min-h-10 overflow-visible',
                )}
              >
                {(
                  [
                    { v: 'All', label: 'All' },
                    { v: 'National', label: 'National' },
                    { v: 'Department', label: 'Departments' },
                    { v: 'Area', label: 'Areas' },
                    { v: 'Region', label: 'Regions' },
                  ] as const
                ).map((t) => (
                  <TabsTrigger
                    key={t.v}
                    value={t.v}
                    className={clsx(
                      'px-3 sm:px-4 py-1.5 text-[12px] sm:text-sm rounded-xl',
                      'data-[state=active]:bg-slate-900 data-[state=active]:text-white',
                      'data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-slate-900/10',
                      'cursor-pointer',
                    )}
                  >
                    {t.label}
                    <span
                      className={clsx(
                        'ml-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[10px]',
                        'bg-slate-100 text-slate-600',
                        'data-[state=active]:bg-white/20 data-[state=active]:text-white',
                      )}
                    >
                      {counts[t.v as 'All' | Level]}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
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
                className='relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md pt-5 px-4'
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
                    <span
                      title={primary.tag}
                      className='mt-1 inline-block rounded-none sm:rounded-full border bg-gray-50 px-2 py-0.5 text-[10px] tracking-wide uppercase text-gray-600'
                    >
                      {primary.tag}
                    </span>
                  )}

                  {/* Other roles (badges) */}
                  {others.length > 0 && (
                    <div className='mt-2 flex flex-wrap justify-center gap-1.5'>
                      {others.map((r, idx) => (
                        <span
                          key={idx}
                          className='inline-flex items-center rounded-none sm:rounded-full bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600 ring-1 ring-slate-200'
                          title={`${r.title}${r.tag ? ` • ${r.tag}` : ''}`}
                        >
                          {r.level}: {r.tag ? `${r.tag} — ` : ''} {r.title}
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
      if (!existing.photoUrl && l.photoUrl) existing.photoUrl = l.photoUrl
      const dup = existing.roles.some(
        (r) =>
          r.level === role.level &&
          r.title === role.title &&
          r.tag === role.tag,
      )
      if (!dup) existing.roles.push(role)
    }
  }
  for (const p of map.values()) {
    p.roles.sort((a, b) => {
      const L = levelPriority(a.level) - levelPriority(b.level)
      if (L !== 0) return L
      const ao = a.order ?? 999
      const bo = b.order ?? 999
      if (ao !== bo) return ao - bo
      return (a.tag ?? '').localeCompare(b.tag ?? '')
    })
  }
  return Array.from(map.values())
}

function getPrimaryRole(roles: Role[]): Role {
  return roles.slice().sort((a, b) => {
    const L = levelPriority(a.level) - levelPriority(b.level)
    if (L !== 0) return L
    return (a.order ?? 999) - (b.order ?? 999)
  })[0]
}

function LeaderPortrait({ src, name }: { src?: string; name: string }) {
  const [loaded, setLoaded] = useState(false)

  const sizes =
    '(max-width: 640px) 45vw, (max-width: 1024px) 28vw, (max-width: 1280px) 20vw, 220px'

  return (
    <>
      {/* neutral backdrop to avoid flash of white */}
      <div className='absolute inset-0 bg-gray-100' aria-hidden='true' />

      {/* Single image: starts blurred & slightly zoomed, then sharpens */}
      <Image
        src={(src || '/leaders/placeholder.png') as string}
        alt={name}
        fill
        sizes={sizes}
        loading='lazy'
        decoding='async'
        onLoadingComplete={() => setLoaded(true)}
        className={clsx(
          'object-cover object-center',
          'transition-[filter,transform,opacity] duration-500 ease-out',
          loaded
            ? 'opacity-100 blur-0 scale-100'
            : 'opacity-80 blur-xl scale-105',
        )}
        style={{ willChange: 'filter, transform, opacity' }}
      />
    </>
  )
}
