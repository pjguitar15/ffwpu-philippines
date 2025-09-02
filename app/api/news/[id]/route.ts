import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { News } from '@/models/News'
import { slugify, toParagraphHtml } from '@/lib/text'
import mongoose from 'mongoose'
import { recordAudit } from '@/lib/audit'

async function findByIdOrSlug(idOrSlug: string) {
  // Only try ObjectId lookup if the value is a valid ObjectId to avoid CastError
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    const byId = await News.findById(idOrSlug)
    if (byId) return byId
  }
  return News.findOne({ slug: idOrSlug })
}

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect()
  const doc = await findByIdOrSlug(params.id)
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const o: any = doc.toObject()
  o.id = String(o._id)
  return NextResponse.json(o)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect()
  const doc = await findByIdOrSlug(params.id)
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const body = await req.json()

  if (body.title) doc.title = body.title
  if (body.author) doc.author = body.author
  if (body.date) doc.date = body.date
  if (body.image) doc.image = body.image
  if (Array.isArray(body.tags)) doc.tags = body.tags
  if (body.status) doc.status = body.status
  if (typeof body.content === 'string')
    doc.content = toParagraphHtml(body.content)
  if (body.slug) doc.slug = slugify(body.slug)

  await doc.save()
  const o: any = doc.toObject()
  o.id = String(o._id)
  // Audit log
  try {
    recordAudit({
      action: 'Updated',
      resourceType: 'news',
      resourceId: String(o.id),
      details: `Updated news: ${o.title}`,
    })
  } catch {}
  return NextResponse.json(o)
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect()
  const doc = await findByIdOrSlug(params.id)
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await doc.deleteOne()
  // Audit log
  try {
    const o: any = doc.toObject()
    recordAudit({
      action: 'Deleted',
      resourceType: 'news',
      resourceId: String(o._id),
      details: `Deleted news: ${o.title}`,
    })
  } catch {}
  return NextResponse.json({ ok: true })
}
