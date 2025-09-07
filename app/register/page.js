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
		<div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
			<div className="container max-w-md">
				<div className="card">
					{/* Header */}
					<div className="text-center mb-8">
						<h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
							Create your account
						</h1>
						<p style={{ color: 'var(--text-secondary)' }}>
							Join ReWear to swap sustainably
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

					<form onSubmit={handleSubmit} className="space-y-6">
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
							<label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
								Email
							</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
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
							<label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
								Password
							</label>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
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

						<button type="submit" className="btn w-full py-3 font-medium" disabled={isLoading} style={{
							background: isLoading ? '#f0e6da' : 'var(--accent)',
							color: 'var(--text-primary)',
							border: 'none',
							borderRadius: 'var(--radius)',
							boxShadow: 'var(--shadow)',
							transition: 'var(--transition)',
							cursor: isLoading ? 'not-allowed' : 'pointer',
							opacity: isLoading ? 0.7 : 1
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
