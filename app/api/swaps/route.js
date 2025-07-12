// app/api/swaps/route.js
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req) {
  const { itemId, requesterId, type } = await req.json();
  const { swaps } = await getCollections();

  const result = await swaps.insertOne({
    itemId: new ObjectId(itemId),
    requesterId: new ObjectId(requesterId),
    type,
    status: "pending",
    createdAt: new Date()
  });

  return Response.json({ message: "Swap requested", swapId: result.insertedId });
}
