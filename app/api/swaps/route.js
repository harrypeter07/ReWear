// app/api/swaps/route.js
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";
import withAuth from "@/middlewares/withAuth";

async function swapRequestHandler(req, res) {
	if (req.method === "POST") {
		const { itemId, requesterId, type, message } =
			req.body || (await req.json());
		const { swaps, items, users } = await getCollections();

		// Check item exists and is available
		const item = await items.findOne({ _id: new ObjectId(itemId) });
		if (!item) return res.status(404).json({ error: "Item not found" });
		if (item.status !== "available")
			return res.status(400).json({ error: "Item not available" });

		// Prevent duplicate requests
		const existing = await swaps.findOne({
			item: new ObjectId(itemId),
			requester: new ObjectId(requesterId),
			type,
			status: { $in: ["pending", "accepted"] },
		});
		if (existing)
			return res.status(400).json({
				error: "You already have a pending or accepted request for this item.",
			});

		// For redeem, check points
		if (type === "redeem") {
			const user = await users.findOne({ _id: new ObjectId(requesterId) });
			if (!user) return res.status(404).json({ error: "User not found" });
			if (user.points < item.pointsValue) {
				return res.status(400).json({ error: "Not enough points to redeem" });
			}
		}

		const result = await swaps.insertOne({
			item: new ObjectId(itemId),
			requester: new ObjectId(requesterId),
			type,
			status: "pending",
			message: message || "",
			createdAt: new Date(),
		});

		return res.json({
			message: "Swap requested",
			swapId: result.insertedId,
		});
	} else if (req.method === "PATCH") {
		// Accept or reject a swap request
		const { swapId, action } = req.body || (await req.json()); // action: 'accept' or 'reject'
		const { swaps, items, users } = await getCollections();
		const swap = await swaps.findOne({ _id: new ObjectId(swapId) });
		if (!swap) return res.status(404).json({ error: "Swap request not found" });
		if (swap.status !== "pending")
			return res.status(400).json({ error: "Already processed" });

		if (action === "accept") {
			// Update swap status
			await swaps.updateOne(
				{ _id: swap._id },
				{ $set: { status: "accepted", resolvedAt: new Date() } }
			);
			// Update item status
			await items.updateOne(
				{ _id: swap.item },
				{
					$set: {
						status: swap.type === "redeem" ? "redeemed" : "swapped",
						updatedAt: new Date(),
					},
				}
			);
			// Points logic for redeem
			if (swap.type === "redeem") {
				const item = await items.findOne({ _id: swap.item });
				const listerId = item.owner || item.uploaderId;
				const redeemerId = swap.requester;
				// Deduct points from redeemer
				await users.updateOne(
					{ _id: redeemerId },
					{ $inc: { points: -item.pointsValue } }
				);
				// Add points to lister
				await users.updateOne(
					{ _id: listerId },
					{ $inc: { points: item.pointsValue } }
				);
			}
			return res.json({ message: "Swap accepted and processed" });
		} else if (action === "reject") {
			await swaps.updateOne(
				{ _id: swap._id },
				{ $set: { status: "rejected", resolvedAt: new Date() } }
			);
			return res.json({ message: "Swap rejected" });
		} else {
			return res.status(400).json({ error: "Invalid action" });
		}
	} else {
		return res.status(405).json({ error: "Method not allowed" });
	}
}

async function getSwapsHandler(req) {
	if (req.method !== "GET") {
		return Response.json({ error: "Method not allowed" }, { status: 405 });
	}
	const { swaps } = await getCollections();
	const { userId, itemId } =
		req.query ||
		(req.url &&
			Object.fromEntries(
				new URL(req.url, "http://localhost").searchParams.entries()
			));
	const filter = {};
	if (userId) filter.requester = new ObjectId(userId);
	if (itemId) filter.item = new ObjectId(itemId);
	const swapRequests = await swaps
		.find(filter)
		.sort({ createdAt: -1 })
		.toArray();
	return Response.json({ swaps: swapRequests });
}

export const POST = withAuth(swapRequestHandler);
export const PATCH = withAuth(swapRequestHandler);
export const GET = withAuth(getSwapsHandler);
