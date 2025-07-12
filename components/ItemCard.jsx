"use client";
import Link from "next/link";
import { STOCK_IMAGES } from "../utils/constants";

function getDeterministicFallbackImage(item) {
	// Use a simple hash of item._id or item.title to pick a fallback image
	const key = item._id || item.id || item.title || "0";
	let hash = 0;
	for (let i = 0; i < key.length; i++) {
		hash = (hash << 5) - hash + key.charCodeAt(i);
		hash |= 0; // Convert to 32bit integer
	}
	const idx = Math.abs(hash) % STOCK_IMAGES.length;
	return STOCK_IMAGES[idx];
}

export default function ItemCard({ item }) {
	const defaultImage = "/images/default.jpg";
	let imageSrc = defaultImage;
	if (item.image && typeof item.image === "string") {
		if (item.image.startsWith("/uploads/")) {
			imageSrc = item.image;
		} else if (
			item.image.startsWith("http://") ||
			item.image.startsWith("https://")
		) {
			imageSrc = item.image;
		}
	}
	// If imageSrc is still default or is /images/denim-jacket.jpg, use a deterministic fallback
	if (imageSrc === defaultImage || imageSrc === "/images/denim-jacket.jpg") {
		imageSrc = getDeterministicFallbackImage(item);
	}

	return (
		<div className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white flex flex-col h-full">
			<div className="w-full aspect-[4/5] mb-2 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden shadow-sm border border-gray-200">
				<img
					src={imageSrc}
					alt={item.title}
					className="w-full h-full object-cover rounded-lg"
					onError={(e) => {
						e.target.onerror = null;
						e.target.src = getDeterministicFallbackImage(item);
					}}
				/>
			</div>
			<h2 className="font-semibold text-lg mb-1 truncate">{item.title}</h2>
			<div className="text-gray-600 text-sm mb-1">
				Category: <span className="font-medium">{item.category}</span>
			</div>
			<div className="text-gray-600 text-sm mb-1">
				Size: <span className="font-medium">{item.size}</span>
			</div>
			<div className="text-gray-600 text-sm mb-1">
				Condition: <span className="font-medium">{item.condition}</span>
			</div>
			{item.pointsValue !== undefined && (
				<div className="text-gray-600 text-sm mb-1">
					Points: <span className="font-medium">{item.pointsValue}</span>
				</div>
			)}
			<div className="text-gray-700 text-sm mt-2 line-clamp-3">
				{item.description}
			</div>
			<div className="mt-auto pt-4 flex justify-end">
				<Link
					href={`/items/${item._id || item.id}`}
					className="text-blue-600 hover:underline text-sm font-medium"
				>
					View Details
				</Link>
			</div>
		</div>
	);
}
