// scripts/test-connection.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ MONGO_URI not found in environment variables");
  process.exit(1);
}

console.log("🔍 Testing MongoDB connection...");
console.log("📍 Connection string:", uri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")); // Mask password

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
});

async function testConnection() {
  try {
    console.log("\n⏳ Attempting to connect...");
    await client.connect();
    console.log("✅ Successfully connected to MongoDB!");
    
    // Test database access
    const db = client.db("rewear_db");
    const collections = await db.listCollections().toArray();
    console.log(`\n📊 Database: rewear_db`);
    console.log(`📁 Collections found: ${collections.length}`);
    collections.forEach((col) => {
      console.log(`   - ${col.name}`);
    });
    
    // Test a simple query
    const usersCollection = db.collection("users");
    const userCount = await usersCollection.countDocuments();
    console.log(`\n👥 Users in database: ${userCount}`);
    
    console.log("\n✅ Connection test completed successfully!");
  } catch (error) {
    console.error("\n❌ Connection failed!");
    console.error("Error:", error.message);
    console.error("Error code:", error.code);
    
    if (error.code === "EREFUSED" || error.message.includes("querySrv")) {
      console.error("\n🔧 Troubleshooting steps:");
      console.error("1. Go to MongoDB Atlas → Network Access → IP Access List");
      console.error("2. Click 'Add IP Address'");
      console.error("3. Click 'Add Current IP Address' (or use 0.0.0.0/0 for development)");
      console.error("4. Wait 1-2 minutes for changes to propagate");
      console.error("5. Make sure your MongoDB Atlas cluster is running");
    } else if (error.message.includes("authentication")) {
      console.error("\n🔧 Authentication failed. Check your username and password in the connection string.");
    } else if (error.message.includes("ENOTFOUND")) {
      console.error("\n🔧 DNS resolution failed. Check your internet connection and MongoDB Atlas cluster status.");
    }
  } finally {
    await client.close();
    console.log("\n🔌 Connection closed.");
  }
}

testConnection();

