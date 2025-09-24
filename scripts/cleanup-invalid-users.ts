// Simple cleanup script to remove users with invalid passwordHash
// Run this if you have authentication issues

import { dbConnect } from '@/lib/db'
import User from '@/models/User'

export async function cleanupInvalidUsers() {
  await dbConnect()
  
  try {
    // Find users with missing or null passwordHash
    const invalidUsers = await User.find({
      $or: [
        { passwordHash: { $exists: false } },
        { passwordHash: null },
        { passwordHash: '' }
      ]
    })
    
    console.log(`Found ${invalidUsers.length} users with invalid passwordHash`)
    
    if (invalidUsers.length > 0) {
      console.log('Invalid users:')
      invalidUsers.forEach(user => {
        console.log(`- ${user.email} (created: ${user.createdAt})`)
      })
      
      // Delete invalid users
      const result = await User.deleteMany({
        $or: [
          { passwordHash: { $exists: false } },
          { passwordHash: null },
          { passwordHash: '' }
        ]
      })
      
      console.log(`Deleted ${result.deletedCount} invalid users`)
      return result.deletedCount
    }
    
    return 0
  } catch (error) {
    console.error('Error cleaning up users:', error)
    throw error
  }
}

// If running directly
if (require.main === module) {
  cleanupInvalidUsers()
    .then(count => {
      console.log(`Cleanup complete. Removed ${count} invalid users.`)
      process.exit(0)
    })
    .catch(error => {
      console.error('Cleanup failed:', error)
      process.exit(1)
    })
}