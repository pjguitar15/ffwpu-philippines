import mongoose, { Schema, models, model } from 'mongoose'

export interface NewsletterDoc extends mongoose.Document {
  email: string
  frequency: 'weekly' | 'monthly'
  createdAt: Date
  updatedAt: Date
}

const NewsletterSchema = new Schema<NewsletterDoc>(
  {
    email: { type: String, required: true, unique: true, index: true },
    frequency: { type: String, enum: ['weekly', 'monthly'], required: true },
  },
  { timestamps: true },
)

export const Newsletter =
  (models.Newsletter as mongoose.Model<NewsletterDoc>) ||
  model<NewsletterDoc>('Newsletter', NewsletterSchema)
