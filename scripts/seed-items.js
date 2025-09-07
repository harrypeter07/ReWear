// scripts/seed-items.js
import clientPromise from "../lib/mongodb.js";
import { ObjectId } from "mongodb";
// Remote demo image URLs (store as URLs, not base64)
const demoImageUrls = [
  "https://images.unsplash.com/photo-1520975922284-8b456906c813?q=80&w=800",
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800",
  "https://images.unsplash.com/photo-1520975918311-1f8c1959b1f2?q=80&w=800",
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800",
  "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=800",
  "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?q=80&w=800",
  "https://images.unsplash.com/photo-1542060748-10c28b62716f?q=80&w=800",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800",
];

const demoCategories = [
  "Jackets",
  "Dresses",
  "Shoes",
  "Accessories",
  "Shirts",
  "Pants",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getDemoImages() { return demoImageUrls; }

function generateItems(seedOwnerId, count = 20, demoImages = []) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const category = pick(demoCategories);
    items.push({
      title: `${category} ${100 + i}`,
      description:
        "A high-quality, gently used item perfect for sustainable fashion.",
      category,
      size: pick(["S", "M", "L", "XL"]),
      condition: pick(["Like New", "Good", "Fair"]),
      image: pick(demoImages),
      pointsValue: pick([5, 8, 10, 12, 15]),
      owner: new ObjectId(seedOwnerId),
      uploaderId: new ObjectId(seedOwnerId),
      status: "available",
      isApproved: true,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return items;
}

async function main() {
  const seedOwnerEmail = process.env.SEED_OWNER_EMAIL || "user@example.com";
  const client = await clientPromise;
  const db = client.db("rewear_db");
  const users = db.collection("users");
  const itemsCol = db.collection("items");

  const user = await users.findOne({ email: seedOwnerEmail });
  if (!user) {
    console.error(`Seed owner not found: ${seedOwnerEmail}. Create a user first.`);
    process.exit(1);
  }

  // Drop entire items collection if exists, then recreate and index
  try {
    await itemsCol.drop();
    console.log("Dropped items collection");
  } catch {}
  const itemsCol2 = db.collection("items");
  await itemsCol2.createIndex({ createdAt: -1 });

  const images = getDemoImages();
  const items = generateItems(user._id.toString(), 20, images);
  const result = await itemsCol2.insertMany(items);
  console.log(`Inserted ${result.insertedCount || items.length} demo items for`, seedOwnerEmail);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});


