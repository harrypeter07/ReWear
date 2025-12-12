"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserContext } from "../../contexts/UserContext";

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { setUser } = useContext(UserContext);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Client-side password checks for UX; server enforces too
		const hasMinLength = formData.password.length >= 8;
		const hasLetter = /[A-Za-z]/.test(formData.password);
		const hasNumber = /\d/.test(formData.password);
		console.log("[REGISTER UI] Password checks:", { hasMinLength, hasLetter, hasNumber });
		if (!hasMinLength || !hasLetter || !hasNumber) {
			setError("Password must be 8+ chars with a letter and number");
			return;
		}
		setIsLoading(true);
		setError("");

		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			console.log("[REGISTER UI] Response status:", response.status);

			if (response.ok) {
				const data = await response.json();
				console.log("[REGISTER UI] Success for:", { email: data.user?.email });
				setUser(data.user);
				router.push("/dashboard");
			} else {
				const data = await response.json();
				console.log("[REGISTER UI] Error:", data);
				setError(data.message || "Registration failed");
			}
		} catch (err) {
			console.log("[REGISTER UI] Network error:", err);
			setError("An error occurred during registration");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4 pt-28 pb-12" style={{ background: 'var(--bg-primary)' }}>
			<div className="w-full max-w-[420px] mx-auto">
				<div className="card p-8 sm:p-10" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.15)',
					boxShadow: '0 20px 60px rgba(99, 102, 241, 0.12)'
				}}>
					{/* Header */}
					<div className="text-center mb-8">
						<h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
							Create your account
						</h1>
						<p className="text-sm sm:text-base font-medium" style={{ color: 'var(--text-secondary)' }}>
							Join ReWear to swap sustainably
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

					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
								Username
							</label>
							<input
								type="text"
								name="username"
								value={formData.username}
								onChange={handleChange}
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
							<label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
								Email
							</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
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
							<label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
								Password
							</label>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								required
								className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
								style={{
									background: 'rgba(255, 255, 255, 0.8)',
									borderColor: 'var(--border-color)',
									color: 'var(--text-primary)'
								}}
							/>
						</div>

						<button type="submit" className="btn w-full py-3.5 font-semibold text-base disabled:opacity-70 disabled:cursor-not-allowed" disabled={isLoading} style={{
							background: isLoading ? 'rgba(99, 102, 241, 0.5)' : 'var(--accent-gradient)',
							color: 'white',
							border: 'none',
							boxShadow: isLoading ? 'none' : '0 8px 24px rgba(99, 102, 241, 0.3)'
						}}>
						{isLoading ? 'Creating account...' : 'Create account'}
						</button>
					</form>

					{/* Footer */}
					<div className="mt-8 text-center">
						<p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
							Already have an account?{" "}
							<Link href="/login" className="font-medium hover:opacity-70" style={{ color: 'var(--text-primary)', transition: 'var(--transition)' }}>
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
