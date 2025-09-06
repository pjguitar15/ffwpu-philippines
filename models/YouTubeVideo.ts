import mongoose, { Schema, models, model } from 'mongoose'

export interface YouTubeVideoDoc extends mongoose.Document {
  title: string
  description?: string
  videoId: string
  thumbnailUrl?: string
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const YouTubeVideoSchema = new Schema<YouTubeVideoDoc>(
  {
    title: { type: String, required: true },
    description: { type: String },
    videoId: { type: String, required: true, unique: true },
    thumbnailUrl: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { 
    timestamps: true,
    collection: 'youtubevideos' // Explicitly set collection name
  },
)

// Force recreation of the model in development to pick up schema changes
if (process.env.NODE_ENV === 'development') {
  delete models.YouTubeVideo
}

export const YouTubeVideo = (models.YouTubeVideo as mongoose.Model<YouTubeVideoDoc>) ||
  model<YouTubeVideoDoc>('YouTubeVideo', YouTubeVideoSchema)
