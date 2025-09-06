import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { YouTubeVideo } from '@/models/YouTubeVideo'
import mongoose from 'mongoose'
import { recordAudit } from '@/lib/audit'

// Helper function to extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  // If it's already just a video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url
  }
  
  return null
}

// Helper function to generate thumbnail URL
function generateThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params
    
    console.log('GET request for video ID:', id)
    console.log('Is valid ObjectId:', mongoose.Types.ObjectId.isValid(id))
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId format')
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }
    
    // Convert string ID to ObjectId for querying
    const objectId = new mongoose.Types.ObjectId(id)
    const video = await YouTubeVideo.findById(objectId).lean()
    console.log('Found video:', video ? 'YES' : 'NO')
    
    if (!video) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    return NextResponse.json(video)
  } catch (error) {
    console.error('Error in GET /api/youtube-videos/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect()
    const { id } = params
    const body = await req.json()
    
    console.log('PUT request for video ID:', id)
    console.log('Request body:', body)
    console.log('Is valid ObjectId:', mongoose.Types.ObjectId.isValid(id))
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId format')
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }
    
    const updateData: any = { ...body }
    
    // If videoUrl is provided, extract new videoId and update thumbnail
    if (body.videoUrl) {
      const videoId = extractVideoId(body.videoUrl)
      if (!videoId) {
        return NextResponse.json(
          { error: 'Invalid YouTube URL' },
          { status: 400 }
        )
      }
      
      // Check if another video with this videoId exists
      const existingVideo = await YouTubeVideo.findOne({ 
        videoId, 
        _id: { $ne: new mongoose.Types.ObjectId(id) } 
      })
      if (existingVideo) {
        return NextResponse.json(
          { error: 'Video already exists' },
          { status: 400 }
        )
      }
      
      updateData.videoId = videoId
      updateData.thumbnailUrl = generateThumbnailUrl(videoId)
      delete updateData.videoUrl
    }
    
    console.log('Update data:', updateData)
    
    // Convert string ID to ObjectId for querying
    const objectId = new mongoose.Types.ObjectId(id)
    const updated = await YouTubeVideo.findByIdAndUpdate(
      objectId, 
      { $set: updateData }, 
      { new: true, runValidators: true }
    ).lean()
    
    console.log('Updated video:', updated ? 'YES' : 'NO')
    
    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    // Audit log
    try {
      recordAudit({
        action: 'Updated',
        resourceType: 'youtube-video',
        resourceId: String(updated._id),
        details: `Updated YouTube video: ${updated.title}`,
      })
    } catch {}
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating YouTube video:', error)
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect()
    const { id } = params
    
    console.log('DELETE request for video ID:', id)
    console.log('Is valid ObjectId:', mongoose.Types.ObjectId.isValid(id))
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId format')
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }
    
    // Convert string ID to ObjectId for querying
    const objectId = new mongoose.Types.ObjectId(id)
    const before = await YouTubeVideo.findById(objectId).lean()
    console.log('Video found before delete:', before ? 'YES' : 'NO')
    
    if (!before) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    await YouTubeVideo.findByIdAndDelete(objectId)
    console.log('Video deleted successfully')
    
    // Audit log
    try {
      recordAudit({
        action: 'Deleted',
        resourceType: 'youtube-video',
        resourceId: String(before._id),
        details: `Deleted YouTube video: ${before.title}`,
      })
    } catch {}
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting YouTube video:', error)
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    )
  }
}
