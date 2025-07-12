'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function ItemCard({ item }) {
	// Determine image source: base64 or URL
	let imgSrc = "/images/default-item.jpg";
	if (item.image) {
		if (item.image.startsWith("data:image")) {
			imgSrc = item.image;
		} else {
			imgSrc = item.image;
		}
	}
	return (
		<div className="border rounded p-4 shadow hover:shadow-lg transition">
			<img
				src={item.image || "/images/default-item.jpg"}
				alt={item.title}
				className="w-full h-40 object-cover mb-2 rounded"
			/>
			<h2 className="font-semibold text-lg">{item.title}</h2>
			<p className="text-gray-600">{item.category}</p>
			<p className="text-sm mt-2">{item.description}</p>
			{/* TODO: Add swap/redeem button */}
		</div>
	);
}