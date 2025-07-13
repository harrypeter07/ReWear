import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(req) {
	const user = getUserFromRequest(req);
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const { users } = await getCollections();
	const dbUser = await users.findOne({ _id: new ObjectId(user._id) });
	if (!dbUser) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}
	return NextResponse.json({ points: dbUser.points });
}

export async function PATCH(req) {
	const user = getUserFromRequest(req);
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const { userId, points } = await req.json();
	if (typeof points !== "number") {
		return NextResponse.json(
			{ error: "Points must be a number" },
			{ status: 400 }
		);
	}
	const { users } = await getCollections();
	// Only allow admin to update any user's points, or user to update their own
	if (user.role === "admin" && userId) {
		await users.updateOne({ _id: new ObjectId(userId) }, { $set: { points } });
		const updated = await users.findOne({ _id: new ObjectId(userId) });
		return NextResponse.json({ points: updated.points });
	} else if (!userId || userId === user._id) {
		await users.updateOne(
			{ _id: new ObjectId(user._id) },
			{ $set: { points } }
		);
		const updated = await users.findOne({ _id: new ObjectId(user._id) });
		return NextResponse.json({ points: updated.points });
	} else {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}
}
