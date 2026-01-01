import { NextRequest, NextResponse } from 'next/server';
// 1. NEW IMPORT LOCATION
import { connectToDatabase } from '@/libs/mongodb';
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { OllamaEmbeddings } from '@langchain/ollama';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log(`Processing file: ${file.name}...`);

    // 2. Load PDF
    const loader = new WebPDFLoader(file);
    const docs = await loader.load();

    // 3. Add Metadata
    docs.forEach(doc => {
      doc.metadata.source = file.name;
    });

    // 4. Split Text
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await splitter.splitDocuments(docs);

    // 5. Connect to MongoDB
    const { db } = await connectToDatabase();
    const collection = db.collection("knowledge_base");

    // 6. Embed & Save
    await MongoDBAtlasVectorSearch.fromDocuments(
      splitDocs,
      new OllamaEmbeddings({
        model: "nomic-embed-text",
        baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
      }),
      {
        collection: collection as any, // <--- ADD "as any" HERE
        indexName: "default",
        textKey: "text",
        embeddingKey: "embedding",
      }
    );

    return NextResponse.json({ success: true, count: splitDocs.length });

  } catch (error: any) {
    console.error("Ingestion Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}