"use client"

import { usePathname } from 'next/navigation'
import { Footer } from '@/components/layout/footer'
import UnderConstruction from '@/components/under-construction'
import { ConditionalUpcomingEvents } from '@/components/home/conditional-upcoming-events'
import { Header } from './header'

type Props = {
  isUnderConstruction: boolean
  children: React.ReactNode
}

export function SiteShell({ isUnderConstruction, children }: Props) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  // For admin routes, render children without the public site chrome
  if (isAdmin) return <>{children}</>

  if (isUnderConstruction) return <UnderConstruction />

  return (
    <>
      <Header />
      {children}
      <ConditionalUpcomingEvents />
      <Footer />
    </>
  )
}
