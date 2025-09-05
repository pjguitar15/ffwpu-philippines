import mongoose, { Schema, models, model } from 'mongoose'

export interface EventDoc extends mongoose.Document {
  title: string
  description?: string
  date: string // ISO datetime string e.g., 2025-07-27T09:00:00
  end?: string // ISO datetime string
  location: string
  area: 'Area 1' | 'Area 2' | 'Area 3' | 'Area 4' | 'Area 5' | 'Nationwide'
  region: string
  church?: string
  image: string
  button?: string
  href?: string
  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<EventDoc>(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String, required: true },
    end: { type: String },
    location: { type: String, required: true },
    area: {
      type: String,
      enum: ['Area 1', 'Area 2', 'Area 3', 'Area 4', 'Area 5', 'Nationwide'],
      required: true,
    },
    region: { type: String, required: true },
    church: { type: String },
    image: { type: String, required: true },
    button: { type: String },
    href: { type: String },
  },
  { timestamps: true },
)

// Force recreation of the model in development to pick up schema changes
if (process.env.NODE_ENV === 'development') {
  delete models.Event
}

export const Event = (models.Event as mongoose.Model<EventDoc>) ||
  model<EventDoc>('Event', EventSchema)
