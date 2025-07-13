// app/api/items/create/route.js
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";
import { itemSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(req) {
	try {
		// Accept multipart/form-data
		const formData = await req.formData();
		const file = formData.get("file");
		if (!file || typeof file === "string") {
			return Response.json({ error: "No file uploaded" }, { status: 400 });
		}
		const buffer = Buffer.from(await file.arrayBuffer());
		const ext = file.name.split(".").pop();
		const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
		if (!allowed.includes(ext.toLowerCase())) {
			return Response.json({ error: "Invalid file type" }, { status: 400 });
		}
		// Convert image to base64
		const base64Image = `data:image/${ext};base64,${buffer.toString("base64")}`;

		// Extract other fields
		const title = formData.get("title");
		const description = formData.get("description");
		const category = formData.get("category");
		const size = formData.get("size");
		const condition = formData.get("condition");
		const pointsValue = Number(formData.get("pointsValue"));
		const uploaderId = formData.get("uploaderId");

		// Validate input using Zod
		let validated;
		try {
			validated = itemSchema.parse({
				title,
				description,
				category,
				size,
				condition,
				pointsValue,
				uploaderId,
				image: base64Image,
			});
		} catch (zodErr) {
			return Response.json(
				{ error: "Validation failed", details: zodErr.errors || zodErr },
				{ status: 400 }
			);
		}

		const { items } = await getCollections();
		const newItem = {
			...validated,
			uploaderId: new ObjectId(uploaderId),
			owner: new ObjectId(uploaderId), // Set owner for aggregation
			createdAt: new Date(),
			updatedAt: new Date(),
			status: "available",
			isApproved: false,
			isVisible: false,
		};

		const result = await items.insertOne(newItem);
		return Response.json({
			message: "Item submitted",
			itemId: result.insertedId,
		});
	} catch (err) {
		return Response.json(
			{ error: "Internal server error", details: err.message },
			{ status: 500 }
		);
	}
}
