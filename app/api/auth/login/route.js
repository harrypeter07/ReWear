import { getCollections } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
	const { email, password } = await req.json();
	if (!email || !password) {
		return NextResponse.json(
			{ message: "Email and password required" },
			{ status: 400 }
		);
	}
	try {
		const { users } = await getCollections();
		const user = await users.findOne({ email });
		if (!user) {
			return NextResponse.json(
				{ message: "Invalid credentials" },
				{ status: 401 }
			);
		}
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			return NextResponse.json(
				{ message: "Invalid credentials" },
				{ status: 401 }
			);
		}
		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "8h" }
		);
		return NextResponse.json({ token }, { status: 200 });
	} catch (err) {
		console.error("Login error:", err);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
