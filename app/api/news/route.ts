import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { News } from '@/models/News'
import { slugify, toParagraphHtml } from '@/lib/text'

export async function GET() {
  await dbConnect()
  const items = await News.find().sort({ date: -1 }).lean()
  const withId = items.map((d: any) => ({ ...d, id: String(d._id) }))
  return NextResponse.json(withId)
}

export async function POST(req: NextRequest) {
  await dbConnect()
  const body = await req.json()
  const {
    title,
    author,
    date,
    image,
    tags = [],
    status = 'active',
    content = '',
  } = body || {}

  if (!title || !author || !date || !image) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 },
    )
  }

  const slug = body.slug || slugify(title)
  const exists = await News.findOne({ slug })
  if (exists) {
    return NextResponse.json(
      { error: 'Slug already exists' },
      { status: 409 },
    )
  }

  const doc = await News.create({
    title,
    author,
    date,
    image,
    tags,
    status,
    content: toParagraphHtml(content),
    slug,
  })
  const asJson: any = doc.toObject()
  asJson.id = String(asJson._id)
  return NextResponse.json(asJson)
}
