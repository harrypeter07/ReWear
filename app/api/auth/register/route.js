import { getCollections } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
	// At least 8 chars, 1 letter, 1 number
	return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/.test(password);
}

export async function POST(req) {
	const { username, email, password } = await req.json();
	if (!username || !email || !password) {
		return NextResponse.json(
			{ message: "All fields are required" },
			{ status: 400 }
		);
	}
	const cleanUsername = username.trim();
	const cleanEmail = email.trim().toLowerCase();
	const cleanPassword = password.trim();
	if (!isValidEmail(cleanEmail)) {
		return NextResponse.json(
			{ message: "Invalid email format" },
			{ status: 400 }
		);
	}
	if (!isStrongPassword(cleanPassword)) {
		return NextResponse.json(
			{
				message:
					"Password must be at least 8 characters and contain at least one letter and one number",
			},
			{ status: 400 }
		);
	}
	try {
		const { users } = await getCollections();
		const existingEmail = await users.findOne({ email: cleanEmail });
		if (existingEmail) {
			return NextResponse.json(
				{ message: "User with this email already exists" },
				{ status: 409 }
			);
		}
		const existingUsername = await users.findOne({ username: cleanUsername });
		if (existingUsername) {
			return NextResponse.json(
				{ message: "Username already taken" },
				{ status: 409 }
			);
		}
		const hashed = await bcrypt.hash(cleanPassword, 10);
		const user = {
			username: cleanUsername,
			name: "",
			email: cleanEmail,
			password: hashed,
			createdAt: new Date(),
			role: "user",
			points: 2,
		};
		const result = await users.insertOne(user);
		// Auto-login after registration
		const jwt = require("jsonwebtoken");
		const { cookies } = require("next/headers");
		const userId = result.insertedId;
		const accessToken = jwt.sign(
			{ _id: userId, role: user.role, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "15m" }
		);
		const refreshToken = jwt.sign(
			{ _id: userId, role: user.role, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);
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
		return NextResponse.json(
			{
				user: {
					_id: userId,
					email: user.email,
					role: user.role,
					name: user.name || user.username,
					username: user.username,
				},
				message: "Registration and login successful",
			},
			{ status: 201 }
		);
	} catch (err) {
		console.error("Register error:", err);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
