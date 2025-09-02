import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { Wotd, WotdSchedule } from '@/models/Wotd'

// GET /api/wotd/schedule - list upcoming schedules (next 90 days)
export async function GET() {
  await dbConnect()
  const now = new Date()
  const in90 = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
  const items = await WotdSchedule.find({ changeAt: { $gte: now, $lte: in90 } })
    .sort({ changeAt: 1 })
    .lean()
  return NextResponse.json(items.map((x: any) => ({
    id: String(x._id),
    mode: x.mode,
    changeAt: x.changeAt,
    scheduledId: x.scheduledId ? String(x.scheduledId) : null,
  })))
}

// POST /api/wotd/schedule - create schedules from selected dates
// body: { dates: string[] (YYYY-MM-DD), time: string (HH:mm), mode: 'fixed'|'random', scheduledId?: string }
export async function POST(req: Request) {
  await dbConnect()
  const body = await req.json().catch(() => ({}))
  const dates: string[] = Array.isArray(body.dates) ? body.dates : []
  const time: string = body.time || '00:00'
  const mode = body.mode as 'fixed' | 'random'
  const scheduledId = body.scheduledId as string | undefined

  if (!dates.length || !mode) {
    return NextResponse.json({ error: 'dates and mode required' }, { status: 400 })
  }
  if (mode === 'fixed' && !scheduledId) {
    return NextResponse.json({ error: 'scheduledId required for fixed mode' }, { status: 400 })
  }

  // Validate scheduledId exists if provided
  if (scheduledId) {
    const exists = await Wotd.exists({ _id: scheduledId })
    if (!exists) return NextResponse.json({ error: 'scheduledId not found' }, { status: 404 })
  }

  // Build Date objects from date + time (assumed local tz)
  const created: any[] = []
  for (const d of dates) {
    // Expect d = YYYY-MM-DD, time = HH:mm
    const dt = new Date(`${d}T${time}:00`)
    if (isNaN(dt.getTime())) continue
    created.push({ mode, changeAt: dt, scheduledId: scheduledId || null })
  }
  if (!created.length) {
    return NextResponse.json({ error: 'no valid dates' }, { status: 400 })
  }

  const docs = await WotdSchedule.insertMany(created)
  return NextResponse.json(
    docs.map((x: any) => ({ id: String(x._id), mode: x.mode, changeAt: x.changeAt, scheduledId: x.scheduledId ? String(x.scheduledId) : null })),
    { status: 201 },
  )
}

// PUT /api/wotd/schedule - upsert a schedule for a specific day
// body: { date: 'YYYY-MM-DD', time?: 'HH:mm', scheduledId?: string }
export async function PUT(req: Request) {
  await dbConnect()
  const body = await req.json().catch(() => ({}))
  const date: string = body.date
  const time: string = body.time || '09:00'
  const scheduledId = body.scheduledId as string | undefined

  if (!date) {
    return NextResponse.json({ error: 'date required' }, { status: 400 })
  }

  // Delete any existing schedules for that calendar day
  const start = new Date(`${date}T00:00:00`)
  const end = new Date(`${date}T23:59:59.999`)
  await WotdSchedule.deleteMany({ changeAt: { $gte: start, $lte: end } })

  // If no scheduledId provided, treat as clearing the schedule for that day
  if (!scheduledId) {
    return NextResponse.json({ ok: true })
  }

  // Validate target exists
  const exists = await Wotd.exists({ _id: scheduledId })
  if (!exists) return NextResponse.json({ error: 'scheduledId not found' }, { status: 404 })

  const changeAt = new Date(`${date}T${time}:00`)
  if (isNaN(changeAt.getTime())) {
    return NextResponse.json({ error: 'invalid date/time' }, { status: 400 })
  }

  const doc = await WotdSchedule.create({ mode: 'fixed', changeAt, scheduledId })
  return NextResponse.json({ id: String(doc._id), mode: doc.mode, changeAt: doc.changeAt, scheduledId: String(doc.scheduledId) })
}
