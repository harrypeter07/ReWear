// app/api/admin/approve-item/route.js
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

async function requireAdmin(req) {
	const user = await getUserFromRequest(req);
	if (!user || user.role !== "admin") {
		return false;
	}
	return true;
}

export async function PATCH(req) {
	try {
		if (!(await requireAdmin(req))) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const body = await req.json();
		const { itemId } = body;

		if (!itemId) {
			return NextResponse.json(
				{ error: "itemId is required" },
				{ status: 400 }
			);
		}

		const { items, users } = await getCollections();

		const item = await items.findOne({ _id: new ObjectId(itemId) });
		if (!item) {
			return NextResponse.json(
				{ error: "Item not found" },
				{ status: 404 }
			);
		}

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
			await users.updateOne(
				{ _id: item.uploaderId },
				{ $inc: { points: 10 } }
			);
		}

		return NextResponse.json({ message: "Item approved" });
	} catch (error) {
		console.error("[ADMIN] Error approving item:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
