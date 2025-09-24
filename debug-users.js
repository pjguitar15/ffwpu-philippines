const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

// Connect to MongoDB
const MONGODB_STRING = process.env.MONGODB_STRING
if (!MONGODB_STRING) {
  console.error('MONGODB_STRING environment variable is required')
  console.error('Please make sure .env.local file exists with MONGODB_STRING')
  process.exit(1)
}

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  memberId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Member'
  },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' }
}, { 
  timestamps: true,
  collection: 'users'
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

async function checkUsers() {
  try {
    await mongoose.connect(MONGODB_STRING)
    console.log('Connected to MongoDB')
    
    // Find all users
    const users = await User.find({})
    console.log(`Found ${users.length} users`)
    
    // Check for users with missing or invalid passwordHash
    const problematicUsers = users.filter(user => !user.passwordHash)
    
    if (problematicUsers.length > 0) {
      console.log('\n❌ Users with missing passwordHash:')
      problematicUsers.forEach(user => {
        console.log(`- ${user.email} (ID: ${user._id})`)
        console.log(`  passwordHash: ${user.passwordHash}`)
        console.log(`  password: ${user.password}`) // Check if old field exists
      })
      
      console.log('\n⚠️  These users need to be deleted and re-registered, or have their passwords reset.')
    } else {
      console.log('\n✅ All users have valid passwordHash fields')
    }
    
    await mongoose.disconnect()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

checkUsers()