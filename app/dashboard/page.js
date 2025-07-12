"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ItemCard from "@/components/ItemCard";

export default function DashboardPage() {
	const [activeTab, setActiveTab] = useState("listings");
	const [user, setUser] = useState(null);
	const [userListings, setUserListings] = useState([]);
	const [userPurchases, setUserPurchases] = useState([]);
	const [swapRequests, setSwapRequests] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchDashboard() {
			setLoading(true);
			// Fetch user info
			const userRes = await fetch("/api/auth/me", { credentials: "include" });
			if (userRes.ok) {
				const userData = await userRes.json();
				setUser(userData.user);
				// Fetch user's items
				const itemsRes = await fetch(
					`/api/items?uploaderId=${userData.user._id}`
				);
				const items = itemsRes.ok ? await itemsRes.json() : [];
				setUserListings(
					Array.isArray(items)
						? items.filter(
								(i) =>
									i.owner === userData.user._id ||
									i.uploaderId === userData.user._id
						  )
						: []
				);
				// Fetch swap requests
				const swapsRes = await fetch(`/api/swaps?userId=${userData.user._id}`);
				let swaps = swapsRes.ok ? await swapsRes.json() : [];
				if (swaps && swaps.swaps) swaps = swaps.swaps;
				if (!Array.isArray(swaps)) swaps = [];
				setSwapRequests(swaps);
				// Purchases: items where user is swap/redeem recipient
				setUserPurchases(
					swaps.filter(
						(s) => s.status === "accepted" && s.requester === userData.user._id
					)
				);
			}
			setLoading(false);
		}
		fetchDashboard();
	}, []);

	if (loading) return <div className="p-8 text-center">Loading...</div>;

	const fallbackImages = [
		"https://i.pinimg.com/60x60/7d/3f/2f/7d3f2f6cf9664994ee3ae56a268f26b9.jpg",
		"https://i.pinimg.com/60x60/04/5a/cb/045acbc218006ec6857a31ebf48330e9.jpg",
		"https://i.pinimg.com/60x60/81/35/c5/8135c5f8ef39526076ac30432ad403b3.jpg",
		"https://i.pinimg.com/60x60/94/8f/7a/948f7a63203b896e38bbc94584595185.jpg",
		"https://i.pinimg.com/60x60/30/c2/f8/30c2f8ba91a415a87894fd3a2b98cc16.jpg",
		"https://i.pinimg.com/60x60/57/de/cf/57decfab8feb4ae820f423ca854a9c40.jpg",
		"https://i.pinimg.com/60x60/50/db/cd/50dbcd4265648f000435fe6916fc1f64.jpg",
		"https://i.pinimg.com/60x60/3c/46/58/3c4658c9e526fa01ca2502a1bd0666b7.jpg",
		"https://i.pinimg.com/60x60/db/08/95/db0895011eaf57e30c961061bc8daa0f.jpg",
		"https://i.pinimg.com/60x60/c2/4b/18/c24b18486862ad0cb712d490c5023f5f.jpg",
		"https://i.pinimg.com/60x60/6f/18/e9/6f18e98732bf594c91db9b30aa312a11.jpg",
		"https://i.pinimg.com/60x60/97/25/35/972535fe749562e2ab645d49e53059f8.jpg",
		"https://i.pinimg.com/60x60/10/0e/83/100e83a7bc1e277b59beb35f25e95699.jpg",
		"https://i.pinimg.com/60x60/93/7f/d4/937fd46b9c08e050fdd9160b4a13d28e.jpg",
		"https://i.pinimg.com/60x60/a3/b0/d2/a3b0d29974f7e00a708c8a7fd1873bbb.jpg",
		"https://i.pinimg.com/60x60/69/68/0a/69680a0274ad6cebbf12eedbda2a8ebe.jpg",
		"https://i.pinimg.com/60x60/82/8d/73/828d7394556a00842aa19f6549e2a1fb.jpg",
		"https://i.pinimg.com/60x60/82/7e/e2/827ee297a3142a24a4dccc41fe3f9fdf.jpg",
		"https://i.pinimg.com/60x60/80/74/6d/80746db97891afd60f89eb36a3166983.jpg",
		"https://i.pinimg.com/60x60/9a/fc/d4/9afcd46fb75bccab9163037e44532730.jpg",
		"https://i.pinimg.com/60x60/a0/b3/78/a0b37803268877f0f243a1c3f1a2bf15.jpg",
		"https://i.pinimg.com/60x60/34/80/9b/34809b86b998da77775908481281954c.jpg",
		"https://i.pinimg.com/60x60/d8/37/0c/d8370c2816e2e10a9033f9b0e62240b7.jpg",
		"https://i.pinimg.com/60x60/91/fd/55/91fd5569abd956ea3968a07466b2f104.jpg",
		"https://i.pinimg.com/60x60/49/26/32/49263296e5fa1f402d4245deeeeb906e.jpg",
		"https://i.pinimg.com/236x/18/49/8e/18498eddf60795d2a6c2778a95d2bed0.jpg",
		"https://i.pinimg.com/236x/93/6f/6c/936f6ca1b2801cccab21d8b9006f038c.jpg",
		"https://i.pinimg.com/236x/f5/d4/5e/f5d45ec9136f063e610d85e80c1a169d.jpg",
		"https://i.pinimg.com/236x/e7/61/7f/e7617fbcf801f05e72d89999714df9e1.jpg",
		"https://i.pinimg.com/236x/0a/24/83/0a24832a85b4aa488b9769baf266574a.jpg",
		"https://i.pinimg.com/236x/e7/62/5f/e7625fe383da46abc54bd86077542168.jpg",
		"https://i.pinimg.com/236x/cd/d8/69/cdd869465a80b59c7a6a7aa6758b5c84.jpg",
		"https://i.pinimg.com/236x/31/ba/eb/31baeb526daba562bde059111588110e.jpg",
		"https://i.pinimg.com/236x/8f/e4/9a/8fe49a5d5b26747bd6e75977a01c03ea.jpg",
		"https://i.pinimg.com/236x/0f/71/d5/0f71d551ec5e1ab3d06d392e9f2f5780.jpg",
		"https://i.pinimg.com/236x/09/8a/d1/098ad187c66201bedd7cead487b0122f.jpg",
		"https://i.pinimg.com/236x/27/77/fc/2777fc7199949375e3d99463c2019434.jpg",
	];
	function getRandomFallbackImage() {
		return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
	}
	function getImageSrc(image) {
		const defaultImage = "/images/default.jpg";
		if (!image || typeof image !== "string") return getRandomFallbackImage();
		if (image.startsWith("/uploads/")) return image;
		if (image.startsWith("http://") || image.startsWith("https://"))
			return image;
		return getRandomFallbackImage();
	}

	return (
		<div className="container mx-auto px-4 py-8 bg-white min-h-screen">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-6">
				<div className="flex items-center gap-6">
					<img
						src={user?.avatar || "/images/default-avatar.png"}
						alt={user?.username || user?.name || "User"}
						className="w-24 h-24 rounded-full border shadow object-cover bg-gray-100"
					/>
					<div>
						<h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
						<p className="text-gray-500 mt-1">
							Welcome, {user?.username || user?.name || user?.email}
						</p>
						{user && (
							<div className="mt-2 text-green-700 font-bold">
								Points: {user.points}
							</div>
						)}
					</div>
				</div>
				<Link
					href="/items/new"
					className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm transition mt-6 md:mt-0"
				>
					+ List New Item
				</Link>
			</div>

			{/* Tab Navigation */}
			<div className="mb-8">
				<div className="flex space-x-4 border-b border-gray-200">
					<button
						onClick={() => setActiveTab("listings")}
						className={`pb-3 px-1 text-sm font-medium ${
							activeTab === "listings"
								? "text-gray-900 border-b-2 border-gray-900"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						My Listings ({userListings.length})
					</button>
					<button
						onClick={() => setActiveTab("purchases")}
						className={`pb-3 px-1 text-sm font-medium ${
							activeTab === "purchases"
								? "text-gray-900 border-b-2 border-gray-900"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						My Purchases ({userPurchases.length})
					</button>
					<button
						onClick={() => setActiveTab("swaps")}
						className={`pb-3 px-1 text-sm font-medium ${
							activeTab === "swaps"
								? "text-gray-900 border-b-2 border-gray-900"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						Swap Requests ({swapRequests.length})
					</button>
				</div>
			</div>

			{/* Tab Content */}
			{activeTab === "listings" ? (
				<section>
					<h2 className="sr-only">My Listings</h2>
					{userListings.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{userListings.map((item) => (
								<div key={item._id || item.id} className="relative">
									<ItemCard item={item} />
									<span
										className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-md ${
											item.status === "available"
												? "bg-gray-100 text-gray-800"
												: "bg-gray-200 text-gray-800"
										}`}
									>
										{item.status}
									</span>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
							<svg
								className="mx-auto h-12 w-12 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
								/>
							</svg>
							<h3 className="mt-2 text-sm font-medium text-gray-900">
								No listings yet
							</h3>
							<p className="mt-1 text-sm text-gray-500">
								Get started by listing an item for swap
							</p>
							<div className="mt-6">
								<Link
									href="/items/new"
									className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
								>
									+ New Listing
								</Link>
							</div>
						</div>
					)}
				</section>
			) : activeTab === "purchases" ? (
				<section>
					<h2 className="sr-only">My Purchases</h2>
					{userPurchases.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{userPurchases.map((swap) => (
								<div key={swap._id} className="relative">
									<div className="border rounded p-4 shadow flex flex-col items-center">
										{/* Fetch and show the item image if possible */}
										{swap.item && (
											<img
												src={getImageSrc(
													typeof swap.item === "object" && swap.item.image
														? swap.item.image
														: null
												)}
												alt="Purchased Item"
												className="w-24 h-24 object-cover rounded mb-2 border"
												onError={(e) => {
													e.target.onerror = null;
													e.target.src = getRandomFallbackImage();
												}}
											/>
										)}
										<div className="font-semibold">
											Item:{" "}
											{typeof swap.item === "object" && swap.item.title
												? swap.item.title
												: swap.item}
										</div>
										<div>Status: {swap.status}</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-12">No purchases yet.</div>
					)}
				</section>
			) : (
				<section>
					<h2 className="sr-only">Swap Requests</h2>
					{swapRequests.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{swapRequests.map((swap) => (
								<div key={swap._id} className="border rounded p-4 shadow">
									<div className="font-semibold">Item: {swap.item}</div>
									<div>Type: {swap.type}</div>
									<div>Status: {swap.status}</div>
									<div>
										Requested: {new Date(swap.createdAt).toLocaleString()}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-12">No swap requests yet.</div>
					)}
				</section>
			)}
		</div>
	);
}
