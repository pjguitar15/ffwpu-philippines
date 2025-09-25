import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import Member from '@/models/Member'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const church = searchParams.get('church') || ''
    const blessingStatus = searchParams.get('blessingStatus') || ''
    const ageGroup = searchParams.get('ageGroup') || ''
    const membershipCategory = searchParams.get('membershipCategory') || ''
    const sortBy = searchParams.get('sortBy') || 'fullName'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    // Build query
    const query: any = {}

    // Search across multiple fields
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { givenName: { $regex: search, $options: 'i' } },
        { familyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { church: { $regex: search, $options: 'i' } }
      ]
    }

    // Apply filters
    if (church && church !== 'all') query.church = { $regex: church, $options: 'i' }
    if (blessingStatus && blessingStatus !== 'all') query.blessingStatus = blessingStatus
    if (ageGroup && ageGroup !== 'all') query.ageGroup = ageGroup
    if (membershipCategory && membershipCategory !== 'all') query.membershipCategory = membershipCategory

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build sort object
    const sort: any = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    // Execute queries with error handling for invalid ObjectIds
    const [members, totalCount] = await Promise.all([
      Member.find(query)
        .populate({
          path: 'spiritualParent',
          select: 'fullName',
          match: { _id: { $exists: true } } // Only populate valid ObjectIds
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .catch(async (error) => {
          // If population fails due to invalid ObjectIds, fetch without population
          console.warn('Population failed, fetching without spiritual parent:', error.message)
          return Member.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean()
        }),
      Member.countDocuments(query)
    ])

    // Get unique values for filters
    const [churches, blessingStatuses, ageGroups, membershipCategories] = await Promise.all([
      Member.distinct('church').exec(),
      Member.distinct('blessingStatus').exec(),
      Member.distinct('ageGroup').exec(),
      Member.distinct('membershipCategory').exec()
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      members: members.map(member => ({
        id: member._id.toString(),
        fullName: member.fullName,
        givenName: member.givenName,
        familyName: member.familyName,
        email: member.email,
        phone: member.phone,
        church: member.church,
        ageGroup: member.ageGroup,
        blessingStatus: member.blessingStatus,
        membershipCategory: member.membershipCategory,
        dateOfJoining: member.dateOfJoining ? member.dateOfJoining.toISOString() : undefined,
        spiritualParent: member.spiritualParent && typeof member.spiritualParent === 'object' && (member.spiritualParent as any)._id ? {
          id: (member.spiritualParent as any)._id?.toString(),
          fullName: (member.spiritualParent as any).fullName
        } : null,
        gender: member.gender,
        age: member.age,
        city: member.city,
        nation: member.nation
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      },
      filters: {
        churches: churches.filter(Boolean).sort(),
        blessingStatuses: blessingStatuses.filter(Boolean).sort(),
        ageGroups: ageGroups.filter(Boolean).sort(),
        membershipCategories: membershipCategories.filter(Boolean).sort()
      }
    })
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    )
  }
}