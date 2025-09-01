import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.set('admin_token', '', { path: '/', maxAge: 0 })
  return NextResponse.json({ ok: true })
}
