import type { SongMeta } from '@/data/music-songs'

const DEFAULT_COVER = '/holy-songs.jpg'

function stableHash(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

export function getSongCover(song: Pick<SongMeta, 'id' | 'category' | 'cover'>) {
  if (song.category === 'holy-songs') {
    return `https://loremflickr.com/400/400/flower?lock=${stableHash(song.id)}`
  }

  if (!song.cover || song.cover.includes('placeholder')) return DEFAULT_COVER
  return song.cover
}

export { DEFAULT_COVER }
