import { getCollections } from "@/lib/db";
import bcrypt from "bcrypt";
import { userSchema } from "@/lib/validations";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const body = req.body;

    // ✅ Validate using Zod
    const parsed = userSchema.pick({ username: true, email: true, password: true }).parse(body);

    const { users } = await getCollections();

    const existing = await users.findOne({ email: parsed.email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(parsed.password, 10);
    const newUser = {
      ...parsed,
      password: hashedPassword,
      role: "user",
      points: 100,
      isBanned: false,
      joinedAt: new Date()
    };

    const result = await users.insertOne(newUser);
    return res.status(201).json({ message: "User registered", userId: result.insertedId });

  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(400).json({ error: error.message || "Invalid input" });
  }
}
