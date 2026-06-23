import {
  categories,
  getSong,
  getSongsByCategory,
  SongCategory,
} from '@/data/music-songs'
import type { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'
import { generateSongSchema } from '@/lib/structured-data'
import { notFound } from 'next/navigation'
import { LyricsSidebar } from '@/components/music/LyricsSidebar'
import { CategoryBadge } from '@/components/music/CategoryBadge'
import { PlayerBar } from '@/components/music/PlayerBar'
import { MUSIC_FEATURES } from '@/data/music-songs'
import Image from 'next/image'
import { getSongCover } from '@/lib/music-covers'

export function generateStaticParams() {
  const params: { category: string; song: string }[] = []
  for (const c of categories) {
    for (const s of getSongsByCategory(c.key)) {
      params.push({ category: c.key, song: s.id })
    }
  }
  return params
}

// Next.js now provides params as a Promise for dynamic routes; must await before using.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: SongCategory; song: string }>
}): Promise<Metadata> {
  const { category, song: songId } = await params
  const song = getSong(category, songId)
  if (!song) return {}
  const title = `${song.title} Lyrics`
  const description = `Read the lyrics of "${song.title}" by ${song.artist}. Explore devotional and inspirational songs in the ${category} collection.`
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Lyrics Library', url: '/music/lyrics' },
    { name: song.title, url: `/music/lyrics/${category}/${song.id}` },
  ]
  const structuredData = [
    generateSongSchema({
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album,
      lyrics: song.lyrics,
      category,
    }),
  ]
  return generatePageMetadata({
    title,
    description,
    keywords: [song.title, song.artist, 'lyrics', 'holy songs', category],
    section: 'lyrics',
    canonical: `/music/lyrics/${category}/${song.id}`,
    breadcrumbs,
    structuredData,
  })
}

export default async function SongLyricsPage({
  params,
}: {
  params: Promise<{ category: SongCategory; song: string }>
}) {
  const { category, song: songId } = await params
  const meta = categories.find((c) => c.key === category)
  if (!meta) return notFound()
  const song = getSong(category, songId)
  if (!song) return notFound()
  const list = getSongsByCategory(category)
  // Numbering logic: "Suffering" & "New Life" both display #21; songs after them shift by -1.
  const sufferingIdx = list.findIndex((s) => s.id === 'holy-suffering')
  const newLifeIdx = list.findIndex((s) => s.id === 'holy-new-life')
  const sharedBase = Math.min(
    sufferingIdx === -1 ? Infinity : sufferingIdx,
    newLifeIdx === -1 ? Infinity : newLifeIdx,
  )
  const rawIndex = list.findIndex((s) => s.id === song.id)
  let displayNumber = rawIndex + 1
  if (song.id === 'holy-suffering' || song.id === 'holy-new-life') {
    displayNumber = 21
  } else if (sharedBase !== Infinity && rawIndex > sharedBase) {
    displayNumber = rawIndex // subtract 1
  }
  const lines = song.lyrics.split(/\n/)
  return (
    <div className='flex flex-col min-h-[90vh]'>
      <div className='flex flex-1'>
        <LyricsSidebar songs={list} currentId={song.id} category={category} />
        <main className='relative mx-auto flex flex-1 flex-col justify-between bg-[#f6f7f5]'>
          <div className='mx-auto flex w-full max-w-3xl justify-end px-5 pt-4 sm:px-8'>
            <div>
              <a
                href='/music/lyrics'
                className='inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:text-slate-950'
                aria-label='Back to lyrics library'
              >
                ← Back
              </a>
            </div>
          </div>
          <div className='mx-auto grid w-full max-w-3xl grid-cols-[112px_1fr] items-end gap-5 px-5 pb-6 pt-5 sm:grid-cols-[144px_1fr] sm:px-8 md:pt-8'>
            <div className='relative aspect-square w-full overflow-hidden rounded-lg bg-slate-100 shadow-sm ring-1 ring-slate-200'>
              <Image
                src={getSongCover(song)}
                alt=''
                fill
                priority
                sizes='(max-width: 640px) 112px, 144px'
                className='object-cover'
              />
            </div>
            <div className='min-w-0 pb-1'>
              <div className='mb-3 flex flex-wrap items-center gap-2'>
                <span className='rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500 shadow-sm ring-1 ring-slate-200'>
                  #{displayNumber}
                </span>
                <CategoryBadge category={category} />
              </div>
              <h1 className='text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl'>
                {song.title}
              </h1>
              <p className='mt-3 text-sm font-medium text-slate-700'>
                {song.artist}
              </p>
              <p className='mt-1 text-xs text-slate-500'>
                Album: {song.album}
              </p>
            </div>
          </div>
          {/* Scrollable lyrics area without affecting overall page min-height */}
          <div className='mx-auto w-full max-w-3xl flex-1 px-5 pb-5 sm:px-8'>
            <div className='h-full max-h-[calc(100vh-280px)] overflow-y-auto custom-lyrics-scroll rounded-lg bg-white px-4 py-5 shadow-sm ring-1 ring-slate-200 sm:px-8'>
              {lines.map((l, i) => (
                <p
                  key={i}
                  className='whitespace-pre-wrap text-center font-semibold text-slate-800 tracking-normal leading-7 my-2'
                >
                  {l === '' ? '\u00A0' : l}
                </p>
              ))}
            </div>
          </div>
          {MUSIC_FEATURES.ENABLE_PLAYER && <PlayerBar />}
        </main>
      </div>
    </div>
  )
}
