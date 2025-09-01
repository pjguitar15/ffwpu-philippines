import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { AdminUser } from '@/models/AdminUser'
import { verifyPassword, createToken } from '@/lib/auth'

// If you use native modules like bcrypt, force Node runtime:
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    await dbConnect()

    const { email, password } = await request.json()
    const user = await AdminUser.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      )
    }

    const ok = await verifyPassword(password, user.passwordHash)
    if (!ok) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      )
    }

    // update last login (don’t block cookie write if this fails)
    user.lastLoginAt = new Date()
    await user.save().catch(() => {})

    const token = await createToken({
      sub: String(user._id),
      email: user.email,
      role: user.role as any,
    })

    const res = NextResponse.json({ ok: true })
    res.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 2, // 2 hours
    })
    return res
  } catch (err) {
    console.error('LOGIN_ERROR', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
