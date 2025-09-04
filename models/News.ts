import mongoose, { Schema, models, model } from 'mongoose'

export interface NewsDoc extends mongoose.Document {
  title: string
  author: string
  date: string
  image: string
  tags: string[]
  status: 'published' | 'draft' | 'active' | 'inactive' // Temporarily support both for migration
  views: number
  likes: number
  content: string
  slug: string
  comments: any[]
  createdAt: Date
  updatedAt: Date
}

const NewsSchema = new Schema<NewsDoc>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: String, required: true }, // ISO date string
    image: { type: String, required: true },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['published', 'draft', 'active', 'inactive'],
      default: 'published',
    },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    // Use Mixed[] for now; admin UI doesn't edit comments yet
    comments: { type: [Schema.Types.Mixed] as unknown as any, default: [] },
  },
  { timestamps: true },
)

// Clear the model cache to ensure the new schema is used
if (models.News) {
  delete models.News
}

export const News = model<NewsDoc>('News', NewsSchema)
