"use client"
import React from 'react'
import { SongMeta } from '@/data/music-songs'
import { SongRow } from './SongRow'

interface SongListProps {
  songs: SongMeta[]
  category: string
}

export function SongList({ songs, category }: SongListProps) {
  return (
    <div className="flex flex-col gap-1">
      {songs.map((song, i) => (
        <SongRow key={song.id} song={song} category={category} index={i} />
      ))}
    </div>
  )
}
