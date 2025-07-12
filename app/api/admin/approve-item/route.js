// app/api/admin/approve-item/route.js
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";
import withAuth from "@/middlewares/withAuth";

async function approveItemHandler(req, res) {
	console.log("[ADMIN] PATCH /api/admin/approve-item called");
	const { itemId } = req.body || (await req.json());
	if (!itemId) return res.status(400).json({ error: "itemId is required" });
	const { items, users } = await getCollections();

	const item = await items.findOne({ _id: new ObjectId(itemId) });
	if (!item) return res.status(404).json({ error: "Item not found" });

	await items.updateOne(
		{ _id: item._id },
		{
			$set: {
				isApproved: true,
				isVisible: true,
				status: "available",
				updatedAt: new Date(),
			},
		}
	);

	if (item.uploaderId) {
		await users.updateOne({ _id: item.uploaderId }, { $inc: { points: 10 } });
	}

	return res.json({ message: "Item approved" });
}

export const PATCH = withAuth(approveItemHandler, "admin");
