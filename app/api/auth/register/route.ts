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
      confirmPassword 
    } = body

    // Basic validation
    if (!firstName || !lastName || !dateOfBirth || !email || !password) {
      return NextResponse.json(
        { error: 'First name, last name, date of birth, email, and password are required' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if email already exists in users collection
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      // If existing user has invalid passwordHash, delete it and allow re-registration
      if (!existingUser.passwordHash) {
        console.log(`Deleting invalid user record for ${email} and allowing re-registration`)
        await User.deleteOne({ _id: existingUser._id })
      } else {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 400 }
        )
      }
    }

    // Parse the provided date of birth
    const providedBirthDate = parseDate(dateOfBirth)
    if (!providedBirthDate) {
      return NextResponse.json(
        { error: 'Invalid date of birth format' },
        { status: 400 }
      )
    }

    // Search for matching member in the members collection
    const normalizedFirstName = normalizeName(firstName)
    const normalizedMiddleName = middleName ? normalizeName(middleName) : null
    const normalizedLastName = normalizeName(lastName)
    
    // Construct full name from parts for matching
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
          { $toLower: { $trim: { input: "$fullName" } } },
          normalizedConstructedFullName
        ]
      }
    })

    // Strategy 2: First name + Last name match (ignoring middle name)
    searchCriteria.push({
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
    })

    // Strategy 3: Given name + Family name match (for backwards compatibility)
    searchCriteria.push({
      $and: [
        {
          $expr: {
            $eq: [
              { $toLower: { $trim: { input: "$givenName" } } },
              normalizedFirstName
            ]
          }
        },
        {
          $expr: {
            $eq: [
              { $toLower: { $trim: { input: "$familyName" } } },
              normalizedLastName
            ]
          }
        }
      ]
    })

    // Strategy 4: Partial name matching (contains all name parts)
    const namePartsConditions = [
      {
        $expr: {
          $regexMatch: {
            input: { $toLower: "$fullName" },
            regex: normalizedFirstName,
            options: "i"
          }
        }
      },
      {
        $expr: {
          $regexMatch: {
            input: { $toLower: "$fullName" },
            regex: normalizedLastName,
            options: "i"
          }
        }
      }
    ]

    if (normalizedMiddleName) {
      namePartsConditions.push({
        $expr: {
          $regexMatch: {
            input: { $toLower: "$fullName" },
            regex: normalizedMiddleName,
            options: "i"
          }
        }
      })
    }

    searchCriteria.push({
      $and: namePartsConditions
    })

    // Find potential matches
    const potentialMembers = await Member.find({
      $or: searchCriteria,
      hasRegisteredAccount: { $ne: true } // Only unregistered members
    }).lean()

    if (!potentialMembers || potentialMembers.length === 0) {
      return NextResponse.json(
        { 
          error: 'No matching member found in our records. Please contact the administrator to verify your membership status.',
          details: 'Make sure your name and date of birth match exactly with your church registration.'
        },
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
        { 
          error: 'Member found but date of birth does not match. Please contact the administrator.',
          details: 'Your name is in our records but the birth date provided does not match.'
        },
        { status: 400 }
      )
    }

    if (matchingMembers.length > 1) {
      return NextResponse.json(
        { 
          error: 'Multiple matching records found. Please contact the administrator for assistance.',
          details: 'There are multiple members with similar information. Manual verification required.'
        },
        { status: 400 }
      )
    }

    const matchedMember = matchingMembers[0]

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Generate verification token
    const verificationToken = uuidv4()

    // Create the user account
    const userData = {
      firstName,
      middleName: middleName || '',
      lastName,
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
      memberId: matchedMember._id,
      verificationToken,
      isEmailVerified: true  // Set to true for immediate login capability
    }
    
    console.log('Creating user with data:', { ...userData, passwordHash: '[HIDDEN]' })
    const newUser = new User(userData)

    await newUser.save()
    console.log('User created successfully with ID:', newUser._id)

    // Update the member record to link to the user
    console.log('Updating member with ID:', matchedMember._id, 'to add userId:', newUser._id)
    const memberUpdateResult = await Member.findByIdAndUpdate(matchedMember._id, {
      userId: newUser._id,
      hasRegisteredAccount: true
    }, { new: true })
    
    console.log('Member update result:', memberUpdateResult ? 'Success' : 'Failed')
    if (!memberUpdateResult) {
      console.error('Failed to update member record!')
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please check your email for verification instructions.',
      user: {
        id: newUser._id,
        email: newUser.email,
        isEmailVerified: newUser.isEmailVerified,
        member: {
          fullName: matchedMember.fullName,
          church: matchedMember.church,
          membershipCategory: matchedMember.membershipCategory
        }
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}