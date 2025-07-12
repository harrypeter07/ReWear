// app/api/items/create/route.js
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";
import { itemSchema } from "@/lib/validations";

export async function POST(req) {
	console.log("[API] POST /api/items/create called");
	try {
		const body = await req.json();
		console.log("[API] Received body:", body);

		// Validate input using Zod
		let validated;
		try {
			validated = itemSchema.parse(body);
			console.log("[API] Validation passed:", validated);
		} catch (zodErr) {
			console.error("[API] Validation failed:", zodErr, zodErr.errors);
			return Response.json(
				{ error: "Validation failed", details: zodErr.errors || zodErr },
				{ status: 400 }
			);
		}

		const {
			title,
			description,
			category,
			image,
			uploaderId,
			size,
			condition,
			pointsValue,
		} = validated;

		if (typeof pointsValue !== "number" || isNaN(pointsValue)) {
			return Response.json(
				{ error: "pointsValue is required and must be a number." },
				{ status: 400 }
			);
		}

		const { items } = await getCollections();

		const newItem = {
			title,
			description,
			category,
			size,
			condition,
			image: image || "",
			uploaderId: new ObjectId(uploaderId),
			pointsValue,
			createdAt: new Date(),
			updatedAt: new Date(),
			status: "available",
			isApproved: false,
			isVisible: false,
		};
		console.log("[API] Inserting new item:", newItem);

		const result = await items.insertOne(newItem);
		console.log("[API] Insert result:", result);
		return Response.json({
			message: "Item submitted",
			itemId: result.insertedId,
		});
	} catch (err) {
		console.error("[API] Error:", err);
		return Response.json(
			{ error: "Internal server error", details: err.message },
			{ status: 500 }
		);
	}
}
