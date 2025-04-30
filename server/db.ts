import { MongoClient } from "mongodb";
import * as schema from "@shared/schema";

// Declare MongoDB client for global scope to maintain connection across hot reloads
// eslint-disable-next-line no-var
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Check if the DATABASE_URL is a PostgreSQL URL and convert it to MongoDB format if needed
let MONGODB_URI = process.env.MONGODB_URI;

// If DATABASE_URL exists but isn't a MongoDB URL, use a default MongoDB URL instead
if (process.env.DATABASE_URL) {
  if (
    process.env.DATABASE_URL.startsWith("mongodb://") ||
    process.env.DATABASE_URL.startsWith("mongodb+srv://")
  ) {
    MONGODB_URI = process.env.DATABASE_URL;
  } else {
    console.log(
      "Warning: DATABASE_URL is not a MongoDB connection string. Using default MongoDB connection.",
    );
  }
}

const DB_NAME = "website_builder";

// Use a singleton pattern for the MongoDB client
let clientPromise: Promise<MongoClient>;

// Check if we're in development or production
const isDev = process.env.NODE_ENV === "development";

// In development, use a global variable to preserve connection across hot-reloads
// In production, use a new connection for each instance
if (isDev && global._mongoClientPromise) {
  // Use existing connection in development
  clientPromise = global._mongoClientPromise;
} else {
  // Create new connection
  const client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();

  // Save connection to global variable in development
  if (isDev) {
    global._mongoClientPromise = clientPromise;
  }
}

export const getMongoClient = async () => {
  const client = await clientPromise;
  return client;
};

export const getDatabase = async () => {
  const client = await getMongoClient();
  return client.db(DB_NAME);
};
