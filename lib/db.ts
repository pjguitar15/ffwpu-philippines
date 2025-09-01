import mongoose from 'mongoose'

const MONGODB_STRING = process.env.MONGODB_STRING as string

if (!MONGODB_STRING) {
  // eslint-disable-next-line no-console
  console.warn('MONGODB_STRING is not set. Database operations will fail.')
}

let cached = (global as any)._mongoose
if (!cached) {
  cached = (global as any)._mongoose = { conn: null as any, promise: null as Promise<typeof mongoose> | null }
}

export async function dbConnect() {
  if (cached.conn) return cached.conn as typeof mongoose
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_STRING, {
        dbName: process.env.MONGODB_DB || undefined,
      })
      .then((m) => m)
  }
  cached.conn = await cached.promise
  return cached.conn
}
