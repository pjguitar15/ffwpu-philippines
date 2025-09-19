// Advanced SEO Structured Data for FFWPU Philippines
// This utility generates JSON-LD structured data to help search engines understand content

const baseUrl = 'https://ffwpuph.com'
const siteName = 'FFWPU Philippines'

export interface StructuredDataSchema {
  '@context': string
  '@type': string
  '@id'?: string
  [key: string]: any
}

// Organization Schema for FFWPU Philippines
export const organizationSchema: StructuredDataSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${baseUrl}#organization`,
  name: 'Family Federation for World Peace and Unification Philippines',
  alternateName: 'FFWPU Philippines',
  url: baseUrl,
  logo: {
    '@type': 'ImageObject',
    '@id': `${baseUrl}#logo`,
    url: `${baseUrl}/ffwpu-ph-logo.png`,
    contentUrl: `${baseUrl}/ffwpu-ph-logo.png`,
    width: 400,
    height: 400,
    caption: 'FFWPU Philippines Logo'
  },
  image: {
    '@type': 'ImageObject',
    '@id': `${baseUrl}#image`,
    url: `${baseUrl}/ffwpu-ph-logo.png`,
    contentUrl: `${baseUrl}/ffwpu-ph-logo.png`,
    width: 1200,
    height: 630,
    caption: 'FFWPU Philippines'
  },
  description: 'Official website of the Family Federation for World Peace and Unification Philippines. Join us in building a world of peace, love, and unity through the teachings of True Parents.',
  founder: [
    {
      '@type': 'Person',
      '@id': `${baseUrl}#founder-sun-myung-moon`,
      name: 'Rev. Sun Myung Moon',
      alternateName: 'True Father',
      description: 'Founder of the Family Federation for World Peace and Unification'
    },
    {
      '@type': 'Person',
      '@id': `${baseUrl}#founder-hak-ja-han`,
      name: 'Hak Ja Han Moon',
      alternateName: ['True Mother', 'Holy Mother Han'],
      description: 'Co-founder of the Family Federation for World Peace and Unification'
    }
  ],
  sameAs: [
    'https://www.facebook.com/ffwpuphilippines',
    'https://www.instagram.com/ffwpuphilippines',
    'https://twitter.com/ffwpuphilippines'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+63-2-8123-4567',
    contactType: 'customer service',
    availableLanguage: ['English', 'Filipino']
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'PH',
    addressRegion: 'Metro Manila',
    addressLocality: 'Manila',
    streetAddress: 'FFWPU Philippines Headquarters'
  }
}

// Website Schema
export const websiteSchema: StructuredDataSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${baseUrl}#website`,
  url: baseUrl,
  name: siteName,
  description: 'Official website of the Family Federation for World Peace and Unification Philippines',
  publisher: {
    '@id': `${baseUrl}#organization`
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${baseUrl}/search?q={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  },
  inLanguage: 'en-PH'
}

// Article Schema Generator
export function generateArticleSchema(article: {
  id: string
  title: string
  content: string
  author: string
  publishedDate: string
  modifiedDate?: string
  image?: string
  tags?: string[]
  category?: string
}): StructuredDataSchema {
  const articleUrl = `${baseUrl}/news/${article.id}`
  const imageUrl = article.image ? (article.image.startsWith('http') ? article.image : `${baseUrl}${article.image}`) : `${baseUrl}/ffwpu-ph-logo.png`
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${articleUrl}#article`,
    headline: article.title,
    description: article.content.substring(0, 160).replace(/<[^>]*>/g, '').trim() + (article.content.length > 160 ? '...' : ''),
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630
    },
    author: {
      '@type': 'Person',
      name: article.author,
      url: `${baseUrl}/authors/${article.author.toLowerCase().replace(/\s+/g, '-')}`
    },
    publisher: {
      '@id': `${baseUrl}#organization`
    },
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl
    },
    url: articleUrl,
    articleSection: article.category || 'News',
    keywords: article.tags?.join(', ') || '',
    inLanguage: 'en-PH'
  }
}

// Event Schema Generator
export function generateEventSchema(event: {
  id: string
  name: string
  description: string
  startDate: string
  endDate?: string
  location?: string
  image?: string
  organizer?: string
}): StructuredDataSchema {
  const eventUrl = `${baseUrl}/events/${event.id}`
  const imageUrl = event.image ? (event.image.startsWith('http') ? event.image : `${baseUrl}${event.image}`) : `${baseUrl}/ffwpu-ph-logo.png`
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${eventUrl}#event`,
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630
    },
    organizer: {
      '@type': 'Organization',
      name: event.organizer || 'FFWPU Philippines',
      '@id': `${baseUrl}#organization`
    },
    location: event.location ? {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'PH'
      }
    } : undefined,
    url: eventUrl,
    inLanguage: 'en-PH'
  }
}

// Person Schema Generator (for True Parents and leadership)
export function generatePersonSchema(person: {
  id: string
  name: string
  alternateName?: string[]
  description: string
  image?: string
  birthDate?: string
  nationality?: string
  role?: string
}): StructuredDataSchema {
  const personUrl = `${baseUrl}/leadership/${person.id}`
  const imageUrl = person.image ? (person.image.startsWith('http') ? person.image : `${baseUrl}${person.image}`) : `${baseUrl}/ffwpu-ph-logo.png`
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${personUrl}#person`,
    name: person.name,
    alternateName: person.alternateName,
    description: person.description,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 400,
      height: 400
    },
    birthDate: person.birthDate,
    nationality: person.nationality,
    jobTitle: person.role,
    affiliation: {
      '@id': `${baseUrl}#organization`
    },
    url: personUrl
  }
}

// Breadcrumb Schema Generator
export function generateBreadcrumbSchema(breadcrumbs: ReadonlyArray<{
  readonly name: string
  readonly url: string
}>): StructuredDataSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${baseUrl}${crumb.url}`
    }))
  }
}

// FAQ Schema Generator
export function generateFAQSchema(faqs: Array<{
  question: string
  answer: string
}>): StructuredDataSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

// Utility to inject structured data into pages
export function injectStructuredData(schemas: StructuredDataSchema[]): string {
  return schemas.map(schema => 
    `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`
  ).join('\n')
}

// Pre-configured schemas for common pages
export const commonSchemas = {
  home: [organizationSchema, websiteSchema],
  organization: [organizationSchema],
  website: [websiteSchema]
}

// Utility to get structured data for any page
export function getPageStructuredData(pageType: keyof typeof commonSchemas, additionalSchemas: StructuredDataSchema[] = []): StructuredDataSchema[] {
  return [...(commonSchemas[pageType] || []), ...additionalSchemas]
}