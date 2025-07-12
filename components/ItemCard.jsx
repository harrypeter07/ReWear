'use client';
import Link from 'next/link';

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
			<p className="text-gray-600">{item.category}</p>
			<p className="text-sm mt-2">{item.description}</p>
			{/* TODO: Add swap/redeem button */}
		</div>
	);
}
