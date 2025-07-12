// app/api/login/route.js
import { getCollections } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
	const { email, password } = await req.json();
	const { users } = await getCollections();

	const user = await users.findOne({ email });
	if (!user)
		return Response.json({ error: "Invalid credentials" }, { status: 401 });

	const isValid = await bcrypt.compare(password, user.password);
	if (!isValid)
		return Response.json({ error: "Invalid credentials" }, { status: 401 });

	const token = jwt.sign(
		{ userId: user._id, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: "8h" }
	);

	return Response.json({ token });
}
