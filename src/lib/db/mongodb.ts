// src/lib/db/mongodb.ts

import { MongoClient } from 'mongodb';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

// Connection options to optimize performance
const options = {
  maxPoolSize: 1,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 5000,
  connectTimeoutMS: 5000,
};

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR
  if (!global._mongoClientPromise && process.env.MONGODB_URI) {
    client = new MongoClient(process.env.MONGODB_URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  if (!process.env.MONGODB_URI) {
    clientPromise = Promise.resolve(null as unknown as MongoClient);
  } else {
    client = new MongoClient(process.env.MONGODB_URI, options);
    clientPromise = client.connect();
  }
}

export async function getMongoDb() {
  try {
    const client = await clientPromise;
    if (!client) {
      throw new Error('Database connection not available');
    }
    return client.db('smartaicopy');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Database connection failed');
  }
}

export default clientPromise;