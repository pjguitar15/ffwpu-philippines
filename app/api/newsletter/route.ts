import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { Newsletter } from '@/models/Newsletter'

// GET /api/newsletter?page=1&pageSize=20
export async function GET(req: Request) {
  await dbConnect()
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)),
  )

  const skip = (page - 1) * pageSize
  const [items, total] = await Promise.all([
    Newsletter.find({}).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
    Newsletter.countDocuments({}),
  ])

  return NextResponse.json({ items, total, page, pageSize })
}

// POST /api/newsletter
// { email: string, frequency: 'weekly'|'monthly' }
export async function POST(req: Request) {
  await dbConnect()
  const body = await req.json()
  const email = String(body.email || '').trim().toLowerCase()
  const frequency = body.frequency === 'monthly' ? 'monthly' : 'weekly'
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // Upsert by email
  const doc = await Newsletter.findOneAndUpdate(
    { email },
    { $set: { email, frequency } },
    { new: true, upsert: true },
  ).lean()

  return NextResponse.json(doc, { status: 201 })
}
