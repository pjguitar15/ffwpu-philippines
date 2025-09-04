import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { Livestream } from '@/models/Livestream'
import { recordAudit } from '@/lib/audit'

export async function GET() {
  try {
    await dbConnect()
    
    // Get the current livestream settings (there should only be one)
    let livestream = await Livestream.findOne()
    
    if (!livestream) {
      // Create default livestream document if none exists
      livestream = await Livestream.create({
        url: '',
        isActive: false,
        title: 'Live Stream',
        description: '',
      })
    }
    
    return NextResponse.json(livestream)
  } catch (error) {
    console.error('Error fetching livestream:', error)
    return NextResponse.json(
      { error: 'Failed to fetch livestream settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const { url, isActive, title, description } = body
    
    // Get or create the livestream document (there should only be one)
    let livestream = await Livestream.findOne()
    
    if (!livestream) {
      livestream = new Livestream({
        url: url || '',
        isActive: isActive || false,
        title: title || 'Live Stream',
        description: description || '',
      })
    } else {
      if (url !== undefined) livestream.url = url
      if (isActive !== undefined) livestream.isActive = isActive
      if (title !== undefined) livestream.title = title
      if (description !== undefined) livestream.description = description
    }
    
    await livestream.save()
    
    // Record audit log
    await recordAudit({
      action: 'Updated',
      resourceType: 'livestream',
      resourceId: String(livestream._id),
      details: isActive 
        ? `Livestream started: ${url || livestream.url}` 
        : 'Livestream stopped',
    })
    
    return NextResponse.json(livestream)
  } catch (error) {
    console.error('Error updating livestream:', error)
    return NextResponse.json(
      { error: 'Failed to update livestream settings' },
      { status: 500 }
    )
  }
}
