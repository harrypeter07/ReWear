// app/api/items/create/route.js
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";
import { itemSchema } from "@/lib/validations";

export async function POST(req) {
  try {
    const body = await req.json();

    // ✅ Validate input using Zod
    const validated = itemSchema.parse(body);

    const {
      title,
      description,
      category,
      size,
      condition,
      tags,
      images,
      uploaderId
    } = validated;

    const { items } = await getCollections();

    const newItem = {
      title,
      description,
      category,
      size,
      condition,
      tags: tags || [],
      images: images || [],
      uploaderId: new ObjectId(uploaderId),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "pending",
      isApproved: false,
      isVisible: false
    };

    const result = await items.insertOne(newItem);
    return Response.json({ message: "Item submitted", itemId: result.insertedId });
  } catch (err) {
    if (err.name === "ZodError") {
      return Response.json({ error: "Validation failed", details: err.errors }, { status: 400 });
    }
    console.error("Create Item Error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
