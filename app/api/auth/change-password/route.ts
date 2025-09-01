import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { AdminUser } from '@/models/AdminUser'
import { verifyPassword, hashPassword, createToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import mongoose from 'mongoose'
import { VerificationToken } from '@/models/VerificationToken'

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const {
    id,
    currentPassword,
    newPassword,
    token: bodyToken,
  } = (body || {}) as {
    id?: string
    currentPassword?: string
    newPassword?: string
    token?: string
  }
  const urlToken = new URL(req.url).searchParams.get('token') || undefined
  const inviteToken = bodyToken || urlToken

  // Minimal password policy aligned with client UI
  if (
    !newPassword ||
    typeof newPassword !== 'string' ||
    newPassword.length < 8
  ) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  await dbConnect()

  // Invite-token flow (no current password or id needed)
  if (inviteToken) {
    const rec = await VerificationToken.findOne({
      token: inviteToken,
      purpose: 'invite',
    })
    if (!rec)
      return NextResponse.json({ error: 'Invalid link' }, { status: 400 })
    if (rec.usedAt)
      return NextResponse.json({ error: 'Already used' }, { status: 400 })
    if (rec.expiresAt < new Date())
      return NextResponse.json({ error: 'Expired' }, { status: 400 })

    const user = await AdminUser.findById(rec.userId)
    if (!user)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })

    user.passwordHash = await hashPassword(newPassword)
    user.emailVerified = true
    await user.save()

    rec.usedAt = new Date()
    await rec.save()

    const jwt = await createToken({
      sub: String(user._id),
      email: user.email,
      role: user.role as any,
    })
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

  // Fallback: authenticated change via id + currentPassword
  if (!id || !currentPassword) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const user = await AdminUser.findById(id)
  if (!user)
    return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const ok = await verifyPassword(currentPassword, user.passwordHash)
  if (!ok)
    return NextResponse.json(
      { error: 'Current password is incorrect' },
      { status: 401 },
    )

  user.passwordHash = await hashPassword(newPassword)
  if (!user.emailVerified) user.emailVerified = true
  await user.save()

  const jwt = await createToken({
    sub: String(user._id),
    email: user.email,
    role: user.role as any,
  })
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
