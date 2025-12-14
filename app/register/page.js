"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserContext } from "../../contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { setUser, refetchUser } = useContext(UserContext);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const hasMinLength = formData.password.length >= 8;
		const hasLetter = /[A-Za-z]/.test(formData.password);
		const hasNumber = /\d/.test(formData.password);
		
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
				credentials: "include",
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				const data = await response.json();
				await refetchUser();
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
		<div className="min-h-screen flex items-center justify-center p-4 pt-40 pb-12 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
			<div className="w-full max-w-[480px] mx-auto">
				<Card className="shadow-2xl border-0 overflow-hidden" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
					backdropFilter: 'blur(20px)'
				}}>
					<CardHeader className="text-center pb-4">
						<CardTitle className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
							Create your account
						</CardTitle>
						<CardDescription className="text-base text-muted-foreground">
							Join ReWear to swap sustainably and reduce waste
						</CardDescription>
					</CardHeader>
					<CardContent className="px-8 pb-8">
						{error && (
							<Alert variant="destructive" className="mb-6 p-4 rounded-lg border-2">
								<AlertCircle className="h-5 w-5" />
								<AlertDescription className="font-medium">{error}</AlertDescription>
							</Alert>
						)}

						<form onSubmit={handleSubmit} className="space-y-6 px-4">
							<div className="space-y-2">
								<Label htmlFor="username" className="text-base font-semibold text-foreground">
									Username
								</Label>
								<Input
									id="username"
									type="text"
									name="username"
									placeholder="Choose a username"
									value={formData.username}
									onChange={handleChange}
									required
									className="h-12 text-base !px-6"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email" className="text-base font-semibold text-foreground">
									Email Address
								</Label>
								<Input
									id="email"
									type="email"
									name="email"
									placeholder="Enter your email"
									value={formData.email}
									onChange={handleChange}
									required
									className="h-12 text-base !px-6"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="password" className="text-base font-semibold text-foreground">
									Password
								</Label>
								<Input
									id="password"
									type="password"
									name="password"
									placeholder="8+ characters with letter and number"
									value={formData.password}
									onChange={handleChange}
									required
									className="h-12 text-base !px-6"
								/>
								<p className="text-xs text-muted-foreground mt-1">
									Password must be at least 8 characters and include both letters and numbers
								</p>
							</div>

							<Button
								type="submit"
								disabled={isLoading}
								className="w-full h-12 text-base font-semibold mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
							>
								{isLoading ? "Creating account..." : "Create account"}
							</Button>
						</form>

						<div className="mt-8 text-center pt-6 border-t border-border">
							<p className="text-sm text-muted-foreground">
								Already have an account?{" "}
								<Link
									href="/login"
									className="font-semibold text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
								>
									Sign in
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
