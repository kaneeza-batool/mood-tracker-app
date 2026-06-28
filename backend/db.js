import { MongoClient } from "mongodb";

const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri);

let db;

export async function connectDB() {
  try {
    await client.connect();
    db = client.db("moodjournal");

    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

export function getDB() {
  if (!db) {
    throw new Error("Database not connected!");
  }

  return db;
}