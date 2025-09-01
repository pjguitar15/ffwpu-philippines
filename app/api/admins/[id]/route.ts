import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { dbConnect } from '@/lib/db'
import { AdminUser } from '@/models/AdminUser'
import { verifyToken, hashPassword } from '@/lib/auth'

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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const me = await requireSuperAdmin()
  if (!me) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await dbConnect()
  const { id } = params
  const body = await request.json()
  const { name, role, email, resetPassword } = body as {
    name?: string
    role?: 'super_admin' | 'content_manager' | 'news_editor'
    email?: string
    resetPassword?: boolean
  }
  const update: any = {}
  if (name) update.name = name
  if (role) update.role = role
  if (email) update.email = email
  let newPassword: string | undefined
  if (resetPassword) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*'
    const cryptoObj = globalThis.crypto || (require('crypto') as any).webcrypto
    const arr = new Uint32Array(12)
    cryptoObj.getRandomValues(arr)
    newPassword = Array.from(arr, (n) => chars[n % chars.length]).join('')
    update.passwordHash = await hashPassword(newPassword)
  }
  const user = await AdminUser.findByIdAndUpdate(id, update, { new: true })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({
    user: { id: String(user._id), email: user.email, name: user.name, role: user.role },
    credentials: newPassword ? { email: user.email, password: newPassword } : undefined,
  })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const me = await requireSuperAdmin()
  if (!me) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await dbConnect()
  const { id } = params
  const user = await AdminUser.findById(id)
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await AdminUser.deleteOne({ _id: id })
  return NextResponse.json({ ok: true })
}
