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
    
    // Ensure this is a member token
    if (payload.role !== 'member') {
      return NextResponse.json({ error: 'Invalid token type' }, { status: 401 })
    }

    await dbConnect()
    
    // Find the user
    const user = await User.findById(payload.sub).lean() as any
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    // Get the associated member data
    const member = await Member.findById(user.memberId).lean() as any
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 401 })
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
        lastLoginAt: user.lastLoginAt
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
        spiritualParent: member.spiritualParent,
        registeredAt: member.registeredAt,
        registeredBy: member.registeredBy,
        membershipCategory: member.membershipCategory,
        note: member.note
      }
    })
    
  } catch (error) {
    console.error('Member auth check error:', error)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}