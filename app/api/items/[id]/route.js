// app/api/items/[id]/route.js
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(_, context) {
	const { params } = await context;
	const { id } = params;
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
	if (!item) return Response.json({ error: "Item not found" }, { status: 404 });
	return Response.json(item);
}
