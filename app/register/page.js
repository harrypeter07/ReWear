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
		<div className="min-h-screen flex items-center justify-center gradient-bg px-4 sm:px-6">
			<div className="card w-full max-w-md p-8 shadow-lg rounded-2xl">
				<h2 className="text-3xl font-bold mb-2 text-primary text-center">
					Create Account
				</h2>
				<p className="text-secondary mb-6 text-center">
					Join the ReWear community
				</p>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-primary font-semibold mb-1">
							Username
						</label>
						<input
							type="text"
							name="username"
							value={formData.username}
							onChange={handleChange}
							className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-primary bg-white"
							required
						/>
					</div>
					<div>
						<label className="block text-primary font-semibold mb-1">
							Email
						</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-primary bg-white"
							required
						/>
					</div>
					<div>
						<label className="block text-primary font-semibold mb-1">
							Password
						</label>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-primary bg-white"
							required
						/>
					</div>
					{/* Simplified: removed confirm password and checkbox */}
					{error && (
						<p className="text-red-600 text-sm" role="alert">{error}</p>
					)}
					<button type="submit" className="btn w-full mt-2" disabled={isLoading}>
						Register
					</button>
				</form>
				<p className="text-secondary text-sm mt-4 text-center">
					Already have an account?{" "}
					<Link href="/login" className="text-primary underline">
						Login
					</Link>
				</p>
			</div>
		</div>
	);
}
