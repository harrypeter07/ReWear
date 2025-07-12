import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
	cookies().set("token", "", { maxAge: -1, path: "/" });
	return NextResponse.json({ message: "Logged out" });
}
