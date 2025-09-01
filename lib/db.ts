import mongoose from 'mongoose'

const MONGODB_STRING = process.env.MONGODB_STRING as string | undefined

if (!MONGODB_STRING) {
  // eslint-disable-next-line no-console
  console.warn(
    '[DB] MONGODB_STRING is not set. Database operations will fail until it is provided.',
  )
}

// Single cached connection across hot reloads and serverless invocations
let cached = (global as any)._mongoose
if (!cached) {
  cached = (global as any)._mongoose = {
    conn: null as any,
    promise: null as Promise<typeof mongoose> | null,
  }
}

export async function dbConnect() {
  if (cached.conn) return cached.conn as typeof mongoose

  if (!MONGODB_STRING) {
    throw new Error('MONGODB_STRING is missing')
  }

  if (!cached.promise) {
    // Helpful defaults for serverless/platform networking hiccups
    const connectOpts: Parameters<typeof mongoose.connect>[1] = {
      dbName: process.env.MONGODB_DB || undefined,
      // Time out faster so requests fail quickly instead of hanging
      serverSelectionTimeoutMS: 10_000,
      connectTimeoutMS: 10_000,
      socketTimeoutMS: 20_000,
      // Most Atlas clusters want retryWrites + majority
      retryWrites: true,
      w: 'majority' as any,
    }

    // Avoid holding queries in memory when disconnected
    mongoose.set('bufferCommands', false)

    cached.promise = mongoose
      .connect(MONGODB_STRING, connectOpts)
      .then((m) => {
        // eslint-disable-next-line no-console
        console.info('[DB] Connected to MongoDB')
        return m
      })
      .catch((err) => {
        // Surface actionable hints in logs
        // eslint-disable-next-line no-console
        console.error(
          '[DB] Connection error:',
          err?.name || err,
          err?.message || '',
        )
        if (err?.name === 'MongooseServerSelectionError') {
          // eslint-disable-next-line no-console
          console.error(
            '[DB] Server selection failed. Check that:\n' +
              ' - Your Atlas/IP allowlist permits egress from your hosting platform (or use a Private Endpoint).\n' +
              ' - The MONGODB_STRING is correct (username/password, cluster address, SRV record).\n' +
              ' - Your cluster is reachable over the internet from this region.\n' +
              ' - DNS/TLS are not blocked.\n',
          )
        }
        throw err
      })
  }
  cached.conn = await cached.promise
  return cached.conn
}
