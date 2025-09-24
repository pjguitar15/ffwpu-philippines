import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    // Find and delete users with missing passwordHash
    const result = await User.deleteMany({
      $or: [
        { passwordHash: { $exists: false } },
        { passwordHash: null },
        { passwordHash: '' }
      ]
    })
    
    console.log(`Deleted ${result.deletedCount} invalid users`)
    
    return NextResponse.json({
      message: `Cleanup complete. Removed ${result.deletedCount} invalid users.`,
      deletedCount: result.deletedCount
    })
    
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { error: 'Cleanup failed', details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined },
      { status: 500 }
    )
  }
}