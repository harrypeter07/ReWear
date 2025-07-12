"use client";
import Link from "next/link";

export default function ItemCard({ item }) {
	return (
		<div className="border rounded p-4 shadow hover:shadow-lg transition">
			<div className="w-full h-40 mb-2 bg-white flex items-center justify-center rounded overflow-hidden">
				<img
					src={item.image || "/images/default.png"}
					alt={item.title}
					className="max-w-full max-h-full object-contain"
				/>
			</div>

			<h2 className="font-semibold text-lg">{item.title}</h2>
			<p className="text-gray-600">Category: {item.category}</p>
			<p className="text-gray-600">Size: {item.size}</p>
			<p className="text-gray-600">Condition: {item.condition}</p>
			{item.points !== undefined && (
				<p className="text-gray-600">Points: {item.points}</p>
			)}
			<p className="text-sm mt-2">{item.description}</p>
			{/* TODO: Add swap/redeem button */}
		</div>
	);
}
