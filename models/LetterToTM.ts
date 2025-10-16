// models/LetterToTM.ts
import mongoose, { Schema, models, model } from 'mongoose'

export interface LetterToTMDoc extends mongoose.Document {
  name: string
  region: string
  content: string
  color: string
  rotation: number
  position: { x: number; y: number }
  createdAt: Date
  updatedAt: Date
}

const LetterToTMSchema = new Schema<LetterToTMDoc>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    region: {
      type: String,
      required: [true, 'Region is required'],
      trim: true,
      maxlength: [100, 'Region cannot exceed 100 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      maxlength: [1000, 'Content cannot exceed 1000 characters']
    },
    color: {
      type: String,
      required: true,
      default: '#fdf2f8'
    },
    rotation: {
      type: Number,
      required: true,
      default: 0
    },
    position: {
      x: {
        type: Number,
        required: true,
        default: 0
      },
      y: {
        type: Number,
        required: true,
        default: 0
      }
    }
  },
  {
    timestamps: true
  }
)

const LetterToTM = models.LetterToTM || model<LetterToTMDoc>('LetterToTM', LetterToTMSchema)

export default LetterToTM