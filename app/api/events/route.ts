import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { Event } from '@/models/Event'
import { recordAudit } from '@/lib/audit'

export async function GET() {
  await dbConnect()
  const items = await Event.find({}).sort({ date: -1 }).lean()
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  await dbConnect()
  const body = await req.json()
  const created = await Event.create(body)
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
