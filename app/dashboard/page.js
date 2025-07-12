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
												src={
													typeof swap.item === "object" && swap.item.image
														? swap.item.image
														: "/images/default.jpg"
												}
												alt="Purchased Item"
												className="w-24 h-24 object-cover rounded mb-2 border"
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
