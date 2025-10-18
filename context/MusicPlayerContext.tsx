"use client"
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { SongMeta, songs } from '@/data/music-songs'

interface MusicPlayerContextValue {
  current: SongMeta | null
  queue: SongMeta[]
  playing: boolean
  volume: number
  progress: number // seconds progressed (simulated)
  favorites: Set<string>
  playSong: (song: SongMeta, addToQueue?: boolean) => void
  togglePlay: () => void
  next: () => void
  prev: () => void
  addToQueue: (song: SongMeta) => void
  removeFromQueue: (id: string) => void
  seek: (seconds: number) => void
  setVolume: (v: number) => void
  toggleFavorite: (id: string) => void
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | undefined>(undefined)

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<SongMeta | null>(null)
  const [queue, setQueue] = useState<SongMeta[]>([])
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [progress, setProgress] = useState(0)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const progressRef = useRef<number>(0)
  const rafRef = useRef<number | null>(null)

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('musicFavorites')
    if (stored) {
      setFavorites(new Set(JSON.parse(stored)))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('musicFavorites', JSON.stringify(Array.from(favorites)))
  }, [favorites])

  // Simulate progress
  useEffect(() => {
    if (playing && current) {
      const tick = () => {
        progressRef.current += 1
        if (progressRef.current >= current.durationSec) {
          progressRef.current = 0
          next()
        }
        setProgress(progressRef.current)
        rafRef.current = window.setTimeout(tick, 1000)
      }
      tick()
      return () => {
        if (rafRef.current) window.clearTimeout(rafRef.current)
      }
    } else {
      if (rafRef.current) window.clearTimeout(rafRef.current)
    }
  }, [playing, current])

  const playSong = (song: SongMeta, addToQueue: boolean = false) => {
    setCurrent(song)
    progressRef.current = 0
    setProgress(0)
    setPlaying(true)
    if (addToQueue) {
      setQueue(q => q.concat(song))
    }
    // analytics stub
    const played = JSON.parse(localStorage.getItem('songsPlayed') || '[]') as string[]
    played.push(song.id)
    localStorage.setItem('songsPlayed', JSON.stringify(played.slice(-200)))
  }

  const togglePlay = () => setPlaying(p => !p)

  const next = () => {
    if (!current) return
    const idx = queue.findIndex(s => s.id === current.id)
    const nextSong = idx >= 0 && idx < queue.length - 1 ? queue[idx + 1] : null
    if (nextSong) {
      playSong(nextSong)
    } else {
      setPlaying(false)
    }
  }

  const prev = () => {
    if (!current) return
    const idx = queue.findIndex(s => s.id === current.id)
    const prevSong = idx > 0 ? queue[idx - 1] : null
    if (prevSong) {
      playSong(prevSong)
    }
  }

  const addToQueue = (song: SongMeta) => {
    setQueue(q => q.concat(song))
  }

  const removeFromQueue = (id: string) => {
    setQueue(q => q.filter(s => s.id !== id))
  }

  const seek = (seconds: number) => {
    progressRef.current = Math.max(0, Math.min(seconds, current?.durationSec || 0))
    setProgress(progressRef.current)
  }

  const toggleFavorite = (id: string) => {
    setFavorites(f => {
      const copy = new Set(f)
      if (copy.has(id)) {
        copy.delete(id)
      } else {
        copy.add(id)
      }
      return copy
    })
  }

  const value: MusicPlayerContextValue = {
    current,
    queue,
    playing,
    volume,
    progress,
    favorites,
    playSong,
    togglePlay,
    next,
    prev,
    addToQueue,
    removeFromQueue,
    seek,
    setVolume,
    toggleFavorite,
  }

  return <MusicPlayerContext.Provider value={value}>{children}</MusicPlayerContext.Provider>
}

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext)
  if (!ctx) throw new Error('useMusicPlayer must be used within MusicPlayerProvider')
  return ctx
}
