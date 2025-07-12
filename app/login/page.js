export default function LoginPage() {
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
					Sign in to ReWear
				</h1>
				<form className="flex flex-col gap-4">
					<input
						type="email"
						placeholder="Email address"
						className="border p-2 rounded focus:outline-none focus:ring-2"
						style={{
							borderColor: "var(--surface-accent-hover)",
							background: "var(--surface-accent)",
							color: "var(--foreground)",
						}}
					/>
					<input
						type="password"
						placeholder="Password"
						className="border p-2 rounded focus:outline-none focus:ring-2"
						style={{
							borderColor: "var(--surface-accent-hover)",
							background: "var(--surface-accent)",
							color: "var(--foreground)",
						}}
					/>
					<button
						type="submit"
						className="font-semibold p-2 rounded transition"
						style={{
							background: "var(--surface-accent)",
							color: "var(--foreground)",
						}}
					>
						Sign In
					</button>
				</form>
				<p
					className="mt-4 text-sm text-center"
					style={{ color: "var(--foreground)" }}
				>
					Don&apos;t have an account?{" "}
					<a
						href="/register"
						className="underline"
						style={{ color: "var(--foreground)" }}
					>
						Register
					</a>
				</p>
			</div>
		</main>
	);
}
