// lib/auth.js
import jwt from "jsonwebtoken";
import { cookies as nextCookies } from "next/headers";

export function verifyToken(req) {
	const authHeader = req.headers.get("authorization");
	if (!authHeader) throw new Error("No token");

	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		return decoded;
	} catch (err) {
		throw err;
	}
}

export function getUserFromRequest(req) {
	// Try from req.cookies (for edge/serverless context)
	let token = req.cookies?.get?.("accessToken")?.value;
	// Fallback to global cookies() (for app directory API routes)
	if (!token) {
		try {
			token = nextCookies().get("accessToken")?.value;
		} catch {}
	}
	if (!token) return null;
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		return decoded;
	} catch (err) {
		return null;
	}
}
