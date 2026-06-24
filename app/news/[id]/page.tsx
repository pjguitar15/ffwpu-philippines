import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import NewsDetailClient from '@/components/news/news-detail'
import { getPublishedNews, type PublicNewsItem } from '@/lib/news'
import { excerptFromHtml } from '@/lib/text'

export const revalidate = 300

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://ffwpuph.com'
).replace(/\/+$/, '')

function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  return `${siteUrl}/${pathOrUrl.replace(/^\/+/, '')}`
}

function validIsoDate(value?: string) {
  if (!value) return undefined
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? undefined : new Date(timestamp).toISOString()
}

function articleDescription(item: PublicNewsItem) {
  return excerptFromHtml(item.subtitle || item.content || item.title, 160)
}

function articleJsonLd(item: PublicNewsItem) {
  const articleUrl = `${siteUrl}/news/${item.slug}`
  const published = validIsoDate(item.date)
  const modified = validIsoDate(item.updatedAt) || published

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NewsArticle',
        '@id': `${articleUrl}#article`,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': articleUrl,
        },
        headline: item.title,
        description: articleDescription(item),
        image: [absoluteUrl(item.image)],
        datePublished: published,
        dateModified: modified,
        author: {
          '@type': 'Person',
          name: item.author,
        },
        publisher: {
          '@type': 'Organization',
          '@id': `${siteUrl}/#organization`,
          name: 'FFWPU Philippines',
          url: siteUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/ffwpu-ph-logo.png`,
          },
        },
        articleSection: 'News',
        keywords: item.tags.join(', '),
        inLanguage: 'en-PH',
        url: articleUrl,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${articleUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'News',
            item: `${siteUrl}/news`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: item.title,
            item: articleUrl,
          },
        ],
      },
    ],
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const item = await getPublishedNews(id)

  if (!item) {
    return {
      title: 'News Article Not Found | FFWPU Philippines',
      robots: { index: false, follow: false },
    }
  }

  const canonical = `/news/${item.slug}`
  const title = `${item.title} | FFWPU Philippines`
  const description = articleDescription(item)
  const publishedTime = validIsoDate(item.date)
  const modifiedTime = validIsoDate(item.updatedAt)
  const image = absoluteUrl(item.image)

  return {
    title,
    description,
    authors: [{ name: item.author }],
    publisher: 'Family Federation for World Peace and Unification Philippines',
    keywords: item.tags,
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type: 'article',
      locale: 'en_PH',
      siteName: 'FFWPU Philippines',
      url: canonical,
      title,
      description,
      authors: [item.author],
      publishedTime,
      modifiedTime,
      tags: item.tags,
      images: [
        {
          url: image,
          alt: item.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    category: 'news',
  }
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = await getPublishedNews(id)

  if (!item) notFound()
  if (id !== item.slug) permanentRedirect(`/news/${item.slug}`)

  const jsonLd = JSON.stringify(articleJsonLd(item)).replace(/</g, '\\u003c')

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <NewsDetailClient initialItem={item} />
    </>
  )
}
