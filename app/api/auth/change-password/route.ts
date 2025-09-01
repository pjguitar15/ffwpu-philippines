import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { AdminUser } from '@/models/AdminUser'
import { hashPassword, verifyPassword, verifyToken, createToken } from '@/lib/auth'
import { sendEmailJs } from '@/lib/email'
import { VerificationToken } from '@/models/VerificationToken'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const body = await request.json()
  const { currentPassword, newPassword, token: inviteToken } = body as {
    currentPassword?: string
    newPassword?: string
    token?: string
  }

  if (!newPassword) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  await dbConnect()

  // Invite token flow (no session yet)
  if (inviteToken) {
    const rec = await VerificationToken.findOne({ token: inviteToken, purpose: 'invite' })
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

    // Login
    const newToken = await createToken({ sub: String(user._id), email: user.email, role: user.role as any })
    cookieStore.set('admin_token', newToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 2,
    })

    // Notification
    await sendEmailJs(
      {
        serviceId: process.env.EMAILJS_SERVICE_ID,
        templateId: process.env.EMAILJS_TEMPLATE_ID,
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
      },
      {
        to_email: user.email,
        to_name: user.name,
        date: new Date().toLocaleString(),
        app_name: 'FFWPU Philippines Admin',
      },
    ).catch(() => null)

    return NextResponse.json({ ok: true })
  }

  // Authenticated user flow (requires current password)
  const sessionToken = cookieStore.get('admin_token')?.value
  if (!sessionToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let payload: any
  try {
    payload = await verifyToken(sessionToken)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!currentPassword) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const user = await AdminUser.findById(payload.sub)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ok = await verifyPassword(currentPassword, user.passwordHash)
  if (!ok) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })

  user.passwordHash = await hashPassword(newPassword)
  await user.save()

  const newToken = await createToken({ sub: String(user._id), email: user.email, role: user.role as any })
  cookieStore.set('admin_token', newToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 2,
  })

  await sendEmailJs(
    {
      serviceId: process.env.EMAILJS_SERVICE_ID,
      templateId: process.env.EMAILJS_TEMPLATE_ID,
      publicKey: process.env.EMAILJS_PUBLIC_KEY,
    },
    {
      to_email: user.email,
      to_name: user.name,
      date: new Date().toLocaleString(),
      app_name: 'FFWPU Philippines Admin',
    },
  ).catch(() => null)

  return NextResponse.json({ ok: true })
}
