import type { MetadataRoute } from 'next'

export const revalidate = 300

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ffwpuph.com'
).replace(/\/+$/, '')

type NewsItem = { slug: string; date?: string; modifiedDate?: string }
type EventItem = { slug?: string; id?: string; date?: string }

const staticPages = [
  // Main pages
  { path: '', priority: 1.0, changeFrequency: 'daily' as const },
  { path: '/about', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/news', priority: 0.9, changeFrequency: 'daily' as const },

  // Core content sections
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
    path: '/true-father',
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  },
  {
    path: '/holy-mother-han',
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  },

  // About section
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

  // Messages section
  {
    path: '/messages',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
  {
    path: '/messages/regional-director',
    priority: 0.6,
    changeFrequency: 'monthly' as const,
  },
]

// Safe join: guarantees exactly one slash between base and path
const joinUrl = (base: string, path: string) =>
  `${base}/${path.replace(/^\/+/, '')}`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = staticPages.map((p) => ({
    url: joinUrl(siteUrl, p.path),
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))

  let dynamicNews: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(joinUrl(siteUrl, '/api/news'), {
      next: { revalidate: 300 },
      headers: { 'User-Agent': 'Sitemap Generator' },
    })
    if (res.ok) {
      const items = (await res.json()) as NewsItem[]
      dynamicNews = items
        .filter((n) => n?.slug) // drop empties
        .map((n) => ({
          url: joinUrl(siteUrl, `/news/${n.slug}`),
          lastModified:
            (n.modifiedDate &&
              !Number.isNaN(Date.parse(n.modifiedDate)) &&
              new Date(n.modifiedDate)) ||
            (n.date && !Number.isNaN(Date.parse(n.date)) && new Date(n.date)) ||
            now,
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }))
    }
  } catch (err) {
    console.error('Failed to fetch news for sitemap:', err)
  }

  let dynamicEvents: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(joinUrl(siteUrl, '/api/events'), {
      next: { revalidate: 300 },
      headers: { 'User-Agent': 'Sitemap Generator' },
    })
    if (res.ok) {
      const items = (await res.json()) as EventItem[]
      dynamicEvents = items
        .map((ev) => ({ slug: ev.slug || ev.id, date: ev.date }))
        .filter((ev) => !!ev.slug) // no 'undefined'
        .map((ev) => ({
          url: joinUrl(siteUrl, `/events/${ev.slug}`),
          lastModified:
            (ev.date &&
              !Number.isNaN(Date.parse(ev.date)) &&
              new Date(ev.date)) ||
            now,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
    }
  } catch {
    // ok if events api isn't live
  }

  // De-dupe by URL
  const all = [...staticRoutes, ...dynamicNews, ...dynamicEvents]
  const dedup = Array.from(new Map(all.map((x) => [x.url, x])).values())

  return dedup
}
