import type React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HJ Testimonies | FFWPU Philippines',
  description:
    'Stories of faith and family from FFWPU Philippines — watch and read HJ Testimonies.',
  alternates: { canonical: '/hj-testimonies' },
  openGraph: {
    url: '/hj-testimonies',
    title: 'HJ Testimonies | FFWPU Philippines',
    description:
      'Stories of faith and family from FFWPU Philippines — watch and read HJ Testimonies.',
  },
}

export default function HJTestimoniesLayout({ children }: { children: React.ReactNode }) {
  return children
}

