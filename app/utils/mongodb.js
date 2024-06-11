import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DATABASE || 'topingnow';

let cachedDb = null;

async function connectToDatabase(uri) {
  try {
    if (cachedDb) {
      //console.log("=> using cached database instance");
      return cachedDb;
    } else {
      //console.log("=> cached connection closed, reconnecting...");
    }

    const client = await MongoClient.connect(uri);
    cachedDb = client.db(MONGODB_DB);
    return cachedDb;
  } catch (err) {
    console.error("Failed to connect to database: ", err);
    throw err;
  }
}

async function connectDB() {
  try {
    const client = await connectToDatabase(MONGODB_URI);
    return client;
  } catch (error) {
    throw error;
  }
}

export { connectDB };
