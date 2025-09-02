import mongoose, { Schema, models, model } from 'mongoose'

export interface AuditLogDoc extends mongoose.Document {
  adminId?: mongoose.Types.ObjectId | null
  adminEmail?: string
  action: string
  resourceType: string
  resourceId?: string
  details?: string
  createdAt: Date
  updatedAt: Date
}

const AuditLogSchema = new Schema<AuditLogDoc>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null },
    adminEmail: { type: String, default: '' },
    action: { type: String, required: true },
    resourceType: { type: String, required: true },
    resourceId: { type: String, default: '' },
    details: { type: String, default: '' },
  },
  { timestamps: true },
)

export const AuditLog =
  (models.AuditLog as mongoose.Model<AuditLogDoc>) ||
  model<AuditLogDoc>('AuditLog', AuditLogSchema)
