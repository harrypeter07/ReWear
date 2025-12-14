"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function AdminCodePage() {
	const [adminCode, setAdminCode] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const res = await fetch('/api/auth/admin-code', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ code: adminCode }),
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				setError(data.message || 'Invalid admin code');
				return;
			}

			// Also call admin-login to set tokens
			try {
				await fetch('/api/auth/admin-login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({ code: adminCode }),
				});
			} catch (_) {}

			// Redirect to admin panel
			router.push('/admin');
		} catch (err) {
			setError('Something went wrong. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4 pt-40 pb-12 bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="w-full max-w-[420px] mx-auto">
				<Card className="shadow-xl">
					<CardHeader className="text-center">
						<CardTitle className="text-3xl sm:text-4xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
							Admin Access
						</CardTitle>
						<CardDescription className="text-base">
							Enter admin code to continue
						</CardDescription>
					</CardHeader>
					<CardContent>
						{error && (
							<Alert variant="destructive" className="mb-6">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<form onSubmit={handleSubmit} className="space-y-5">
							<div className="space-y-2">
								<Label htmlFor="adminCode">Admin Code</Label>
								<Input
									id="adminCode"
									type="password"
									placeholder="Enter admin code"
									value={adminCode}
									onChange={(e) => setAdminCode(e.target.value)}
									required
								/>
							</div>

							<Button
								type="submit"
								disabled={isLoading}
								className="w-full"
							>
								{isLoading ? "Verifying..." : "Access Admin Panel"}
							</Button>
						</form>

						<div className="mt-8 text-center">
							<Link
								href="/"
								className="text-sm font-medium text-muted-foreground hover:text-primary"
							>
								← Back to Home
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
