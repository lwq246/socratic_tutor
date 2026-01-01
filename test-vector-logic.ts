import { Document } from "@langchain/core/documents";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OllamaEmbeddings } from "@langchain/ollama";
import { MongoClient } from "mongodb";

// ⚠️ REPLACE THIS WITH YOUR REAL CONNECTION STRING
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://<user>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority";
const DB_NAME = "test_db"; // Use a test DB to avoid messing up real data
const COLLECTION_NAME = "knowledge_base";
const OLLAMA_URL = "http://127.0.0.1:11434"; // Ensure this matches your local setting

async function runTest() {
  const client = new MongoClient(MONGO_URI);

  try {
    console.log("1. Connecting to MongoDB...");
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    console.log("✅ Connected.");

    // --- STEP 1: INGESTION (Simulating POST #1) ---
    console.log("\n2. Simulating INGESTION...");
    
    // Create a dummy document
    const testSubjectId = "test-manual-upload.pdf";
    const docs = [
      new Document({
        pageContent: "The secret code for the mission is ALPHA-ZULU-99.",
        metadata: { 
            source: testSubjectId,  // New structure
            uploadedAt: new Date()
        },
      }),
    ];

    const embeddings = new OllamaEmbeddings({
      model: "nomic-embed-text", // Ensure you have this pulled in Ollama
      baseUrl: OLLAMA_URL,
    });

    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
      collection: collection as any,
      indexName: "default", // Ensure this index exists in Atlas!
      textKey: "text",
      embeddingKey: "embedding",
    });

    // Add document to DB
    await vectorStore.addDocuments(docs);
    console.log(`✅ Document saved with source: "${testSubjectId}"`);

    // --- STEP 2: RETRIEVAL (Simulating POST #2) ---
    console.log("\n3. Simulating RETRIEVAL...");

    const query = "What is the secret code?";
    
    // ATTEMPT 1: Search using metadata.source
    console.log(`   Searching with filter: { "metadata.source": "${testSubjectId}" }`);
    
    let results = await vectorStore.similaritySearch(query, 1, {
      preFilter: { "metadata.source": { $eq: testSubjectId } },
    });

    if (results.length > 0) {
      console.log("✅ SUCCESS (Attempt 1 - metadata.source):");
      console.log(`   Result: "${results[0].pageContent}"`);
    } else {
      console.log("❌ FAILED (Attempt 1). No docs found.");
      console.log("   --> Attempting Fallback...");

      // ATTEMPT 2: Search using root source (Simulating older data)
      // Note: This will fail for the doc we just added above, but tests the logic
      results = await vectorStore.similaritySearch(query, 1, {
        preFilter: { "source": { $eq: testSubjectId } },
      });

      if (results.length > 0) {
        console.log("✅ SUCCESS (Attempt 2 - root source):");
        console.log(`   Result: "${results[0].pageContent}"`);
      } else {
        console.log("❌ FAILED (Attempt 2). No docs found anywhere.");
        console.log("⚠️ CHECK YOUR ATLAS SEARCH INDEX CONFIGURATION.");
      }
    }

    // CLEANUP (Optional)
    // await collection.deleteMany({ "metadata.source": testSubjectId });

  } catch (error) {
    console.error("💥 ERROR:", error);
  } finally {
    await client.close();
  }
}

runTest();