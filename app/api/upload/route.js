import { NextResponse } from "next/server";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";

export const runtime = "nodejs";

export async function POST(req) {
	try {
		const formData = await req.formData();
		const file = formData.get("file");
		if (!file || typeof file === "string") {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}
		const buffer = Buffer.from(await file.arrayBuffer());
		const ext = file.name.split(".").pop();
		const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
		if (!allowed.includes(ext.toLowerCase())) {
			return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
		}
		const uploadDir = join(process.cwd(), "public", "uploads");
		await mkdir(uploadDir, { recursive: true });
		const filename = `${Date.now()}-${Math.random()
			.toString(36)
			.slice(2)}.${ext}`;
		const filepath = join(uploadDir, filename);
		await writeFile(filepath, buffer);
		return NextResponse.json({ url: `/uploads/${filename}` });
	} catch (err) {
		console.error("[UPLOAD] Error:", err);
		return NextResponse.json(
			{ error: "Upload failed", details: err.message },
			{ status: 500 }
		);
	}
}
