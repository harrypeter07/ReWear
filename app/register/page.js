export default function RegisterPage() {
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
				<form className="flex flex-col gap-4">
					<input
						type="text"
						placeholder="Full Name"
						className="border p-2 rounded focus:outline-none focus:ring-2"
						style={{
							borderColor: "var(--surface-accent-hover)",
							background: "var(--surface-accent)",
							color: "var(--foreground)",
						}}
					/>
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
						Register
					</button>
				</form>
				<p
					className="mt-4 text-sm text-center"
					style={{ color: "var(--foreground)" }}
				>
					Already have an account?{" "}
					<a
						href="/login"
						className="underline"
						style={{ color: "var(--foreground)" }}
					>
						Sign in
					</a>
				</p>
			</div>
		</main>
	);
}
