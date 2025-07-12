"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ItemForm from "@/components/ItemForm";
import { createItem } from "@/utils/helpers";

export default function AddItemPage() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const router = useRouter();

	useEffect(() => {
		async function fetchUser() {
			try {
				const res = await fetch("/api/auth/me", { credentials: "include" });
				if (res.ok) {
					const data = await res.json();
					setUser(data.user);
				} else {
					setUser(null);
				}
			} catch {
				setUser(null);
			} finally {
				setLoading(false);
			}
		}
		fetchUser();
	}, []);

	const handleSubmit = async (data) => {
		setError("");
		setSuccess("");
		try {
			const payload = { ...data, uploaderId: user._id };
			await createItem(payload);
			setSuccess("Item submitted for review!");
			setTimeout(() => router.push("/dashboard"), 1500);
		} catch (err) {
			setError(err.message || "Failed to add item");
		}
	};

	if (loading) return <div className="p-8 text-center">Loading...</div>;
	if (!user)
		return (
			<div className="p-8 text-center">
				<p>You must be logged in to add an item.</p>
				<button
					className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
					onClick={() => router.push("/login")}
				>
					Go to Login
				</button>
			</div>
		);

	return (
		<main
			className="min-h-screen flex flex-col items-center justify-center p-4"
			style={{ background: "var(--background)" }}
		>
			<div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
				<h1 className="text-2xl font-bold mb-4 text-center">Add New Item</h1>
				{error && (
					<div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
						{error}
					</div>
				)}
				{success && (
					<div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
						{success}
					</div>
				)}
				<ItemForm onSubmit={handleSubmit} />
			</div>
		</main>
	);
}
