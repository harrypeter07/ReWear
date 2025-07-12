import { getCollections } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

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
			email: cleanEmail,
			password: hashed,
			createdAt: new Date(),
			role: "user",
		};
		await users.insertOne(user);
		return NextResponse.json(
			{ message: "Registration successful" },
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
