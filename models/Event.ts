import mongoose, { Schema, models, model } from 'mongoose'

export interface EventDoc extends mongoose.Document {
  title: string
  date: string // ISO datetime string e.g., 2025-07-27T09:00:00
  end?: string // ISO datetime string
  location: string
  area: 'Area 1' | 'Area 2' | 'Area 3' | 'Area 4' | 'Area 5' | 'Nationwide'
  region: string
  church?: string
  image: string
  description?: string
  button?: string
  href?: string
  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<EventDoc>(
  {
    title: { type: String, required: true },
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
    description: { type: String },
    button: { type: String },
    href: { type: String },
  },
  { timestamps: true },
)

// Handle Next.js dev HMR: if the model exists but schema is outdated (e.g. missing
// newly added fields like `description`), recompile the model in development.
let EventModel: mongoose.Model<EventDoc>
if (models.Event) {
  EventModel = models.Event as mongoose.Model<EventDoc>
  if (!EventModel.schema.path('description') && process.env.NODE_ENV !== 'production') {
    delete (mongoose.models as any).Event
    EventModel = model<EventDoc>('Event', EventSchema)
  }
} else {
  EventModel = model<EventDoc>('Event', EventSchema)
}

export const Event = EventModel
