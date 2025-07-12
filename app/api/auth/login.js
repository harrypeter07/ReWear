import { getCollections } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ message: "Email and password required" });
	}
	try {
		const { users } = await getCollections();
		const user = await users.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}
		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "8h" }
		);
		return res.status(200).json({ token });
	} catch (err) {
		console.error("Login error:", err);
		return res.status(500).json({ message: "Internal server error" });
	}
}
