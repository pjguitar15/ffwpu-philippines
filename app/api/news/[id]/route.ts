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
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect()
  const { id } = await params
  const doc = await findByIdOrSlug(id)
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const o: any = doc.toObject()
  o.id = String(o._id)
  return NextResponse.json(o, { headers: { 'Cache-Control': 'no-store' } })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect()
  const { id } = await params
  const doc = await findByIdOrSlug(id)
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  if (body.title) doc.title = body.title
  if ('subtitle' in body) {
    doc.subtitle =
      typeof body.subtitle === 'string' ? body.subtitle.trim() : ''
  }
  if (body.author) doc.author = body.author
  if (body.date) doc.date = body.date
  if (body.image) doc.image = body.image
  if (Array.isArray(body.gallery)) {
    doc.gallery = body.gallery
      .map((url: any) => String(url || '').trim())
      .filter(Boolean)
      .slice(0, 12)
  }
  if (Array.isArray(body.tags)) doc.tags = body.tags
  if (body.status) {
    let newStatus = body.status
    if (body.status === 'active') newStatus = 'published'
    if (body.status === 'inactive') newStatus = 'draft'
    doc.status = newStatus
  }
  if (typeof body.content === 'string')
    doc.content = toParagraphHtml(body.content)
  if (body.slug) doc.slug = slugify(body.slug)

  // ⬅️ NEW: testimonials
  if (Array.isArray(body.testimonials)) {
    doc.testimonials = body.testimonials
      .slice(0, 3)
      .map((t: any) => ({
        name: String(t?.name || '').trim(),
        role: String(t?.role || '').trim() || undefined,
        avatar: String(t?.avatar || '').trim() || undefined,
        quote: String(t?.quote || '').trim(),
      }))
      .filter((t: any) => t.name && t.quote)
  }

  await doc.save()
  const o: any = doc.toObject()
  o.id = String(o._id)
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
  const { id } = await params
  const doc = await findByIdOrSlug(id)
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

