import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import Member from '@/models/Member'

export async function POST() {
  try {
    await dbConnect()
    console.log('Connected to database')

    // Get all members with spiritualParent as string
    const membersWithSpiritualParents = await Member.find({
      $and: [
        { spiritualParent: { $type: 'string' } },
        { spiritualParent: { $ne: null } },
        { spiritualParent: { $ne: '' } }
      ]
    })

    console.log(`Found ${membersWithSpiritualParents.length} members with spiritual parents`)

    const conversionResults = []

    for (const member of membersWithSpiritualParents) {
      const spiritualParentName = member.spiritualParent

      if (!spiritualParentName || typeof spiritualParentName !== 'string') {
        continue
      }

      console.log(`Processing member ${member.fullName} with spiritual parent: ${spiritualParentName}`)

      // Ensure we have a string to work with
      const parentName = String(spiritualParentName).trim()
      if (!parentName) {
        continue
      }

      // Escape special regex characters in the name
      const escapedName = parentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      
      // Try to find the spiritual parent by fullName (exact match)
      let spiritualParentMember = await Member.findOne({
        fullName: { $regex: new RegExp(`^${escapedName}$`, 'i') }
      })

      // If not found by fullName, try by givenName + familyName combination
      if (!spiritualParentMember) {
        const nameParts = parentName.split(/\s+/)
        if (nameParts.length >= 2) {
          const firstName = nameParts[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const lastName = nameParts[nameParts.length - 1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          
          // Try different name combinations
          spiritualParentMember = await Member.findOne({
            $or: [
              // Exact match on given and family names
              {
                $and: [
                  { givenName: { $regex: new RegExp(`^${firstName}$`, 'i') } },
                  { familyName: { $regex: new RegExp(`^${lastName}$`, 'i') } }
                ]
              },
              // Try full name contains all parts
              {
                fullName: { $regex: new RegExp(escapedName, 'i') }
              },
              // Try reversed name order (Last, First)
              {
                fullName: { $regex: new RegExp(`^${lastName}.*${firstName}`, 'i') }
              }
            ]
          })
        }
      }

      if (spiritualParentMember) {
        // Convert string to ObjectId reference
        await Member.findByIdAndUpdate(member._id, {
          spiritualParent: spiritualParentMember._id
        })

        conversionResults.push({
          memberName: member.fullName,
          spiritualParentName: spiritualParentName,
          spiritualParentId: spiritualParentMember._id,
          spiritualParentFullName: spiritualParentMember.fullName,
          status: 'converted'
        })

        console.log(`✅ Converted ${member.fullName}: ${spiritualParentName} -> ${spiritualParentMember._id}`)
      } else {
        conversionResults.push({
          memberName: member.fullName,
          spiritualParentName: spiritualParentName,
          status: 'not_found'
        })

        console.log(`❌ Could not find spiritual parent: ${spiritualParentName} for ${member.fullName}`)
      }
    }

    // Summary
    const converted = conversionResults.filter(r => r.status === 'converted').length
    const notFound = conversionResults.filter(r => r.status === 'not_found').length

    console.log(`\n=== CONVERSION SUMMARY ===`)
    console.log(`Total processed: ${conversionResults.length}`)
    console.log(`Successfully converted: ${converted}`)
    console.log(`Not found: ${notFound}`)

    return NextResponse.json({
      success: true,
      message: 'Spiritual parent conversion completed',
      summary: {
        totalProcessed: conversionResults.length,
        converted,
        notFound
      },
      results: conversionResults
    })

  } catch (error) {
    console.error('Conversion error:', error)
    return NextResponse.json(
      { error: 'Conversion failed', details: (error as Error).message },
      { status: 500 }
    )
  }
}