import { getUserFromRequest } from "../lib/auth";

export default function withAuth(handler, requiredRole = null) {
	return async (req, res) => {
		const user = getUserFromRequest(req);
		if (!user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		if (requiredRole && user.role !== requiredRole) {
			return res.status(403).json({ message: "Forbidden: Insufficient role" });
		}
		// Attach user to request for downstream handlers
		req.user = user;
		return handler(req, res);
	};
}
