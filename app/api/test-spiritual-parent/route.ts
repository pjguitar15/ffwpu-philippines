// Test script to check if spiritual parent conversion is working
import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import Member from '@/models/Member'

export async function GET() {
  try {
    await dbConnect()
    
    // Find a member with spiritual parent to test
    const memberWithSpiritualParent = await Member.findOne({
      spiritualParent: { $ne: null }
    }).populate('spiritualParent', 'fullName givenName familyName email phone church')
    
    if (!memberWithSpiritualParent) {
      return NextResponse.json({
        message: 'No members with spiritual parents found'
      })
    }
    
    return NextResponse.json({
      message: 'Spiritual parent test successful',
      member: {
        fullName: memberWithSpiritualParent.fullName,
        spiritualParent: memberWithSpiritualParent.spiritualParent
      }
    })
    
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json(
      { error: 'Test failed', details: (error as Error).message },
      { status: 500 }
    )
  }
}