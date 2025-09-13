import type React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | FFWPU Philippines',
  description:
    'Learn about FFWPU Philippines: mission, leadership, and our work to build peace, love, and unity.',
  alternates: { canonical: '/about' },
  openGraph: {
    url: '/about',
    title: 'About | FFWPU Philippines',
    description:
      'Learn about FFWPU Philippines: mission, leadership, and our work to build peace, love, and unity.',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}

