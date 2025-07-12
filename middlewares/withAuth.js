export default function withAuth(handler) {
	return async (req, res) => {
		// TODO: Implement authentication check
		const isAuthenticated = false; // Replace with real logic
		if (!isAuthenticated) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		return handler(req, res);
	};
}
