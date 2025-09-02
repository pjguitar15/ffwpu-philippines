import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { Wotd } from '@/models/Wotd'
import { recordAudit } from '@/lib/audit'

export async function GET() {
  await dbConnect()
  const items = await Wotd.find({}).sort({ createdAt: -1 }).lean()
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  await dbConnect()
  const body = await req.json()
  if (!body?.text || typeof body.text !== 'string') {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 })
  }
  const created = await Wotd.create({
    title: body.title || 'Word of the Day',
    text: body.text,
    attribution: body.attribution || '',
    status: body.status === 'draft' ? 'draft' : 'published',
    tags: Array.isArray(body.tags) ? body.tags : [],
    date: body.date || '',
  })
  // Audit log
  try {
    recordAudit({
      action: 'Created',
      resourceType: 'wotd',
      resourceId: String((created as any)?._id),
      details: `Created WOTD: ${(body.title || '').slice(0, 50)}`,
    })
  } catch {}
  return NextResponse.json(created, { status: 201 })
}
