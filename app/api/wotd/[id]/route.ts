import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { Wotd, WotdSetting } from '@/models/Wotd'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  await dbConnect()
  const item = await Wotd.findById(params.id).lean()
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  await dbConnect()
  const body = await req.json()
  const updated = await Wotd.findByIdAndUpdate(
    params.id,
    {
      $set: {
        title: body.title ?? 'Word of the Day',
        text: body.text,
        attribution: body.attribution ?? '',
        status: body.status === 'draft' ? 'draft' : 'published',
        tags: Array.isArray(body.tags) ? body.tags : [],
        date: body.date ?? '',
      },
    },
    { new: true },
  ).lean()
  if (!updated)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  await dbConnect()
  const deleted = await Wotd.findByIdAndDelete(params.id)
  if (!deleted)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  // If deleted was current/scheduled, clear from settings
  const setting = await WotdSetting.findOne({})
  if (setting) {
    let changed = false
    if (String(setting.currentId || '') === String(params.id)) {
      setting.currentId = null as any
      changed = true
    }
    if (String(setting.scheduledId || '') === String(params.id)) {
      setting.scheduledId = null as any
      changed = true
    }
    if (changed) await setting.save()
  }
  return NextResponse.json({ ok: true })
}
