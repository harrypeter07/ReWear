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
					router.push("/login");
				}
			} catch {
				setUser(null);
				router.push("/login");
			} finally {
				setLoading(false);
			}
		}
		fetchUser();
	}, [router]);

	const handleSubmit = async (data) => {
		setError("");
		setSuccess("");
		console.log("Current user:", user);
		if (
			!user ||
			!user._id ||
			typeof user._id !== "string" ||
			user._id.length !== 24
		) {
			setError(
				"User ID is missing or invalid. Please log out and log in again."
			);
			return;
		}
		try {
			const payload = { ...data, uploaderId: user._id };
			console.log("Submitting item payload:", payload);
			await createItem(payload);
			setSuccess("Item submitted for review!");
			setTimeout(() => router.push("/dashboard"), 1500);
		} catch (err) {
			console.log("Item creation error:", err);
			setError(err.message || "Failed to add item");
		}
	};

	if (loading) return <div className="p-8 text-center">Loading...</div>;

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
