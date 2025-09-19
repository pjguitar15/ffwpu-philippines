import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ffwpuph.com'

type NewsItem = { slug: string; date?: string; modifiedDate?: string }
type EventItem = { slug: string; date?: string; id?: string }

// Static pages with priorities and change frequencies
const staticPages = [
  { path: '', priority: 1.0, changeFrequency: 'daily' as const },
  { path: '/about', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/news', priority: 0.9, changeFrequency: 'daily' as const },
  {
    path: '/hj-media-works',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    path: '/hj-testimonies',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    path: '/about/history',
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  },
  {
    path: '/about/true-parents',
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  },
  {
    path: '/messages/regional-director',
    priority: 0.6,
    changeFrequency: 'monthly' as const,
  },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date()

  // Static routes with enhanced metadata
  const staticRoutes: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${siteUrl}${page.path}`,
    lastModified: currentDate,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  // Dynamic news articles
  let dynamicNews: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${siteUrl}/api/news`, {
      next: { revalidate: 300 },
      headers: { 'User-Agent': 'Sitemap Generator' },
    })
    if (res.ok) {
      const items = (await res.json()) as NewsItem[]
      dynamicNews = items.map((n) => ({
        url: `${siteUrl}/news/${n.slug}`,
        lastModified: n.modifiedDate
          ? new Date(n.modifiedDate)
          : n.date
          ? new Date(n.date)
          : currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.error('Failed to fetch news for sitemap:', error)
  }

  // Dynamic events (if available)
  let dynamicEvents: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${siteUrl}/api/events`, {
      next: { revalidate: 300 },
      headers: { 'User-Agent': 'Sitemap Generator' },
    })
    if (res.ok) {
      const items = (await res.json()) as EventItem[]
      dynamicEvents = items.map((event) => ({
        url: `${siteUrl}/events/${event.slug || event.id}`,
        lastModified: event.date ? new Date(event.date) : currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    // Events API might not exist yet, that's okay
    console.log('Events API not available for sitemap')
  }

  return [...staticRoutes, ...dynamicNews, ...dynamicEvents]
}
