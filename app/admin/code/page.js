"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminCodePage() {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            console.log('[ADMIN CODE] Submitting code');
            const res = await fetch('/api/auth/admin-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });
            if (!res.ok) {
                const data = await res.json();
                console.log('[ADMIN CODE] Verify failed:', data);
                setError(data.message || 'Invalid code');
            } else {
                console.log('[ADMIN CODE] Verify ok, attempting admin login via code');
                // Also try to establish admin JWT using the same code (if configured)
                try {
                    const loginRes = await fetch('/api/auth/admin-login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code }),
                    });
                    const loginData = await loginRes.json().catch(() => ({}));
                    console.log('[ADMIN LOGIN] Result:', loginRes.status, loginData);
                    if (!loginRes.ok) {
                        // Not fatal for panel entry (middleware already passed), but surface message
                        console.warn('[ADMIN LOGIN] Admin JWT not issued; admin APIs may return 403');
                    }
                } catch (e) {
                    console.warn('[ADMIN LOGIN] Request error', e);
                }
                router.push('/admin');
            }
        } catch (err) {
            console.error('[ADMIN CODE] Network error', err);
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
            <div className="container max-w-md">
                <div className="card">
                    <h1 className="text-2xl font-semibold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>Enter Admin Access Code</h1>
                    {error && <div className="p-3 mb-4" style={{ background: '#fef2f2', color: '#dc2626' }}>{error}</div>}
                    <form onSubmit={submit} className="space-y-4">
                        <input
                            type="password"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Access Code"
                            className="w-full px-4 py-3"
                            style={{ background: '#fffdf9', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', color: 'var(--text-primary)' }}
                            required
                        />
                        <button className="btn w-full py-3" disabled={loading} style={{ background: 'var(--accent)' }}>
                            {loading ? 'Verifying...' : 'Continue'}
                        </button>
                    </form>
                    <p className="mt-3 text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
                        Tip: If admin APIs still show 403 after this, re-enter the code or ask for admin password.
                    </p>
                </div>
            </div>
        </div>
    );
}


