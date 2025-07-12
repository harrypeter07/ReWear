// app/api/items/[id]/route.js
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(_, { params }) {
  const { id } = params;
  const { items } = await getCollections();
  const item = await items.findOne({ _id: new ObjectId(id) });

  if (!item) return Response.json({ error: "Item not found" }, { status: 404 });
  return Response.json(item);
}
