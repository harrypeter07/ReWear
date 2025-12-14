import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/contexts/UserContext";

export default function SwapRequestForm({ itemId, type, onSuccess }) {
	const { user: contextUser, refetchUser } = useContext(UserContext);
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [user, setUser] = useState(null);
	const [item, setItem] = useState(null);

	useEffect(() => {
		// Use context user if available, otherwise fetch
		if (contextUser) {
			setUser(contextUser);
		} else {
			async function fetchUser() {
				try {
					const userRes = await fetch("/api/auth/me", { credentials: "include" });
					if (!userRes.ok) return;
					const { user } = await userRes.json();
					setUser(user);
				} catch {}
			}
			fetchUser();
		}
		
		// Fetch item details to show points value
		async function fetchItem() {
			try {
				const itemRes = await fetch(`/api/items/${itemId}`);
				if (itemRes.ok) {
					const itemData = await itemRes.json();
					setItem(itemData);
				}
			} catch {}
		}
		fetchItem();
	}, [itemId, contextUser]);

	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);
		try {
			if (!user || !user._id) {
				setError("You must be logged in to redeem items");
				setLoading(false);
				return;
			}

			if (!item) {
				setError("Item information not available");
				setLoading(false);
				return;
			}

			// Check if user has enough points
			if (user.points < item.pointsValue) {
				setError(`Not enough points. You have ${user.points} points, but this item costs ${item.pointsValue} points.`);
				setLoading(false);
				return;
			}

			const body = { 
				itemId, 
				requesterId: user._id,
				message 
			};
			
			const res = await fetch("/api/swaps", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(body),
			});
			
			if (res.ok) {
				const data = await res.json();
				if (data.autoApproved) {
					setSuccess("Item redeemed successfully! Points have been deducted and the order is complete.");
					// Refresh user data to update points
					await refetchUser();
					if (onSuccess) onSuccess();
					// Optionally redirect to orders page after a delay
					setTimeout(() => {
						if (window.confirm("Order completed! Would you like to view your orders?")) {
							window.location.href = "/orders";
						}
					}, 2000);
				} else {
					setSuccess("Redeem request submitted! The seller will review your request.");
				}
				setMessage("");
			} else {
				const data = await res.json();
				setError(data.error || "Failed to submit redeem request");
			}
		} catch (err) {
			setError("Failed to submit request. Please try again.");
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
			{item && user && (
				<div className="mb-4 p-4 rounded-xl" style={{ 
					background: 'rgba(99, 102, 241, 0.05)',
					border: '1px solid rgba(99, 102, 241, 0.2)'
				}}>
					<div className="flex justify-between items-center mb-2">
						<span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Item Cost:</span>
						<span className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{item.pointsValue} points</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Your Points:</span>
						<span className="text-lg font-semibold" style={{ 
							color: user.points >= item.pointsValue ? '#10b981' : '#ef4444' 
						}}>
							{user.points} points
						</span>
					</div>
					{user.points < item.pointsValue && (
						<p className="text-sm mt-2" style={{ color: '#ef4444' }}>
							You need {item.pointsValue - user.points} more points to redeem this item.
						</p>
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
					background: (loading || !user || !item || user.points < item.pointsValue) ? 'rgba(99, 102, 241, 0.5)' : 'var(--accent-gradient)',
					color: 'white',
					border: 'none',
					boxShadow: (loading || !user || !item || user.points < item.pointsValue) ? 'none' : '0 8px 24px rgba(99, 102, 241, 0.3)'
				}}
				disabled={loading || !user || !item || user.points < item.pointsValue}
			>
				{loading ? "Submitting..." : "Redeem with Points"}
			</button>
		</form>
	);
}
