// scripts/seed-items.js
import clientPromise from "../lib/mongodb.js";
import { ObjectId } from "mongodb";

// Demo images hosted in repo public/uploads or placeholders
const demoImages = [
  "/uploads/1752318373893-0zbgu3f18lyh.jpg",
  "/uploads/1752318415828-pfzak19p3s.jpg",
  "/uploads/1752318995452-hsvwmrih5ow.jpg",
  "/uploads/1752344430155-y4hzw3293y.jpg",
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

function generateItems(seedOwnerId, count = 20) {
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

  const items = generateItems(user._id.toString(), 20);
  const result = await itemsCol.insertMany(items);
  console.log(`Inserted ${result.insertedCount || items.length} demo items for`, seedOwnerEmail);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});


