import { NextResponse } from "next/server";
import { getUserFromRequest } from "../lib/auth";

export default function withAuth(handler, requiredRole = null) {
	return async (req, context) => {
		const user = getUserFromRequest(req);
		if (!user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}
		if (requiredRole && user.role !== requiredRole) {
			return NextResponse.json(
				{ message: "Forbidden: Insufficient role" },
				{ status: 403 }
			);
		}
		// Attach user to request for downstream handlers (if needed)
		// req.user = user; // Not used in current handlers
		return handler(req, context);
	};
}
