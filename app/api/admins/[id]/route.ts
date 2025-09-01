import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { dbConnect } from '@/lib/db'
import { AdminUser } from '@/models/AdminUser'
import { verifyToken, hashPassword } from '@/lib/auth'
import mongoose from 'mongoose'

const VALID_ROLES = new Set([
  'super_admin',
  'content_manager',
  'news_editor',
] as const)

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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const me = await requireSuperAdmin()
  if (!me) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  await dbConnect()

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, role, email, resetPassword } = body as {
    name?: string
    role?: 'super_admin' | 'content_manager' | 'news_editor'
    email?: string
    resetPassword?: boolean
  }

  const update: any = {}
  if (name) update.name = name
  if (role) {
    if (!VALID_ROLES.has(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }
    update.role = role
  }
  if (email) {
    // prevent duplicate emails
    const exists = await AdminUser.findOne({ email, _id: { $ne: id } }).lean()
    if (exists) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 },
      )
    }
    update.email = email.toLowerCase().trim()
  }

  let newPassword: string | undefined
  if (resetPassword) {
    const chars =
      'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*'
    const cryptoObj =
      (globalThis as any).crypto || (await import('crypto')).webcrypto
    const arr = new Uint32Array(12)
    cryptoObj.getRandomValues(arr)
    newPassword = Array.from(arr, (n) => chars[n % chars.length]).join('')
    update.passwordHash = await hashPassword(newPassword)
  }

  try {
    const user = await AdminUser.findByIdAndUpdate(id, update, { new: true })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      credentials: newPassword
        ? { email: user.email, password: newPassword }
        : undefined,
    })
  } catch (e: any) {
    // e.g. CastError or other DB error
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const me = await requireSuperAdmin()
  if (!me) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  await dbConnect()

  const res = await AdminUser.deleteOne({ _id: id })
  if (res.deletedCount === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    await dbConnect()
    const u = await AdminUser.findById(id).lean()
    if (!u) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Minimal, non-sensitive public info
    return new NextResponse(
      JSON.stringify({
        id: String(u._id),
        name: u.name ?? '',
        role: u.role,
        emailVerified: !!u.emailVerified,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0', // don’t cache user existence
        },
      },
    )
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
