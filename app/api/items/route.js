// app/api/items/route.js
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET() {
	const { items, users } = await getCollections();
	// Only return approved and visible items; join owner info; newest first
	const allItems = await items
		.aggregate([
			{ $match: { isApproved: true, isVisible: true, status: { $ne: "pending" } } },
			{
				$addFields: {
					lookupUserId: { $ifNull: ["$owner", "$uploaderId"] },
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "lookupUserId",
					foreignField: "_id",
					as: "ownerInfo",
				},
			},
			{
				$addFields: {
					ownerUsername: { $arrayElemAt: ["$ownerInfo.username", 0] },
					ownerName: { $arrayElemAt: ["$ownerInfo.name", 0] },
				},
			},
			{ $sort: { createdAt: -1 } },
			{ $project: { ownerInfo: 0, lookupUserId: 0 } },
		])
		.toArray();
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
