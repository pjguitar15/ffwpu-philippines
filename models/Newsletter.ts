import mongoose, { Schema, models, model } from 'mongoose'

export interface NewsletterDoc extends mongoose.Document {
  email: string
  firstName: string
  lastName: string
  frequency: 'weekly' | 'monthly'
  createdAt: Date
  updatedAt: Date
}

const NewsletterSchema = new Schema<NewsletterDoc>(
  {
    email: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    frequency: { type: String, enum: ['weekly', 'monthly'], required: true },
  },
  {
    timestamps: true,
    strict: false, // Allow flexible updates for migration
  },
)

// Clear existing model to force recompilation with new schema
if (mongoose.connection.readyState === 1 && models.Newsletter) {
  delete models.Newsletter
}

export const Newsletter =
  (models.Newsletter as mongoose.Model<NewsletterDoc>) ||
  model<NewsletterDoc>('Newsletter', NewsletterSchema)
