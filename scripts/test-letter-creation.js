// Test script to verify letter creation with isPublic field
const { MongoClient } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ffwpu-philippines'

async function testLetterCreation() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB for testing')
    
    const db = client.db()
    const collection = db.collection('lettertotms')
    
    // Test creating a public letter
    const publicLetter = {
      name: 'Test User',
      region: 'Test Region',
      content: 'This is a test public letter',
      isPublic: true,
      color: 'bg-yellow-100 border-yellow-200',
      rotation: 1.5,
      position: { x: 0, y: 0 },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Test creating a private letter
    const privateLetter = {
      name: 'Private User',
      region: 'Private Region', 
      content: 'This is a test private letter',
      isPublic: false,
      color: 'bg-pink-100 border-pink-200',
      rotation: -1.2,
      position: { x: 0, y: 0 },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Insert both letters
    const result = await collection.insertMany([publicLetter, privateLetter])
    console.log(`Inserted ${result.insertedCount} test letters`)
    
    // Verify they were created with isPublic field
    const publicCount = await collection.countDocuments({ isPublic: true })
    const privateCount = await collection.countDocuments({ isPublic: false })
    
    console.log(`Public letters: ${publicCount}`)
    console.log(`Private letters: ${privateCount}`)
    
    // Show sample documents
    const publicSample = await collection.findOne({ isPublic: true })
    const privateSample = await collection.findOne({ isPublic: false })
    
    console.log('\nPublic letter sample:')
    console.log(JSON.stringify(publicSample, null, 2))
    
    console.log('\nPrivate letter sample:')
    console.log(JSON.stringify(privateSample, null, 2))
    
  } catch (error) {
    console.error('Test failed:', error)
  } finally {
    await client.close()
    console.log('Database connection closed')
  }
}

// Run the test
testLetterCreation().catch(console.error)