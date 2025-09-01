import mongoose, { Schema, Model, InferSchemaType } from 'mongoose'

const VerificationTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'AdminUser' },
    token: { type: String, required: true, unique: true, index: true },
    purpose: { type: String, enum: ['invite', 'reset'], required: true },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date },
  },
  { timestamps: true },
)

export type VerificationTokenDoc = InferSchemaType<typeof VerificationTokenSchema>

export const VerificationToken: Model<VerificationTokenDoc> =
  (mongoose.models.VerificationToken as Model<VerificationTokenDoc>) ||
  mongoose.model<VerificationTokenDoc>('VerificationToken', VerificationTokenSchema)
