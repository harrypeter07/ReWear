// app/api/admin/approve-item/route.js
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";

import { itemSchema } from "@/lib/validations";

const body = await req.json();
const validated = itemSchema.parse(body); // validates fields


export async function PATCH(req) {
  const { itemId } = await req.json();
  const { items, users } = await getCollections();

  const item = await items.findOne({ _id: new ObjectId(itemId) });
  if (!item) return Response.json({ error: "Item not found" }, { status: 404 });

  await items.updateOne({ _id: item._id }, {
    $set: { isApproved: true, isVisible: true, status: "available", updatedAt: new Date() }
  });

  await users.updateOne({ _id: item.uploaderId }, { $inc: { points: 10 } });

  return Response.json({ message: "Item approved" });
}
