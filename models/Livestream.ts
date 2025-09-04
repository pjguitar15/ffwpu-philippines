import mongoose, { Schema, models, model } from 'mongoose'

export interface LivestreamDoc extends mongoose.Document {
  url: string
  isActive: boolean
  title?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const LivestreamSchema = new Schema<LivestreamDoc>(
  {
    url: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    title: { type: String, default: 'Live Stream' },
    description: { type: String, default: '' },
  },
  { timestamps: true },
)

// Clear the model cache to ensure the new schema is used
if (models.Livestream) {
  delete models.Livestream
}

export const Livestream = model<LivestreamDoc>('Livestream', LivestreamSchema)
