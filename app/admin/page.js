export default function AdminPage() {
	return (
		<main
			className="min-h-screen p-8 flex flex-col items-center"
			style={{ background: "var(--background)" }}
		>
			<div
				className="rounded-lg shadow p-8 w-full max-w-2xl"
				style={{ background: "var(--surface)" }}
			>
				<h1
					className="text-2xl font-bold mb-4"
					style={{ color: "var(--foreground)" }}
				>
					Admin Panel
				</h1>
				<p className="mb-6" style={{ color: "var(--foreground)" }}>
					Approve or reject new items, manage users, and oversee the community
					exchange.
				</p>
				<div
					className="p-4 rounded"
					style={{
						background: "var(--surface-accent)",
						color: "var(--foreground)",
					}}
				>
					Admin controls will appear here.
				</div>
			</div>
		</main>
	);
}
