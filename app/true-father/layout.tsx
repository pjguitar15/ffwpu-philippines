import type React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'True Father | FFWPU Philippines',
  description:
    'Discover the life and teachings of Rev. Sun Myung Moon (True Father) and his vision for world peace.',
  alternates: { canonical: '/true-father' },
  openGraph: {
    url: '/true-father',
    title: 'True Father | FFWPU Philippines',
    description:
      'Discover the life and teachings of Rev. Sun Myung Moon (True Father) and his vision for world peace.',
  },
}

export default function TrueFatherLayout({ children }: { children: React.ReactNode }) {
  return children
}

