"use server"
// Ensure this file only runs in Node.js runtime, not Edge Runtime
import 'server-only';
import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Please define the MONGODB_URI environment variable in your production environment');
  }
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongoCache {
  client: MongoClient | null;
  db: Db | null;
  promise: Promise<{ client: MongoClient; db: Db }> | null;
}

declare global {
  var mongo: MongoCache | undefined;
}

let cached: MongoCache = global.mongo || { client: null, db: null, promise: null };

if (!global.mongo) {
  global.mongo = cached;
}

async function connectDB(): Promise<{ client: MongoClient; db: Db }> {
  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db };
  }

  if (!cached.promise) {
    cached.promise = MongoClient.connect(MONGODB_URI as string).then((client) => {
      const db = client.db();
      return { client, db };
    });
  }

  try {
    const { client, db } = await cached.promise;
    cached.client = client;
    cached.db = db;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return { client: cached.client!, db: cached.db! };
}

export default connectDB;

