import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { Event } from '@/models/Event'
import { recordAudit } from '@/lib/audit'

export async function GET() {
  await dbConnect()
  const items = await Event.find({}).sort({ date: -1 }).lean()
  return NextResponse.json(items)
}

const ALLOWED_FIELDS = [
  'title',
  'date',
  'end',
  'location',
  'area',
  'church',
  'image',
  'description',
  'button',
  'href',
] as const
type AllowedField = (typeof ALLOWED_FIELDS)[number]

function sanitizeEventBody(body: any) {
  const out: Partial<Record<AllowedField, any>> = {}
  for (const key of ALLOWED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      const v = (body as any)[key]
      out[key] = typeof v === 'string' ? v.trim() : v
    }
  }
  return out
}

export async function POST(req: Request) {
  await dbConnect()
  const body = await req.json()
  const payload = sanitizeEventBody(body)
  const created = await Event.create(payload)
  // Audit log
  try {
    const title = (body?.title as string) || 'Event'
    recordAudit({
      action: 'Created',
      resourceType: 'event',
      resourceId: String((created as any)?._id || ''),
      details: `Created event: ${title}`,
    })
  } catch {}
  return NextResponse.json(created, { status: 201 })
}
