import mongoose, { Schema, models, model } from 'mongoose'

export interface NewsDoc extends mongoose.Document {
  title: string
  author: string
  date: string
  image: string
  tags: string[]
  status: 'active' | 'inactive'
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
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
  // Use Mixed[] for now; admin UI doesn't edit comments yet
  comments: { type: [Schema.Types.Mixed] as unknown as any, default: [] },
  },
  { timestamps: true },
)

export const News = (models.News as mongoose.Model<NewsDoc>) ||
  model<NewsDoc>('News', NewsSchema)
