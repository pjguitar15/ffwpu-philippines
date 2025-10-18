"use client"
import Link from 'next/link'
import { categories, getSongsByCategory, MUSIC_FEATURES } from '@/data/music-songs'
import Image from 'next/image'
import { FiSearch, FiHeart, FiGrid, FiList } from 'react-icons/fi'
import { useMusicPlayer } from '@/context/MusicPlayerContext'
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

// Tiny blur placeholder (transparent pixel)
const BLUR = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='

interface CategoryViewState {
  [key: string]: number // number of items currently shown per category
}

export default function MusicLyricsLanding() {
  const { playSong, addToQueue, favorites, current } = useMusicPlayer()
  const [query, setQuery] = useState('')
  // Pagination removed: always show full list per category
  const [shown] = useState<CategoryViewState>(() => {
    const initial: CategoryViewState = {}
    for (const c of categories) initial[c.key] = Infinity
    return initial
  })
  const [activeCat, setActiveCat] = useState<string>('all')
  const [view, setView] = useState<'grid' | 'list'>(MUSIC_FEATURES.ENABLE_TILE_VIEW_DEFAULT ? 'grid' : 'list')

  const normalizedQuery = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    return categories.map((cat) => {
      const list = getSongsByCategory(cat.key)
      const afterSearch = normalizedQuery
        ? list.filter(
            (s) =>
              s.title.toLowerCase().includes(normalizedQuery) ||
              s.artist.toLowerCase().includes(normalizedQuery) ||
              s.lyrics.toLowerCase().includes(normalizedQuery),
          )
        : list
      return { cat, list: afterSearch }
    })
  }, [normalizedQuery])

  const visibleCats = filtered.filter(
    ({ list, cat }) => list.length > 0 && (activeCat === 'all' || cat.key === activeCat),
  )

  // showMore removed

  return (
    <main className='max-w-[1400px] mx-auto px-6 lg:px-10 py-10 min-h-screen flex flex-col gap-10'>
      {/* Sticky search + category bar */}
      <div className='sticky top-[70px] z-30 -mx-6 lg:-mx-10 px-6 lg:px-10 py-4 backdrop-blur bg-white/70 border rounded-xl flex flex-col gap-4'>
        <div className='flex flex-col md:flex-row md:items-center gap-4'>
          <div className='flex-1 flex items-center gap-3'>
            <div className='relative w-full max-w-xl'>
              <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500' />
              <input
                type='text'
                placeholder='Search songs, artists, or lyrics keywords…'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className='w-full h-11 rounded-md pl-10 pr-3 bg-white/80 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm placeholder:text-slate-400'
              />
            </div>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <button
              onClick={() => setActiveCat('all')}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border transition-colors',
                activeCat === 'all'
                  ? 'bg-gradient-to-r from-slate-800 via-cyan-700 to-teal-600 text-white border-transparent shadow'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200',
              )}
            >
              All ({filtered.reduce((sum, f) => sum + f.list.length, 0)})
            </button>
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCat(c.key)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border transition-colors',
                  activeCat === c.key
                    ? 'bg-gradient-to-r from-slate-800 via-cyan-700 to-teal-600 text-white border-transparent shadow'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200',
                )}
              >
                {c.label} ({filtered.find((f) => f.cat.key === c.key)?.list.length || 0})
              </button>
            ))}
            {/* View toggle */}
            <div className='flex items-center gap-1 ml-2'>
              <button
                type='button'
                aria-label='Grid view'
                onClick={() => setView('grid')}
                className={cn('h-9 w-9 inline-flex items-center justify-center rounded-md border text-slate-600', view === 'grid' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white hover:bg-slate-100 border-slate-200')}
              >
                <FiGrid className='h-4 w-4' />
              </button>
              <button
                type='button'
                aria-label='List view'
                onClick={() => setView('list')}
                className={cn('h-9 w-9 inline-flex items-center justify-center rounded-md border text-slate-600', view === 'list' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white hover:bg-slate-100 border-slate-200')}
              >
                <FiList className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>
        {normalizedQuery && (
          <p className='text-xs text-slate-500'>
            Showing results for <span className='font-semibold'>{query}</span>
          </p>
        )}
      </div>
      {/* Heading */}
      <div className='text-center'>
  <h1 className='text-3xl md:text-4xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 via-cyan-700 to-teal-600'>Lyrics Library</h1>
        <p className='text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed'>Browse devotional & inspirational songs. Hover a card for quick actions or click to open full lyrics.</p>
      </div>
      <div className={cn('flex flex-col gap-20', view === 'grid' && 'space-y-12')}>
        {visibleCats.map(({ cat, list }) => {
          const slice = list // show all
          const remaining = 0
          return (
            <section key={cat.key} className='flex flex-col gap-6'>
              {/* Category header */}
              <div className='flex items-center gap-6 flex-wrap'>
                <div
                  className={`relative h-24 w-24 rounded-xl overflow-hidden shadow ring-1 ring-slate-200 bg-gradient-to-r ${cat.gradient}`}
                >
                  <Image
                    src={cat.cover}
                    alt={cat.label}
                    fill
                    placeholder='blur'
                    blurDataURL={BLUR}
                    className='object-cover opacity-90'
                  />
                </div>
                <div className='min-w-0'>
                  <h2 className='text-2xl font-bold tracking-tight'>{cat.label}</h2>
                  <p className='text-sm text-slate-600 max-w-xl leading-relaxed'>{cat.desc}</p>
                  <Link
                    href={`/music/lyrics/${cat.key}`}
                    className='mt-2 inline-flex text-[11px] font-semibold uppercase tracking-wide text-white px-3 py-2 rounded-md bg-gradient-to-r from-slate-800 via-cyan-700 to-teal-600 shadow hover:brightness-110'
                  >
                    Open Category →
                  </Link>
                </div>
              </div>
              {/* Song list area */}
              {view === 'list' ? (
                <div className='group relative'>
                  <div className='overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent py-2'>
                    <div className='min-w-max flex items-stretch gap-4'>
                      {slice.map((song, idx) => {
                      const isPlaying = current?.id === song.id
                      const isFav = favorites.has(song.id)
                      // Numbering adjustment with shared #21 for Suffering/New Life
                      const sufferingIdx = slice.findIndex(s => s.id === 'holy-suffering')
                      const newLifeIdx = slice.findIndex(s => s.id === 'holy-new-life')
                      const sharedBase = Math.min(
                        sufferingIdx === -1 ? Infinity : sufferingIdx,
                        newLifeIdx === -1 ? Infinity : newLifeIdx
                      )
                      const lowered = song.title.toLowerCase()
                      const isPair = song.id === 'holy-suffering' || song.id === 'holy-new-life'
                      // Compute base numbering so that pair gets 21 and subsequent songs increment normally.
                      // Original idx starts at 0, we want: when idx == sharedBase => 21, when idx == other pair => 21 also, when idx > sharedBase + 1 => (idx + 1) because two slots collapsed into one.
                      let displayNumber = idx + 1
                      if (sharedBase !== Infinity) {
                        if (isPair) {
                          displayNumber = 21
                        } else if (idx > sharedBase + 1) {
                          // subtract 1 for the extra collapsed number
                          displayNumber = idx
                        } else if (idx === sharedBase + 1 && song.id !== 'holy-new-life' && song.id !== 'holy-suffering') {
                          // This is the second position after pair; if it's not the pair itself keep its original idx+1 - 1
                          displayNumber = idx
                        }
                      }
                      return (
                        <div
                          key={song.id}
                          className={cn(
                            'relative w-56 flex-shrink-0 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 pt-4 pb-3 shadow-sm hover:shadow-md transition-all duration-200 group/song',
                            isPlaying && 'ring-2 ring-cyan-600 shadow-cyan-200/60',
                          )}
                        >
                          <Link
                            href={`/music/lyrics/${cat.key}/${song.id}`}
                            className='absolute inset-0'
                            aria-label={`Open lyrics for ${song.title}`}
                          />
                          {/* Overlay gradient on hover */}
                          <div className='absolute inset-0 rounded-xl opacity-0 group-hover/song:opacity-100 bg-gradient-to-br from-white/0 via-cyan-50 to-teal-100 pointer-events-none transition-opacity' />
                          <div className='flex flex-col h-full relative z-10'>
                            <div className='flex items-start justify-between gap-2 mb-2'>
                              <p className='text-[11px] font-mono text-slate-400'>#{displayNumber}</p>
                              {isFav && <FiHeart className='h-3.5 w-3.5 text-cyan-600' />}
                            </div>
                            <h3 className='text-sm font-semibold leading-snug line-clamp-2'>{song.title}</h3>
                            <p className='text-[11px] text-slate-500 line-clamp-1 mt-1'>{song.artist}</p>
                            {isPlaying && (
                              <div className='mt-auto flex items-center justify-end text-[10px] text-cyan-600 font-mono pt-3'>
                                <span className='inline-flex items-center gap-1 font-semibold'>• Playing</span>
                              </div>
                            )}
                            {/* Play / queue controls removed per request */}
                          </div>
                        </div>
                      )
                      })}
                      {slice.length === 0 && (
                        <div className='py-6 px-4 text-sm text-slate-500'>No matches in this category.</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'>
                  {slice.map((song, idx) => {
                    const isPlaying = current?.id === song.id
                    const isFav = favorites.has(song.id)
                    const sufferingIdx = slice.findIndex(s => s.id === 'holy-suffering')
                    const newLifeIdx = slice.findIndex(s => s.id === 'holy-new-life')
                    const sharedBase = Math.min(
                      sufferingIdx === -1 ? Infinity : sufferingIdx,
                      newLifeIdx === -1 ? Infinity : newLifeIdx
                    )
                    const isPair = song.id === 'holy-suffering' || song.id === 'holy-new-life'
                    let displayNumber = idx + 1
                    if (sharedBase !== Infinity) {
                      if (isPair) {
                        displayNumber = 21
                      } else if (idx > sharedBase + 1) {
                        displayNumber = idx
                      } else if (idx === sharedBase + 1 && !isPair) {
                        displayNumber = idx
                      }
                    }
                    return (
                      <div
                        key={song.id}
                        className={cn(
                          'relative rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 pt-4 pb-3 shadow-sm hover:shadow-md transition-all duration-200 group/song flex flex-col',
                          isPlaying && 'ring-2 ring-cyan-600 shadow-cyan-200/60',
                        )}
                      >
                        <Link
                          href={`/music/lyrics/${cat.key}/${song.id}`}
                          className='absolute inset-0'
                          aria-label={`Open lyrics for ${song.title}`}
                        />
                        <div className='flex items-start justify-between gap-2 mb-2'>
                          <p className='text-[11px] font-mono text-slate-400'>#{displayNumber}</p>
                          {isFav && <FiHeart className='h-3.5 w-3.5 text-cyan-600' />}
                        </div>
                        <h3 className='text-sm font-semibold leading-snug line-clamp-2'>{song.title}</h3>
                        <p className='text-[11px] text-slate-500 line-clamp-1 mt-1'>{song.artist}</p>
                        {isPlaying && (
                          <div className='mt-auto flex items-center justify-end text-[10px] text-cyan-600 font-mono pt-3'>
                            <span className='inline-flex items-center gap-1 font-semibold'>• Playing</span>
                          </div>
                        )}
                        {/* Play / queue controls removed per request */}
                      </div>
                    )
                  })}
                  {slice.length === 0 && (
                    <div className='col-span-full py-6 px-4 text-sm text-slate-500'>No matches in this category.</div>
                  )}
                </div>
              )}
              {/* Pagination removed: all items displayed */}
            </section>
          )
        })}
        {visibleCats.length === 0 && (
          <p className='text-sm text-center text-slate-500'>No songs match “{query}”. Try a different keyword.</p>
        )}
      </div>
    </main>
  )
}
