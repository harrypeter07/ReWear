export default function ItemsPage() {
	return (
		<main
			className="min-h-screen p-8 flex flex-col items-center"
			style={{ background: "var(--background)" }}
		>
			<div
				className="rounded-lg shadow p-8 w-full max-w-3xl"
				style={{ background: "var(--surface)" }}
			>
				<h1
					className="text-2xl font-bold mb-4"
					style={{ color: "var(--foreground)" }}
				>
					Browse Clothing Items
				</h1>
				<p className="mb-6" style={{ color: "var(--foreground)" }}>
					Find something you love! Filter, search, and swap or redeem items from
					the community.
				</p>
				<div
					className="p-4 rounded"
					style={{
						background: "var(--surface-accent)",
						color: "var(--foreground)",
					}}
				>
					Item list and filters will appear here.
				</div>
			</div>
		</main>
	);
}
