// models/News.ts
import mongoose, { Schema, models, model } from 'mongoose'

export interface Testimonial {
  name: string
  role?: string
  avatar?: string
  quote: string
}

export interface NewsDoc extends mongoose.Document {
  title: string
  subtitle?: string
  author: string
  date: string
  image: string
  gallery: string[]
  tags: string[]
  status: 'published' | 'draft' | 'active' | 'inactive'
  views: number
  likes: number
  content: string
  slug: string
  comments: any[]
  testimonials: Testimonial[]
  createdAt: Date
  updatedAt: Date
}

const TestimonialSchema = new Schema<Testimonial>(
  {
    name: { type: String, required: true },
    role: { type: String },
    avatar: { type: String },
    quote: { type: String, required: true },
  },
  { _id: false },
)

const NewsSchema = new Schema<NewsDoc>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    author: { type: String, required: true },
    date: { type: String, required: true },
    image: { type: String, required: true },
    gallery: { type: [String], default: [] },
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
    comments: { type: [Schema.Types.Mixed] as unknown as any, default: [] },
    testimonials: { type: [TestimonialSchema], default: [] },
  },
  { timestamps: true },
)

if (models.News) delete models.News
export const News = model<NewsDoc>('News', NewsSchema)

