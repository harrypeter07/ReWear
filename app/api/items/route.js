// app/api/items/route.js
import { getCollections } from "@/lib/db";

export async function GET() {
  const { items } = await getCollections();
  const allItems = await items.find({ isApproved: true, isVisible: true }).toArray();
  return Response.json(allItems);
}
