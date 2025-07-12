export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}
	// TODO: Implement registration logic
	return res
		.status(201)
		.json({ message: "Registration successful (placeholder)" });
}
