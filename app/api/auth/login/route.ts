import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { AdminUser } from '@/models/AdminUser'
import { verifyPassword, createToken } from '@/lib/auth'

export async function POST(request: Request) {
  await dbConnect()
  const { email, password } = await request.json()
  const user = await AdminUser.findOne({ email })
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  // update last login
  user.lastLoginAt = new Date()
  await user.save()

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
