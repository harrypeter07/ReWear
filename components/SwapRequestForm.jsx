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
		<form onSubmit={handleSubmit} className="card p-6" style={{
			background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
			backdropFilter: 'blur(20px)',
			border: '1px solid rgba(99, 102, 241, 0.1)'
		}}>
			{error && (
				<div className="p-4 mb-4 rounded-xl border-l-4 flex items-center gap-3" style={{
					background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.8) 0%, rgba(254, 226, 226, 0.8) 100%)',
					borderColor: '#ef4444',
					color: '#dc2626'
				}}>
					<svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
						<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
					</svg>
					<p className="text-sm font-medium">{error}</p>
				</div>
			)}
			{success && (
				<div className="p-4 mb-4 rounded-xl border-l-4 flex items-center gap-3" style={{
					background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.8) 0%, rgba(220, 252, 231, 0.8) 100%)',
					borderColor: '#10b981',
					color: '#059669'
				}}>
					<svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
						<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
					</svg>
					<p className="text-sm font-medium">{success}</p>
				</div>
			)}
			{type === "swap" && (
				<div>
					<label className="block font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
						Select one of your own approved listings to offer:
					</label>
					{userItems.length === 0 ? (
						<p className="text-sm mt-2 p-3 rounded-xl" style={{ 
							color: 'var(--text-secondary)',
							background: 'rgba(99, 102, 241, 0.05)'
						}}>
							You have no approved, available listings to offer.
						</p>
					) : (
						<select
							className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							value={offeredItemId}
							onChange={(e) => setOfferedItemId(e.target.value)}
							style={{
								background: 'rgba(255, 255, 255, 0.8)',
								borderColor: 'var(--border-color)',
								color: 'var(--text-primary)'
							}}
						>
							{userItems.map((item) => (
								<option
									key={item._id}
									value={item._id}
								>
									{item.title} ({item.pointsValue} points)
								</option>
							))}
						</select>
					)}
				</div>
			)}
			<textarea
				className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical min-h-[100px]"
				placeholder="Message (optional)"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				style={{
					background: 'rgba(255, 255, 255, 0.8)',
					borderColor: 'var(--border-color)',
					color: 'var(--text-primary)'
				}}
			/>
			<button
				type="submit"
				className="btn w-full py-3.5 font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
				style={{
					background: (loading || (type === "swap" && userItems.length === 0)) ? 'rgba(99, 102, 241, 0.5)' : 'var(--accent-gradient)',
					color: 'white',
					border: 'none',
					boxShadow: (loading || (type === "swap" && userItems.length === 0)) ? 'none' : '0 8px 24px rgba(99, 102, 241, 0.3)'
				}}
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
