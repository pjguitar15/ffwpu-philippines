'use client'

import { usePathname } from 'next/navigation'
import { UpcomingEventsSection } from '@/components/home/upcoming-events-section'

export function ConditionalUpcomingEvents() {
  const pathname = usePathname()
  const hideOnPaths =['/', '/about']
  if (hideOnPaths.includes(pathname)) return null // hide on specified paths
  return <UpcomingEventsSection /> // show everywhere else
}
