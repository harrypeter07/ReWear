// lib/auth.js
import jwt from "jsonwebtoken";

export function verifyToken(req) {
	const authHeader = req.headers.get("authorization");
	console.log("[AUTH] verifyToken - authHeader:", authHeader);
	if (!authHeader) throw new Error("No token");

	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log("[AUTH] verifyToken - decoded:", decoded);
		return decoded;
	} catch (err) {
		console.error("[AUTH] verifyToken - error:", err);
		throw err;
	}
}

export function getUserFromRequest(req) {
	const token = req.cookies?.get("token")?.value;
	console.log("[AUTH] getUserFromRequest - token:", token);
	if (!token) return null;
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log("[AUTH] getUserFromRequest - decoded:", decoded);
		return decoded;
	} catch (err) {
		console.error("[AUTH] getUserFromRequest - error:", err);
		return null;
	}
}
