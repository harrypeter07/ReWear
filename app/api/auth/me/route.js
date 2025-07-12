import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req) {
	console.log("[AUTH/ME] Route hit");
	const user = getUserFromRequest(req);
	console.log("[AUTH/ME] User from token:", user);
	if (!user) {
		console.log("[AUTH/ME] Unauthorized - no valid token");
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}
	return NextResponse.json({ user });
}
