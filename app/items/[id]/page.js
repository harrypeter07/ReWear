"use client";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import SwapRequestForm from "@/components/SwapRequestForm";
import { useState, useEffect } from "react";

async function fetchItem(id) {
	const res = await fetch(`/api/items/${id}`);
	if (!res.ok) return null;
	return await res.json();
}

function getImageSrc(image) {
	const defaultImage = "/images/default.jpg";
	if (!image || typeof image !== "string") return defaultImage;
	if (image.startsWith("/uploads/")) return image;
	if (image.startsWith("http://") || image.startsWith("https://")) return image;
	return defaultImage;
}

export default function ItemDetailPage() {
	const params = useParams();
	const id = params.id;
	const [item, setItem] = useState(null);
	const [showSwap, setShowSwap] = useState(false);
	const [showRedeem, setShowRedeem] = useState(false);
	const [previousListings, setPreviousListings] = useState([]);

	useEffect(() => {
		async function load() {
			const data = await fetchItem(id);
			console.log("[ITEM DETAIL] Loaded item:", data);
			if (data && data.image) {
				console.log("[ITEM DETAIL] item.image:", data.image);
				console.log("[ITEM DETAIL] typeof item.image:", typeof data.image);
			}
			setItem(data);
			if (data && data.uploaderId) {
				const res = await fetch(`/api/items?uploaderId=${data.uploaderId}`);
				if (res.ok) {
					const apiData = await res.json();
					if (Array.isArray(apiData.items)) {
						setPreviousListings(apiData.items.filter((i) => i._id !== id));
					} else {
						console.log("[ITEM DETAIL] No items array in response", apiData);
						setPreviousListings([]);
					}
				} else {
					console.log("[ITEM DETAIL] Failed to fetch previous listings");
					setPreviousListings([]);
				}
			}
		}
		if (id) load();
	}, [id]);

	if (!item) {
		return <div className="p-8 text-center">Item not found.</div>;
	}

	const imageSrc = getImageSrc(item.image);

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="bg-white rounded shadow p-6 flex flex-col md:flex-row gap-8">
				{/* Image Section */}
				<div className="flex-1 flex flex-col items-center">
					<img
						src={imageSrc}
						alt={item.title}
						className="w-full max-w-xs h-72 object-cover rounded border shadow-md hover:shadow-xl transition mb-4 bg-gray-50"
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = "/images/default.jpg";
						}}
					/>
					{imageSrc === "/images/default.jpg" && (
						<div className="text-xs text-gray-500 mt-1">No image available</div>
					)}
				</div>
				{/* Description Section */}
				<div className="flex-1 flex flex-col justify-between">
					<div>
						<h1 className="text-2xl font-bold mb-2">{item.title}</h1>
						<div className="mb-2 text-gray-700 whitespace-pre-line">
							{item.description}
						</div>
						<div className="text-gray-700 mb-1">Category: {item.category}</div>
						<div className="text-gray-700 mb-1">Size: {item.size}</div>
						<div className="text-gray-700 mb-1">
							Condition: {item.condition}
						</div>
						<div className="text-gray-700 mb-1">
							Points Value: {item.pointsValue}
						</div>
						<div className="text-gray-700 mb-1">Status: {item.status}</div>
						<div className="text-gray-700 mb-1">
							Approved: {item.isApproved ? "Yes" : "No"}
						</div>
					</div>
					<div className="mt-4 flex gap-4">
						<button
							className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
							onClick={() => setShowRedeem((v) => !v)}
						>
							Available/Swap
						</button>
					</div>
					{showRedeem && <SwapRequestForm itemId={item._id} type="redeem" />}
				</div>
			</div>
			{/* Previous Listings Section */}
			<div className="mt-10">
				<h2 className="text-lg font-semibold mb-2">Previous Listings:</h2>
				<div className="flex gap-4 flex-wrap">
					{previousListings.length === 0 && (
						<div className="text-gray-500">No previous listings.</div>
					)}
					{previousListings.slice(0, 4).map((prev) => (
						<Link
							key={prev._id}
							href={`/items/${prev._id}`}
							className="block w-32 h-40 bg-gray-100 rounded shadow hover:shadow-lg transition overflow-hidden"
						>
							<img
								src={getImageSrc(prev.image)}
								alt={prev.title}
								className="w-full h-24 object-cover mb-2"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = "/images/default.jpg";
								}}
							/>
							<div className="px-2 text-sm font-medium truncate">
								{prev.title}
							</div>
						</Link>
					))}
				</div>
			</div>
			<div className="mt-6">
				<Link href="/items" className="text-blue-600 hover:underline">
					Back to Items
				</Link>
			</div>
		</div>
	);
}
