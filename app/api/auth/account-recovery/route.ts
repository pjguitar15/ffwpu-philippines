import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import Member from '@/models/Member'
import User from '@/models/User'
import { v4 as uuidv4 } from 'uuid'

// Helper function to normalize names for comparison
function normalizeName(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, ' ')
}

// Helper function to parse date strings
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null
  const date = new Date(dateStr)
  if (!isNaN(date.getTime())) {
    return date
  }
  return null
}

// Helper function to check if dates match
function datesMatch(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const { 
      firstName, 
      middleName, 
      lastName, 
      dateOfBirth, 
      email 
    } = body

    // Get request metadata
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Basic validation
    if (!firstName || !lastName || !dateOfBirth) {
      return NextResponse.json(
        { error: 'First name, last name, and date of birth are required' },
        { status: 400 }
      )
    }

    const providedBirthDate = parseDate(dateOfBirth)
    if (!providedBirthDate) {
      return NextResponse.json(
        { error: 'Invalid date of birth format' },
        { status: 400 }
      )
    }

    // Search for matching member (same logic as registration)
    const normalizedFirstName = normalizeName(firstName)
    const normalizedLastName = normalizeName(lastName)
    const constructedFullName = middleName 
      ? `${firstName} ${middleName} ${lastName}`.trim()
      : `${firstName} ${lastName}`.trim()
    const normalizedConstructedFullName = normalizeName(constructedFullName)

    const searchCriteria = [
      {
        $expr: {
          $eq: [
            { $toLower: { $trim: { input: "$fullName" } } },
            normalizedConstructedFullName
          ]
        }
      },
      {
        $and: [
          {
            $expr: {
              $regexMatch: {
                input: { $toLower: "$fullName" },
                regex: `^${normalizedFirstName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
                options: "i"
              }
            }
          },
          {
            $expr: {
              $regexMatch: {
                input: { $toLower: "$fullName" },
                regex: `${normalizedLastName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
                options: "i"
              }
            }
          }
        ]
      }
    ]

    const potentialMembers = await Member.find({
      $or: searchCriteria
    }).lean()

    if (!potentialMembers || potentialMembers.length === 0) {
      return NextResponse.json(
        { error: 'No matching member found in our records.' },
        { status: 404 }
      )
    }

    // Filter by date of birth
    const matchingMembers = potentialMembers.filter(member => {
      if (!member.dateOfBirth) return false
      const memberBirthDate = new Date(member.dateOfBirth)
      return datesMatch(providedBirthDate, memberBirthDate)
    })

    if (matchingMembers.length === 0) {
      return NextResponse.json(
        { error: 'Member found but date of birth does not match.' },
        { status: 400 }
      )
    }

    if (matchingMembers.length > 1) {
      return NextResponse.json(
        { error: 'Multiple matching records found. Please contact support.' },
        { status: 400 }
      )
    }

    const matchedMember = matchingMembers[0]

    // Find existing user account for this member
    const existingUser = await User.findOne({ 
      memberId: matchedMember._id 
    }).lean()

    if (!existingUser) {
      return NextResponse.json(
        { 
          error: 'No account found for this member profile.',
          details: 'You can create a new account using the registration form.',
          canRegister: true
        },
        { status: 404 }
      )
    }

    // Check account status
    if (existingUser.accountStatus === 'suspended') {
      return NextResponse.json(
        { 
          error: 'Your account has been suspended. Please contact the administrator.',
          requiresAdminAction: true
        },
        { status: 403 }
      )
    }

    if (existingUser.accountStatus === 'deleted') {
      return NextResponse.json(
        { 
          error: 'Your account was previously deleted. Please contact the administrator for reactivation.',
          requiresAdminAction: true
        },
        { status: 403 }
      )
    }

    // If email is provided, check if it matches
    if (email && email.toLowerCase() !== existingUser.email) {
      return NextResponse.json(
        { 
          error: 'The email provided does not match the email associated with this member profile.',
          details: 'Please use the correct email address or contact support if you need to update your email.'
        },
        { status: 400 }
      )
    }

    // Generate password reset token
    const resetToken = uuidv4()
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Update user with reset token
    await User.findByIdAndUpdate(existingUser._id, {
      verificationToken: resetToken,
      // Add reset attempt to registration attempts for audit
      $push: {
        registrationAttempts: {
          email: existingUser.email,
          attemptedAt: new Date(),
          ipAddress,
          userAgent,
          status: 'success',
          reason: 'Password reset requested'
        }
      }
    })

    // In a real application, you would send an email here
    // For now, we'll return the reset information
    return NextResponse.json({
      success: true,
      message: 'Account recovery initiated successfully.',
      details: 'A password reset link would be sent to your registered email address.',
      accountInfo: {
        email: existingUser.email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Masked email
        memberName: matchedMember.fullName,
        church: matchedMember.church,
        registeredAt: existingUser.createdAt
      },
      resetToken: resetToken, // In production, don't return this - send via email
      resetTokenExpiry: resetTokenExpiry
    })

  } catch (error) {
    console.error('Account recovery error:', error)
    return NextResponse.json(
      { error: 'Account recovery failed. Please try again.' },
      { status: 500 }
    )
  }
}