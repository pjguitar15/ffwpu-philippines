import mongoose from 'mongoose'

const MemberSchema = new mongoose.Schema({
  // Basic Identity
  id: { type: String, required: true, unique: true },
  continent: { type: String, required: true },
  region: { type: String, required: true },
  nation: { type: String, required: true },
  church: { type: String, required: true },
  city: { type: String, required: true },
  givenName: { type: String, required: true },
  familyName: { type: String, required: true },
  fullName: { type: String, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  age: { type: Number, required: true },
  ageGroup: { type: String, required: true },
  
  // Contact Information
  email: { type: String, required: true },
  phone: { type: String, required: true },
  
  // Blessing Information
  blessedChild: { type: String, required: true },
  blessingStatus: { type: String, required: true },
  blessedYear: { type: Number },
  nameOfSpouse: { type: String },
  
  // Membership Details
  dateOfJoining: { type: Date, required: true },
  spiritualParent: { type: String },
  registeredAt: { type: String, required: true },
  registeredBy: { type: String, required: true },
  membershipCategory: { type: String, required: true },
  note: { type: String }
}, { 
  timestamps: true,
  collection: 'members'
})

// Add indexes for performance
MemberSchema.index({ id: 1 })
MemberSchema.index({ email: 1 })
MemberSchema.index({ church: 1 })

const Member = mongoose.models.Member || mongoose.model('Member', MemberSchema)

export default Member