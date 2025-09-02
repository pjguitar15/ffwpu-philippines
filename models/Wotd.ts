import mongoose, { Schema, model, models } from 'mongoose'

const WotdSchema = new Schema(
  {
    title: { type: String, default: 'Word of the Day' },
    text: { type: String, required: true },
    attribution: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    tags: { type: [String], default: [] },
    date: { type: String, default: '' }, // intended publish date (YYYY-MM-DD)
  },
  { timestamps: true },
)

const WotdSettingSchema = new Schema(
  {
    currentId: { type: Schema.Types.ObjectId, ref: 'Wotd', default: null },
    mode: { type: String, enum: ['fixed', 'random'], default: 'fixed' },
    nextChangeAt: { type: Date, default: null },
    scheduledId: { type: Schema.Types.ObjectId, ref: 'Wotd', default: null },
  },
  { timestamps: true },
)

// Individual scheduled changes (calendar-based)
const WotdScheduleSchema = new Schema(
  {
    mode: { type: String, enum: ['fixed', 'random'], required: true },
    changeAt: { type: Date, required: true },
    scheduledId: { type: Schema.Types.ObjectId, ref: 'Wotd', default: null },
  },
  { timestamps: true },
)

export const Wotd = (models as any).Wotd || model('Wotd', WotdSchema)
export const WotdSetting = (models as any).WotdSetting || model('WotdSetting', WotdSettingSchema)
export const WotdSchedule = (models as any).WotdSchedule || model('WotdSchedule', WotdScheduleSchema)

export type TWotd = mongoose.InferSchemaType<typeof WotdSchema> & { _id: any }
export type TWotdSetting = mongoose.InferSchemaType<typeof WotdSettingSchema> & { _id: any }
export type TWotdSchedule = mongoose.InferSchemaType<typeof WotdScheduleSchema> & { _id: any }
