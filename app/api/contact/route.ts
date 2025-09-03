import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmailJs } from '@/lib/email'

export const runtime = 'nodejs'

// Simple in-memory rate limiter (per instance). For stronger protection, use Upstash Ratelimit.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const RATE_LIMIT_MAX = 5 // max submissions per window per IP
const ipHits = new Map<string, number[]>()

// Recipient constant (mail group or single address) from env
const CONTACT_TO = (
  process.env.CONTACT_FORM_TO || ''
).trim()

function getClientIp(req: Request) {
  const xfwd = req.headers.get('x-forwarded-for') || ''
  const real = req.headers.get('x-real-ip') || ''
  const ip = (xfwd.split(',')[0] || real || '').trim()
  return ip || 'unknown'
}

function checkRateLimit(ip: string) {
  const now = Date.now()
  const arr = ipHits.get(ip) || []
  const recent = arr.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX) return false
  recent.push(now)
  ipHits.set(ip, recent)
  return true
}

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().transform((s) => (s || '').trim()),
  subject: z.string().min(2).max(160),
  message: z.string().min(10).max(5000),
  // Honeypot fields – must be empty
  company: z.string().max(0).optional().or(z.literal('')).optional(),
  website: z.string().max(0).optional().or(z.literal('')).optional(),
  ts: z.number().int().optional(), // timestamp when form rendered
})

export async function POST(req: Request) {
  const ip = getClientIp(req)
  const ua = req.headers.get('user-agent') || ''
  const referer = req.headers.get('referer') || ''

  // Basic rate limit
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  let data: z.infer<typeof contactSchema>
  try {
    const json = await req.json()
    data = contactSchema.parse(json)
  } catch (e: any) {
    const msg = e?.message || 'Invalid request'
    return NextResponse.json({ success: false, error: msg }, { status: 400 })
  }

  // Anti-bot: honeypot – if any hidden field has value, pretend to succeed
  if ((data as any).company || (data as any).website) {
    return NextResponse.json({ success: true })
  }

  // Anti-bot: minimum fill time (2s). Also drop absurdly old timestamps (> 1 day).
  const now = Date.now()
  const ts = Number(data.ts || 0)
  if (ts > 0) {
    const delta = now - ts
    if (delta < 2000) {
      // Too fast – likely a bot
      return NextResponse.json({ success: true })
    }
    if (delta > 24 * 60 * 60 * 1000) {
      // Stale form – ask to refresh
      return NextResponse.json({ success: false, error: 'Form expired. Please reload and try again.' }, { status: 400 })
    }
  }

  const { name, email, phone = '', subject, message } = data

  // Compose template params for EmailJS
  const templateParams = {
    name: name,
    email: email,
    phone: phone,
    // Recipient (configure your EmailJS template to use these)
    to_email: CONTACT_TO,
    reply_to: email,
    subject,
    message,
    submitted_at: new Date().toISOString(),
    ip,
    user_agent: ua,
    referer,
  }

  console.log('templateParams', templateParams)

  const res = await sendEmailJs(
    {
      serviceId: process.env.EMAILJS_SERVICE_ID,
      templateId: process.env.EMAILJS_TEMPLATE_ID_CONTACT || process.env.EMAILJS_TEMPLATE_ID,
      publicKey: process.env.EMAILJS_PUBLIC_KEY,
      privateKey: process.env.EMAILJS_PRIVATE_KEY,
    },
    templateParams,
  )

  if (!res.ok && !('skipped' in res)) {
    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again later.' },
      { status: 500 },
    )
  }

  return NextResponse.json({ success: true })
}
