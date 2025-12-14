// app/api/items/route.js
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(req) {
	const startTime = Date.now();
	const { items } = await getCollections();
	const url = new URL(req.url, "http://localhost");
	const uploaderId = url.searchParams.get("uploaderId");
	const status = url.searchParams.get("status");

	console.log("[ITEMS] GET request", { uploaderId, status });

	const pipeline = [];
	if (uploaderId) {
		// Only convert to ObjectId if it's a valid ObjectId string (24 hex characters)
		// Skip for special users like 'admin'
		const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(String(uploaderId));
		if (isValidObjectId) {
			try {
				pipeline.push({ $match: { uploaderId: new ObjectId(uploaderId) } });
				console.log("[ITEMS] Filtering by uploaderId", { uploaderId });
			} catch (err) {
				console.error("[ITEMS] Error converting uploaderId to ObjectId", { uploaderId, error: err.message });
			}
		} else {
			console.log("[ITEMS] Invalid uploaderId format (not a valid ObjectId), returning empty array", { uploaderId });
			// Return empty array for invalid ObjectIds like 'admin'
			return Response.json([]);
		}
	} else if (status === "pending") {
		pipeline.push({ $match: { isApproved: false } });
		console.log("[ITEMS] Filtering pending items");
	} else {
		pipeline.push({ $match: { isApproved: true, isVisible: true, status: { $ne: "pending" } } });
		console.log("[ITEMS] Filtering approved and visible items");
	}
	pipeline.push(
		{ $addFields: { lookupUserId: { $ifNull: ["$owner", "$uploaderId"] } } },
		{ $lookup: { from: "users", localField: "lookupUserId", foreignField: "_id", as: "ownerInfo" } },
		{ $addFields: { ownerUsername: { $arrayElemAt: ["$ownerInfo.username", 0] }, ownerName: { $arrayElemAt: ["$ownerInfo.name", 0] } } },
		{ $sort: { createdAt: -1 } },
		{ $project: { ownerInfo: 0, lookupUserId: 0 } },
	);

	const allItems = await items.aggregate(pipeline).toArray();
	
	console.log("[ITEMS] Items fetched", { 
		count: allItems.length,
		duration: `${Date.now() - startTime}ms`
	});
	
	// Add cache headers for public items (not user-specific)
	const isPublic = !uploaderId && status !== "pending";
	const response = Response.json(allItems);
	
	if (isPublic) {
		response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
		console.log("[ITEMS] Public cache headers set");
	} else {
		response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
		console.log("[ITEMS] Private cache headers set");
	}
	
	return response;
}

export async function PATCH(req) {
	const startTime = Date.now();
	console.log("[ITEMS] PATCH request received");
	
	try {
		const { itemId } = await req.json();
		console.log("[ITEMS] PATCH - Approving item", { itemId });
		
		if (!itemId) {
			console.log("[ITEMS] PATCH - Missing itemId");
			return Response.json(
				{ error: "itemId is required" },
				{ status: 400 }
			);
		}
		
		const { items, users } = await getCollections();
		
		// Get item first to check if already approved and get uploaderId
		const item = await items.findOne({ _id: new ObjectId(itemId) });
		if (!item) {
			return Response.json(
				{ error: "Item not found" },
				{ status: 404 }
			);
		}
		
		// Check if item is already approved to avoid giving points twice
		const wasAlreadyApproved = item.isApproved === true;
		
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
			console.log("[ITEMS] PATCH - Item not found or not updated", { itemId });
			return Response.json(
				{ error: "Item not found or not updated" },
				{ status: 404 }
			);
		}
		
		// Give points to user when item is approved (only if not already approved)
		if (item.uploaderId && !wasAlreadyApproved) {
			const pointsToAward = item.pointsValue || 10; // Use item's pointsValue, default to 10 if not set
			await users.updateOne(
				{ _id: item.uploaderId },
				{ $inc: { points: pointsToAward } }
			);
			console.log(`[ITEMS] PATCH - Awarded ${pointsToAward} points to user ${item.uploaderId} for approved item ${itemId}`);
		}
		
		console.log("[ITEMS] PATCH - Item approved successfully", { 
			itemId,
			duration: `${Date.now() - startTime}ms`
		});
		
		return Response.json({ message: "Item approved and made visible" });
	} catch (err) {
		console.error("[ITEMS] PATCH - Internal error:", err);
		return Response.json(
			{ error: "Internal server error", details: err.message },
			{ status: 500 }
		);
	}
}
