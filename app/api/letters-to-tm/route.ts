// app/api/letters-to-tm/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import LetterToTM, { LetterToTMDoc } from '@/models/LetterToTM'
import { PAPER_COLORS } from '@/constants/letter-to-true-mother'

// Helper function to generate letter properties
function generateLetterProps(seed: number) {
  const rng = {
    value: seed,
    next() {
      this.value = (this.value * 9301 + 49297) % 233280
      return this.value / 233280
    }
  }
  
  return {
    color: PAPER_COLORS[Math.floor(rng.next() * PAPER_COLORS.length)],
    rotation: (rng.next() - 0.5) * 10, // -5 to 5 degrees
    position: {
      x: rng.next() * 20 - 10, // -10 to 10
      y: rng.next() * 20 - 10  // -10 to 10
    }
  }
}

// GET - Fetch all public letters
export async function GET() {
  try {
    await dbConnect()
    
    const letters = await LetterToTM.find({ isPublic: true })
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
      isPublic: letter.isPublic
    }))
    
    return NextResponse.json({
      success: true,
      data: transformedLetters
    })
  } catch (error) {
    console.error('Error fetching letters:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch letters' 
      },
      { status: 500 }
    )
  }
}

// POST - Create a new letter
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const { name, region, content, isPublic = true } = body
    
    // Validation
    if (!name || !region || !content) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Name, region, and content are required' 
        },
        { status: 400 }
      )
    }
    
    // Word count validation
    const words = content.trim().split(/\s+/).filter((word: string) => word.length > 0)
    if (words.length > 100) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Content cannot exceed 100 words' 
        },
        { status: 400 }
      )
    }
    
    // Generate letter properties using current timestamp as seed
    const seed = Date.now() % 1000000
    const letterProps = generateLetterProps(seed)
    
    // Create new letter
    const letterData = {
      name: name.trim(),
      region: region.trim(),
      content: content.trim(),
      isPublic: Boolean(isPublic),
      ...letterProps
    }
    
    console.log('Creating letter with data:', letterData)
    const newLetter = new LetterToTM(letterData)
    console.log('New letter object before save:', newLetter.toObject())
    
    const savedLetter = await newLetter.save()
    console.log('Saved letter from DB:', savedLetter.toObject())
    
    // Transform response to match frontend interface
    const transformedLetter = {
      _id: (savedLetter._id as any).toString(),
      name: savedLetter.name,
      region: savedLetter.region,
      content: savedLetter.content,
      createdAt: (savedLetter.createdAt as Date).toISOString(),
      color: savedLetter.color,
      rotation: savedLetter.rotation,
      position: savedLetter.position,
      isPublic: savedLetter.isPublic
    }
    
    return NextResponse.json({
      success: true,
      data: transformedLetter
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating letter:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create letter' 
      },
      { status: 500 }
    )
  }
}