import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import Member from '@/models/Member'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    // For now, just get one random member (you can make this dynamic later)
    const member = await Member.findOne().lean() as any
    
    if (!member) {
      return NextResponse.json(
        { error: 'No member found' },
        { status: 404 }
      )
    }

    // Transform the data to match the frontend format
    const memberData = {
      id: member.id,
      continent: member.continent,
      region: member.region,
      nation: member.nation,
      church: member.church,
      city: member.city,
      givenName: member.givenName,
      familyName: member.familyName,
      fullName: member.fullName,
      gender: member.gender,
      dateOfBirth: member.dateOfBirth,
      age: member.age,
      ageGroup: member.ageGroup,
      email: member.email,
      phone: member.phone,
      blessedChild: member.blessedChild,
      blessingStatus: member.blessingStatus,
      blessedYear: member.blessedYear,
      nameOfSpouse: member.nameOfSpouse,
      dateOfJoining: member.dateOfJoining,
      spiritualParent: member.spiritualParent,
      registeredAt: member.registeredAt,
      registeredBy: member.registeredBy,
      membershipCategory: member.membershipCategory,
      note: member.note
    }

    return NextResponse.json({
      success: true,
      data: memberData
    })

  } catch (error) {
    console.error('Error fetching member:', error)
    return NextResponse.json(
      { error: 'Failed to fetch member data' },
      { status: 500 }
    )
  }
}