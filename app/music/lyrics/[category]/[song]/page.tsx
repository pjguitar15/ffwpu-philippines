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
// Image removed (no cover needed)

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
export async function generateMetadata({ params }: { params: Promise<{ category: SongCategory; song: string }> }): Promise<Metadata> {
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
  const sufferingIdx = list.findIndex(s => s.id === 'holy-suffering')
  const newLifeIdx = list.findIndex(s => s.id === 'holy-new-life')
  const sharedBase = Math.min(
    sufferingIdx === -1 ? Infinity : sufferingIdx,
    newLifeIdx === -1 ? Infinity : newLifeIdx
  )
  const rawIndex = list.findIndex(s => s.id === song.id)
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
  <main className='flex-1 flex flex-col justify-between mx-auto relative'>
          <div className='flex-col flex items-center justify-between gap-6'>
            {/* <div className='relative h-48 w-48 rounded-xl overflow-hidden shadow border bg-slate-100'>
              <Image
                src={song.cover}
                alt={song.title}
                fill
                className='object-cover'
              />
            </div> */}
            <div className='flex flex-col gap-3 self-center pt-8'>
              <div className='absolute top-4 right-4'>
                <a
                  href='/music/lyrics'
                  className='inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide px-3 py-2 rounded-md bg-gradient-to-r from-slate-800 via-cyan-700 to-teal-600 text-white shadow hover:brightness-110'
                  aria-label='Back to lyrics library'
                >
                  ← Back
                </a>
              </div>
              <h1 className='text-3xl font-bold tracking-tight text-center'>
                <span className='text-slate-400 mr-2 text-xl font-semibold'>#{displayNumber}</span>
                {song.title}
              </h1>
              <div className='flex items-center justify-center gap-3'>
                <span className='text-sm font-medium text-slate-700'>
                  {song.artist}
                </span>
                <CategoryBadge category={category} />
              </div>
              <p className='text-xs text-slate-500 text-center'>
                Album: {song.album}
              </p>
            </div>
          </div>
          {/* Scrollable lyrics area without affecting overall page min-height */}
          <div className='flex-1 w-full max-w-3xl mx-auto px-4 pb-4'>
            <div className='h-full max-h-[calc(100vh-200px)] overflow-y-auto custom-lyrics-scroll rounded-md px-2'>
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
