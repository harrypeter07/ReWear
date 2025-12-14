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

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { setUser, refetchUser } = useContext(UserContext);

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
				credentials: "include",
				body: JSON.stringify({ email, password }),
			});

			if (response.ok) {
				await refetchUser();
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
		<div className="min-h-screen flex items-center justify-center p-4 pt-40 pb-12 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
			<div className="w-full max-w-[480px] mx-auto">
				<Card className="shadow-2xl border-0 overflow-hidden" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
					backdropFilter: 'blur(20px)'
				}}>
					<CardHeader className="text-center pb-4">
						<CardTitle className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
							Welcome to ReWear
						</CardTitle>
						<CardDescription className="text-base text-muted-foreground">
							Sign in to your account to continue
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
								<Label htmlFor="email" className="text-base font-semibold text-foreground">
									Email Address
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="h-12 text-base !px-6"
								/>
							</div>

							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<Label htmlFor="password" className="text-base font-semibold text-foreground">
										Password
									</Label>
									<Link
										href="/forgot-password"
										className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
									>
										Forgot password?
									</Link>
								</div>
								<Input
									id="password"
									type="password"
									placeholder="Enter your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="h-12 text-base !px-6"
								/>
							</div>

							<div className="flex items-center space-x-3 py-1">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="h-5 w-5 rounded border-gray-300 cursor-pointer accent-indigo-600"
								/>
								<Label htmlFor="remember-me" className="text-sm font-medium cursor-pointer text-foreground">
									Remember me
								</Label>
							</div>

							<Button
								type="submit"
								disabled={isLoading}
								className="w-full h-12 text-base font-semibold mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
							>
								{isLoading ? "Signing in..." : "Sign in"}
							</Button>
						</form>

						<div className="relative my-8">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-border"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-4 bg-card text-muted-foreground font-medium">
									Or continue with
								</span>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<Button 
								variant="outline" 
								type="button"
								className="h-12 font-medium border-2 hover:bg-accent hover:border-primary transition-all"
							>
								<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
									<path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
									<path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
									<path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
									<path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
								</svg>
								Google
							</Button>
							<Button 
								variant="outline" 
								type="button"
								className="h-12 font-medium border-2 hover:bg-accent hover:border-primary transition-all"
							>
								<svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
									<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
								</svg>
								Facebook
							</Button>
						</div>

						<div className="mt-8 text-center pt-6 border-t border-border">
							<p className="text-sm text-muted-foreground">
								Don&apos;t have an account?{" "}
								<Link
									href="/register"
									className="font-semibold text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
								>
									Sign up
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
