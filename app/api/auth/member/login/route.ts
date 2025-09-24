import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import User from '@/models/User'
import { verifyPassword, createToken } from '@/lib/auth'
import { cookies } from 'next/headers'

// If you use native modules like bcrypt, force Node runtime:
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    await dbConnect()

    const { email, password } = await request.json()

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if passwordHash exists
    if (!user.passwordHash) {
      console.error('User passwordHash is missing for user:', user.email)
      return NextResponse.json(
        { error: 'Account setup incomplete. Please contact support.' },
        { status: 400 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Update last login timestamp
    user.lastLoginAt = new Date()
    await user.save().catch(() => {})

    // Create JWT token with member role
    const token = await createToken({
      sub: String(user._id),
      email: user.email,
      role: 'member', // Different from admin role
      memberId: String(user.memberId) // Include member reference
    })

    // Set cookie with member token
    const cookieStore = await cookies()
    cookieStore.set('member_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days (longer than admin sessions)
    })

    return NextResponse.json({ 
      success: true,
      user: {
        id: String(user._id),
        email: user.email,
        memberId: String(user.memberId),
        isEmailVerified: user.isEmailVerified
      }
    })

  } catch (error) {
    console.error('Member login error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined },
      { status: 500 }
    )
  }
}