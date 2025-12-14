// app/api/swaps/route.js
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";
import withAuth from "@/middlewares/withAuth";

async function swapRequestHandler(req) {
	if (req.method === "POST") {
		const { itemId, requesterId, message } = await req.json();
		const { swaps, items, users } = await getCollections();

		// Check item exists and is available
		const item = await items.findOne({ _id: new ObjectId(itemId) });
		if (!item)
			return Response.json({ error: "Item not found" }, { status: 404 });
		
		// Item must be approved to be redeemable
		if (!item.isApproved || !item.isVisible)
			return Response.json({ error: "Item must be approved to redeem" }, { status: 400 });
		
		if (item.status !== "available")
			return Response.json({ error: "Item not available" }, { status: 400 });

		// Check user has enough points
		const user = await users.findOne({ _id: new ObjectId(requesterId) });
		if (!user)
			return Response.json({ error: "User not found" }, { status: 404 });
		if (user.points < item.pointsValue) {
			return Response.json(
				{ error: `Not enough points. You have ${user.points} points, but this item costs ${item.pointsValue} points.` },
				{ status: 400 }
			);
		}

		// Prevent duplicate requests
		const existing = await swaps.findOne({
			item: new ObjectId(itemId),
			requester: new ObjectId(requesterId),
			status: { $in: ["pending", "accepted"] },
		});
		if (existing)
			return Response.json(
				{ error: "You already have a pending or accepted request for this item." },
				{ status: 400 }
			);

		const targetUserId = String(item.owner || item.uploaderId);

		// Simple redeem request - no swap logic needed
		const swapDoc = {
			item: new ObjectId(itemId),
			requester: new ObjectId(requesterId),
			targetUser: new ObjectId(targetUserId),
			type: "redeem", // Always redeem
			status: "pending",
			message: message || "",
			createdAt: new Date(),
		};

		const result = await swaps.insertOne(swapDoc);

		return Response.json({
			message: "Redeem request submitted",
			swapId: result.insertedId,
		});
	} else if (req.method === "PATCH") {
		const { swapId, action } = await req.json(); // action: 'accept' or 'reject'
		const { swaps, items, users } = await getCollections();
		const swap = await swaps.findOne({ _id: new ObjectId(swapId) });
		if (!swap)
			return Response.json(
				{ error: "Swap request not found" },
				{ status: 404 }
			);
		if (swap.status !== "pending")
			return Response.json({ error: "Already processed" }, { status: 400 });

		if (action === "accept") {
			// Simple redeem logic - only support redeem with points
			const item = await items.findOne({ _id: swap.item });
			if (!item)
				return Response.json({ error: "Item not found" }, { status: 404 });
			
			if (item.status !== "available")
				return Response.json({ error: "Item is no longer available" }, { status: 400 });

			const listerId = item.owner || item.uploaderId;
			const redeemerId = swap.requester;
			
			// Verify redeemer still has enough points
			const redeemer = await users.findOne({ _id: redeemerId });
			if (!redeemer || redeemer.points < item.pointsValue) {
				return Response.json(
					{ error: "User no longer has enough points to redeem this item" },
					{ status: 400 }
				);
			}

			// Deduct points from redeemer
			await users.updateOne(
				{ _id: redeemerId },
				{ $inc: { points: -item.pointsValue } }
			);
			
			// Add points to lister (seller)
			await users.updateOne(
				{ _id: listerId },
				{ $inc: { points: item.pointsValue } }
			);
			
			// Mark item as redeemed and transfer ownership
			await items.updateOne(
				{ _id: swap.item },
				{ 
					$set: { 
						status: "redeemed", 
						owner: redeemerId,
						updatedAt: new Date() 
					} 
				}
			);
			
			// Update swap status
			await swaps.updateOne(
				{ _id: swap._id },
				{ $set: { status: "accepted", resolvedAt: new Date() } }
			);
			
			return Response.json({ message: "Item redeemed successfully" });
		} else if (action === "reject") {
			await swaps.updateOne(
				{ _id: swap._id },
				{ $set: { status: "rejected", resolvedAt: new Date() } }
			);
			return Response.json({ message: "Swap rejected" });
		} else {
			return Response.json({ error: "Invalid action" }, { status: 400 });
		}
	} else {
		return Response.json({ error: "Method not allowed" }, { status: 405 });
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
	// Only convert to ObjectId if it's a valid ObjectId string (24 hex characters)
	// Skip for special users like 'admin'
	if (userId) {
		const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(String(userId));
		if (isValidObjectId) {
			filter.requester = new ObjectId(userId);
		} else {
			// For non-ObjectId users (like 'admin'), return empty array
			console.log("[SWAPS] Invalid userId format, skipping filter", { userId });
			return Response.json({ swaps: [] });
		}
	}
	if (itemId) {
		const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(String(itemId));
		if (isValidObjectId) {
			filter.item = new ObjectId(itemId);
		} else {
			console.log("[SWAPS] Invalid itemId format, skipping filter", { itemId });
		}
	}
	const swapRequests = await swaps
		.find(filter)
		.sort({ createdAt: -1 })
		.toArray();
	return Response.json({ swaps: swapRequests });
}

export const POST = withAuth(swapRequestHandler);
export const PATCH = withAuth(swapRequestHandler);
export const GET = withAuth(getSwapsHandler);
