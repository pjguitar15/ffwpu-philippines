import type React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'True Parents | FFWPU Philippines',
  description:
    'Learn about True Parents — Rev. Sun Myung Moon and Dr. Hak Ja Han Moon — and their life and teachings.',
  alternates: { canonical: '/about/true-parents' },
  openGraph: {
    url: '/about/true-parents',
    title: 'True Parents | FFWPU Philippines',
    description:
      'Learn about True Parents — Rev. Sun Myung Moon and Dr. Hak Ja Han Moon — and their life and teachings.',
  },
}

export default function TrueParentsLayout({ children }: { children: React.ReactNode }) {
  return children
}

