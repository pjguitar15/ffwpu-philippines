import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import User from '@/models/User'
import Member from '@/models/Member'

export async function POST() {
  try {
    await dbConnect()
    console.log('Connected to database')

    // Find the user
    const user = await User.findOne({ email: 'philcobsuzuki@gmail.com' })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('Found user:', {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      memberId: user.memberId
    })

    // Find the member by memberId
    const member = await Member.findById(user.memberId)
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    console.log('Found member:', {
      id: member._id,
      fullName: member.fullName,
      userId: member.userId,
      hasRegisteredAccount: member.hasRegisteredAccount
    })

    // Check if member needs to be updated
    if (!member.userId || member.userId.toString() !== user._id.toString()) {
      console.log('Updating member with userId...')
      
      const updateResult = await Member.findByIdAndUpdate(member._id, {
        userId: user._id,
        hasRegisteredAccount: true
      }, { new: true })

      if (updateResult) {
        console.log('Member updated successfully')
        return NextResponse.json({
          success: true,
          message: 'Member linking fixed successfully',
          user: {
            id: user._id,
            email: user.email,
            memberId: user.memberId
          },
          member: {
            id: updateResult._id,
            fullName: updateResult.fullName,
            userId: updateResult.userId,
            hasRegisteredAccount: updateResult.hasRegisteredAccount
          }
        })
      } else {
        return NextResponse.json({ error: 'Failed to update member' }, { status: 500 })
      }
    } else {
      return NextResponse.json({
        success: true,
        message: 'Member already has correct userId',
        user: {
          id: user._id,
          email: user.email,
          memberId: user.memberId
        },
        member: {
          id: member._id,
          fullName: member.fullName,
          userId: member.userId,
          hasRegisteredAccount: member.hasRegisteredAccount
        }
      })
    }

  } catch (error) {
    console.error('Error fixing user linking:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    )
  }
}