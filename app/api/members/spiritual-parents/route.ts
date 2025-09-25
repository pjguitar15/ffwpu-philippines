import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import Member from '@/models/Member'
import { Types } from 'mongoose'

interface SpiritualParentOverview {
  id: string
  fullName: string
  email: string | null
  church: string
  membershipCategory: string
  ageGroup: string
  totalDownlines: number
  directChildren: number
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '6')
    const skip = (page - 1) * limit

    console.log(`Fetching spiritual parents overview - page ${page}, limit ${limit}...`)
    
    // Get all members with spiritual parent data
    const allMembers = await Member.find({}).lean()
    console.log(`Found ${allMembers.length} total members`)
    
    // Create maps for efficient lookups
    const childrenMap = new Map()
    let relationshipCount = 0
    
    // Build children map and detect potential cycles
    allMembers.forEach(member => {
      if (member.spiritualParent) {
        const parentId = member.spiritualParent.toString()
        const memberId = member._id.toString()
        
        // Basic cycle detection: prevent self-reference
        if (parentId === memberId) {
          console.warn(`Skipping self-reference for member ${member.fullName}`)
          return
        }
        
        if (!childrenMap.has(parentId)) {
          childrenMap.set(parentId, [])
        }
        childrenMap.get(parentId).push(member)
        relationshipCount++
      }
    })
    
    console.log(`Built ${relationshipCount} spiritual parent-child relationships`)

    // Function to count all downlines recursively with cycle detection
    const countAllDownlines = (memberId: string, visited: Set<string> = new Set()): number => {
      // Prevent infinite recursion by checking if we've already visited this member
      if (visited.has(memberId)) {
        return 0
      }
      
      visited.add(memberId)
      const directChildren = childrenMap.get(memberId) || []
      let total = directChildren.length
      
      // Add all descendants
      directChildren.forEach((child: any) => {
        total += countAllDownlines(child._id.toString(), new Set(visited))
      })
      
      return total
    }

    // Get members who have at least one spiritual child
    const spiritualParents: SpiritualParentOverview[] = []
    
    // Safe recursive approach with proper cycle detection
    const calculateDownlines = (memberId: string, visited: Set<string> = new Set(), depth: number = 0): number => {
      // Prevent infinite recursion with cycle detection and depth limit
      if (visited.has(memberId) || depth > 10) {
        return 0
      }
      
      // Create a new visited set for this branch to avoid affecting other branches
      const currentVisited = new Set(visited)
      currentVisited.add(memberId)
      
      const directChildren = childrenMap.get(memberId) || []
      let totalCount = directChildren.length // Count direct children
      
      // Recursively count descendants
      directChildren.forEach((child: any) => {
        const childId = child._id.toString()
        totalCount += calculateDownlines(childId, currentVisited, depth + 1)
      })
      
      return totalCount
    }
    
    allMembers.forEach(member => {
      const memberId = member._id.toString()
      const directChildren = childrenMap.get(memberId) || []
      
      if (directChildren.length > 0) {
        const totalDownlines = calculateDownlines(memberId)
        
        spiritualParents.push({
          id: memberId,
          fullName: member.fullName,
          email: member.email,
          church: member.church,
          membershipCategory: member.membershipCategory,
          ageGroup: member.ageGroup,
          totalDownlines,
          directChildren: directChildren.length
        })
      }
    })

    // Sort by total downlines (most influential first)
    spiritualParents.sort((a, b) => b.totalDownlines - a.totalDownlines)

    // Apply pagination
    const totalCount = spiritualParents.length
    const paginatedParents = spiritualParents.slice(skip, skip + limit)
    const totalPages = Math.ceil(totalCount / limit)
    const hasMore = page < totalPages

    // Get statistics
    const stats = {
      totalMembers: allMembers.length,
      totalSpiritualParents: spiritualParents.length,
      totalWithSpiritualParents: allMembers.filter(m => m.spiritualParent).length,
      averageDownlines: spiritualParents.length > 0 
        ? Math.round(spiritualParents.reduce((sum, p) => sum + p.totalDownlines, 0) / spiritualParents.length)
        : 0
    }

    return NextResponse.json({
      success: true,
      data: {
        spiritualParents: paginatedParents,
        statistics: stats,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasMore,
          limit
        }
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Error fetching spiritual parents overview:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch spiritual parents overview',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}