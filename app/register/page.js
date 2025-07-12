"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [agreeTerms, setAgreeTerms] = useState(false);
	const router = useRouter();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!agreeTerms) {
			setError("You must agreeto the terms and conditions");
			return;
		}
		setIsLoading(true);
		setError("");

		try {
			// Registration API call
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				// Auto-login after registration
				const loginRes = await fetch("/api/auth/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email: formData.email,
						password: formData.password,
					}),
				});
				if (loginRes.ok) {
					router.push("/dashboard");
				} else {
					const loginData = await loginRes.json();
					setError(
						loginData.message ||
							"Registration succeeded but login failed. Please log in manually."
					);
				}
			} else {
				const data = await response.json();
				setError(data.message || "Registration failed");
			}
		} catch (err) {
			setError("An error occurred during registration");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-800">
						Create your ReWear account
					</h1>
					<p className="mt-2 text-gray-600">
						Join our sustainable fashion community
					</p>
				</div>

				{error && (
					<div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
						<p>{error}</p>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="username"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Username
						</label>
						<input
							id="username"
							name="username"
							type="text"
							placeholder="Your username"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-500"
							value={formData.username}
							onChange={handleChange}
							required
						/>
					</div>

					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Email Address
						</label>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="you@example.com"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-500"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							placeholder="••••••••"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-500"
							value={formData.password}
							onChange={handleChange}
							required
						/>
					</div>

					<div>
						<label
							htmlFor="confirmPassword"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Confirm Password
						</label>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							placeholder="••••••••"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-500"
							value={formData.confirmPassword}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="flex items-start">
						<div className="flex items-center h-5">
							<input
								id="terms"
								name="terms"
								type="checkbox"
								className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								checked={agreeTerms}
								onChange={(e) => setAgreeTerms(e.target.checked)}
								required
							/>
						</div>
						<div className="ml-3 text-sm">
							<label htmlFor="terms" className="font-medium text-gray-700">
								I agree to the{" "}
								<Link
									href="/terms"
									className="text-blue-600 hover:text-blue-500"
								>
									Terms and Conditions
								</Link>
							</label>
						</div>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className={`w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${
							isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
						}`}
					>
						{isLoading ? (
							<span className="flex items-center justify-center">
								<svg
									className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Registering...
							</span>
						) : (
							"Register"
						)}
					</button>
				</form>

				<div className="mt-6 text-center text-sm text-gray-600">
					Already have an account?{" "}
					<Link
						href="/login"
						className="font-medium text-blue-600 hover:text-blue-500"
					>
						Login here
					</Link>
				</div>
			</div>
		</div>
	);
}
