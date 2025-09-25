import { Metadata } from 'next'
import { dbConnect } from '@/lib/db'
import Member from '@/models/Member'
import MembersTable from '@/components/members/MembersTable'
import { MembersResponse } from '@/types/members'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FiGitBranch } from 'react-icons/fi'
import LeftNavigation from '@/components/layout/LeftNavigation'

export const metadata: Metadata = {
  title: 'Members Directory - FFWPU Philippines',
  description: 'Browse and search through all FFWPU Philippines members',
}

interface MembersPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    church?: string
    blessingStatus?: string
    ageGroup?: string
    membershipCategory?: string
    sortBy?: string
    sortOrder?: string
  }>
}

export default async function MembersPage({ searchParams }: MembersPageProps) {
  await dbConnect()

  // Await and parse search parameters
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const limit = 10
  const search = params.search || ''
  const church = params.church || ''
  const blessingStatus = params.blessingStatus || ''
  const ageGroup = params.ageGroup || ''
  const membershipCategory = params.membershipCategory || ''
  const sortBy = params.sortBy || 'fullName'
  const sortOrder = params.sortOrder || 'asc'

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

  try {
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

    const initialData: MembersResponse = {
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
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <LeftNavigation />
        <div className="lg:pl-64">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Members Directory</h1>
                  <p className="text-gray-600">
                    Browse and search through all FFWPU Philippines members. Click on any member to view their full profile.
                  </p>
                </div>
                <Link href="/members/spiritual-family-tree">
                  <Button variant="outline">
                    <FiGitBranch className="h-4 w-4 mr-2" />
                    Family Tree
                  </Button>
                </Link>
              </div>
            </div>
            
            <MembersTable initialData={initialData} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching members:', error)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <LeftNavigation />
        <div className="lg:pl-64">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Members Directory</h1>
                  <p className="text-red-600">
                    Sorry, there was an error loading the members directory. Please try again later.
                  </p>
                </div>
                <Link href="/members/spiritual-family-tree">
                  <Button variant="outline">
                    <FiGitBranch className="h-4 w-4 mr-2" />
                    Family Tree
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}