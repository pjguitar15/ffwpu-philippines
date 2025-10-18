export type SongCategory = 'holy-songs' | 'hjm-songs' | 'csw-songs'

export interface SongMeta {
  id: string
  title: string
  artist: string
  album: string
  durationSec: number
  category: SongCategory
  lyrics: string
  cover: string // image path placeholder
}

// Feature flags for music module
export const MUSIC_FEATURES = {
  ENABLE_PLAYER: false, // hide global player & interactive play/queue controls while focusing on lyrics experience
  ENABLE_QUEUE_ACTIONS: false,
  ENABLE_TILE_VIEW_DEFAULT: true,
} as const

// Placeholder lyrics and songs; real content can replace later.
import { holySongs } from './holy-songs'

export const songs: SongMeta[] = [
  {
    id: 'hjm-song-1',
    title: 'Heart of Filial Piety',
    artist: 'Hyo Jin Moon',
    album: 'Devotional Tracks',
    durationSec: 240,
    category: 'hjm-songs',
    cover: '/placeholder-album.webp',
    lyrics: `Intro\nInstrumental placeholder.\nVerse\nFilial heart placeholder lines.\nChorus\nWe offer love placeholder.`,
  },
  {
    id: 'hjm-song-2',
    title: 'Path of Devotion',
    artist: 'Hyo Jin Moon',
    album: 'Devotional Tracks',
    durationSec: 195,
    category: 'hjm-songs',
    cover: '/placeholder-album.webp',
    lyrics: `Verse\nWalking the path placeholder.\nChorus\nDevotion strong placeholder.`,
  },
  {
    id: 'csw-song-1',
    title: 'Cheon Shim Prayer',
    artist: 'Cheon Shim Won',
    album: 'CSW Hymns',
    durationSec: 230,
    category: 'csw-songs',
    cover: '/placeholder-album.webp',
    lyrics: `Verse\nPrayerful hearts placeholder.\nChorus\nCheon Shim Won placeholder refrain.`,
  },
  {
    id: 'csw-song-2',
    title: 'Temple Dawn',
    artist: 'Cheon Shim Won',
    album: 'CSW Hymns',
    durationSec: 205,
    category: 'csw-songs',
    cover: '/placeholder-album.webp',
    lyrics: `Verse\nDawn at the temple placeholder.\nChorus\nRising light placeholder.`,
  },
]

// Merge extended holy songs (avoid duplicates if placeholder ids exist)
for (const hs of holySongs) {
  if (!songs.find(s => s.id === hs.id)) {
    songs.push(hs)
  }
}

export const categories: { key: SongCategory; label: string; desc: string; gradient: string; cover: string }[] = [
  {
    key: 'holy-songs',
    label: 'Holy Songs',
    desc: 'Traditional devotional hymns used in early services and gatherings.',
    gradient: 'from-cyan-600 via-teal-600 to-sky-600',
    cover: '/holy-songs.jpg',
  },
  // {
  //   key: 'hjm-songs',
  //   label: 'Hyo Jin Moon Songs',
  //   desc: 'Inspirational tracks attributed to Hyo Jin Moon (HJM).',
  //   gradient: 'from-pink-500 via-rose-600 to-fuchsia-600',
  //   cover: '/placeholder-hjm.webp',
  // },
  // {
  //   key: 'csw-songs',
  //   label: 'Cheon Shim Won Songs',
  //   desc: 'Prayerful songs from Cheon Shim Won devotion culture.',
  //   gradient: 'from-blue-600 via-indigo-600 to-violet-600',
  //   cover: '/placeholder-csw.webp',
  // },
]

export function getSongsByCategory(category: SongCategory) {
  return songs.filter(s => s.category === category)
}

export function getSong(category: SongCategory, songId: string) {
  return songs.find(s => s.category === category && s.id === songId) || null
}

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
