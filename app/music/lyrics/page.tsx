'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { BookOpen, Grid3X3, Heart, ListMusic, Search } from 'lucide-react'
import {
  categories,
  formatDuration,
  getSongsByCategory,
  MUSIC_FEATURES,
  SongCategory,
  SongMeta,
} from '@/data/music-songs'
import { useMusicPlayer } from '@/context/MusicPlayerContext'
import { cn } from '@/lib/utils'
import { DEFAULT_COVER, getSongCover } from '@/lib/music-covers'

type ViewMode = 'grid' | 'list'

function getDisplayNumber(song: SongMeta, songs: SongMeta[], index: number) {
  const sufferingIndex = songs.findIndex((s) => s.id === 'holy-suffering')
  const newLifeIndex = songs.findIndex((s) => s.id === 'holy-new-life')
  const pairStart = Math.min(
    sufferingIndex === -1 ? Infinity : sufferingIndex,
    newLifeIndex === -1 ? Infinity : newLifeIndex,
  )
  const isSharedPair =
    song.id === 'holy-suffering' || song.id === 'holy-new-life'

  if (pairStart === Infinity) return index + 1
  if (isSharedPair) return 21
  if (index > pairStart + 1) return index
  if (index === pairStart + 1) return index
  return index + 1
}

export default function MusicLyricsLanding() {
  const { favorites, current } = useMusicPlayer()
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState<'all' | SongCategory>('all')
  const [view, setView] = useState<ViewMode>(
    MUSIC_FEATURES.ENABLE_TILE_VIEW_DEFAULT ? 'grid' : 'list',
  )

  const normalizedQuery = query.trim().toLowerCase()
  const categoryResults = useMemo(() => {
    return categories.map((cat) => {
      const songs = getSongsByCategory(cat.key).filter((song) => {
        if (!normalizedQuery) return true
        return `${song.title} ${song.artist} ${song.album} ${song.lyrics}`
          .toLowerCase()
          .includes(normalizedQuery)
      })

      return { cat, songs }
    })
  }, [normalizedQuery])

  const totalSongs = categoryResults.reduce(
    (sum, result) => sum + result.songs.length,
    0,
  )
  const visibleCategories = categoryResults.filter(
    ({ cat, songs }) =>
      songs.length > 0 && (activeCat === 'all' || activeCat === cat.key),
  )

  return (
    <main className='min-h-screen bg-[#f6f7f5] text-slate-950'>
      <section className='border-b border-slate-200 bg-white'>
        <div className='mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-7 sm:px-8 md:flex-row md:items-end md:justify-between md:py-10'>
          <div className='flex items-start gap-4'>
            <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-slate-100 shadow-sm ring-1 ring-slate-200 sm:h-20 sm:w-20'>
              <Image
                src={DEFAULT_COVER}
                alt=''
                fill
                priority
                sizes='80px'
                className='object-cover'
              />
            </div>
            <div>
              <p className='text-sm font-medium text-emerald-700'>
                FFWPU Philippines Music
              </p>
              <h1 className='mt-2 text-3xl font-semibold tracking-normal sm:text-4xl'>
                Lyrics Library
              </h1>
              <p className='mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base'>
                Search and browse devotional songs in a simple reading-focused
                library.
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2 text-sm text-slate-500'>
            <BookOpen className='h-4 w-4' />
            <span>{totalSongs} songs</span>
          </div>
        </div>
      </section>

      <section className='sticky top-[64px] z-30 border-b border-slate-200 bg-[#f6f7f5]/95 backdrop-blur'>
        <div className='mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-3 sm:px-8 lg:flex-row lg:items-center lg:justify-between'>
          <label className='flex h-11 min-w-0 items-center gap-2 rounded-md bg-white px-3 shadow-sm ring-1 ring-slate-200 lg:w-[420px]'>
            <Search className='h-4 w-4 shrink-0 text-slate-400' />
            <input
              type='search'
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Search lyrics'
              className='min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400'
            />
          </label>

          <div className='flex items-center justify-between gap-3'>
            <div className='flex min-w-0 gap-2 overflow-x-auto pb-1 lg:pb-0'>
              <FilterPill
                active={activeCat === 'all'}
                label='All'
                count={totalSongs}
                onClick={() => setActiveCat('all')}
              />
              {categoryResults.map(({ cat, songs }) => (
                <FilterPill
                  key={cat.key}
                  active={activeCat === cat.key}
                  label={cat.label}
                  count={songs.length}
                  onClick={() => setActiveCat(cat.key)}
                />
              ))}
            </div>

            <div className='grid shrink-0 grid-cols-2 rounded-md bg-white p-1 shadow-sm ring-1 ring-slate-200'>
              <IconButton
                active={view === 'grid'}
                label='Grid view'
                onClick={() => setView('grid')}
              >
                <Grid3X3 className='h-4 w-4' />
              </IconButton>
              <IconButton
                active={view === 'list'}
                label='List view'
                onClick={() => setView('list')}
              >
                <ListMusic className='h-4 w-4' />
              </IconButton>
            </div>
          </div>
        </div>
      </section>

      <section className='mx-auto w-full max-w-6xl px-5 py-7 sm:px-8'>
        {normalizedQuery && (
          <p className='mb-5 text-sm text-slate-600'>
            {totalSongs} result{totalSongs === 1 ? '' : 's'} for{' '}
            <span className='font-medium text-slate-950'>"{query}"</span>
          </p>
        )}

        <div className='space-y-9'>
          {visibleCategories.map(({ cat, songs }) => (
            <section key={cat.key}>
              <div className='mb-4 flex items-center justify-between gap-4'>
                <div>
                  <h2 className='text-xl font-semibold text-slate-950'>
                    {cat.label}
                  </h2>
                  <p className='mt-1 text-sm text-slate-500'>{cat.desc}</p>
                </div>
                <Link
                  href={`/music/lyrics/${cat.key}`}
                  className='hidden rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:text-slate-950 sm:inline-flex'
                >
                  View all
                </Link>
              </div>

              {view === 'grid' ? (
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                  {songs.map((song, index) => (
                    <SongCard
                      key={song.id}
                      song={song}
                      category={cat.key}
                      displayNumber={getDisplayNumber(song, songs, index)}
                      isFavorite={favorites.has(song.id)}
                      isPlaying={current?.id === song.id}
                    />
                  ))}
                </div>
              ) : (
                <div className='overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-200'>
                  {songs.map((song, index) => (
                    <SongRow
                      key={song.id}
                      song={song}
                      category={cat.key}
                      displayNumber={getDisplayNumber(song, songs, index)}
                      isFavorite={favorites.has(song.id)}
                      isPlaying={current?.id === song.id}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {visibleCategories.length === 0 && (
          <div className='rounded-md border border-dashed border-slate-300 bg-white px-5 py-12 text-center'>
            <BookOpen className='mx-auto h-7 w-7 text-slate-400' />
            <h2 className='mt-4 text-base font-semibold'>No lyrics found</h2>
            <p className='mt-2 text-sm text-slate-500'>
              Try a different title, artist, or lyric phrase.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

function FilterPill({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean
  label: string
  count: number
  onClick: () => void
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'h-9 shrink-0 rounded-full px-3 text-sm font-medium transition',
        active
          ? 'bg-emerald-600 text-white'
          : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:text-slate-950',
      )}
    >
      {label}
      <span
        className={cn(
          'ml-1.5 text-xs',
          active ? 'text-white/70' : 'text-slate-400',
        )}
      >
        {count}
      </span>
    </button>
  )
}

function IconButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type='button'
      aria-label={label}
      onClick={onClick}
      className={cn(
        'grid h-8 w-9 place-items-center rounded-md transition',
        active ? 'bg-slate-950 text-white' : 'text-slate-500 hover:text-slate-950',
      )}
    >
      {children}
    </button>
  )
}

function SongCard({
  song,
  category,
  displayNumber,
  isFavorite,
  isPlaying,
}: {
  song: SongMeta
  category: SongCategory
  displayNumber: number
  isFavorite: boolean
  isPlaying: boolean
}) {
  return (
    <Link
      href={`/music/lyrics/${category}/${song.id}`}
      className={cn(
        'group flex gap-4 rounded-md bg-white p-3 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md',
        isPlaying && 'ring-2 ring-emerald-200',
      )}
    >
      <SongArtwork song={song} size='large' />
      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='flex items-start justify-between gap-3'>
          <span className='text-xs font-medium text-slate-400'>
            #{displayNumber}
          </span>
          {isFavorite && (
            <Heart className='h-4 w-4 fill-emerald-600 text-emerald-600' />
          )}
        </div>
        <h3 className='mt-2 line-clamp-2 text-base font-semibold leading-snug text-slate-950 group-hover:underline'>
          {song.title}
        </h3>
        <p className='mt-1 line-clamp-1 text-sm text-slate-500'>
          {song.artist}
        </p>
        <div className='mt-auto flex items-center justify-between pt-4 text-xs text-slate-500'>
          <span>{formatDuration(song.durationSec)}</span>
          <span className='font-medium text-emerald-700'>
            {isPlaying ? 'Playing' : 'Lyrics'}
          </span>
        </div>
      </div>
    </Link>
  )
}

function SongRow({
  song,
  category,
  displayNumber,
  isFavorite,
  isPlaying,
}: {
  song: SongMeta
  category: SongCategory
  displayNumber: number
  isFavorite: boolean
  isPlaying: boolean
}) {
  return (
    <Link
      href={`/music/lyrics/${category}/${song.id}`}
      className={cn(
        'grid grid-cols-[34px_48px_1fr_auto] items-center gap-3 border-b border-slate-100 px-3 py-3 transition last:border-b-0 hover:bg-slate-50 sm:grid-cols-[44px_52px_1fr_72px_auto]',
        isPlaying && 'bg-emerald-50',
      )}
    >
      <span className='text-sm font-medium text-slate-400'>
        #{displayNumber}
      </span>
      <SongArtwork song={song} size='small' />
      <div className='min-w-0'>
        <h3 className='truncate text-sm font-semibold text-slate-950 sm:text-base'>
          {song.title}
        </h3>
        <p className='mt-1 truncate text-xs text-slate-500 sm:text-sm'>
          {song.artist}
        </p>
      </div>
      <span className='hidden text-sm text-slate-500 sm:block'>
        {formatDuration(song.durationSec)}
      </span>
      <div className='flex items-center gap-2 text-emerald-700'>
        {isFavorite && <Heart className='h-4 w-4 fill-current' />}
        <BookOpen className='h-4 w-4' />
      </div>
    </Link>
  )
}

function SongArtwork({
  song,
  size,
}: {
  song: SongMeta
  size: 'small' | 'large'
}) {
  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded bg-slate-100 shadow-sm ring-1 ring-slate-200',
        size === 'large' ? 'h-24 w-24' : 'h-12 w-12',
      )}
    >
      <Image
        src={getSongCover(song)}
        alt=''
        fill
        sizes={size === 'large' ? '96px' : '48px'}
        className='object-cover'
      />
    </div>
  )
}
