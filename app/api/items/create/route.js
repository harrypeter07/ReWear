// app/api/items/create/route.js
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";
import { itemSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(req) {
	const startTime = Date.now();
	console.log("[ITEMS/CREATE] POST request received");
	
	try {
		// Accept either JSON (with image as url/data uri) or multipart/form-data (file upload)
		let title, description, category, size, condition, pointsValue, uploaderId, image;
		const contentType = req.headers.get("content-type") || "";
		
		console.log("[ITEMS/CREATE] Content-Type:", contentType);
		
		if (contentType.includes("application/json")) {
			const body = await req.json();
			({ title, description, category, size, condition, pointsValue, uploaderId, image } = body);
			console.log("[ITEMS/CREATE] JSON payload received", { 
				title, 
				category, 
				pointsValue, 
				hasImage: !!image,
				uploaderId 
			});
		} else {
			const formData = await req.formData();
			const file = formData.get("file");
			const imageUrlOrData = formData.get("image");
			
			if (file && typeof file !== "string") {
				const buffer = Buffer.from(await file.arrayBuffer());
				const ext = (file.name || "").split(".").pop();
				const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
				if (!allowed.includes((ext || "").toLowerCase())) {
					console.log("[ITEMS/CREATE] Invalid file type", { ext, fileName: file.name });
					return Response.json({ error: "Invalid file type" }, { status: 400 });
				}
				image = `data:image/${ext};base64,${buffer.toString("base64")}`;
				console.log("[ITEMS/CREATE] File uploaded", { ext, size: buffer.length });
			} else if (typeof imageUrlOrData === "string") {
				image = imageUrlOrData;
				console.log("[ITEMS/CREATE] Image URL/data provided");
			}
			title = formData.get("title");
			description = formData.get("description");
			category = formData.get("category");
			size = formData.get("size");
			condition = formData.get("condition");
			pointsValue = Number(formData.get("pointsValue"));
			uploaderId = formData.get("uploaderId");
			console.log("[ITEMS/CREATE] Form data received", { 
				title, 
				category, 
				pointsValue, 
				uploaderId 
			});
		}

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
				image,
			});
			console.log("[ITEMS/CREATE] Validation passed");
		} catch (zodErr) {
			console.error("[ITEMS/CREATE] Validation failed", { errors: zodErr.errors });
			return Response.json(
				{ error: "Validation failed", details: zodErr.errors || zodErr },
				{ status: 400 }
			);
		}

		const { items } = await getCollections();
		const requireReview = Number(pointsValue) > 10;
		const newItem = {
			...validated,
			uploaderId: new ObjectId(uploaderId),
			owner: new ObjectId(uploaderId), // Set owner for aggregation
			createdAt: new Date(),
			updatedAt: new Date(),
			status: requireReview ? "pending" : "available",
			isApproved: !requireReview,
			isVisible: !requireReview,
		};

		console.log("[ITEMS/CREATE] Creating item", { 
			uploaderId, 
			requireReview,
			status: newItem.status
		});

		const result = await items.insertOne(newItem);
		
		console.log("[ITEMS/CREATE] Item created successfully", { 
			itemId: result.insertedId,
			duration: `${Date.now() - startTime}ms`
		});
		
		return Response.json({
			message: "Item submitted",
			itemId: result.insertedId,
		});
	} catch (err) {
		console.error("[ITEMS/CREATE] Internal error:", err);
		return Response.json(
			{ error: "Internal server error", details: err.message },
			{ status: 500 }
		);
	}
}
