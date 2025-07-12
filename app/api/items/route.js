// app/api/items/route.js
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET() {
	console.log("[API] GET /api/items called");
	const { items } = await getCollections();
	const allItems = await items.find({}).toArray();
	console.log(`[API] /api/items found ${allItems.length} items`);
	if (allItems.length > 0) {
		console.log("[API] Example item:", allItems[0]);
	}
	return Response.json(allItems);
}

export async function PATCH(req) {
	try {
		const { itemId } = await req.json();
		const { items } = await getCollections();
		const result = await items.updateOne(
			{ _id: new ObjectId(itemId) },
			{
				$set: {
					isApproved: true,
					isVisible: true,
					status: "available",
					updatedAt: new Date(),
				},
			}
		);
		if (result.modifiedCount === 0) {
			return Response.json(
				{ error: "Item not found or not updated" },
				{ status: 404 }
			);
		}
		return Response.json({ message: "Item approved and made visible" });
	} catch (err) {
		console.error("[API] PATCH /api/items error:", err);
		return Response.json(
			{ error: "Internal server error", details: err.message },
			{ status: 500 }
		);
	}
}
