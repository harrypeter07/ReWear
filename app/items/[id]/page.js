export default function ItemDetailPage() {
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
					Item Details
				</h1>
				<p className="mb-6" style={{ color: "var(--foreground)" }}>
					See all the details and swap or redeem this item.
				</p>
				<div
					className="p-4 rounded"
					style={{
						background: "var(--surface-accent)",
						color: "var(--foreground)",
					}}
				>
					Item details and actions will appear here.
				</div>
			</div>
		</main>
	);
}
