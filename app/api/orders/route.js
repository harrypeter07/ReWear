// app/api/orders/route.js
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";
import withAuth from "@/middlewares/withAuth";

async function getOrdersHandler(req) {
	if (req.method !== "GET") {
		return Response.json({ error: "Method not allowed" }, { status: 405 });
	}
	
	const { swaps, items, users } = await getCollections();
	const url = new URL(req.url, "http://localhost");
	const userId = url.searchParams.get("userId");
	
	if (!userId) {
		return Response.json({ error: "userId is required" }, { status: 400 });
	}
	
	// Validate userId is a valid ObjectId
	const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(String(userId));
	if (!isValidObjectId) {
		return Response.json({ orders: [] });
	}
	
	try {
		const userObjectId = new ObjectId(userId);
		
		// Get all orders where user is requester (purchases) or targetUser (sales)
		const swapRequests = await swaps
			.find({
				$or: [
					{ requester: userObjectId },
					{ targetUser: userObjectId }
				],
				status: "accepted" // Only show completed orders
			})
			.sort({ createdAt: -1 })
			.toArray();
		
		// Enrich with item and user details
		const orders = await Promise.all(
			swapRequests.map(async (swap) => {
				const item = await items.findOne({ _id: swap.item });
				const requester = await users.findOne({ _id: swap.requester });
				const seller = await users.findOne({ _id: swap.targetUser });
				
				return {
					_id: swap._id,
					item: item ? {
						_id: item._id,
						title: item.title,
						image: item.image,
						pointsValue: item.pointsValue,
						category: item.category,
					} : null,
					requester: requester ? {
						_id: requester._id,
						username: requester.username || requester.name,
						email: requester.email,
					} : null,
					seller: seller ? {
						_id: seller._id,
						username: seller.username || seller.name,
						email: seller.email,
					} : null,
					type: swap.type,
					status: swap.status,
					message: swap.message,
					createdAt: swap.createdAt,
					resolvedAt: swap.resolvedAt,
					isPurchase: swap.requester.toString() === userId, // User is the buyer
					isSale: swap.targetUser.toString() === userId, // User is the seller
				};
			})
		);
		
		return Response.json({ orders });
	} catch (error) {
		console.error("[ORDERS] Error fetching orders:", error);
		return Response.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export const GET = withAuth(getOrdersHandler);

