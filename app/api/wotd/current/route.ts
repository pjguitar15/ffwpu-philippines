import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { Wotd, WotdSetting, WotdSchedule } from '@/models/Wotd'

const WOTD_TIME_ZONE = 'Asia/Manila'

function getLocalDateKey(date: Date, timeZone = WOTD_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const get = (type: string) => parts.find((part) => part.type === type)?.value
  return `${get('year')}-${get('month')}-${get('day')}`
}

function stableHash(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

async function pickDailyRandomWotd(date = new Date()) {
  const candidates = await Wotd.find({ status: 'published' })
    .sort({ _id: 1 })
    .lean()

  if (candidates.length === 0) return null

  const dateKey = getLocalDateKey(date)
  const index = stableHash(`${dateKey}:wotd`) % candidates.length
  return candidates[index]
}

async function getOrCreateSettings() {
  let s = await WotdSetting.findOne({})
  if (!s) s = await WotdSetting.create({})
  return s
}

export async function GET() {
  await dbConnect()
  const now = new Date()
  const s = await getOrCreateSettings()

  // First, apply any due calendar schedules (WotdSchedule)
  const due = await WotdSchedule.find({ changeAt: { $lte: now } })
    .sort({ changeAt: 1 })
    .lean()
  if (due.length > 0) {
    let newCurrentId: any = s.currentId
    for (const item of due) {
      if (item.mode === 'random') {
        const candidates = await Wotd.find({ status: 'published' })
        if (candidates.length > 0) {
          const pick = candidates[Math.floor(Math.random() * candidates.length)]
          newCurrentId = pick._id
        }
      } else if (item.mode === 'fixed' && item.scheduledId) {
        newCurrentId = item.scheduledId as any
      }
    }
    if (newCurrentId) {
      s.currentId = newCurrentId
      // Calendar schedules are independent of the simple setting-based schedule
      // so we clear any past-due nextChangeAt if it has already passed.
      if (s.nextChangeAt && s.nextChangeAt.getTime() <= now.getTime()) {
        s.nextChangeAt = null
        s.scheduledId = null as any
      }
      await s.save()
    }
    // Consume applied schedules
    await WotdSchedule.deleteMany({ changeAt: { $lte: now } })
  }

  // Apply due schedule if any
  if (s.nextChangeAt && s.nextChangeAt.getTime() <= now.getTime()) {
    if (s.mode === 'random') {
      const candidates = await Wotd.find({ status: 'published' })
      if (candidates.length > 0) {
        const pick = candidates[Math.floor(Math.random() * candidates.length)]
        s.currentId = pick._id
      }
    } else if (s.mode === 'fixed' && s.scheduledId) {
      s.currentId = s.scheduledId
    }
    s.nextChangeAt = null
    s.scheduledId = null as any
    await s.save()
  }

  const dailyRandom = await pickDailyRandomWotd(now)
  if (dailyRandom && String(s.currentId || '') !== String(dailyRandom._id)) {
    s.currentId = dailyRandom._id as any
    s.mode = 'random'
    s.nextChangeAt = null
    s.scheduledId = null as any
    await s.save()
  }

  let current: any = dailyRandom
  if (!current && s.currentId) current = await Wotd.findById(s.currentId).lean()
  // Fallback: pick latest published
  if (!current) {
    current = await Wotd.findOne({ status: 'published' })
      .sort({ createdAt: -1 })
      .lean()
  }

  if (!current) {
    return NextResponse.json(
      {
        id: 'fallback',
        title: 'Word of the Day',
        text:
          '“Live for the sake of others, and your life will overflow with purpose.”',
        attribution: '— True Parents',
      },
      { status: 200 },
    )
  }

  const payload: any = {
    id: String(current._id),
    title: current.title || 'Word of the Day',
    text: current.text,
    attribution: current.attribution || '',
  }
  // Include setting summary for admin UI convenience
  if (s) {
    payload.setting = {
      mode: s.mode,
      changeAt: s.nextChangeAt,
      scheduledId: s.scheduledId,
    }
  }
  return NextResponse.json(payload)
}

// Set current explicitly
export async function POST(req: Request) {
  await dbConnect()
  const body = await req.json().catch(() => ({}))
  const id = body?.id as string | undefined
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const item = await Wotd.findById(id)
  if (!item) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const s = await getOrCreateSettings()
  s.currentId = item._id as any
  await s.save()
  return NextResponse.json({ ok: true })
}

// Schedule change or randomize
export async function PUT(req: Request) {
  await dbConnect()
  const body = await req.json().catch(() => ({}))
  const mode = body?.mode as 'random' | 'fixed' | undefined
  const changeAt = body?.changeAt ? new Date(body.changeAt) : null
  const scheduledId = body?.scheduledId as string | undefined

  const s = await getOrCreateSettings()
  if (mode && (mode === 'random' || mode === 'fixed')) s.mode = mode
  if (changeAt && !isNaN(changeAt.getTime())) s.nextChangeAt = changeAt
  else s.nextChangeAt = null
  if (scheduledId) s.scheduledId = scheduledId as any
  else if (mode === 'random') s.scheduledId = null as any
  await s.save()
  return NextResponse.json({ ok: true })
}
