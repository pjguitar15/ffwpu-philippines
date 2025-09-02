import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { Event } from '@/models/Event'
import seed from '@/data/events-seed'

export async function POST() {
  await dbConnect()
  const count = await Event.countDocuments()
  if (count > 0) return NextResponse.json({ ok: true, skipped: true })
  const docs = await Event.insertMany(seed as any[])
  return NextResponse.json({ ok: true, inserted: docs.length })
}
