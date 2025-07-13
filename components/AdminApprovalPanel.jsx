import { useEffect, useState } from "react";

export default function AdminApprovalPanel() {
	const [pendingItems, setPendingItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		async function fetchPending() {
			setLoading(true);
			setError("");
			try {
				const res = await fetch("/api/items?pending=true");
				const items = res.ok ? await res.json() : [];
				setPendingItems(
					Array.isArray(items) ? items.filter((i) => !i.isApproved) : []
				);
			} catch (err) {
				setError("Failed to fetch pending items");
			}
			setLoading(false);
		}
		fetchPending();
	}, []);

	async function handleApprove(itemId) {
		setError("");
		try {
			const res = await fetch("/api/admin/approve-item", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ itemId }),
			});
			if (res.ok) {
				setPendingItems((items) => items.filter((i) => i._id !== itemId));
			} else {
				setError("Failed to approve item");
			}
		} catch {
			setError("Failed to approve item");
		}
	}

	// For demo, no reject logic yet

	if (loading) return <div>Loading pending items...</div>;
	if (error) return <div className="text-red-600">{error}</div>;

	return (
		<div className="card p-6 mb-6">
			<h2 className="text-xl font-bold text-primary mb-4">
				Pending Items for Approval
			</h2>
			{pendingItems.length === 0 ? (
				<div>No pending items.</div>
			) : (
				<ul className="space-y-4">
					{pendingItems.map((item) => (
						<li
							key={item._id}
							className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between"
						>
							<div>
								<div className="font-semibold">{item.title}</div>
								<div className="text-secondary text-sm">{item.category}</div>
								<div className="text-secondary text-sm">{item.description}</div>
							</div>
							<div className="mt-2 md:mt-0 flex gap-2">
								<button className="btn" onClick={() => handleApprove(item._id)}>
									Approve
								</button>
								<button
									className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
									disabled
								>
									Reject
								</button>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
