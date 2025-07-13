"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserContext } from "../../contexts/UserContext";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { setUser } = useContext(UserContext);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			if (response.ok) {
				const data = await response.json();
				setUser(data.user);
				router.push("/dashboard");
			} else {
				const data = await response.json();
				setError(data.message || "Login failed. Please try again.");
			}
		} catch (err) {
			setError("An error occurred during login");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
			<div className="container max-w-md">
				<div className="card">
					{/* Header */}
					<div className="text-center mb-8">
						<h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
							Welcome to ReWear
						</h1>
						<p style={{ color: 'var(--text-secondary)' }}>
							Sign in to your account
						</p>
					</div>

					{/* Error Message */}
					{error && (
						<div 
							className="p-4 mb-6 rounded-lg border-l-4"
							style={{ 
								background: '#fef2f2',
								borderColor: '#fca5a5',
								color: '#dc2626'
							}}
						>
							<p className="text-sm font-medium">{error}</p>
						</div>
					)}

					{/* Login Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label 
								htmlFor="email" 
								className="block text-sm font-medium mb-2"
								style={{ color: 'var(--text-primary)' }}
							>
								Email Address
							</label>
							<input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								style={{
									background: '#fffdf9',
									border: '1px solid var(--border-color)',
									borderRadius: 'var(--radius)',
									padding: '0.75rem 1rem',
									width: '100%',
									transition: 'var(--transition)',
									color: 'var(--text-primary)'
								}}
							/>
						</div>

						<div>
							<div className="flex justify-between items-center mb-2">
								<label 
									htmlFor="password" 
									className="block text-sm font-medium"
									style={{ color: 'var(--text-primary)' }}
								>
									Password
								</label>
								<Link
									href="/forgot-password"
									className="text-sm font-medium hover:opacity-70"
									style={{ 
										color: 'var(--text-secondary)',
										transition: 'var(--transition)'
									}}
								>
									Forgot password?
								</Link>
							</div>
							<input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								style={{
									background: '#fffdf9',
									border: '1px solid var(--border-color)',
									borderRadius: 'var(--radius)',
									padding: '0.75rem 1rem',
									width: '100%',
									transition: 'var(--transition)',
									color: 'var(--text-primary)'
								}}
							/>
						</div>

						<div className="flex items-center">
							<input
								id="remember-me"
								name="remember-me"
								type="checkbox"
								className="w-4 h-4 rounded"
								style={{
									accentColor: 'var(--accent)',
									border: '1px solid var(--border-color)'
								}}
							/>
							<label
								htmlFor="remember-me"
								className="ml-3 text-sm font-medium"
								style={{ color: 'var(--text-secondary)' }}
							>
								Remember me
							</label>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="btn w-full py-3 text-center font-medium"
							style={{
								background: isLoading ? '#f0e6da' : 'var(--accent)',
								color: 'var(--text-primary)',
								border: 'none',
								borderRadius: 'var(--radius)',
								boxShadow: 'var(--shadow)',
								transition: 'var(--transition)',
								cursor: isLoading ? 'not-allowed' : 'pointer',
								opacity: isLoading ? 0.7 : 1
							}}
						>
							{isLoading ? "Signing in..." : "Sign in"}
						</button>
					</form>

					{/* Divider */}
					<div className="relative my-8">
						<div className="absolute inset-0 flex items-center">
							<div 
								className="w-full border-t"
								style={{ borderColor: 'var(--border-color)' }}
							></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span 
								className="px-4 text-sm"
								style={{ 
									background: 'var(--bg-primary)',
									color: 'var(--text-secondary)'
								}}
							>
								Or continue with
							</span>
						</div>
					</div>

					{/* Social Login Buttons */}
					<div className="bento-grid grid-cols-2 gap-4">
						<button
							type="button"
							className="btn text-center py-3 font-medium"
							style={{
								background: 'var(--bg-secondary)',
								color: 'var(--text-primary)',
								border: '1px solid var(--border-color)',
								borderRadius: 'var(--radius)',
								boxShadow: 'var(--shadow)',
								transition: 'var(--transition)'
							}}
						>
							Google
						</button>
						<button
							type="button"
							className="btn text-center py-3 font-medium"
							style={{
								background: 'var(--bg-secondary)',
								color: 'var(--text-primary)',
								border: '1px solid var(--border-color)',
								borderRadius: 'var(--radius)',
								boxShadow: 'var(--shadow)',
								transition: 'var(--transition)'
							}}
						>
							Facebook
						</button>
					</div>

					{/* Sign Up Link */}
					<div className="mt-8 text-center">
						<p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
							Don&apos;t have an account?{" "}
							<Link
								href="/register"
								className="font-medium hover:opacity-70"
								style={{ 
									color: 'var(--text-primary)',
									transition: 'var(--transition)'
								}}
							>
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}