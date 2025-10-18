import type React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'History | FFWPU Philippines',
  description:
    'Explore the historical milestones of FFWPU Philippines and our journey of faith and service.',
  alternates: { canonical: '/about/history' },
  openGraph: {
    url: '/about/history',
    title: 'History | FFWPU Philippines',
    description:
      'Explore the historical milestones of FFWPU Philippines and our journey of faith and service.',
  },
}

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children
}

