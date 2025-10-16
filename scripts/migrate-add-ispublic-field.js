// Migration script to add isPublic field to existing letters
const { MongoClient } = require('mongodb')

// Try multiple possible connection strings
const MONGODB_URI = process.env.MONGODB_URI || 
                   process.env.DATABASE_URL || 
                   'mongodb://localhost:27017/ffwpu-philippines'

async function migrateAddIsPublicField() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    console.log('Connection URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'))
    
    const db = client.db()
    
    // Check all possible collection names
    const possibleCollections = ['lettertotms', 'LetterToTMs', 'letters', 'letterToTMs']
    let targetCollection = null
    
    for (const collName of possibleCollections) {
      const collection = db.collection(collName)
      const count = await collection.countDocuments()
      if (count > 0) {
        console.log(`Found ${count} documents in collection: ${collName}`)
        targetCollection = collection
        break
      }
    }
    
    if (!targetCollection) {
      console.log('No letter collection found with documents. Checking all collections...')
      const allCollections = await db.listCollections().toArray()
      
      for (const col of allCollections) {
        const collection = db.collection(col.name)
        const sample = await collection.findOne()
        if (sample && (sample.name && sample.content && sample.region)) {
          console.log(`Found letter-like documents in collection: ${col.name}`)
          targetCollection = collection
          break
        }
      }
    }
    
    if (!targetCollection) {
      console.log('No letter documents found in any collection.')
      return
    }
    
    // Count documents without isPublic field
    const documentsWithoutIsPublic = await targetCollection.countDocuments({
      isPublic: { $exists: false }
    })
    
    console.log(`Found ${documentsWithoutIsPublic} documents without isPublic field`)
    
    if (documentsWithoutIsPublic === 0) {
      console.log('All documents already have isPublic field. Migration not needed.')
      return
    }
    
    // Add isPublic: true to all existing documents that don't have it
    const result = await targetCollection.updateMany(
      { isPublic: { $exists: false } },
      { $set: { isPublic: true } }
    )
    
    console.log(`Successfully updated ${result.modifiedCount} documents`)
    console.log('Migration completed!')
    
    // Verify the migration
    const verifyCount = await targetCollection.countDocuments({
      isPublic: { $exists: false }
    })
    
    if (verifyCount === 0) {
      console.log('✅ Migration verification passed - all documents now have isPublic field')
    } else {
      console.log(`⚠️  ${verifyCount} documents still missing isPublic field`)
    }
    
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await client.close()
    console.log('Database connection closed')
  }
}

// Run the migration
if (require.main === module) {
  migrateAddIsPublicField()
    .then(() => {
      console.log('Migration script completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Migration script failed:', error)
      process.exit(1)
    })
}

module.exports = migrateAddIsPublicField