import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { Event } from '@/models/Event'
import mongoose from 'mongoose'
import { recordAudit } from '@/lib/audit'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const { id } = params
  const item = mongoose.Types.ObjectId.isValid(id)
    ? await Event.findById(id).lean()
    : null
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  await dbConnect()
  const { id } = params
  const body = await req.json()
  const updated = await Event.findByIdAndUpdate(id, body, { new: true }).lean()
  if (!updated)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  // Audit log
  try {
    recordAudit({
      action: 'Updated',
      resourceType: 'event',
      resourceId: String(updated._id),
      details: `Updated event: ${updated.title}`,
    })
  } catch {}
  return NextResponse.json(updated)
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  await dbConnect()
  const { id } = params
  const before = await Event.findById(id).lean()
  await Event.findByIdAndDelete(id)
  // Audit log
  try {
    recordAudit({
      action: 'Deleted',
      resourceType: 'event',
      resourceId: id,
      details: `Deleted event: ${before?.title || id}`,
    })
  } catch {}
  return NextResponse.json({ ok: true })
}
