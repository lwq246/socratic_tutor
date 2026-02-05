import { connectToDatabase } from "@/libs/mongodb";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { LangChainStream, StreamingTextResponse } from 'ai';

// 👇 IMPORT THE ADAPTER

export const maxDuration = 300; 
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { messages, subjectId, sessionId } = await req.json();

    // 1. DB Connection
    const { db } = await connectToDatabase();
    const historyCollection = db.collection("chat_history");
    const knowledgeCollection = db.collection("knowledge_base");

    const currentQuestion = messages[messages.length - 1].content;
    
    // Save User Message immediately
    await historyCollection.insertOne({
      sessionId, subjectId, role: "user", content: currentQuestion, createdAt: new Date(),
    });

    // 2. Vector Search (Manual Filter)
    const vectorStore = new MongoDBAtlasVectorSearch(
      new OllamaEmbeddings({
        model: "nomic-embed-text",
        baseUrl: process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434",
      }),
      {
        collection: knowledgeCollection as any,
        indexName: "default", 
        textKey: "text", 
        embeddingKey: "embedding",
      }
    );

    const broadResults = await vectorStore.similaritySearch(currentQuestion, 50);
    const relevantDocs = broadResults
      .filter(doc => {
        const metaSource = doc.metadata?.source;
        const rootSource = (doc as any).source;
        return metaSource === subjectId || rootSource === subjectId;
      })
      .slice(0, 3);

    const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");

    // 3. Setup AI
    const model = new ChatOllama({
      baseUrl: process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434",
      model: "sutor-v2", // Change to "llama3" if "sutor" is slow
      temperature: 0.3,
    });

    const chain = RunnableSequence.from([
  PromptTemplate.fromTemplate(`
    SYSTEM: You are a Socratic Tutor. 
    - You have access to the context below.
    - DO NOT just summarize the context.
    - DO NOT give the answer directly.
    - Instead, ask the user a guiding question to check if they understand the concept in the context.
    
    CONTEXT:
    {context}
    
    USER QUESTION:
    {question}
    
    YOUR RESPONSE (Ask a question):
  `),
  model,
  new StringOutputParser(),
]);

    // 4. Create the Stream Helpers
    const { stream, handlers } = LangChainStream({
      onFinal: async (completion) => {
        // Save to DB when finished
        await historyCollection.insertOne({
          sessionId,
          subjectId,
          role: "assistant",
          content: completion,
          createdAt: new Date(),
        });
      },
    });

    // 5. Connect Chain to Stream
    // Note: We use .call() or .invoke() with callbacks instead of .stream() here
    chain.invoke(
      { context: context, question: currentQuestion },
      { callbacks: [handlers] }
    );

    // 6. Return the Stream Response
    return new StreamingTextResponse(stream);

  } catch (e: any) {
    console.error("❌ ROUTE ERROR:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

// import { connectToDatabase } from "@/libs/mongodb";
// import { StringOutputParser } from "@langchain/core/output_parsers";
// import { PromptTemplate } from "@langchain/core/prompts";
// import { RunnableSequence } from "@langchain/core/runnables";
// import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
// import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
// import { LangChainStream, StreamingTextResponse } from 'ai';

// // 👇 IMPORT THE ADAPTER

// export const maxDuration = 300; 
// export const dynamic = 'force-dynamic';

// export async function POST(req: Request) {
//   try {
//     const { messages, subjectId, sessionId } = await req.json();

//     // 1. DB Connection
//     const { db } = await connectToDatabase();
//     const historyCollection = db.collection("chat_history");
//     const knowledgeCollection = db.collection("knowledge_base");

//     const currentQuestion = messages[messages.length - 1].content;
    
//     // Save User Message immediately
//     await historyCollection.insertOne({
//       sessionId, subjectId, role: "user", content: currentQuestion, createdAt: new Date(),
//     });

//     // 2. Vector Search (Manual Filter)
//     const vectorStore = new MongoDBAtlasVectorSearch(
//       new OllamaEmbeddings({
//         model: "nomic-embed-text",
//         baseUrl: process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434",
//       }),
//       {
//         collection: knowledgeCollection as any,
//         indexName: "default", 
//         textKey: "text", 
//         embeddingKey: "embedding",
//       }
//     );

//     const broadResults = await vectorStore.similaritySearch(currentQuestion, 50);
//     const relevantDocs = broadResults
//       .filter(doc => {
//         const metaSource = doc.metadata?.source;
//         const rootSource = (doc as any).source;
//         return metaSource === subjectId || rootSource === subjectId;
//       })
//       .slice(0, 3);

//     const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");

//     // 3. Setup AI
//     const model = new ChatOllama({
//       baseUrl: process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434",
//       model: "sutor-v2", // Change to "llama3" if "sutor" is slow
//       temperature: 0.3,
//     });

//     const chain = RunnableSequence.from([
//       PromptTemplate.fromTemplate(`Context: {context}\n\nQuestion: {question}`),
//       model,
//       new StringOutputParser(),
//     ]);

//     // 4. Create the Stream Helpers
//     const { stream, handlers } = LangChainStream({
//       onFinal: async (completion) => {
//         // Save to DB when finished
//         await historyCollection.insertOne({
//           sessionId,
//           subjectId,
//           role: "assistant",
//           content: completion,
//           createdAt: new Date(),
//         });
//       },
//     });

//     // 5. Connect Chain to Stream
//     // Note: We use .call() or .invoke() with callbacks instead of .stream() here
//     chain.invoke(
//       { context: context, question: currentQuestion },
//       { callbacks: [handlers] }
//     );

//     // 6. Return the Stream Response
//     return new StreamingTextResponse(stream);

//   } catch (e: any) {
//     console.error("❌ ROUTE ERROR:", e);
//     return new Response(JSON.stringify({ error: e.message }), { status: 500 });
//   }
// }