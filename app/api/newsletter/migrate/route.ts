import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { Newsletter } from '@/models/Newsletter'

// GET /api/newsletter/migrate - one-time migration for existing records
export async function GET(req: Request) {
  await dbConnect()
  
  try {
    // Update all existing records that don't have firstName/lastName
    const result = await Newsletter.updateMany(
      { 
        $or: [
          { firstName: { $exists: false } },
          { lastName: { $exists: false } },
          { firstName: '' },
          { lastName: '' }
        ]
      },
      { 
        $set: { 
          firstName: 'Legacy',
          lastName: 'Subscriber'
        }
      }
    )

    return NextResponse.json({ 
      message: `Updated ${result.modifiedCount} records`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { error: 'Migration failed' }, 
      { status: 500 }
    )
  }
}