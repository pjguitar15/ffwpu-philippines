import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { dbConnect } from '@/lib/db'
import { AdminUser } from '@/models/AdminUser'
import { verifyToken, hashPassword, createToken } from '@/lib/auth'
import { VerificationToken } from '@/models/VerificationToken'
import { sendEmailJs } from '@/lib/email'

async function requireSuperAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return null
  try {
    const payload = await verifyToken(token)
    await dbConnect()
    const me = await AdminUser.findById(payload.sub).lean()
    if (!me || me.role !== 'super_admin') return null
    return me
  } catch {
    return null
  }
}

export async function GET() {
  const me = await requireSuperAdmin()
  console.log('MEEE', me)
  if (!me) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await dbConnect()
  const users = await AdminUser.find({
    $or: [
      { emailVerified: true },
      { _id: (me as any)._id }, // always include current user
    ],
  })
    .sort({ createdAt: -1 })
    .lean()
  return NextResponse.json(
    users.map((u: any) => ({
      id: String(u._id),
      email: u.email,
      name: u.name,
      role: u.role,
      lastLoginAt: u.lastLoginAt ?? null,
      createdAt: u.createdAt,
    })),
  )
}

function generatePassword(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*'
  let pwd = ''
  const cryptoObj = globalThis.crypto || (require('crypto') as any).webcrypto
  const arr = new Uint32Array(length)
  cryptoObj.getRandomValues(arr)
  for (let i = 0; i < length; i++) pwd += chars[arr[i] % chars.length]
  return pwd
}

export async function POST(request: Request) {
  const me = await requireSuperAdmin()
  if (!me) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await dbConnect()
  const body = await request.json()
  const { email, name, role } = body as {
    email: string
    name: string
    role: 'super_admin' | 'content_manager' | 'news_editor'
  }
  if (!email || !name || !role)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const exists = await AdminUser.findOne({ email })
  if (exists) return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
  // Create a temporary random password (will be replaced upon set-password)
  const tempPassword = generatePassword()
  const passwordHash = await hashPassword(tempPassword)
  const user = await AdminUser.create({ email, name, role, passwordHash, emailVerified: false })

  // Create a one-time invite token (random string, not JWT) valid for 48h
  const rawToken = cryptoRandomString(48)
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48)
  await VerificationToken.create({ userId: user._id, token: rawToken, purpose: 'invite', expiresAt })

  // Build invite URL
  const baseOrigin = new URL(request.url).origin
  const url = new URL(baseOrigin)
  url.pathname = '/admin/set-password'
  url.searchParams.set('token', rawToken)

  // Send email via EmailJS (best-effort)
  await sendEmailJs(
    {
      serviceId: process.env.EMAILJS_SERVICE_ID,
      templateId: process.env.EMAILJS_TEMPLATE_ID,
      publicKey: process.env.EMAILJS_PUBLIC_KEY,
      privateKey: process.env.EMAILJS_PRIVATE_KEY,
    },
    {
      to_email: user.email,
      to_name: user.name,
      invite_link: url.toString(),
      app_name: 'FFWPU Philippines Admin',
    },
  ).catch(() => console.log('Error Sending'))

  return NextResponse.json({
  user: { id: String(user._id), email: user.email, name: user.name, role: user.role },
    invite: { sent: true },
  })
}

function cryptoRandomString(length = 48) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const cryptoObj = globalThis.crypto || (require('crypto') as any).webcrypto
  const arr = new Uint32Array(length)
  cryptoObj.getRandomValues(arr)
  let s = ''
  for (let i = 0; i < length; i++) s += chars[arr[i] % chars.length]
  return s
}
