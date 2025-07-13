import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req) {
	let user = getUserFromRequest(req);
	const cookieStore = await cookies();
	if (!user) {
		// Try refresh token
		const refreshToken =
			req.cookies?.get("refreshToken")?.value ||
			cookieStore.get("refreshToken")?.value;
		if (refreshToken) {
			try {
				const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
				// Issue new access token
				const newAccessToken = jwt.sign(
					{ _id: decoded._id, role: decoded.role, email: decoded.email },
					process.env.JWT_SECRET,
					{ expiresIn: "15m" }
				);
				cookieStore.set("accessToken", newAccessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "lax",
					maxAge: 60 * 15,
					path: "/",
				});
				user = { _id: decoded._id, role: decoded.role, email: decoded.email };
			} catch (err) {}
		}
	}
	if (!user) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}
	// Fetch the full user document from the database
	const { users } = await getCollections();
	const dbUser = await users.findOne({ _id: new ObjectId(user._id) });
	if (!dbUser) {
		return NextResponse.json({ message: "User not found" }, { status: 404 });
	}
	return NextResponse.json({ user: dbUser });
}

export async function PATCH(req) {
	const userFromToken = getUserFromRequest(req);
	if (!userFromToken) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const { username, name, avatar } = await req.json();
	if (username !== undefined && (!username || !name)) {
		return NextResponse.json(
			{ error: "Username and name are required when changing username" },
			{ status: 400 }
		);
	}
	if (name === undefined && avatar === undefined && username === undefined) {
		return NextResponse.json({ error: "No fields to update" }, { status: 400 });
	}
	try {
		const { users } = await getCollections();
		const update = {};
		if (username !== undefined) {
			// Check for username conflict (if changed)
			const existing = await users.findOne({
				username,
				_id: { $ne: new ObjectId(userFromToken._id) },
			});
			if (existing) {
				return NextResponse.json(
					{ error: "Username already taken" },
					{ status: 409 }
				);
			}
			update.username = username;
			update.name = name;
		} else if (name !== undefined) {
			update.name = name;
		}
		if (avatar !== undefined) update.avatar = avatar;
		await users.updateOne(
			{ _id: new ObjectId(userFromToken._id) },
			{ $set: update }
		);
		const updatedUser = await users.findOne({
			_id: new ObjectId(userFromToken._id),
		});
		return NextResponse.json({ user: updatedUser });
	} catch (err) {
		console.error("[AUTH/ME] PATCH error:", err);
		return NextResponse.json(
			{ error: "Failed to update profile" },
			{ status: 500 }
		);
	}
}
