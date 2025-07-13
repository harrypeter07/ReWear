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
		confirmPassword: "",
	});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [agreeTerms, setAgreeTerms] = useState(false);
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
		if (!agreeTerms) {
			setError("You must agreeto the terms and conditions");
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

			if (response.ok) {
				const data = await response.json();
				setUser(data.user);
				router.push("/dashboard");
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
		<div className="min-h-screen flex items-center justify-center gradient-bg px-2">
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
							className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-primary bg-white"
							required
						/>
					</div>
					<button type="submit" className="btn w-full mt-2">
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
