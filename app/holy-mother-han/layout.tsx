import type React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Holy Mother Han | FFWPU Philippines',
  description:
    'Learn about Holy Mother Dr. Hak Ja Han Moon and her global ministry for peace and families.',
  alternates: { canonical: '/holy-mother-han' },
  openGraph: {
    url: '/holy-mother-han',
    title: 'Holy Mother Han | FFWPU Philippines',
    description:
      'Learn about Holy Mother Dr. Hak Ja Han Moon and her global ministry for peace and families.',
  },
}

export default function HolyMotherHanLayout({ children }: { children: React.ReactNode }) {
  return children
}

