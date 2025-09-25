import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import User from '@/models/User'
import Member from '@/models/Member'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('member_token')?.value
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await verifyToken(token)
    console.log('Token verification successful, payload:', {
      sub: payload.sub,
      role: payload.role,
      email: payload.email,
      memberId: payload.memberId,
    })

    // Ensure this is a member token
    if (payload.role !== 'member') {
      console.log('Invalid token type, expected member but got:', payload.role)
      return NextResponse.json({ error: 'Invalid token type' }, { status: 401 })
    }

    await dbConnect()

    // Find the user
    const user = (await User.findById(payload.sub).lean()) as any
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    // Get the associated member data first
    let member = (await Member.findById(user.memberId).lean()) as any
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 401 })
    }

    // Try to populate spiritualParent only if it's an ObjectId
    if (member.spiritualParent) {
      // Check if spiritualParent is an ObjectId (24 character hex string)
      const isObjectId =
        typeof member.spiritualParent === 'object' ||
        (typeof member.spiritualParent === 'string' &&
          member.spiritualParent.length === 24 &&
          /^[0-9a-fA-F]{24}$/.test(member.spiritualParent))

      if (isObjectId) {
        try {
          const populatedMember = (await Member.findById(user.memberId)
            .populate(
              'spiritualParent',
              'fullName givenName familyName email phone church',
            )
            .lean()) as any
          if (populatedMember && populatedMember.spiritualParent) {
            member.spiritualParent = populatedMember.spiritualParent
          }
        } catch (error) {
          console.warn(
            'Failed to populate spiritualParent, keeping original value:',
            error,
          )
          // Keep the original string value if population fails
        }
      }
    }

    console.log('Raw member data from DB:', {
      id: member._id,
      fullName: member.fullName,
      givenName: member.givenName,
      familyName: member.familyName,
      gender: member.gender,
      age: member.age,
      email: member.email,
      phone: member.phone,
      continent: member.continent,
      region: member.region,
      nation: member.nation,
      city: member.city,
      church: member.church,
      // Add more fields to debug
    })

    return NextResponse.json({
      user: {
        id: String(user._id),
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        lastLoginAt: user.lastLoginAt,
      },
      member: {
        id: String(member._id),
        fullName: member.fullName,
        givenName: member.givenName,
        familyName: member.familyName,
        gender: member.gender,
        dateOfBirth: member.dateOfBirth,
        age: member.age,
        ageGroup: member.ageGroup,

        // Contact Information
        email: member.email,
        phone: member.phone,

        // Location & Church
        continent: member.continent,
        region: member.region,
        nation: member.nation,
        city: member.city,
        church: member.church,

        // Blessing Information
        blessedChild: member.blessedChild,
        blessingStatus: member.blessingStatus,
        blessedYear: member.blessedYear,
        nameOfSpouse: member.nameOfSpouse,

        // Membership Details
        dateOfJoining: member.dateOfJoining,
        spiritualParent: member.spiritualParent
          ? {
              id: String(member.spiritualParent._id),
              fullName: member.spiritualParent.fullName,
              givenName: member.spiritualParent.givenName,
              familyName: member.spiritualParent.familyName,
              email: member.spiritualParent.email,
              phone: member.spiritualParent.phone,
              church: member.spiritualParent.church,
            }
          : null,
        registeredAt: member.registeredAt,
        registeredBy: member.registeredBy,
        membershipCategory: member.membershipCategory,
        note: member.note,
      },
    })
  } catch (error) {
    console.error('Member auth check error:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error name:', error.name)
    }
    return NextResponse.json({ 
      error: 'Invalid token',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 401 })
  }
}