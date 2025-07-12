import ItemCard from "@/components/ItemCard";
import Link from "next/link";

// Mock data - replace with real data fetching
const getItems = async () => {
	// In a real app, you would fetch from your API:
	// const res = await fetch('/api/items');
	// return await res.json();

	return [
		{
			id: 1,
			title: "Vintage Denim Jacket",
			category: "Jackets",
			description:
				"Light wash denim jacket from the 90s in excellent condition",
			size: "M",
			image:
				"https://www.alamodelabel.in/cdn/shop/files/AD15F82B-CAD5-4B7A-9B2E-814B092A3068_600x600_crop_center.jpg?v=1749207515",
			points: 150,
		},
		{
			id: 2,
			title: "Floral Summer Dress",
			category: "Dresses",
			description: "Lightweight cotton dress with floral pattern",
			size: "S",
			image:
				"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtKdDLXw5t-0a7qxJB8p7e16JPkeuU3N-CEg&s",
			points: 100,
		},
		{
			id: 3,
			title: "Classic White Sneakers",
			category: "Shoes",
			description: "Like-new condition, size 9",
			size: "9",
			image:
				"https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/24908578/2023/9/12/da8743b9-d2aa-4d7e-a4d4-c63d1ea9e9ad1694490216796ASIANBoysWhitePerforationsSneakers1.jpg",
		},
	];
};

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
						<ItemCard key={item.id} item={item} />
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
