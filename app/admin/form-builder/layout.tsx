import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Form Builder | FFWPU Philippines Admin',
  description: 'Create and manage interactive forms for the FFWPU Philippines website',
}

export default function FormBuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}