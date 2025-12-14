import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
	console.log("[AUTH/LOGOUT] POST request received");
	
	const cookieStore = await cookies();
	
	// Clear all auth cookies (including any admin tokens)
	cookieStore.delete("accessToken");
	cookieStore.delete("refreshToken");
	cookieStore.delete("token");
	cookieStore.delete("admin_code"); // Also clear admin code if exists
	
	console.log("[AUTH/LOGOUT] User logged out successfully");
	
	return NextResponse.json({ message: "Logged out" });
}
