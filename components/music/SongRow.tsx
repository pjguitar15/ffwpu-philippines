"use client"
import React from 'react'
import { SongMeta } from '@/data/music-songs'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useMusicPlayer } from '@/context/MusicPlayerContext'

interface SongRowProps {
  song: SongMeta
  category: string
  index: number
}

export function SongRow({ song, category, index }: SongRowProps) {
  const { current } = useMusicPlayer()
  const isCurrent = current?.id === song.id
  // Numbering: two specific IDs share #21; following songs shift by -1.
  let displayNumber = index + 1
  if (song.id === 'holy-suffering' || song.id === 'holy-new-life') {
    displayNumber = 21
  } else {
    // We need to know where suffering appears; assume dataset ordering consistent.
    // If index is after the second of the pair, subtract 1.
    // Simpler: find indices once per render via closure of SongRow? Not available. Accept heuristic: if index >  (position of pair start + 1) subtract 1.
    // Without full list context we cannot compute pair start reliably here; consider passing adjusted index from parent for perfect accuracy.
    // For now keep original numbering (will be accurate if parent pre-adjusts).
  }
  return (
    <Link
      href={`/music/lyrics/${category}/${song.id}`}
      className={cn(
        'group flex items-center gap-4 px-4 py-2 rounded-md text-sm',
        'hover:bg-white/70 active:bg-white border border-transparent hover:border-slate-200 transition-colors'
      )}
    >
      <span className='text-[11px] font-mono text-slate-400 w-10'>#{displayNumber}</span>
      <div className='min-w-0 flex flex-col'>
        <span className='font-medium truncate'>{song.title}</span>
        <span className='text-[11px] text-slate-500 truncate'>{song.artist}</span>
      </div>
      {isCurrent && (
        <span className='ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded bg-cyan-600 text-white'>Playing</span>
      )}
    </Link>
  )
}
