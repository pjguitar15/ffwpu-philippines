"use client"

import { usePathname } from 'next/navigation'
import { Footer } from '@/components/layout/footer'
import UnderConstruction from '@/components/under-construction'
import { ConditionalUpcomingEvents } from '@/components/home/conditional-upcoming-events'
import { Header } from './header'
import { NewsletterBanner } from '@/components/home/newsletter-banner'
import { ChurchBranchesSection } from '@/components/home/church-branches-section'

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
      {/* Events first (conditionally), then branches, then newsletter */}
      <ConditionalUpcomingEvents />
      <div className='container mx-auto space-y-16'>
        <ChurchBranchesSection />
      </div>
      <NewsletterBanner />
      <Footer />
    </>
  )
}
