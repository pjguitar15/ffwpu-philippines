import { categories, getSongsByCategory, SongCategory } from '@/data/music-songs'
import { notFound } from 'next/navigation'
import { SongList } from '@/components/music/SongList'
import { CategoryBadge } from '@/components/music/CategoryBadge'

export function generateStaticParams() {
  return categories.map(c => ({ category: c.key }))
}

export default async function CategorySongsPage({ params }: { params: Promise<{ category: SongCategory }> }) {
  const { category } = await params
  const meta = categories.find(c => c.key === category)
  if (!meta) return notFound()
  const songs = getSongsByCategory(category)
  return (
  <main className="max-w-5xl mx-auto px-6 py-10 min-h-screen relative">
      <div className='absolute top-4 right-4'>
        <a
          href='/music/lyrics'
          className='inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide px-3 py-2 rounded-md bg-gradient-to-r from-slate-800 via-cyan-700 to-teal-600 text-white shadow hover:brightness-110'
          aria-label='Back to lyrics library'
        >
          ← Back
        </a>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{meta.label}</h1>
        <CategoryBadge category={category} />
      </div>
      <div className="rounded-xl border bg-white/80 backdrop-blur p-4 shadow-sm">
        <SongList songs={songs} category={category} />
      </div>
    </main>
  )
}
