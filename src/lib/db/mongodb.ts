// src/lib/db/mongodb.ts

import { MongoClient } from 'mongodb';
import { envConfig } from '../config/env';
import { logError } from '../utils/error-logger';

const uri = envConfig.mongodb.uri;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (envConfig.nodeEnv === 'development') {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  };

  if (!globalWithMongo._mongoClientPromise) {
    try {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    } catch (error) {
      logError('MongoDB connection failed in development', 'error', {
        error,
        uri: uri.replace(/:[^:/@]+@/, ':***@') // Hide password in logs
      });
      throw error;
    }
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  try {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  } catch (error) {
    logError('MongoDB connection failed in production', 'error', {
      error,
      uri: uri.replace(/:[^:/@]+@/, ':***@') // Hide password in logs
    });
    throw error;
  }
}

export async function getMongoDb() {
  try {
    const client = await clientPromise;
    return client.db(envConfig.mongodb.dbName);
  } catch (error) {
    logError('Failed to get MongoDB database', 'error', { error });
    throw error;
  }
}

export default clientPromise;