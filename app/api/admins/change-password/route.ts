import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { AdminUser } from '@/models/AdminUser'
import { hashPassword, verifyPassword, createToken } from '@/lib/auth'
import mongoose from 'mongoose'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { id, currentPassword, newPassword } = body as {
    id?: string
    currentPassword?: string
    newPassword?: string
  }

  if (!id || !currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }
  // Basic server-side password policy (mirror client rules lightly)
  if (
    newPassword.length < 12 ||
    !/[A-Z]/.test(newPassword) ||
    !/[a-z]/.test(newPassword) ||
    !/[0-9]/.test(newPassword) ||
    !/[!@#$%^&*()\-_=+[{\]};:'",.<>/?`~|\\]/.test(newPassword)
  ) {
    return NextResponse.json({ error: 'Password does not meet requirements' }, { status: 400 })
  }

  await dbConnect()
  const user = await AdminUser.findById(id)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const ok = await verifyPassword(currentPassword, user.passwordHash)
  if (!ok) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })

  user.passwordHash = await hashPassword(newPassword)
  user.emailVerified = true
  await user.save()

  // Auto-login
  const token = await createToken({ sub: String(user._id), email: user.email, role: user.role as any })
  const cookieStore = await cookies()
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 2,
  })

  return NextResponse.json({ ok: true })
}
