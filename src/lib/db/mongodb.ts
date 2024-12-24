// src/lib/db/mongodb.ts

import { MongoClient } from 'mongodb';

// Only initialize client if URI exists
const uri = process.env.MONGODB_URI;

if (!uri && process.env.NODE_ENV === 'production') {
  // Only throw in production, allows build to complete
  throw new Error('Please add your MongoDB URI to environment variables');
}

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

// Global type declaration for development
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

export async function getMongoDb() {
  if (!uri) {
    throw new Error('MongoDB URI not configured');
  }
  
  if (!clientPromise) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  try {
    const client = await clientPromise;
    return client.db('smartaicopy');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Database connection failed');
  }
}

// Export clientPromise for reuse
export default clientPromise;