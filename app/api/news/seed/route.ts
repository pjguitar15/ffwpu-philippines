import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { News } from '@/models/News'
import { sampleNews } from '@/data/news'

export async function POST() {
  await dbConnect()
  const count = await News.countDocuments()
  if (count > 0) return NextResponse.json({ seeded: false, count })
  const docs = await News.insertMany(sampleNews)
  return NextResponse.json({ seeded: true, count: docs.length })
}
