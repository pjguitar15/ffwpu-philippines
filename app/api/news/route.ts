import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { News } from '@/models/News'
import { slugify, toParagraphHtml } from '@/lib/text'
import { recordAudit } from '@/lib/audit'

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export async function GET(req: NextRequest) {
  await dbConnect()

  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()

  // Only show published (or missing status treated as published)
  const publishedMatch = {
    $or: [{ status: { $exists: false } }, { status: 'published' }],
  }

  // --- Suggest mode (used by your HeaderSearch) ---
  if (q) {
    const rx = new RegExp(escape(q), 'i')
    const rxStarts = new RegExp('^' + escape(q), 'i')

    // Find candidates by regex across fields
    const candidates = await News.find({
      ...publishedMatch,
      $or: [
        { title: rx },
        { slug: rx },
        { tags: rx }, // works on string[] fields
        { content: rx }, // if you store HTML, that's fine for a quick match
      ],
    })
      .select('slug title date tags image') // keep the payload light
      .limit(50) // cap DB load before scoring
      .lean()

    // Score in JS to push better hits up (title match > prefix > tags > content)
    const scored = candidates
      .map((i: any) => {
        let score = 0
        if (rx.test(i.title)) score += 20
        if (rxStarts.test(i.title)) score += 15
        if (Array.isArray(i.tags) && i.tags.some((t: string) => rx.test(t)))
          score += 8
        if (rx.test(i.content || '')) score += 5

        // tiny recency nudge
        const days =
          Math.max(
            1,
            (Date.now() - (i.date ? new Date(i.date).getTime() : 0)) /
              86_400_000,
          ) || 1
        score += Math.max(0, 5 - Math.log10(days + 1))

        return { item: i, score }
      })
      .filter(({ score }) => score > 0) // ✅ ensure the query actually matches
      .sort(
        (a, b) =>
          b.score - a.score ||
          (new Date(b.item.date).getTime() || 0) -
            (new Date(a.item.date).getTime() || 0),
      )
      .slice(0, 8)
      .map(({ item }) => item)

    return NextResponse.json(scored, {
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  // --- Full list mode (no q) ---
  const items = await News.find(publishedMatch).sort({ date: -1 }).lean()

  // preserve your previous id mapping if you still need it
  const withId = items.map((d: any) => ({ ...d, id: String(d._id) }))
  return NextResponse.json(withId, { headers: { 'Cache-Control': 'no-store' } })
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
    status = 'published',
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
    return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
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
  // Audit log
  recordAudit({
    action: 'Created',
    resourceType: 'news',
    resourceId: asJson.id,
    details: `Created news: ${title}`,
  })
  return NextResponse.json(asJson)
}
