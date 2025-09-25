import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import Member from '@/models/Member'
import User from '@/models/User'
import { hashPassword } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

// Helper function to normalize names for comparison
function normalizeName(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, ' ')
}

// Helper function to parse date strings in various formats
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null
  
  // Try different date formats
  const date = new Date(dateStr)
  if (!isNaN(date.getTime())) {
    return date
  }
  
  return null
}

// Helper function to check if dates match (same day, month, year)
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
      email,
      password,
      confirmPassword,
    } = body

    // Get request metadata for audit trail
    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Basic validation
    if (!firstName || !lastName || !dateOfBirth || !email || !password) {
      return NextResponse.json(
        {
          error:
            'First name, last name, date of birth, email, and password are required',
        },
        { status: 400 },
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 },
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 },
      )
    }

    // Parse the provided date of birth
    const providedBirthDate = parseDate(dateOfBirth)
    if (!providedBirthDate) {
      return NextResponse.json(
        { error: 'Invalid date of birth format' },
        { status: 400 },
      )
    }

    // SECURITY ENHANCEMENT: Find the member first to get their ID
    const normalizedFirstName = normalizeName(firstName)
    const normalizedMiddleName = middleName ? normalizeName(middleName) : null
    const normalizedLastName = normalizeName(lastName)

    const constructedFullName = middleName
      ? `${firstName} ${middleName} ${lastName}`.trim()
      : `${firstName} ${lastName}`.trim()
    const normalizedConstructedFullName = normalizeName(constructedFullName)

    // Build search criteria - try multiple matching strategies
    const searchCriteria = []

    // Strategy 1: Exact full name match
    searchCriteria.push({
      $expr: {
        $eq: [
          { $toLower: { $trim: { input: '$fullName' } } },
          normalizedConstructedFullName,
        ],
      },
    })

    // Strategy 2: First name + Last name match
    searchCriteria.push({
      $and: [
        {
          $expr: {
            $regexMatch: {
              input: { $toLower: '$fullName' },
              regex: `^${normalizedFirstName.replace(
                /[.*+?^${}()|[\]\\]/g,
                '\\$&',
              )}`,
              options: 'i',
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toLower: '$fullName' },
              regex: `${normalizedLastName.replace(
                /[.*+?^${}()|[\]\\]/g,
                '\\$&',
              )}$`,
              options: 'i',
            },
          },
        },
      ],
    })

    // Strategy 3: Given name + Family name match
    searchCriteria.push({
      $and: [
        {
          $expr: {
            $eq: [
              { $toLower: { $trim: { input: '$givenName' } } },
              normalizedFirstName,
            ],
          },
        },
        {
          $expr: {
            $eq: [
              { $toLower: { $trim: { input: '$familyName' } } },
              normalizedLastName,
            ],
          },
        },
      ],
    })

    // Find ALL potential members (not just unregistered ones)
    const potentialMembers = await Member.find({
      $or: searchCriteria,
    }).lean()

    if (!potentialMembers || potentialMembers.length === 0) {
      return NextResponse.json(
        {
          error:
            'No matching member found in our records. Please contact the administrator to verify your membership status.',
          details:
            'Make sure your name and date of birth match exactly with your church registration.',
        },
        { status: 404 },
      )
    }

    // Filter by date of birth
    const matchingMembers = potentialMembers.filter((member) => {
      if (!member.dateOfBirth) return false
      const memberBirthDate = new Date(member.dateOfBirth)
      return datesMatch(providedBirthDate, memberBirthDate)
    })

    if (matchingMembers.length === 0) {
      return NextResponse.json(
        {
          error:
            'Member found but date of birth does not match. Please contact the administrator.',
          details:
            'Your name is in our records but the birth date provided does not match.',
        },
        { status: 400 },
      )
    }

    if (matchingMembers.length > 1) {
      return NextResponse.json(
        {
          error:
            'Multiple matching records found. Please contact the administrator for assistance.',
          details:
            'There are multiple members with similar information. Manual verification required.',
        },
        { status: 400 },
      )
    }

    const matchedMember = matchingMembers[0]

    // SECURITY CHECK 1A: Check if member already has a userId field (direct check)
    if (matchedMember.userId) {
      // Verify the userId points to a valid user
      const linkedUser = await User.findById(matchedMember.userId).lean()

      if (linkedUser) {
        // Record this registration attempt
        await Member.findByIdAndUpdate(matchedMember._id, {
          $push: {
            registrationHistory: {
              email: email.toLowerCase(),
              registeredAt: new Date(),
              status: 'blocked',
              ipAddress,
              userAgent,
            },
          },
          $inc: { registrationAttemptCount: 1 },
          lastRegistrationAttempt: new Date(),
        })

        return NextResponse.json(
          {
            error: 'This member profile already has an account linked to it.',
            details:
              'Each member can only have one account. If you forgot your login credentials, please use account recovery.',
            suggestAccountRecovery: true,
            existingEmail: linkedUser.email.replace(/(.{2}).*(@.*)/, '$1***$2'),
          },
          { status: 409 }, // Conflict status
        )
      } else {
        // Clean up invalid userId reference
        console.log(
          `Cleaning up invalid userId reference for member ${matchedMember._id}`,
        )
        await Member.findByIdAndUpdate(matchedMember._id, {
          $unset: { userId: 1 },
          hasRegisteredAccount: false,
        })
      }
    }

    // SECURITY CHECK 1B: Check if this member already has ANY user account (reverse lookup)
    const existingUserForMember = await User.findOne({
      memberId: matchedMember._id,
    }).lean()

    if (existingUserForMember) {
      // Record this registration attempt
      await Member.findByIdAndUpdate(matchedMember._id, {
        $push: {
          registrationHistory: {
            email: email.toLowerCase(),
            registeredAt: new Date(),
            status: 'blocked',
            ipAddress,
            userAgent,
          },
        },
        $inc: { registrationAttemptCount: 1 },
        lastRegistrationAttempt: new Date(),
      })

      // If account is active, suggest account recovery
      if (existingUserForMember.accountStatus === 'active') {
        return NextResponse.json(
          {
            error: 'An account already exists for this member profile.',
            details:
              'If you forgot your login credentials, please use the "Forgot Password" feature instead of creating a new account.',
            suggestAccountRecovery: true,
            existingEmail: existingUserForMember.email.replace(
              /(.{2}).*(@.*)/,
              '$1***$2',
            ), // Mask email for privacy
          },
          { status: 409 }, // Conflict status
        )
      }

      // If account was deleted/suspended, offer reactivation
      if (
        existingUserForMember.accountStatus === 'deleted' ||
        existingUserForMember.accountStatus === 'suspended'
      ) {
        return NextResponse.json(
          {
            error: `Your previous account was ${existingUserForMember.accountStatus}. Please contact the administrator for account reactivation.`,
            details:
              'Creating multiple accounts is not allowed. Account reactivation is required.',
            requiresAdminAction: true,
            existingEmail: existingUserForMember.email.replace(
              /(.{2}).*(@.*)/,
              '$1***$2',
            ),
          },
          { status: 403 }, // Forbidden status
        )
      }
    }

    // SECURITY CHECK 2: Check if email already exists with different member
    const existingUserWithEmail = await User.findOne({
      email: email.toLowerCase(),
    }).lean()

    if (existingUserWithEmail) {
      // If it's a different member ID, this is suspicious
      if (
        existingUserWithEmail.memberId.toString() !==
        matchedMember._id.toString()
      ) {
        await Member.findByIdAndUpdate(matchedMember._id, {
          $push: {
            registrationHistory: {
              email: email.toLowerCase(),
              registeredAt: new Date(),
              status: 'blocked',
              ipAddress,
              userAgent,
            },
          },
          $inc: { registrationAttemptCount: 1 },
          lastRegistrationAttempt: new Date(),
        })

        return NextResponse.json(
          {
            error:
              'This email is already associated with a different member profile.',
            details:
              'Each email can only be linked to one member. Please use a different email or contact support.',
          },
          { status: 409 },
        )
      }

      // If it's the same member but account was deleted, clean up first
      if (existingUserWithEmail.accountStatus === 'deleted') {
        await User.deleteOne({ _id: existingUserWithEmail._id })
      } else {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 400 },
        )
      }
    }

    // All security checks passed - proceed with registration
    const hashedPassword = await hashPassword(password)
    const verificationToken = uuidv4()

    // Create the user account with enhanced tracking
    const userData = {
      firstName,
      middleName: middleName || '',
      lastName,
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
      memberId: matchedMember._id,
      verificationToken,
      isEmailVerified: true,
      accountStatus: 'active',
      registrationAttempts: [
        {
          email: email.toLowerCase(),
          attemptedAt: new Date(),
          ipAddress,
          userAgent,
          status: 'success',
          reason: 'Initial registration',
        },
      ],
      lastRegistrationAttempt: new Date(),
    }

    console.log('Creating user with enhanced security:', {
      ...userData,
      passwordHash: '[HIDDEN]',
    })
    const newUser = new User(userData)
    await newUser.save()
    console.log('User created successfully with ID:', newUser._id)

    // Update the member record with enhanced tracking
    const memberUpdateResult = await Member.findByIdAndUpdate(
      matchedMember._id,
      {
        userId: newUser._id,
        hasRegisteredAccount: true,
        firstRegistrationAt: matchedMember.firstRegistrationAt || new Date(),
        lastRegistrationAttempt: new Date(),
        $inc: { registrationAttemptCount: 1 },
        $push: {
          registrationHistory: {
            userId: newUser._id,
            email: email.toLowerCase(),
            registeredAt: new Date(),
            status: 'active',
            ipAddress,
            userAgent,
          },
        },
      },
      { new: true },
    )

    if (!memberUpdateResult) {
      console.error('Failed to update member record!')
      // Clean up the user if member update failed
      await User.deleteOne({ _id: newUser._id })
      return NextResponse.json(
        {
          error: 'Registration failed during member linking. Please try again.',
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message:
        'Registration successful! Your account has been created and linked to your member profile.',
      user: {
        id: newUser._id,
        email: newUser.email,
        isEmailVerified: newUser.isEmailVerified,
        member: {
          fullName: matchedMember.fullName,
          church: matchedMember.church,
          membershipCategory: matchedMember.membershipCategory,
        },
      },
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Handle duplicate key errors (unique constraints)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0]
      if (field === 'email') {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 400 }
        )
      } else if (field === 'memberId') {
        return NextResponse.json(
          { 
            error: 'This member profile already has an associated account. Please use account recovery instead.',
            suggestAccountRecovery: true
          },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}