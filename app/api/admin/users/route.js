// Convert Express-style handler to Next.js app directory API route
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

// Helper to check admin
function requireAdmin(req) {
	const user = getUserFromRequest(req);
	if (!user || user.role !== "admin") {
		return false;
	}
	return true;
}

export async function GET(req) {
	if (!requireAdmin(req)) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}
	const { users } = await getCollections();
	const allUsers = await users.find({}).toArray();
	return NextResponse.json({ users: allUsers });
}

export async function PATCH(req) {
	if (!requireAdmin(req)) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}
	const { userId, action } = await req.json();
	if (!userId || !["suspend", "activate"].includes(action)) {
		return NextResponse.json(
			{ error: "userId and valid action required" },
			{ status: 400 }
		);
	}
	const status = action === "suspend" ? "suspended" : "active";
	const { users } = await getCollections();
	const result = await users.updateOne(
		{ _id: new ObjectId(userId) },
		{ $set: { status } }
	);
	if (result.modifiedCount === 0) {
		return NextResponse.json(
			{ error: "User not found or not updated" },
			{ status: 404 }
		);
	}
	return NextResponse.json({ message: `User ${action}d` });
}

export async function DELETE(req) {
	if (!requireAdmin(req)) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}
	const { userId } = await req.json();
	if (!userId)
		return NextResponse.json({ error: "userId required" }, { status: 400 });
	const { users } = await getCollections();
	const result = await users.deleteOne({ _id: new ObjectId(userId) });
	if (result.deletedCount === 0) {
		return NextResponse.json(
			{ error: "User not found or not deleted" },
			{ status: 404 }
		);
	}
	return NextResponse.json({ message: "User deleted" });
}
