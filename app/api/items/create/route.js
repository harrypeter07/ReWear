// app/api/items/create/route.js
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";
import { itemSchema } from "@/lib/validations";

export async function POST(req) {
	try {
		const body = await req.json();
		console.log("[ITEM CREATE] Received body:", body);

		// Validate input using Zod
		let validated;
		try {
			validated = itemSchema.parse(body);
			console.log("[ITEM CREATE] Validation passed:", validated);
		} catch (zodErr) {
			console.error("[ITEM CREATE] Validation failed:", zodErr, zodErr.errors);
			return Response.json(
				{ error: "Validation failed", details: zodErr.errors || zodErr },
				{ status: 400 }
			);
		}

		const { title, description, category, image, uploaderId, size, condition } =
			validated;

		const { items } = await getCollections();

		const newItem = {
			title,
			description,
			category,
			size,
			condition,
			image: image || "",
			uploaderId: new ObjectId(uploaderId),
			createdAt: new Date(),
			updatedAt: new Date(),
			status: "pending",
			isApproved: false,
			isVisible: false,
		};
		console.log("[ITEM CREATE] Inserting new item:", newItem);

		const result = await items.insertOne(newItem);
		console.log("[ITEM CREATE] Insert result:", result);
		return Response.json({
			message: "Item submitted",
			itemId: result.insertedId,
		});
	} catch (err) {
		console.error("[ITEM CREATE] Error:", err);
		return Response.json(
			{ error: "Internal server error", details: err.message },
			{ status: 500 }
		);
	}
}
