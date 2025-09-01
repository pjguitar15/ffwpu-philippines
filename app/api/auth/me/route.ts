import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { AdminUser } from '@/models/AdminUser'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const payload = await verifyToken(token)
    await dbConnect()
    const user = await AdminUser.findById(payload.sub).lean()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
      lastLoginAt: user.lastLoginAt ?? null,
    })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
