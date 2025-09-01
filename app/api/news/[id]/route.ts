import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { News } from '@/models/News'
import { slugify, toParagraphHtml } from '@/lib/text'

async function findByIdOrSlug(idOrSlug: string) {
  const byId = await News.findById(idOrSlug)
  if (byId) return byId
  return News.findOne({ slug: idOrSlug })
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect()
  const doc = await findByIdOrSlug(params.id)
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const o: any = doc.toObject()
  o.id = String(o._id)
  return NextResponse.json(o)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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
  if (typeof body.content === 'string') doc.content = toParagraphHtml(body.content)
  if (body.slug) doc.slug = slugify(body.slug)

  await doc.save()
  const o: any = doc.toObject()
  o.id = String(o._id)
  return NextResponse.json(o)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect()
  const doc = await findByIdOrSlug(params.id)
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await doc.deleteOne()
  return NextResponse.json({ ok: true })
}
