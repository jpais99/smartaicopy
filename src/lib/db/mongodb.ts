// src/lib/db/mongodb.ts

import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && process.env.NODE_ENV === 'production') {
  console.error(
    'Please define the MONGODB_URI environment variable inside Vercel'
  );
}

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR
  if (!global._mongoClientPromise && MONGODB_URI) {
    client = new MongoClient(MONGODB_URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside Vercel'
    );
  }
  client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect();
}

export async function getMongoDb() {
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