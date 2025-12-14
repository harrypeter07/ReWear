// lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const options = {
  serverSelectionTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000, // 45 seconds
  connectTimeoutMS: 10000, // 10 seconds
  maxPoolSize: 10,
  retryWrites: true,
  retryReads: true,
  // Enable connection monitoring
  monitorCommands: process.env.NODE_ENV === "development",
};

let client;
let clientPromise;

if (!process.env.MONGO_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable to reuse connection
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      console.error("[MongoDB] Connection error:", err.message);
      if (err.code === "EREFUSED" || err.message?.includes("querySrv")) {
        console.error(
          "[MongoDB] ❌ Connection refused. Please check:\n" +
          "   1. Your IP address is whitelisted in MongoDB Atlas\n" +
          "   2. Network connectivity is working\n" +
          "   3. MongoDB Atlas cluster is running\n" +
          "   4. Connection string is correct\n" +
          "   Run 'npm run test:db' to test the connection"
        );
      }
      throw err;
    });
    
    // Log successful connection in development
    global._mongoClientPromise.then(() => {
      console.log("[MongoDB] ✅ Connected to MongoDB successfully");
    }).catch(() => {
      // Error already logged above
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, don't use global
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((err) => {
    console.error("[MongoDB] Connection error:", err.message);
    if (err.code === "EREFUSED" || err.message?.includes("querySrv")) {
      console.error(
        "[MongoDB] ❌ Connection refused. Please check:\n" +
        "   1. Your IP address is whitelisted in MongoDB Atlas\n" +
        "   2. Network connectivity is working\n" +
        "   3. MongoDB Atlas cluster is running\n" +
        "   4. Connection string is correct"
      );
    }
    throw err;
  });
}

export default clientPromise;
