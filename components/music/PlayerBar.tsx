"use client"
import React, { useEffect } from 'react'
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2, FiHeart } from 'react-icons/fi'
import { useMusicPlayer } from '@/context/MusicPlayerContext'
import { formatDuration } from '@/data/music-songs'

export function PlayerBar() {
  const { current, playing, togglePlay, next, prev, volume, setVolume, progress, seek, favorites, toggleFavorite } = useMusicPlayer()

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      switch (e.key) {
        case ' ': // play/pause
          e.preventDefault(); togglePlay(); break
        case 'ArrowRight':
          seek(progress + 5); break
        case 'ArrowLeft':
          seek(Math.max(0, progress - 5)); break
        case 'ArrowUp':
          prev(); break
        case 'ArrowDown':
          next(); break
        case 'f':
          if (current) toggleFavorite(current.id); break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [togglePlay, seek, progress, prev, next, current, toggleFavorite])

  const percent = current ? (progress / current.durationSec) * 100 : 0
  const isFav = current ? favorites.has(current.id) : false

  return (
    <div className="sticky bottom-0 w-full border-t bg-white/95 backdrop-blur flex items-center gap-6 px-6 py-4 shadow-sm">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <button
          type="button"
          className="h-11 w-11 flex items-center justify-center rounded-full bg-slate-900 text-white hover:scale-105 transition-transform"
          aria-label={playing ? 'Pause' : 'Play'}
          onClick={togglePlay}
        >
          {playing ? <FiPause className="h-5 w-5" /> : <FiPlay className="h-5 w-5" />}
        </button>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium truncate">{current ? current.title : 'No song selected'}</span>
          <span className="text-[11px] text-slate-500 truncate">{current ? `${current.artist} • ${current.album}` : 'Select a song to start playback.'}</span>
        </div>
        {current && (
          <button
            onClick={() => toggleFavorite(current.id)}
            aria-label={isFav ? 'Unfavorite' : 'Favorite'}
            className="h-9 w-9 flex items-center justify-center rounded-md border bg-white hover:bg-pink-50 text-pink-600"
          >
            <FiHeart className={isFav ? 'fill-pink-600 text-pink-600 h-4 w-4' : 'h-4 w-4'} />
          </button>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <button className="h-9 w-9 flex items-center justify-center rounded-md bg-slate-100 hover:bg-slate-200" aria-label="Previous" onClick={prev}>
            <FiSkipBack className="h-4 w-4" />
          </button>
          <button className="h-9 w-9 flex items-center justify-center rounded-md bg-slate-100 hover:bg-slate-200" aria-label="Next" onClick={next}>
            <FiSkipForward className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="hidden md:flex flex-col w-[360px] gap-1">
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>{formatDuration(Math.floor(progress))}</span>
          <span>{current ? formatDuration(current.durationSec) : '0:00'}</span>
        </div>
        <div className="relative h-2 rounded-full bg-slate-200 overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 to-rose-600" style={{ width: `${percent}%` }} />
          {current && (
            <input
              type="range"
              min={0}
              max={current.durationSec}
              value={progress}
              onChange={(e) => seek(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              aria-label="Seek"
            />
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 w-40">
        <FiVolume2 className="h-5 w-5 text-slate-500" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          aria-label="Volume"
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  )
}
