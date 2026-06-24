import 'server-only'

import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import mongoose from 'mongoose'
import { dbConnect } from '@/lib/db'
import { News } from '@/models/News'

export type PublicNewsItem = {
  id: string
  slug: string
  title: string
  subtitle?: string
  author: string
  date: string
  image: string
  gallery: string[]
  tags: string[]
  status: 'published'
  views: number
  likes: number
  content: string
  comments: unknown[]
  testimonials: Array<{
    name: string
    role?: string
    avatar?: string
    quote: string
  }>
  createdAt?: string
  updatedAt?: string
}

export type NewsSitemapEntry = {
  slug: string
  date?: string
  updatedAt?: string
}

const publishedMatch = {
  $or: [{ status: { $exists: false } }, { status: 'published' }],
}

function serializeNews(doc: any): PublicNewsItem {
  return {
    id: String(doc._id),
    slug: String(doc.slug),
    title: String(doc.title),
    subtitle: doc.subtitle ? String(doc.subtitle) : '',
    author: String(doc.author),
    date: String(doc.date),
    image: String(doc.image),
    gallery: Array.isArray(doc.gallery) ? doc.gallery.map(String) : [],
    tags: Array.isArray(doc.tags) ? doc.tags.map(String) : [],
    status: 'published',
    views: Number(doc.views || 0),
    likes: Number(doc.likes || 0),
    content: String(doc.content || ''),
    comments: [],
    testimonials: Array.isArray(doc.testimonials)
      ? doc.testimonials.map((item: any) => ({
          name: String(item.name || ''),
          role: item.role ? String(item.role) : undefined,
          avatar: item.avatar ? String(item.avatar) : undefined,
          quote: String(item.quote || ''),
        }))
      : [],
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : undefined,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
  }
}

const getCachedPublishedNews = unstable_cache(
  async (idOrSlug: string): Promise<PublicNewsItem | null> => {
    await dbConnect()

    const identifier = decodeURIComponent(idOrSlug)
    const identityMatch = mongoose.Types.ObjectId.isValid(identifier)
      ? { $or: [{ _id: identifier }, { slug: identifier }] }
      : { slug: identifier }

    const doc = await News.findOne({
      $and: [identityMatch, publishedMatch],
    }).lean()

    return doc ? serializeNews(doc) : null
  },
  ['published-news-by-id-or-slug'],
  {
    revalidate: 300,
    tags: ['published-news'],
  },
)

export const getPublishedNews = cache(getCachedPublishedNews)

export const getPublishedNewsSitemapEntries = unstable_cache(
  async (): Promise<NewsSitemapEntry[]> => {
    await dbConnect()

    const docs = await News.find(publishedMatch)
      .select('slug date updatedAt')
      .sort({ date: -1 })
      .lean()

    return docs.map((doc: any) => ({
      slug: String(doc.slug),
      date: doc.date ? String(doc.date) : undefined,
      updatedAt: doc.updatedAt
        ? new Date(doc.updatedAt).toISOString()
        : undefined,
    }))
  },
  ['published-news-sitemap'],
  {
    revalidate: 300,
    tags: ['published-news'],
  },
)
