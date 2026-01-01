import "dotenv/config";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI!; 

async function migrateData() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const collection = client.db().collection("knowledge_base");

  console.log("🔍 Scanning for documents with legacy structure...");

  // Find documents where 'source' exists at the root
  const cursor = collection.find({ source: { $exists: true } });
  const docs = await cursor.toArray();

  console.log(`Found ${docs.length} documents to migrate.`);

  if (docs.length === 0) {
    console.log("✅ Data is already clean!");
    await client.close();
    return;
  }

  let updated = 0;
  for (const doc of docs) {
    const filename = doc.source;
    
    // Move 'source' into 'metadata.source'
    await collection.updateOne(
      { _id: doc._id },
      { 
        $set: { "metadata.source": filename }, // Add to metadata
        $unset: { source: "" }                 // Remove from root
      }
    );
    updated++;
  }

  console.log(`✅ Successfully migrated ${updated} documents.`);
  await client.close();
}

migrateData();