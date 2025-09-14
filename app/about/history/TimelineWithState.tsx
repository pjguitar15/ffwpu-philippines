"use client"

import { useState } from 'react'
import { Timeline } from './Timeline'
import { TimelineItem } from '@/constants/history.constants'

export function TimelineWithState({ timeline }: { timeline: TimelineItem[] }) {
  const [forceYear, setForceYear] = useState<string | null>(null)
  return (
    <Timeline
      timeline={timeline}
      forceYear={forceYear}
      setForceYear={setForceYear}
    />
  )
}
