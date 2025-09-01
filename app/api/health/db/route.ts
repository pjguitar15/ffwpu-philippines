import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import mongoose from 'mongoose'

export const runtime = 'nodejs'

export async function GET() {
  try {
    await dbConnect()
    // Try a lightweight ping if possible
    try {
      if (mongoose.connection?.db) {
        await mongoose.connection.db.admin().command({ ping: 1 })
      }
    } catch {
      // ignore ping errors; connection itself is sufficient
    }
    return NextResponse.json({ ok: true, state: mongoose.connection.readyState })
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err?.name || 'Error',
        message: err?.message || 'DB connection failed',
        state: mongoose.connection?.readyState ?? -1,
      },
      { status: 500 },
    )
  }
}
