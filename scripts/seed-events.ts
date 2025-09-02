// ts-node-style script using ts-node/register is not guaranteed here; compile-less Node by using dynamic import/types suppressed.
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'

// We import via compiled TS at runtime in Next environment; here we duplicate minimal connect logic
const MONGODB_STRING = process.env.MONGODB_STRING as string | undefined
if (!MONGODB_STRING) {
  console.error('MONGODB_STRING is missing. Aborting.')
  process.exit(1)
}

async function run() {
  await mongoose.connect(MONGODB_STRING as string, { dbName: process.env.MONGODB_DB || undefined } as any)
  const EventSchema = new mongoose.Schema({
    title: String,
    date: String,
    end: String,
    location: String,
    area: String,
    region: String,
    church: String,
    image: String,
    button: String,
    href: String,
  }, { timestamps: true })
  const Event = mongoose.models.Event || mongoose.model('Event', EventSchema)

  const dataPath = path.join(process.cwd(), 'data', 'events-seed.json')
  const raw = readFileSync(dataPath, 'utf8')
  const items = JSON.parse(raw)

  const count = await Event.countDocuments()
  if (count > 0) {
    console.log('Events already present. Skipping.')
    await mongoose.disconnect()
    return
  }
  await Event.insertMany(items)
  console.log(`Inserted ${items.length} events.`)
  await mongoose.disconnect()
}

run().catch(async (e) => {
  console.error(e)
  try { await mongoose.disconnect() } catch {}
  process.exit(1)
})
