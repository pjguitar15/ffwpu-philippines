// Script to fix the existing user's member linking
import { dbConnect } from '@/lib/db'
import User from '@/models/User'
import Member from '@/models/Member'

async function fixUserMemberLinking() {
  try {
    await dbConnect()
    console.log('Connected to database')

    // Find the user
    const user = await User.findOne({ email: 'philcobsuzuki@gmail.com' })
    if (!user) {
      console.log('User not found')
      return
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
      console.log('Member not found with ID:', user.memberId)
      return
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
        console.log('Member updated:', {
          id: updateResult._id,
          userId: updateResult.userId,
          hasRegisteredAccount: updateResult.hasRegisteredAccount
        })
      } else {
        console.log('Member update failed')
      }
    } else {
      console.log('Member already has correct userId')
    }

    console.log('✅ Linking is now correct!')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    process.exit(0)
  }
}

fixUserMemberLinking()