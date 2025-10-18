import React from 'react'
import { MusicPlayerProvider } from '@/context/MusicPlayerContext'

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return (
    <MusicPlayerProvider>
      {children}
    </MusicPlayerProvider>
  )
}
