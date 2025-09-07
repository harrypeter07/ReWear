import { NextResponse } from 'next/server';

export async function POST(req) {
    const { code } = await req.json();
    const required = process.env.ADMIN_ACCESS_CODE;
    if (!required) return NextResponse.json({ ok: true });
    if (code !== required) return NextResponse.json({ ok: false, message: 'Invalid code' }, { status: 401 });
    const res = NextResponse.json({ ok: true });
    res.cookies.set('admin_code', code, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 8,
    });
    return res;
}


