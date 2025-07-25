import { getCollections } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
	const { email, password } = await req.json();
	console.log("[LOGIN] Received:", {
		email,
		password: password ? "[MASKED]" : undefined,
	});
	if (!email || !password) {
		console.log("[LOGIN] Missing email or password");
		return NextResponse.json(
			{ message: "Email and password required" },
			{ status: 400 }
		);
	}
	try {
		const { users } = await getCollections();
		const user = await users.findOne({ email });
		console.log(
			"[LOGIN] User lookup:",
			user ? { _id: user._id, email: user.email } : null
		);
		if (!user) {
			console.log("[LOGIN] User not found");
			return NextResponse.json(
				{ message: "User not registered" },
				{ status: 404 }
			);
		}
		const valid = await bcrypt.compare(password, user.password);
		console.log("[LOGIN] Password valid:", valid);
		if (!valid) {
			console.log("[LOGIN] Invalid password");
			return NextResponse.json(
				{ message: "Invalid credentials" },
				{ status: 401 }
			);
		}
		const accessToken = jwt.sign(
			{ _id: user._id, role: user.role, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "15m" }
		);
		const refreshToken = jwt.sign(
			{ _id: user._id, role: user.role, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);
		console.log("[LOGIN] Tokens created");
		const cookieStore = await cookies();
		cookieStore.set("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 15, // 15 minutes
			path: "/",
		});
		cookieStore.set("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 7, // 7 days
			path: "/",
		});
		console.log("[LOGIN] Cookies set");
		return NextResponse.json(
			{
				user: {
					_id: user._id,
					email: user.email,
					role: user.role,
					name: user.name || user.username,
				},
				message: "Login successful",
			},
			{ status: 200 }
		);
	} catch (err) {
		console.error("[LOGIN] Error:", err);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
