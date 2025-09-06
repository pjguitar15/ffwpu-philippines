import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { YouTubeVideo } from '@/models/YouTubeVideo'
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

export async function GET() {
  try {
    console.log('🔍 YouTube Videos API: GET request received')
    await dbConnect()
    
    // For admin, return all videos. For public, only active ones.
    // We'll return all for now since this is used by admin
    const videos = await YouTubeVideo.find({})
      .sort({ order: 1, createdAt: -1 })
      .lean()
    
    console.log(`📺 Found ${videos.length} videos`)
    
    return NextResponse.json(videos)
  } catch (error) {
    console.error('❌ Error fetching YouTube videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    console.log('🔍 YouTube Videos API: POST request received')
    await dbConnect()
    const body = await req.json()
    const { title, description, videoUrl, order, isActive } = body
    
    console.log('POST request body:', body)
    
    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: 'Title and video URL are required' },
        { status: 400 }
      )
    }
    
    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      )
    }
    
    // Check if video already exists
    const existingVideo = await YouTubeVideo.findOne({ videoId })
    if (existingVideo) {
      return NextResponse.json(
        { error: 'Video already exists' },
        { status: 400 }
      )
    }
    
    const videoData = {
      title,
      description: description || '',
      videoId,
      thumbnailUrl: generateThumbnailUrl(videoId),
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
    }
    
    const video = new YouTubeVideo(videoData)
    await video.save()
    
    console.log(`📺 Created new video: ${title} (${videoId})`)
    
    // Audit log
    try {
      recordAudit({
        action: 'Created',
        resourceType: 'youtube-video',
        resourceId: String(video._id),
        details: `Created YouTube video: ${video.title}`,
      })
    } catch {}
    
    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating YouTube video:', error)
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    )
  }
}
