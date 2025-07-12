export default function AddItemPage() {
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
					Add a New Clothing Item
				</h1>
				<p className="mb-6" style={{ color: "var(--foreground)" }}>
					Share your pre-loved clothes with the community. Fill out the form
					below to list an item.
				</p>
				<div
					className="p-4 rounded"
					style={{
						background: "var(--surface-accent)",
						color: "var(--foreground)",
					}}
				>
					Add item form will appear here.
				</div>
			</div>
		</main>
	);
}
