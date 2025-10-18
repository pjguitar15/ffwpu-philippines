import React from 'react'
import { categories, SongCategory } from '@/data/music-songs'
import { cn } from '@/lib/utils'

export function CategoryBadge({ category }: { category: SongCategory }) {
  const meta = categories.find(c => c.key === category)
  if (!meta) return null
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-1 rounded-full text-white shadow',
        'bg-gradient-to-r',
        meta.gradient
      )}
    >
      {meta.label}
    </span>
  )
}
