import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";
import withAuth from "@/middlewares/withAuth";

async function usersHandler(req, res) {
	const { users } = await getCollections();
	if (req.method === "GET") {
		// List all users
		const allUsers = await users.find({}).toArray();
		return res.json({ users: allUsers });
	} else if (req.method === "PATCH") {
		// Suspend or activate user
		const { userId, action } = req.body || (await req.json());
		if (!userId || !["suspend", "activate"].includes(action)) {
			return res
				.status(400)
				.json({ error: "userId and valid action required" });
		}
		const status = action === "suspend" ? "suspended" : "active";
		const result = await users.updateOne(
			{ _id: new ObjectId(userId) },
			{ $set: { status } }
		);
		if (result.modifiedCount === 0) {
			return res.status(404).json({ error: "User not found or not updated" });
		}
		return res.json({ message: `User ${action}d` });
	} else if (req.method === "DELETE") {
		// Delete user
		const { userId } = req.body || (await req.json());
		if (!userId) return res.status(400).json({ error: "userId required" });
		const result = await users.deleteOne({ _id: new ObjectId(userId) });
		if (result.deletedCount === 0) {
			return res.status(404).json({ error: "User not found or not deleted" });
		}
		return res.json({ message: "User deleted" });
	} else {
		return res.status(405).json({ error: "Method not allowed" });
	}
}

export const GET = withAuth(usersHandler, "admin");
export const PATCH = withAuth(usersHandler, "admin");
export const DELETE = withAuth(usersHandler, "admin");
