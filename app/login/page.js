export default function LoginPage() {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen">
			<h1 className="text-2xl font-bold mb-4">Login</h1>
			{/* TODO: Add login form */}
			<form className="flex flex-col gap-2 w-64">
				<input
					type="email"
					placeholder="Email"
					className="border p-2 rounded"
				/>
				<input
					type="password"
					placeholder="Password"
					className="border p-2 rounded"
				/>
				<button type="submit" className="bg-blue-600 text-white p-2 rounded">
					Login
				</button>
			</form>
		</main>
	);
}
