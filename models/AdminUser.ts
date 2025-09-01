import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

export type AdminRole = 'super_admin' | 'content_manager' | 'news_editor'

const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ['super_admin', 'content_manager', 'news_editor'],
      default: 'news_editor',
    },
    passwordHash: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
)

export type AdminUserDoc = InferSchemaType<typeof AdminUserSchema>

export const AdminUser: Model<AdminUserDoc> =
  (mongoose.models.AdminUser as Model<AdminUserDoc>) ||
  mongoose.model<AdminUserDoc>('AdminUser', AdminUserSchema)
