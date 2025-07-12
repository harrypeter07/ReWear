import { getCollections } from "@/lib/db";
import bcrypt from "bcrypt";

import { userSchema } from "@/lib/validations";

const body = await req.json();
const validated = userSchema.parse(body);


export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}
	const { username, email, password } = req.body;
	if (!username || !email || !password) {
		return res.status(400).json({ message: "All fields are required" });
	}
	try {
		const { users } = await getCollections();
		const existing = await users.findOne({ email });
		if (existing) {
			return res.status(409).json({ message: "User already exists" });
		}
		const hashed = await bcrypt.hash(password, 10);
		const user = {
			username,
			email,
			password: hashed,
			createdAt: new Date(),
			role: "user",
		};
		await users.insertOne(user);
		return res.status(201).json({ message: "Registration successful" });
	} catch (err) {
		console.error("Register error:", err);
		return res.status(500).json({ message: "Internal server error" });
	}
}
