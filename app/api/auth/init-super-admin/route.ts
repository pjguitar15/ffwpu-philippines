import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { AdminUser } from '@/models/AdminUser'
import { hashPassword } from '@/lib/auth'

export async function POST(request: Request) {
  await dbConnect()
  const body = await request.json().catch(() => ({}))
  const email = body.email || process.env.SUPER_ADMIN_EMAIL
  const password = body.password || process.env.SUPER_ADMIN_PASSWORD
  const name = body.name || 'Super Admin'
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email/password' }, { status: 400 })
  }

  const existing = await AdminUser.findOne({ email })
  if (existing) {
    return NextResponse.json({ ok: true, created: false })
  }
  const passwordHash = await hashPassword(password)
  await AdminUser.create({ email, name, role: 'super_admin', passwordHash })
  return NextResponse.json({ ok: true, created: true })
}
