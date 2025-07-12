"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Replace with your actual authentication API call
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
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
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#333333]">Welcome to ReWear</h1>
          <p className="mt-2 text-[#666666]">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#333333] mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-[#dddddd] rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-[#4a90e2] transition bg-white text-[#333333]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-[#333333]">
                Password
              </label>
              <Link href="/forgot-password" className="text-sm text-[#4a90e2] hover:text-[#357abd]">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-[#dddddd] rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-[#4a90e2] transition bg-white text-[#333333]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-[#4a90e2] focus:ring-[#4a90e2] border-[#dddddd] rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-[#333333]">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a90e2] transition ${
              isLoading ? "bg-[#7aa7e1]" : "bg-[#4a90e2] hover:bg-[#357abd]"
            }`}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#dddddd]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#666666]">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-[#dddddd] rounded-lg shadow-sm bg-white text-sm font-medium text-[#333333] hover:bg-[#f5f5f5]"
            >
              Google
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-[#dddddd] rounded-lg shadow-sm bg-white text-sm font-medium text-[#333333] hover:bg-[#f5f5f5]"
            >
              Facebook
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-[#666666]">
          Don't have an account?{" "}
          <Link href="/register" className="font-medium text-[#4a90e2] hover:text-[#357abd]">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}