import type { Metadata } from 'next'
import { getPageStructuredData, generateBreadcrumbSchema, type StructuredDataSchema } from './structured-data'

export interface PageMetadataConfig {
  title?: string
  description?: string
  keywords?: readonly string[]
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  authors?: string[]
  section?: string
  tags?: string[]
  noIndex?: boolean
  canonical?: string
  breadcrumbs?: ReadonlyArray<{ readonly name: string; readonly url: string }>
  structuredData?: StructuredDataSchema[]
}

const baseUrl = 'https://ffwpuph.com'
const siteName = 'FFWPU Philippines'
const defaultImage = '/ffwpu-ph-logo.png'

export function generatePageMetadata(config: PageMetadataConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = defaultImage,
    type = 'website',
    publishedTime,
    authors,
    section,
    tags,
    noIndex = false,
    canonical,
    breadcrumbs,
    structuredData,
  } = config

  // Create full title with site name
  const fullTitle = title 
    ? `${title} | ${siteName}`
    : `${siteName} - Family Federation for World Peace and Unification`

  // Default description
  const defaultDescription = 'Official website of the Family Federation for World Peace and Unification Philippines. Join us in building a world of peace, love, and unity through the teachings of True Parents.'
  const metaDescription = description || defaultDescription

  // Combine default keywords with page-specific ones
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
  const allKeywords = [...defaultKeywords, ...(keywords || [])]

  // Generate structured data
  const pageStructuredData = getPageStructuredData('home', structuredData || [])
  if (breadcrumbs) {
    pageStructuredData.push(generateBreadcrumbSchema(breadcrumbs))
  }

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: allKeywords.join(', '),
    authors: authors ? authors.map(name => ({ name })) : [{ name: siteName }],
    creator: siteName,
    publisher: 'Family Federation for World Peace and Unification Philippines',
    robots: {
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type,
      locale: 'en_PH',
      url: baseUrl,
      siteName,
      title: fullTitle,
      description: metaDescription,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || siteName,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        authors,
        section,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      images: [image],
    },
    category: section || 'religion',
    alternates: canonical ? {
      canonical: canonical.startsWith('http') ? canonical : `${baseUrl}${canonical}`
    } : undefined,
    other: {
      // Inject structured data as meta tags for crawlers
      'structured-data': JSON.stringify(pageStructuredData)
    }
  }
}

// Pre-configured metadata for common pages
export const pageMetadataConfigs = {
  home: {
    title: 'Home',
    description:
      'Welcome to FFWPU Philippines. Join us in building a world of peace, love, and unity through the teachings of True Parents - Rev. Sun Myung Moon and Hak Ja Han Moon.',
    keywords: ['home', 'welcome', 'main page'],
    canonical: '/',
  },
  about: {
    title: 'About Us',
    description:
      'Learn about the Family Federation for World Peace and Unification Philippines, our mission, vision, and the teachings of True Parents.',
    keywords: ['about', 'mission', 'vision', 'history', 'organization'],
    canonical: '/about',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'About Us', url: '/about' },
    ],
  },
  contact: {
    title: 'Contact Us',
    description:
      'Get in touch with FFWPU Philippines. Find our contact information, office locations, and ways to connect with our community.',
    keywords: [
      'contact',
      'address',
      'phone',
      'email',
      'location',
      'get in touch',
    ],
    canonical: '/contact',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contact', url: '/contact' },
    ],
  },
  news: {
    title: 'News & Updates',
    description:
      'Stay updated with the latest news, announcements, and activities from FFWPU Philippines and our global community.',
    keywords: ['news', 'updates', 'announcements', 'activities', 'events'],
    section: 'news',
    canonical: '/news',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Updates', url: '/news' },
    ],
  },
  hjMediaWorks: {
    title: 'HJ Media Works',
    description:
      'Discover inspirational content from HJ Media Works, featuring teachings and messages from True Mother Hak Ja Han Moon.',
    keywords: [
      'HJ Media Works',
      'True Mother',
      'Hak Ja Han Moon',
      'media',
      'videos',
      'content',
    ],
    section: 'media',
    canonical: '/hj-media-works',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'HJ Media Works', url: '/hj-media-works' },
    ],
  },
  hjTestimonies: {
    title: 'HJ Testimonies',
    description:
      'Read inspiring testimonies and experiences from members of our global FFWPU community.',
    keywords: ['testimonies', 'experiences', 'stories', 'faith', 'inspiration'],
    section: 'testimonies',
    canonical: '/hj-testimonies',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'HJ Testimonies', url: '/hj-testimonies' },
    ],
  },
  holyMotherHan: {
    title: 'Holy Mother Han',
    description:
      'Learn about Holy Mother Han (Hak Ja Han Moon), True Mother and co-founder of the Family Federation for World Peace and Unification.',
    keywords: [
      'Holy Mother Han',
      'Hak Ja Han Moon',
      'True Mother',
      'biography',
    ],
    canonical: '/holy-mother-han',
  },
  trueFather: {
    title: 'True Father',
    description:
      'Learn about True Father Rev. Sun Myung Moon, founder of the Family Federation for World Peace and Unification.',
    keywords: ['True Father', 'Rev. Sun Myung Moon', 'founder', 'biography'],
    canonical: '/true-father',
  },
  messages: {
    title: 'Messages',
    description:
      'Read important messages and guidance from our church leadership and True Parents.',
    keywords: ['messages', 'guidance', 'leadership', 'teachings'],
    section: 'messages',
    canonical: '/messages',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Messages', url: '/messages' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    description:
      'Read our privacy policy to understand how we collect, use, and protect your personal information.',
    keywords: ['privacy', 'policy', 'data protection', 'personal information'],
    noIndex: true,
    canonical: '/privacy',
  },
  terms: {
    title: 'Terms of Service',
    description:
      'Read our terms of service and conditions for using the FFWPU Philippines website.',
    keywords: ['terms', 'service', 'conditions', 'legal'],
    noIndex: true,
    canonical: '/terms',
  },
  letterToTrueMother: {
    title: 'Letters to True Mother',
    description:
      'Share your heartfelt messages of love, gratitude, and appreciation to our beloved True Mother. Write personal letters expressing your feelings and experiences.',
    keywords: [
      'letters',
      'True Mother',
      'Hak Ja Han Moon',
      'gratitude',
      'love',
      'messages',
      'testimonials',
    ],
    canonical: '/letter-to-true-mother',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Letters to True Mother', url: '/letter-to-true-mother' },
    ],
  },
} as const