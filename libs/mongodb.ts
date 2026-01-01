// lib/mongodb.ts
import { Db, MongoClient } from 'mongodb';

// 1. Define the DB Name here ONCE
const DB_NAME = "SocraticTutor"; 

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

function getClientPromise(): Promise<MongoClient> {
  // Lazy check - only validate when actually connecting
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }

  const uri = process.env.MONGODB_URI;
  const options = {};

  if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    return globalWithMongo._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

// 2. Export a helper function instead of just the promise
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const clientPromise = getClientPromise();
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return { client, db };
}