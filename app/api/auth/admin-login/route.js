import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
    const { code, password } = await req.json();
    const envCode = process.env.ADMIN_ACCESS_CODE || "";
    const envPass = process.env.ADMIN_PASSWORD || "";

    if (!envCode && !envPass) {
        return NextResponse.json({ message: "Admin auth not configured" }, { status: 400 });
    }
    if ((envCode && code === envCode) || (envPass && password === envPass)) {
        const adminPayload = { _id: "admin", role: "admin", email: "admin@local" };
        const accessToken = jwt.sign(adminPayload, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign(adminPayload, process.env.JWT_SECRET, { expiresIn: "7d" });
        const cookieStore = await cookies();
        cookieStore.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 15,
            path: "/",
        });
        cookieStore.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });
        return NextResponse.json({ message: "Admin logged in" }, { status: 200 });
    }
    return NextResponse.json({ message: "Invalid admin credentials" }, { status: 401 });
}


