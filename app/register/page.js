export default function RegisterPage() {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen">
			<h1 className="text-2xl font-bold mb-4">Register</h1>
			{/* TODO: Add registration form */}
			<form className="flex flex-col gap-2 w-64">
				<input type="text" placeholder="Name" className="border p-2 rounded" />
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
				<button type="submit" className="bg-green-600 text-white p-2 rounded">
					Register
				</button>
			</form>
		</main>
	);
}
