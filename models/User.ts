import mongoose from 'mongoose'

// Clear any existing model to prevent caching issues
if (mongoose.models.User) {
  delete mongoose.models.User
}

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
      // Add unique index to prevent multiple accounts per member
      unique: true,
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'deleted', 'pending'],
      default: 'active',
    },
    isEmailVerified: {
      type: Boolean,
      default: true, // Default to true for member registration
    },
    verificationToken: {
      type: String,
    },
    lastLoginAt: {
      type: Date,
    },
    registrationAttempts: [
      {
        email: { type: String, required: true },
        attemptedAt: { type: Date, default: Date.now },
        ipAddress: { type: String },
        userAgent: { type: String },
        status: {
          type: String,
          enum: ['success', 'blocked', 'failed'],
          required: true,
        },
        reason: { type: String },
      },
    ],
    lastRegistrationAttempt: { type: Date },
    role: { type: String, enum: ['member', 'admin'], default: 'member' },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    collection: 'users',
  },
)

// Add indexes for performance
UserSchema.index({ email: 1 })
UserSchema.index({ memberId: 1 })
UserSchema.index({ verificationToken: 1 })

const User = mongoose.model('User', UserSchema)

export default User