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
		setError("");

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		try {
			// TODO: Replace with actual API call
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: formData.username,
					email: formData.email,
					password: formData.password,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				router.push("/dashboard");
			} else {
				setError(data.message || "Registration failed");
			}
		} catch (err) {
			setError("An error occurred during registration");
		}
	};

	return (
		<main
			className="flex flex-col items-center justify-center min-h-screen"
			style={{ background: "var(--background)" }}
		>
			<div
				className="rounded-lg shadow p-8 w-full max-w-sm"
				style={{ background: "var(--surface)" }}
			>
				<h1
					className="text-2xl font-bold mb-4"
					style={{ color: "var(--foreground)" }}
				>
					Create your ReWear account
				</h1>
				{error && (
					<div
						className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
						role="alert"
					>
						<span className="block sm:inline">{error}</span>
					</div>
				)}
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<input
						type="text"
						name="username"
						placeholder="Username"
						required
						className="border p-2 rounded focus:outline-none focus:ring-2"
						style={{
							borderColor: "var(--surface-accent-hover)",
							background: "var(--surface-accent)",
							color: "var(--foreground)",
						}}
						value={formData.username}
						onChange={handleChange}
					/>
					<input
						type="email"
						name="email"
						placeholder="Email address"
						required
						className="border p-2 rounded focus:outline-none focus:ring-2"
						style={{
							borderColor: "var(--surface-accent-hover)",
							background: "var(--surface-accent)",
							color: "var(--foreground)",
						}}
						value={formData.email}
						onChange={handleChange}
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						required
						className="border p-2 rounded focus:outline-none focus:ring-2"
						style={{
							borderColor: "var(--surface-accent-hover)",
							background: "var(--surface-accent)",
							color: "var(--foreground)",
						}}
						value={formData.password}
						onChange={handleChange}
					/>
					<input
						type="password"
						name="confirmPassword"
						placeholder="Confirm Password"
						required
						className="border p-2 rounded focus:outline-none focus:ring-2"
						style={{
							borderColor: "var(--surface-accent-hover)",
							background: "var(--surface-accent)",
							color: "var(--foreground)",
						}}
						value={formData.confirmPassword}
						onChange={handleChange}
					/>
					<div className="flex items-center">
						<input
							id="terms"
							name="terms"
							type="checkbox"
							required
							className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
						/>
						<label
							htmlFor="terms"
							className="ml-2 block text-sm"
							style={{ color: "var(--foreground)" }}
						>
							I agree to the{" "}
							<Link
								href="/terms"
								className="text-green-600 hover:text-green-500"
							>
								Terms and Conditions
							</Link>
						</label>
					</div>
					<button
						type="submit"
						className="font-semibold p-2 rounded transition"
						style={{
							background: "var(--surface-accent)",
							color: "var(--foreground)",
						}}
					>
						Register
					</button>
				</form>
				<div className="mt-6">
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span
								className="px-2"
								style={{
									background: "var(--surface)",
									color: "var(--foreground)",
								}}
							>
								Or sign up with
							</span>
						</div>
					</div>
					<div className="mt-6 grid grid-cols-2 gap-3">
						<div>
							<button
								type="button"
								className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
							>
								Google
							</button>
						</div>
						<div>
							<button
								type="button"
								className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
							>
								Facebook
							</button>
						</div>
					</div>
				</div>
				<p
					className="mt-4 text-sm text-center"
					style={{ color: "var(--foreground)" }}
				>
					Already have an account?{" "}
					<Link
						href="/login"
						className="underline font-medium text-green-600 hover:text-green-500"
					>
						Login here
					</Link>
				</p>
			</div>
		</main>
	);
}
