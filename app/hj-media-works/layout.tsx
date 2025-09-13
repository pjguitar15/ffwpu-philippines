import type React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HJ Media Works | FFWPU Philippines',
  description:
    'Watch and explore HJ Media Works — testimonies, events, and inspirational content from FFWPU Philippines.',
  alternates: { canonical: '/hj-media-works' },
  openGraph: {
    url: '/hj-media-works',
    title: 'HJ Media Works | FFWPU Philippines',
    description:
      'Watch and explore HJ Media Works — testimonies, events, and inspirational content from FFWPU Philippines.',
  },
}

export default function HJMediaWorksLayout({ children }: { children: React.ReactNode }) {
  return children
}

