/* Simple Node seeding script for Events */
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

const uri = process.env.MONGODB_STRING
if (!uri) {
  console.error('MONGODB_STRING is missing. Aborting.')
  process.exit(1)
}

async function run() {
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || undefined })
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
  const raw = fs.readFileSync(dataPath, 'utf8')
  const items = JSON.parse(raw)

  const count = await Event.countDocuments()
  if (count > 0) {
    console.log('Events already present. Skipping insert. Count:', count)
    await mongoose.disconnect()
    return
  }
  const docs = await Event.insertMany(items)
  console.log('Inserted', docs.length, 'events')
  await mongoose.disconnect()
}

run().catch(async (e) => {
  console.error(e)
  try { await mongoose.disconnect() } catch {}
  process.exit(1)
})
