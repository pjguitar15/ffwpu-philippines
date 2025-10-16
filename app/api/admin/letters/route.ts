// app/api/admin/letters/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import LetterToTM from '@/models/LetterToTM'

// GET - Fetch all letters (both public and private) for admin
export async function GET() {
  try {
    await dbConnect()
    
    const letters = await LetterToTM.find({})
      .sort({ createdAt: -1 })
      .lean()
    
    // Transform to match frontend interface
    const transformedLetters = letters.map((letter: any) => ({
      _id: letter._id.toString(),
      name: letter.name,
      region: letter.region,
      content: letter.content,
      createdAt: letter.createdAt.toISOString(),
      color: letter.color,
      rotation: letter.rotation,
      position: letter.position,
      isPublic: letter.isPublic || true // Default to public for existing letters without this field
    }))
    
    return NextResponse.json({
      success: true,
      data: transformedLetters
    })
  } catch (error) {
    console.error('Error fetching admin letters:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch letters' 
      },
      { status: 500 }
    )
  }
}