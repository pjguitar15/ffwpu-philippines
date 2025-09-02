import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { Event } from '@/models/Event'
import mongoose from 'mongoose'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const { id } = params
  const item = mongoose.Types.ObjectId.isValid(id)
    ? await Event.findById(id).lean()
    : null
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const { id } = params
  const body = await req.json()
  const updated = await Event.findByIdAndUpdate(id, body, { new: true }).lean()
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const { id } = params
  await Event.findByIdAndDelete(id)
  return NextResponse.json({ ok: true })
}
