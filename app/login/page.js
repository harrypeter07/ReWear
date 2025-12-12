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
		<div className="min-h-screen flex items-center justify-center p-4 pt-24" style={{ background: 'var(--bg-primary)' }}>
			<div className="container max-w-md w-full">
				<div className="card" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)',
					boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15)'
				}}>
					{/* Header */}
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
							Welcome to ReWear
						</h1>
						<p className="text-base font-medium" style={{ color: 'var(--text-secondary)' }}>
							Sign in to your account
						</p>
					</div>

					{/* Error Message */}
					{error && (
						<div 
							className="p-4 mb-6 rounded-xl border-l-4 flex items-center gap-3"
							style={{ 
								background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.8) 0%, rgba(254, 226, 226, 0.8) 100%)',
								borderColor: '#ef4444',
								color: '#dc2626',
								backdropFilter: 'blur(10px)'
							}}
						>
							<svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
							</svg>
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
								className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
								style={{
									background: 'rgba(255, 255, 255, 0.8)',
									borderColor: 'var(--border-color)',
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
								className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
								style={{
									background: 'rgba(255, 255, 255, 0.8)',
									borderColor: 'var(--border-color)',
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
							className="btn w-full py-3.5 text-center font-semibold text-base disabled:opacity-70 disabled:cursor-not-allowed"
							style={{
								background: isLoading ? 'rgba(99, 102, 241, 0.5)' : 'var(--accent-gradient)',
								color: 'white',
								border: 'none',
								boxShadow: isLoading ? 'none' : '0 8px 24px rgba(99, 102, 241, 0.3)'
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
					<div className="grid grid-cols-2 gap-4">
						<button
							type="button"
							className="px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105"
							style={{
								background: 'rgba(255, 255, 255, 0.8)',
								color: 'var(--text-primary)',
								border: '1px solid var(--border-color)',
								boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
							}}
						>
							Google
						</button>
						<button
							type="button"
							className="px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105"
							style={{
								background: 'rgba(255, 255, 255, 0.8)',
								color: 'var(--text-primary)',
								border: '1px solid var(--border-color)',
								boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
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