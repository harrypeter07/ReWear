"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ItemCard from "@/components/ItemCard";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";

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
			try {
				const userRes = await fetch("/api/auth/me", { credentials: "include" });
				if (userRes.ok) {
					const userData = await userRes.json();
					setUser(userData.user);
					const itemsRes = await fetch(
						`/api/items?uploaderId=${userData.user._id}`
					);
					const items = itemsRes.ok ? await itemsRes.json() : [];
					setUserListings(
						Array.isArray(items)
							? items.filter((i) => {
									const uploaderId =
										typeof i.uploaderId === "object" &&
										i.uploaderId !== null &&
										i.uploaderId.toString
											? i.uploaderId.toString()
											: String(i.uploaderId);
									return uploaderId === String(userData.user._id);
							  })
							: []
					);
					const swapsRes = await fetch(
						`/api/swaps?userId=${userData.user._id}`
					);
					let swaps = swapsRes.ok ? await swapsRes.json() : [];
					if (swaps && swaps.swaps) swaps = swaps.swaps;
					if (!Array.isArray(swaps)) swaps = [];
					setSwapRequests(swaps);
					setUserPurchases(
						swaps.filter(
							(s) =>
								s.status === "accepted" && s.requester === userData.user._id
						)
					);
				} else {
					setUser(null);
				}
			} catch (err) {
				setUser(null);
			} finally {
				setLoading(false);
			}
		}
		fetchDashboard();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
				<div className="card text-center">
					<div className="loader"></div>
					<p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Loading dashboard...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
				<div className="card text-center max-w-md">
					<div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full" style={{ background: 'var(--accent)' }}>
						<svg
							className="w-8 h-8"
							style={{ color: 'var(--text-primary)' }}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
					</div>
					<h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
						Authentication Required
					</h2>
					<p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
						Please log in to access your dashboard.
					</p>
					<Link href="/login" className="btn inline-block">
						Go to Login
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="container min-h-screen" style={{ background: 'var(--bg-primary)' }}>
			{/* Header Card */}
			<div className="card mb-8">
				<div className="flex flex-col md:flex-row items-center gap-6">
					<div className="relative">
						{user?.avatar ? (
							<Image
								src={user.avatar}
								alt={user?.username || user?.name || "User"}
								width={80}
								height={80}
								className="w-20 h-20 rounded-full object-cover transition-transform hover:scale-105"
								style={{ 
									boxShadow: 'var(--shadow)',
									border: `2px solid var(--border-color)`
								}}
								unoptimized={user?.avatar?.startsWith("http")}
							/>
						) : (
							<div 
								className="w-20 h-20 rounded-full flex items-center justify-center"
								style={{ 
									background: 'var(--accent)',
									boxShadow: 'var(--shadow)'
								}}
							>
								<svg
									className="w-10 h-10"
									style={{ color: 'var(--text-primary)' }}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
									/>
								</svg>
							</div>
						)}
					</div>
					<div className="flex-1 text-center md:text-left">
						<h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
							Welcome back!
						</h1>
						<p className="mb-2" style={{ color: 'var(--text-secondary)' }}>
							{user?.username || user?.name || user?.email}
						</p>
						{user && (
							<div 
								className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
								style={{ 
									background: 'var(--accent)',
									color: 'var(--text-primary)'
								}}
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
								</svg>
								{user.points} Points
							</div>
						)}
					</div>
					<Link
						href="/items/new"
						className="btn inline-flex items-center gap-2 hover:scale-105"
						style={{ transition: 'var(--transition)' }}
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
						</svg>
						List New Item
					</Link>
				</div>
			</div>

			{/* Tab Navigation */}
			<div className="card mb-8">
				<div className="flex flex-wrap gap-2">
					<button
						onClick={() => setActiveTab("listings")}
						className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
							activeTab === "listings"
								? "text-white"
								: "hover:scale-105"
						}`}
						style={{
							background: activeTab === "listings" ? 'var(--text-primary)' : 'var(--accent)',
							color: activeTab === "listings" ? 'white' : 'var(--text-primary)',
							transition: 'var(--transition)'
						}}
					>
						My Listings ({userListings.length})
					</button>
					<button
						onClick={() => setActiveTab("purchases")}
						className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
							activeTab === "purchases"
								? "text-white"
								: "hover:scale-105"
						}`}
						style={{
							background: activeTab === "purchases" ? 'var(--text-primary)' : 'var(--accent)',
							color: activeTab === "purchases" ? 'white' : 'var(--text-primary)',
							transition: 'var(--transition)'
						}}
					>
						My Purchases ({userPurchases.length})
					</button>
					<button
						onClick={() => setActiveTab("swaps")}
						className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
							activeTab === "swaps"
								? "text-white"
								: "hover:scale-105"
						}`}
						style={{
							background: activeTab === "swaps" ? 'var(--text-primary)' : 'var(--accent)',
							color: activeTab === "swaps" ? 'white' : 'var(--text-primary)',
							transition: 'var(--transition)'
						}}
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
						<div className="bento-grid">
							{userListings.map((item) => (
								<div key={item._id || item.id} className="relative">
									<ItemCard
										item={{
											...item,
											ownerUsername: item.ownerUsername,
											ownerName: item.ownerName,
										}}
									/>
									<span
										className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium ${
											item.isApproved
												? "bg-green-100 text-green-700"
												: "bg-amber-100 text-amber-700"
										}`}
										style={{
											boxShadow: 'var(--shadow)',
											border: `1px solid ${item.isApproved ? '#d1fae5' : '#fef3c7'}`
										}}
									>
										{item.isApproved ? "✓ Approved" : "⏳ Pending"}
									</span>
								</div>
							))}
						</div>
					) : (
						<div className="card text-center py-12">
							<div 
								className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
								style={{ background: 'var(--accent)' }}
							>
								<svg
									className="w-10 h-10"
									style={{ color: 'var(--text-primary)' }}
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
							</div>
							<h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
								No listings yet
							</h3>
							<p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
								Create your first listing to start swapping items with others
							</p>
							<Link
								href="/items/new"
								className="btn inline-flex items-center gap-2 hover:scale-105"
								style={{ transition: 'var(--transition)' }}
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
								</svg>
								Create First Listing
							</Link>
						</div>
					)}
				</section>
			) : activeTab === "purchases" ? (
				<section>
					<h2 className="sr-only">My Purchases</h2>
					{userPurchases.length > 0 ? (
						<div className="bento-grid">
							{userPurchases.map((swap) => (
								<div key={swap._id}>
									{swap.item && (
										<ItemCard
											item={{
												...swap.item,
												ownerUsername: swap.item.ownerUsername,
												ownerName: swap.item.ownerName,
											}}
										/>
									)}
								</div>
							))}
						</div>
					) : (
						<div className="card text-center py-12">
							<div 
								className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
								style={{ background: 'var(--accent)' }}
							>
								<svg
									className="w-10 h-10"
									style={{ color: 'var(--text-primary)' }}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
								No purchases yet
							</h3>
							<p style={{ color: 'var(--text-secondary)' }}>
								Items you e successfully swapped will appear here
							</p>
						</div>
					)}
				</section>
			) : (
				<section>
					<h2 className="sr-only">Swap Requests</h2>
					{swapRequests.length > 0 ? (
						<div className="bento-grid">
							{swapRequests.map((swap) => (
								<div key={swap._id} className="card">
									<div className="flex items-center gap-3 mb-4">
										<div 
											className="w-12 h-12 rounded-full flex items-center justify-center"
											style={{ background: 'var(--accent)' }}
										>
											<svg
												className="w-6 h-6"
												style={{ color: 'var(--text-primary)' }}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={1.5}
													d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
												/>
											</svg>
										</div>
										<div>
											<h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
												{swap.item || 'Swap Request'}
											</h4>
											<p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
												{swap.type}
											</p>
										</div>
									</div>
									<div className="space-y-2">
										<div className="flex justify-between items-center">
											<span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Status:</span>
											<span 
												className={`px-2 py-1 rounded-full text-xs font-medium ${
													swap.status === 'accepted' ? 'bg-green-100 text-green-700' :
													swap.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
													'bg-red-100 text-red-700'
												}`}
											>
												{swap.status}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Requested:</span>
											<span className="text-sm" style={{ color: 'var(--text-primary)' }}>
												{new Date(swap.createdAt).toLocaleDateString()}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="card text-center py-12">
							<div 
								className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
								style={{ background: 'var(--accent)' }}
							>
								<svg
									className="w-10 h-10"
									style={{ color: 'var(--text-primary)' }}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
								No swap requests yet
							</h3>
							<p style={{ color: 'var(--text-secondary)' }}>
								Swap requests from other users will appear here
							</p>
						</div>
					)}
				</section>
			)}
		</div>
	);
}