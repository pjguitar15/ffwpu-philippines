'use client'

import { useEffect } from 'react'
import type { PageMetadataConfig } from '@/lib/metadata'

interface ClientMetadataProps {
  config: PageMetadataConfig
}

export function ClientMetadata({ config }: ClientMetadataProps) {
  useEffect(() => {
    // Update document title
    if (config.title) {
      document.title = `${config.title} | FFWPU Philippines`
    }

    // Update meta description
    if (config.description) {
      let metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.setAttribute('name', 'description')
        document.head.appendChild(metaDescription)
      }
      metaDescription.setAttribute('content', config.description)
    }

    // Update meta keywords
    if (config.keywords && config.keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]')
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta')
        metaKeywords.setAttribute('name', 'keywords')
        document.head.appendChild(metaKeywords)
      }
      const defaultKeywords = [
        'FFWPU Philippines',
        'Family Federation for World Peace and Unification',
        'True Parents',
        'Rev. Sun Myung Moon',
        'Hak Ja Han Moon',
        'Holy Mother Han',
        'Unification Church Philippines',
        'Peace',
        'Unity',
        'World Peace',
      ]
      const allKeywords = [...defaultKeywords, ...config.keywords]
      metaKeywords.setAttribute('content', allKeywords.join(', '))
    }

    // Update Open Graph meta tags
    const updateOGMeta = (property: string, content: string) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`)
      if (!metaTag) {
        metaTag = document.createElement('meta')
        metaTag.setAttribute('property', property)
        document.head.appendChild(metaTag)
      }
      metaTag.setAttribute('content', content)
    }

    if (config.title) {
      updateOGMeta('og:title', `${config.title} | FFWPU Philippines`)
    }
    if (config.description) {
      updateOGMeta('og:description', config.description)
    }
    if (config.image) {
      updateOGMeta('og:image', config.image)
    }
    updateOGMeta('og:type', config.type || 'website')

    // Update Twitter Card meta tags
    const updateTwitterMeta = (name: string, content: string) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`)
      if (!metaTag) {
        metaTag = document.createElement('meta')
        metaTag.setAttribute('name', name)
        document.head.appendChild(metaTag)
      }
      metaTag.setAttribute('content', content)
    }

    updateTwitterMeta('twitter:card', 'summary_large_image')
    if (config.title) {
      updateTwitterMeta('twitter:title', `${config.title} | FFWPU Philippines`)
    }
    if (config.description) {
      updateTwitterMeta('twitter:description', config.description)
    }
    if (config.image) {
      updateTwitterMeta('twitter:image', config.image)
    }

    // Update robots meta tag
    if (config.noIndex) {
      let robotsMeta = document.querySelector('meta[name="robots"]')
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta')
        robotsMeta.setAttribute('name', 'robots')
        document.head.appendChild(robotsMeta)
      }
      robotsMeta.setAttribute('content', 'noindex, nofollow')
    }
  }, [config])

  return null // This component doesn't render anything
}