'use client'

import { useEffect } from 'react'
import { type StructuredDataSchema } from '@/lib/structured-data'

interface StructuredDataProps {
  schemas: StructuredDataSchema[]
}

export function StructuredData({ schemas }: StructuredDataProps) {
  useEffect(() => {
    // Remove existing structured data scripts to avoid duplicates
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"][data-structured-data]')
    existingScripts.forEach(script => script.remove())

    // Add new structured data scripts
    schemas.forEach((schema, index) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-structured-data', `schema-${index}`)
      script.textContent = JSON.stringify(schema, null, 2)
      document.head.appendChild(script)
    })

    // Cleanup function to remove scripts when component unmounts
    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"][data-structured-data]')
      scripts.forEach(script => script.remove())
    }
  }, [schemas])

  // This component doesn't render anything visible
  return null
}

// Hook for managing structured data in client components
export function useStructuredData(schemas: StructuredDataSchema[]) {
  useEffect(() => {
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"][data-structured-data]')
    existingScripts.forEach(script => script.remove())

    schemas.forEach((schema, index) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-structured-data', `schema-${index}`)
      script.textContent = JSON.stringify(schema, null, 2)
      document.head.appendChild(script)
    })

    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"][data-structured-data]')
      scripts.forEach(script => script.remove())
    }
  }, [schemas])
}