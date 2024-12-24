import { MongoClient } from 'mongodb';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const getMongoClient = () => {
  if (!process.env.MONGODB_URI) {
    console.error('MongoDB URI check failed:', {
      hasUri: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV,
    });
    throw new Error('Missing required MONGODB_URI environment variable');
  }

  if (process.env.NODE_ENV === 'development') {
    // In development, use a global variable
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(process.env.MONGODB_URI);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production, create new connection
    client = new MongoClient(process.env.MONGODB_URI);
    clientPromise = client.connect();
  }

  return clientPromise;
};

export async function getMongoDb() {
  const client = await getMongoClient();
  return client.db('smartaicopy');
}

export default getMongoClient;