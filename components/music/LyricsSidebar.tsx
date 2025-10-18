"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { SongMeta } from '@/data/music-songs'
import { cn } from '@/lib/utils'

interface LyricsSidebarProps {
  songs: SongMeta[]
  currentId: string
  category: string
}

export function LyricsSidebar({ songs, currentId, category }: LyricsSidebarProps) {
  // Mobile drawer state
  const [open, setOpen] = useState(false)

  // Find indices for Suffering & New Life to enforce shared #21 and shifted numbering
  const sufferingIdx = songs.findIndex(s => s.id === 'holy-suffering')
  const newLifeIdx = songs.findIndex(s => s.id === 'holy-new-life')
  const sharedBase = Math.min(
    sufferingIdx === -1 ? Infinity : sufferingIdx,
    newLifeIdx === -1 ? Infinity : newLifeIdx
  )

  const computeDisplayNumber = (idx: number, song: SongMeta) => {
    const isPair = song.id === 'holy-suffering' || song.id === 'holy-new-life'
    if (sharedBase === Infinity) return idx + 1
    if (isPair) return 21
    // After the pair (which occupies sharedBase & sharedBase+1 positions visually as one number) subtract 1
    if (idx > sharedBase + 1) return idx
    if (idx === sharedBase + 1 && !isPair) return idx // immediate next becomes 22
    return idx + 1
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        type='button'
        onClick={() => setOpen(o => !o)}
        className='lg:hidden fixed bottom-5 right-5 z-40 px-4 py-2 rounded-full shadow bg-gradient-to-r from-slate-800 via-cyan-700 to-teal-600 text-white text-xs font-semibold'
        aria-expanded={open}
        aria-controls='lyrics-mobile-sidebar'
      >
        {open ? 'Close Songs' : 'Songs'}
      </button>
      {/* Mobile drawer */}
      <div
        id='lyrics-mobile-sidebar'
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 w-64 bg-white/90 backdrop-blur border-r shadow-xl transform transition-transform duration-300 z-30 flex flex-col',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <h3 className='px-5 pt-4 text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-2'>Songs</h3>
        <div className='flex-1 overflow-y-auto custom-lyrics-scroll'>
          {songs.map((s, idx) => (
            <Link
              key={s.id}
              href={`/music/lyrics/${category}/${s.id}`}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-5 py-3 text-sm border-b border-slate-100/70 hover:bg-white/80 transition-colors',
                s.id === currentId && 'bg-white font-semibold'
              )}
            >
              <span className='text-[10px] font-mono text-slate-400 w-8'>#{computeDisplayNumber(idx, s)}</span>
              <span className='truncate flex-1'>{s.title}</span>
            </Link>
          ))}
        </div>
      </div>
      {/* Desktop sidebar */}
      <aside
        className='hidden lg:flex flex-col w-64 xl:w-72 bg-white/60 backdrop-blur border-r pt-4 sticky top-0 h-screen'
        aria-label='Song list sidebar'
      >
        <h3 className='px-5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-2'>Songs</h3>
        <div className='flex-1 overflow-y-auto px-0 custom-lyrics-scroll' aria-label='Scrollable list of songs'>
          {songs.map((s, idx) => (
            <Link
              key={s.id}
              href={`/music/lyrics/${category}/${s.id}`}
              className={cn(
                'flex items-center gap-3 px-5 py-4 text-sm border-b border-slate-100/70 hover:bg-white/80 transition-colors group',
                s.id === currentId && 'bg-white font-semibold'
              )}
              aria-current={s.id === currentId ? 'page' : undefined}
            >
              <span className='text-[10px] font-mono text-slate-400 w-8'>#{computeDisplayNumber(idx, s)}</span>
              <span className='truncate flex-1' title={s.title}>{s.title}</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  )
}
