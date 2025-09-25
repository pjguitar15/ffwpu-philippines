import mongoose from 'mongoose'

// Clear any existing model to prevent caching issues
if (mongoose.models.Member) {
  delete mongoose.models.Member
}

const MemberSchema = new mongoose.Schema(
  {
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
    spiritualParent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      default: null,
    },
    registeredAt: { type: String, required: true },
    registeredBy: { type: String, required: true },
    membershipCategory: { type: String, required: true },
    note: { type: String },

    // User registration fields
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    hasRegisteredAccount: {
      type: Boolean,
      default: false,
    },
    // Enhanced registration tracking
    registrationHistory: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      email: { type: String, required: true },
      registeredAt: { type: Date, default: Date.now },
      status: { 
        type: String, 
        enum: ['active', 'deleted', 'suspended'],
        default: 'active'
      },
      ipAddress: { type: String },
      userAgent: { type: String }
    }],
    firstRegistrationAt: { type: Date },
    lastRegistrationAttempt: { type: Date },
    registrationAttemptCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: 'members',
  },
)

// Add indexes for performance
MemberSchema.index({ id: 1 })
MemberSchema.index({ church: 1 })
MemberSchema.index({ spiritualParent: 1 }) // Add index for spiritual parent lookups

const Member = mongoose.model('Member', MemberSchema)

export default Member