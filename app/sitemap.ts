import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ffwpu-philippines.vercel.app'

type NewsItem = { slug: string; date?: string }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/news',
    '/about',
    '/about/history',
    '/about/true-parents',
    '/contact',
    '/privacy',
    '/terms',
    '/hj-media-works',
    '/hj-testimonies',
  ].map((path) => ({ url: `${siteUrl}${path}` }))

  let dynamicNews: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${siteUrl}/api/news`, { next: { revalidate: 300 } })
    if (res.ok) {
      const items = (await res.json()) as NewsItem[]
      dynamicNews = items.map((n) => ({
        url: `${siteUrl}/news/${n.slug}`,
        lastModified: n.date ? new Date(n.date) : undefined,
      }))
    }
  } catch {}

  return [...staticRoutes, ...dynamicNews]
}
