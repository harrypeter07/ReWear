import Image from "next/image";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-8 gap-12">
			<section className="text-center max-w-2xl">
				<h1 className="text-4xl font-bold mb-4">
					ReWear – Community Clothing Exchange
				</h1>
				<p className="text-lg mb-6">
					Swap, redeem, and share clothing in your community. Promote
					sustainable fashion and reduce textile waste with ReWear!
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<a
						href="/register"
						className="bg-green-600 text-white px-6 py-3 rounded font-semibold hover:bg-green-700 transition"
					>
						Get Started
					</a>
					<a
						href="/items"
						className="bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition"
					>
						Browse Items
					</a>
				</div>
			</section>
			<section className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl mt-8">
				<div className="bg-gray-100 p-6 rounded shadow text-center">
					<h2 className="font-bold text-xl mb-2">Direct Swaps</h2>
					<p>
						Exchange clothing directly with other users for a sustainable
						wardrobe refresh.
					</p>
				</div>
				<div className="bg-gray-100 p-6 rounded shadow text-center">
					<h2 className="font-bold text-xl mb-2">Point-Based System</h2>
					<p>
						Earn points for your contributions and redeem them for new items.
					</p>
				</div>
				<div className="bg-gray-100 p-6 rounded shadow text-center">
					<h2 className="font-bold text-xl mb-2">Community Impact</h2>
					<p>
						Join a movement to reduce textile waste and promote eco-friendly
						fashion.
					</p>
				</div>
			</section>
		</div>
	);
}
