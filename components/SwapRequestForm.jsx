import { useState } from "react";

export default function SwapRequestForm({ itemId, type, onSuccess }) {
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);
		try {
			const res = await fetch("/api/swaps", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ itemId, type, message }),
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
			<textarea
				className="border p-2 rounded"
				placeholder="Message (optional)"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
			/>
			<button
				type="submit"
				className="bg-blue-600 text-white p-2 rounded"
				disabled={loading}
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
