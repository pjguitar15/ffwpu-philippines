import { NextRequest, NextResponse } from 'next/server'
import { News } from '@/models/News'
import { dbConnect } from '@/lib/db'
import mongoose from 'mongoose'

async function findByIdOrSlug(idOrSlug: string) {
  // Only try ObjectId lookup if the value is a valid ObjectId to avoid CastError
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    const byId = await News.findById(idOrSlug)
    if (byId) return byId
  }
  return News.findOne({ slug: idOrSlug })
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const { id } = params
    
    // Find the article by ID or slug
    const article = await findByIdOrSlug(id)
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    // Only increment views for published articles
    if (article.status !== 'published') {
      return NextResponse.json(
        { error: 'Article not published' },
        { status: 400 }
      )
    }
    
    // Increment the view count
    article.views = (article.views || 0) + 1
    await article.save()
    
    return NextResponse.json({ 
      success: true, 
      views: article.views 
    })
  } catch (error) {
    console.error('Error incrementing views:', error)
    return NextResponse.json(
      { error: 'Failed to increment views' },
      { status: 500 }
    )
  }
}
