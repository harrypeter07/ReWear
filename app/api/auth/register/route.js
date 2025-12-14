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
	console.log("[REGISTER] Received:", {
		username,
		email,
		password: password ? "[MASKED]" : undefined,
	});
	if (!username || !email || !password) {
		console.log("[REGISTER] Missing fields", {
			hasUsername: !!username,
			hasEmail: !!email,
			hasPassword: !!password,
		});
		return NextResponse.json(
			{ message: "All fields are required" },
			{ status: 400 }
		);
	}
	const cleanUsername = username.trim();
	const cleanEmail = email.trim().toLowerCase();
	const cleanPassword = password.trim();
	if (!isValidEmail(cleanEmail)) {
		console.log("[REGISTER] Invalid email format", { cleanEmail });
		return NextResponse.json(
			{ message: "Invalid email format" },
			{ status: 400 }
		);
	}
	const hasMinLength = cleanPassword.length >= 8;
	const hasLetter = /[A-Za-z]/.test(cleanPassword);
	const hasNumber = /\d/.test(cleanPassword);
	if (!isStrongPassword(cleanPassword)) {
		console.log("[REGISTER] Weak password", {
			hasMinLength,
			hasLetter,
			hasNumber,
		});
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
			console.log("[REGISTER] Email already exists", { cleanEmail });
			return NextResponse.json(
				{ message: "User with this email already exists" },
				{ status: 409 }
			);
		}
		const existingUsername = await users.findOne({ username: cleanUsername });
		if (existingUsername) {
			console.log("[REGISTER] Username already taken", { cleanUsername });
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
		console.log("[REGISTER] User created", { _id: result.insertedId, email: user.email });
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
		
		// Clear any existing tokens first (including old admin tokens)
		cookieStore.delete("accessToken");
		cookieStore.delete("refreshToken");
		
		// Set new tokens
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
		console.log("[REGISTER] Tokens set and response ready", { _id: userId });
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
		console.error("[REGISTER] Internal error:", err);
		
		// Provide more specific error messages
		if (err.code === "EREFUSED" || err.message?.includes("querySrv") || err.message?.includes("EREFUSED")) {
			return NextResponse.json(
				{ 
					message: "Database connection failed. Please check your MongoDB Atlas IP whitelist settings.",
					error: "DATABASE_CONNECTION_ERROR"
				},
				{ status: 503 }
			);
		}
		
		return NextResponse.json(
			{ message: "Internal server error. Please try again later." },
			{ status: 500 }
		);
	}
}
