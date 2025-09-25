import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import Member from '@/models/Member'
import { Types } from 'mongoose'

interface FamilyTreeNode {
  id: string
  fullName: string
  email: string | null
  church: string
  membershipCategory: string
  ageGroup: string
  spiritualChildren: FamilyTreeNode[]
  _count?: {
    spiritualChildren: number
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const rootId = searchParams.get('rootId')

    let rootMembers: any[]

    if (rootId) {
      // Get a specific member and their descendants
      if (!Types.ObjectId.isValid(rootId)) {
        return NextResponse.json(
          { error: 'Invalid member ID format' },
          { status: 400 }
        )
      }

      const rootMember = await Member.findById(rootId).lean()
      if (!rootMember) {
        return NextResponse.json(
          { error: 'Member not found' },
          { status: 404 }
        )
      }
      rootMembers = [rootMember]
    } else {
      // Get all members who don't have spiritual parents (root nodes)
      rootMembers = await Member.find({
        $or: [
          { spiritualParent: null },
          { spiritualParent: { $exists: false } }
        ]
      }).lean()
    }

    // Fetch ALL members at once to avoid multiple database queries
    const allMembers = await Member.find({}).lean()
    
    // Create a map for quick lookups
    const memberMap = new Map()
    const childrenMap = new Map()
    
    // Build maps for efficient lookups
    allMembers.forEach(member => {
      memberMap.set(member._id.toString(), member)
      
      if (member.spiritualParent) {
        const parentId = member.spiritualParent.toString()
        if (!childrenMap.has(parentId)) {
          childrenMap.set(parentId, [])
        }
        childrenMap.get(parentId).push(member)
      }
    })

    // Build the family tree recursively using in-memory data
    const buildFamilyTree = (
      parentId: string,
      visited: Set<string> = new Set()
    ): FamilyTreeNode[] => {
      // Prevent infinite loops by tracking visited nodes
      if (visited.has(parentId)) {
        return []
      }
      
      visited.add(parentId)
      const children = childrenMap.get(parentId) || []
      const familyTreeNodes: FamilyTreeNode[] = []

      for (const child of children) {
        const childId = child._id.toString()
        const childVisited = new Set(visited)
        const spiritualChildren = buildFamilyTree(childId, childVisited)

        // Count direct children only (not recursive)
        const directChildrenCount = childrenMap.get(childId)?.length || 0

        familyTreeNodes.push({
          id: childId,
          fullName: child.fullName,
          email: child.email,
          church: child.church,
          membershipCategory: child.membershipCategory,
          ageGroup: child.ageGroup,
          spiritualChildren,
          _count: {
            spiritualChildren: directChildrenCount
          }
        })
      }

      return familyTreeNodes
    }

    // Build the complete family tree
    const familyTree: FamilyTreeNode[] = []

    for (const rootMember of rootMembers) {
      const rootId = rootMember._id.toString()
      const spiritualChildren = buildFamilyTree(rootId)
      
      // Count direct spiritual children for root member
      const directChildrenCount = childrenMap.get(rootId)?.length || 0

      familyTree.push({
        id: rootId,
        fullName: rootMember.fullName,
        email: rootMember.email,
        church: rootMember.church,
        membershipCategory: rootMember.membershipCategory,
        ageGroup: rootMember.ageGroup,
        spiritualChildren,
        _count: {
          spiritualChildren: directChildrenCount
        }
      })
    }

    // Calculate statistics from the in-memory data
    const totalMembers = allMembers.length
    const membersWithSpiritualParents = allMembers.filter(m => m.spiritualParent).length
    const rootMembersCount = totalMembers - membersWithSpiritualParents

    return NextResponse.json({
      success: true,
      data: {
        familyTree,
        statistics: {
          totalMembers,
          rootMembers: rootMembersCount,
          membersWithSpiritualParents
        }
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Error fetching spiritual family tree:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch spiritual family tree',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}