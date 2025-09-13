import type React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | FFWPU Philippines',
  description:
    'Contact FFWPU Philippines. Reach our national headquarters for inquiries, events, and community support.',
  alternates: { canonical: '/contact' },
  openGraph: {
    url: '/contact',
    title: 'Contact | FFWPU Philippines',
    description:
      'Contact FFWPU Philippines. Reach our national headquarters for inquiries, events, and community support.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}

