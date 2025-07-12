"use client";
import Link from "next/link";

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

	return (
		<div className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white flex flex-col h-full">
			<div className="w-full h-40 mb-2 bg-gray-50 flex items-center justify-center rounded overflow-hidden">
				<img
					src={imageSrc}
					alt={item.title}
					className="max-w-full max-h-full object-contain"
					onError={(e) => {
						e.target.onerror = null;
						e.target.src = defaultImage;
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
