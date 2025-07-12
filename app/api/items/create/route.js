// app/api/items/create/route.js
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const {
      title,
      description,
      category,
      size,
      condition,
      tags,
      images,
      uploaderId
    } = await req.json();

    const { items } = await getCollections();

    const newItem = {
      title,
      description,
      category,
      size,
      condition,
      tags,
      images,
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
    console.error("Create Item Error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
