// lib/initDB.js
import clientPromise from "./mongodb";

export async function initializeDB() {
  const client = await clientPromise;
  const db = client.db("rewear_db");

  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("items").createIndex({ category: 1 });
  await db.collection("items").createIndex({ tags: 1 });
  await db.collection("items").createIndex({ status: 1 });
  await db.collection("swap_requests").createIndex({ requesterId: 1 });
  await db.collection("notifications").createIndex({ userId: 1, read: 1 });

  console.log("✅ Collections and indexes created.");
}
