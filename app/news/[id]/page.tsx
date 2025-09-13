import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
// Route-level loader is handled by app/news/(index)/loading.tsx for the index route

const NewsDetailClient = dynamic(() => import('@/components/news/news-detail'))

type NewsItem = {
  id?: string
  slug: string
  title: string
  author: string
  date: string
  image: string
  tags?: string[]
  status?: string
  views?: number
  content?: string
}

async function getBaseUrl() {
  const h = await headers()
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('host') ?? 'localhost:3000'
  return `${proto}://${host}`
}

function stripHtml(html?: string) {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function toDescription(text: string, max = 160) {
  if (!text) return ''
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim() + '…'
}

async function fetchNews(slug: string): Promise<NewsItem | undefined> {
  try {
    const base = await getBaseUrl()
    const res = await fetch(`${base}/api/news/${slug}`, { cache: 'no-store' })
    if (res.ok) return (await res.json()) as NewsItem
  } catch {}
  // No fallback to sample data; return undefined on failure
  return undefined
}

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const item = await fetchNews(params.id)
  const slug = item?.slug || params.id
  const description = toDescription(
    stripHtml(item?.content) || item?.title || '',
  )

  const canonical = `/news/${slug}`
  const title = item?.title
    ? `${item.title} | News`
    : 'News Article | FFWPU Philippines'

  const publishedTime = item?.date
    ? new Date(item.date).toISOString()
    : undefined

  return {
    title,
    description,
    alternates: { canonical },
    robots: {
      index: item?.status !== 'draft',
      follow: true,
    },
    openGraph: {
      type: 'article',
      url: canonical,
      title,
      description,
      authors: item?.author ? [item.author] : undefined,
      publishedTime,
      tags: item?.tags,
      images: item?.image
        ? [
            {
              url: item.image,
              alt: item.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: item?.image ? [item.image] : undefined,
    },
    category: 'news',
  }
}

async function NewsJsonLd({ slug }: { slug: string }) {
  const base = await getBaseUrl()
  const item = await fetchNews(slug)
  if (!item) return null
  const url = `${base}/news/${item.slug || slug}`
  const imageUrl = item.image?.startsWith('http')
    ? item.image
    : `${base}${item.image}`
  const description = toDescription(stripHtml(item.content) || item.title || '')
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: item.title,
    description,
    image: [imageUrl],
    datePublished: item.date,
    dateModified: item.date,
    author: item.author
      ? {
          '@type': 'Person',
          name: item.author,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'FFWPU Philippines',
      logo: {
        '@type': 'ImageObject',
        url: `${base}/ffwpu-ph-logo.png`,
      },
    },
  }
  return (
    <script
      type='application/ld+json'
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default function Page({ params }: { params: { id: string } }) {
  const slug = params.id
  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <main className='flex-1'>
        {/* Structured data for SEO */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <NewsJsonLd slug={slug} />
        <NewsDetailClient />
      </main>
    </div>
  )
}
