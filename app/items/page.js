import ItemCard from "@/components/ItemCard";
import Link from "next/link";

async function getItems() {
	let baseUrl =
		process.env.NEXT_PUBLIC_BASE_URL ||
		(process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: "http://localhost:3000");
	const res = await fetch(`${baseUrl}/api/items`, { cache: "no-store" });
	if (!res.ok) return [];
	return await res.json();
}

export default async function ItemsPage() {
	const items = await getItems();

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Browse Items</h1>
				<div className="flex gap-4">
					<select className="border rounded px-3 py-2 text-sm">
						<option>All Categories</option>
						<option>Jackets</option>
						<option>Dresses</option>
						<option>Shoes</option>
					</select>
					<select className="border rounded px-3 py-2 text-sm">
						<option>Sort By</option>
						<option>Newest</option>
						<option>Points: Low to High</option>
					</select>
				</div>
			</div>

			{items.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{items.map((item) => (
						<ItemCard key={item._id || item.id} item={item} />
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<p className="text-gray-500">No items available yet</p>
					<Link
						href="/items/new"
						className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
					>
						List an Item
					</Link>
				</div>
			)}
		</div>
	);
}
