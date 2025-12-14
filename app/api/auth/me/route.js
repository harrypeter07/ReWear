import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req) {
	const startTime = Date.now();
	console.log("[AUTH/ME] GET request received");
	
	let user = await getUserFromRequest(req);
	const cookieStore = await cookies();
	
	if (!user) {
		console.log("[AUTH/ME] No access token, checking refresh token");
		// Try refresh token
		const refreshToken =
			req.cookies?.get("refreshToken")?.value ||
			cookieStore.get("refreshToken")?.value;
		if (refreshToken) {
			try {
				const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
				console.log("[AUTH/ME] Refresh token valid, issuing new access token", { userId: decoded._id });
				
				// If refresh token is for admin user, clear it and return unauthorized
				// This prevents old admin tokens from auto-logging users in
				if (decoded._id === "admin" && decoded.role === "admin") {
					console.log("[AUTH/ME] Admin refresh token detected, clearing tokens");
					cookieStore.delete("accessToken");
					cookieStore.delete("refreshToken");
					return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
				}
				
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
			} catch (err) {
				console.error("[AUTH/ME] Refresh token verification failed:", err.message);
			}
		} else {
			console.log("[AUTH/ME] No refresh token found");
		}
	} else {
		console.log("[AUTH/ME] Access token valid", { userId: user._id });
	}
	
	if (!user) {
		console.log("[AUTH/ME] Unauthorized - no valid tokens");
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}
	
	// Handle admin user (special case where _id is "admin")
	if (user._id === "admin" && user.role === "admin") {
		console.log("[AUTH/ME] Admin user detected, returning admin user object");
		const adminUser = {
			_id: "admin",
			username: "admin",
			email: user.email || "admin@local",
			role: "admin",
			name: "Administrator",
			points: 0,
			createdAt: new Date(),
		};
		const response = NextResponse.json({ user: adminUser });
		response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
		return response;
	}
	
	// Fetch the full user document from the database
	const { users } = await getCollections();
	let dbUser;
	
	// Check if user._id is a valid ObjectId string (24 hex characters)
	const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(String(user._id));
	
	if (isValidObjectId) {
		// Try to find by ObjectId
		try {
			dbUser = await users.findOne({ _id: new ObjectId(user._id) });
		} catch (err) {
			console.error("[AUTH/ME] Error converting to ObjectId:", err.message);
		}
	}
	
	// If not found by ObjectId, try to find by username or email
	if (!dbUser) {
		if (user.email) {
			dbUser = await users.findOne({ email: user.email });
		} else if (user.username) {
			dbUser = await users.findOne({ username: user.username });
		} else if (typeof user._id === 'string') {
			// Try finding by username if _id is a string (like 'admin')
			dbUser = await users.findOne({ username: user._id });
		}
	}
	
	if (!dbUser) {
		console.error("[AUTH/ME] User not found in database", { 
			userId: user._id, 
			email: user.email,
			username: user.username,
			isValidObjectId 
		});
		return NextResponse.json({ message: "User not found" }, { status: 404 });
	}
	
	console.log("[AUTH/ME] User fetched successfully", { 
		userId: dbUser._id, 
		email: dbUser.email,
		duration: `${Date.now() - startTime}ms`
	});
	
	const response = NextResponse.json({ user: dbUser });
	// Don't cache user data - it's private and changes frequently
	response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	return response;
}

export async function PATCH(req) {
	const startTime = Date.now();
	console.log("[AUTH/ME] PATCH request received");
	
	const userFromToken = await getUserFromRequest(req);
	if (!userFromToken) {
		console.log("[AUTH/ME] PATCH - Unauthorized");
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	
	const { username, name, avatar } = await req.json();
	console.log("[AUTH/ME] PATCH - Update request", { 
		userId: userFromToken._id,
		hasUsername: username !== undefined,
		hasName: name !== undefined,
		hasAvatar: avatar !== undefined
	});
	
	if (username !== undefined && (!username || !name)) {
		console.log("[AUTH/ME] PATCH - Validation failed: username requires name");
		return NextResponse.json(
			{ error: "Username and name are required when changing username" },
			{ status: 400 }
		);
	}
	if (name === undefined && avatar === undefined && username === undefined) {
		console.log("[AUTH/ME] PATCH - No fields to update");
		return NextResponse.json({ error: "No fields to update" }, { status: 400 });
	}
	
	try {
		const { users } = await getCollections();
		
		// Find the user first to get their actual _id
		let dbUser;
		const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(String(userFromToken._id));
		
		if (isValidObjectId) {
			try {
				dbUser = await users.findOne({ _id: new ObjectId(userFromToken._id) });
			} catch (err) {
				console.error("[AUTH/ME] PATCH - Error converting to ObjectId:", err.message);
			}
		}
		
		if (!dbUser) {
			if (userFromToken.email) {
				dbUser = await users.findOne({ email: userFromToken.email });
			} else if (userFromToken.username) {
				dbUser = await users.findOne({ username: userFromToken.username });
			} else if (typeof userFromToken._id === 'string') {
				dbUser = await users.findOne({ username: userFromToken._id });
			}
		}
		
		if (!dbUser) {
			console.error("[AUTH/ME] PATCH - User not found", { userId: userFromToken._id });
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}
		
		const update = {};
		if (username !== undefined) {
			// Check for username conflict (if changed)
			const existing = await users.findOne({
				username,
				_id: { $ne: dbUser._id },
			});
			if (existing) {
				console.log("[AUTH/ME] PATCH - Username conflict", { username });
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
		
		const result = await users.updateOne(
			{ _id: dbUser._id },
			{ $set: update }
		);
		
		if (result.modifiedCount === 0) {
			console.log("[AUTH/ME] PATCH - No changes made", { userId: dbUser._id });
		}
		
		const updatedUser = await users.findOne({
			_id: dbUser._id,
		});
		
		console.log("[AUTH/ME] PATCH - Profile updated successfully", { 
			userId: userFromToken._id,
			duration: `${Date.now() - startTime}ms`
		});
		
		return NextResponse.json({ user: updatedUser });
	} catch (err) {
		console.error("[AUTH/ME] PATCH - Internal error:", err);
		return NextResponse.json(
			{ error: "Failed to update profile" },
			{ status: 500 }
		);
	}
}
