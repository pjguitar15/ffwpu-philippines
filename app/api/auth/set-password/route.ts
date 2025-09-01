import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { VerificationToken } from '@/models/VerificationToken'
import { AdminUser } from '@/models/AdminUser'
import { createToken, hashPassword } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token') || ''
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  await dbConnect()
  const rec = await VerificationToken.findOne({ token, purpose: 'invite' })
  if (!rec) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  if (rec.usedAt) return NextResponse.json({ error: 'Used' }, { status: 400 })
  if (rec.expiresAt < new Date()) return NextResponse.json({ error: 'Expired' }, { status: 400 })
  return NextResponse.json({ ok: true })
}

export async function POST(request: Request) {
  const { token, newPassword } = await request.json()
  if (!token || !newPassword) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  await dbConnect()
  const rec = await VerificationToken.findOne({ token, purpose: 'invite' })
  if (!rec) return NextResponse.json({ error: 'Invalid link' }, { status: 400 })
  if (rec.usedAt) return NextResponse.json({ error: 'Already used' }, { status: 400 })
  if (rec.expiresAt < new Date()) return NextResponse.json({ error: 'Expired' }, { status: 400 })

  const user = await AdminUser.findById(rec.userId)
  if (!user) return NextResponse.json({ error: 'User missing' }, { status: 404 })

  user.passwordHash = await hashPassword(newPassword)
  user.emailVerified = true
  await user.save()

  rec.usedAt = new Date()
  await rec.save()

  // Auto-login: set admin_token cookie
  const jwt = await createToken({ sub: String(user._id), email: user.email, role: user.role as any })
  const cookieStore = await cookies()
  cookieStore.set('admin_token', jwt, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 2,
  })

  return NextResponse.json({ ok: true })
}
