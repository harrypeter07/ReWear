// app/api/items/[id]/route.js
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(_, context) {
	const startTime = Date.now();
	const { params } = await context;
	const { id } = params;
	
	console.log("[ITEMS/[ID]] GET request", { itemId: id });
	
	try {
		const { items, users } = await getCollections();
		const agg = await items
			.aggregate([
				{ $match: { _id: new ObjectId(id) } },
				{
					$lookup: {
						from: "users",
						localField: "owner",
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
				{ $project: { ownerInfo: 0 } },
			])
			.toArray();
		const item = agg[0];
		
		if (!item) {
			console.log("[ITEMS/[ID]] Item not found", { itemId: id });
			return Response.json({ error: "Item not found" }, { status: 404 });
		}
		
		console.log("[ITEMS/[ID]] Item fetched successfully", { 
			itemId: id,
			title: item.title,
			duration: `${Date.now() - startTime}ms`
		});
		
		const response = Response.json(item);
		// Cache item details for 5 minutes, stale-while-revalidate for 1 hour
		response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
		return response;
	} catch (err) {
		console.error("[ITEMS/[ID]] Error fetching item", { itemId: id, error: err.message });
		return Response.json({ error: "Invalid item ID" }, { status: 400 });
	}
}
