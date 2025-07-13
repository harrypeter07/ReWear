import { useState, useEffect } from "react";

export default function SwapRequestForm({ itemId, type, onSuccess }) {
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [userItems, setUserItems] = useState([]);
	const [offeredItemId, setOfferedItemId] = useState("");
	const [user, setUser] = useState(null);

	useEffect(() => {
		async function fetchUserItems() {
			try {
				const userRes = await fetch("/api/auth/me", { credentials: "include" });
				if (!userRes.ok) return;
				const { user } = await userRes.json();
				setUser(user);
				const itemsRes = await fetch(`/api/items`);
				if (!itemsRes.ok) return;
				const items = await itemsRes.json();
				const filtered = items.filter(
					(i) =>
						(String(i.owner) === String(user._id) ||
							String(i.uploaderId) === String(user._id)) &&
						i.isApproved &&
						i.isVisible &&
						i.status === "available" &&
						i._id !== itemId
				);
				setUserItems(filtered);
				if (filtered.length > 0) setOfferedItemId(filtered[0]._id);
			} catch {}
		}
		if (type === "swap" || type === "redeem") fetchUserItems();
	}, [type, itemId]);

	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);
		try {
			const body = { itemId, type, message };
			if (user && user._id) body.requesterId = user._id;
			if (type === "swap") {
				if (!offeredItemId) {
					setError(
						"You must select one of your own approved listings to offer."
					);
					setLoading(false);
					return;
				}
				body.offeredItemId = offeredItemId;
			}
			const res = await fetch("/api/swaps", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (res.ok) {
				setSuccess("Request submitted!");
				setMessage("");
				if (onSuccess) onSuccess();
			} else {
				const data = await res.json();
				setError(data.error || "Failed to submit request");
			}
		} catch {
			setError("Failed to submit request");
		}
		setLoading(false);
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
			{error && (
				<div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
			)}
			{success && (
				<div className="bg-green-100 text-green-700 p-2 rounded">{success}</div>
			)}
			{type === "swap" && (
				<div>
					<label className="block mb-1 font-medium">
						Select one of your own approved listings to offer:
					</label>
					{userItems.length === 0 ? (
						<div className="text-sm text-gray-500">
							You have no approved, available listings to offer.
						</div>
					) : (
						<select
							className="border p-2 rounded w-full text-gray-900 bg-white"
							value={offeredItemId}
							onChange={(e) => setOfferedItemId(e.target.value)}
						>
							{userItems.map((item) => (
								<option
									key={item._id}
									value={item._id}
									className="text-gray-900 bg-white"
								>
									{item.title} ({item.pointsValue} points)
								</option>
							))}
						</select>
					)}
				</div>
			)}
			<textarea
				className="border p-2 rounded"
				placeholder="Message (optional)"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
			/>
			<button
				type="submit"
				className="bg-blue-600 text-white p-2 rounded"
				disabled={loading || (type === "swap" && userItems.length === 0)}
			>
				{loading
					? "Submitting..."
					: type === "redeem"
					? "Redeem via Points"
					: "Request Swap"}
			</button>
		</form>
	);
}
