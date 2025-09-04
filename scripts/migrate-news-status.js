const { MongoClient } = require('mongodb');

async function migrateNewsStatus() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ffwpu-philippines';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const collection = db.collection('news');

    // Update all records with 'active' status to 'published'
    const activeResult = await collection.updateMany(
      { status: 'active' },
      { $set: { status: 'published' } }
    );
    console.log(`Updated ${activeResult.modifiedCount} records from 'active' to 'published'`);

    // Update all records with 'inactive' status to 'draft'
    const inactiveResult = await collection.updateMany(
      { status: 'inactive' },
      { $set: { status: 'draft' } }
    );
    console.log(`Updated ${inactiveResult.modifiedCount} records from 'inactive' to 'draft'`);

    // Count records with new status values
    const publishedCount = await collection.countDocuments({ status: 'published' });
    const draftCount = await collection.countDocuments({ status: 'draft' });
    
    console.log(`\nMigration complete!`);
    console.log(`Published articles: ${publishedCount}`);
    console.log(`Draft articles: ${draftCount}`);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

migrateNewsStatus();
