"use client";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ItemCard from "@/components/ItemCard";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import DashboardWidgets from "@/components/DashboardWidgets";
import SwapRequestForm from "@/components/SwapRequestForm";
import { UserContext } from "@/contexts/UserContext";

export default function DashboardPage() {
	const [activeTab, setActiveTab] = useState("listings");
	const { user: contextUser, isLoading: userLoading, refetchUser } = useContext(UserContext);
	const [user, setUser] = useState(null);
	const [userListings, setUserListings] = useState([]);
	const [userPurchases, setUserPurchases] = useState([]);
	const [swapRequests, setSwapRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	// Use user from context
	useEffect(() => {
		if (contextUser) {
			setUser(contextUser);
		} else if (!userLoading && !contextUser) {
			// User context loaded but no user found
			setUser(null);
		}
	}, [contextUser, userLoading]);

	useEffect(() => {
		async function fetchDashboard() {
			// Wait for user context to load
			if (userLoading) {
				return;
			}
			
			// Use context user
			const currentUser = contextUser;
			if (!currentUser) {
				setLoading(false);
				setUser(null);
				return;
			}
			
			setUser(currentUser);
			setLoading(true);
			try {
					
					// Skip fetching user-specific data for admin user (has _id: 'admin', not a valid ObjectId)
					const isAdminUser = currentUser._id === 'admin' || currentUser.role === 'admin';
					const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(String(currentUser._id));
					
					if (!isAdminUser && isValidObjectId) {
						const itemsRes = await fetch(
							`/api/items?uploaderId=${currentUser._id}`
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
									return uploaderId === String(currentUser._id);
								  })
								: []
						);
						const swapsRes = await fetch(
							`/api/swaps?userId=${currentUser._id}`
						);
						let swaps = swapsRes.ok ? await swapsRes.json() : [];
						if (swaps && swaps.swaps) swaps = swaps.swaps;
						if (!Array.isArray(swaps)) swaps = [];
						setSwapRequests(swaps);
						setUserPurchases(
							swaps.filter(
								(s) =>
									s.status === "accepted" && s.requester === currentUser._id
							)
						);
					} else {
						// For admin user, set empty arrays
						setUserListings([]);
						setSwapRequests([]);
						setUserPurchases([]);
					}
				} catch (err) {
					console.error("[DASHBOARD] Error fetching data:", err);
				} finally {
					setLoading(false);
				}
		}
		fetchDashboard();
	}, [contextUser, userLoading, user]);

	if (userLoading || loading) {
		return (
			<div
				className="flex justify-center items-center min-h-screen"
				style={{ background: "var(--bg-primary)" }}
			>
				<div className="text-center card">
					<div className="loader"></div>
					<p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>
						Loading dashboard...
					</p>
				</div>
			</div>
		);
	}

	// Use contextUser if available, fallback to local user state
	const currentUser = contextUser || user;
	if (!currentUser) {
		return (
			<div
				className="flex justify-center items-center min-h-screen"
				style={{ background: "var(--bg-primary)" }}
			>
				<div className="max-w-md text-center card">
					<div
						className="flex justify-center items-center mx-auto mb-4 w-16 h-16 rounded-full"
						style={{ background: "var(--accent)" }}
					>
						<svg
							className="w-8 h-8"
							style={{ color: "var(--text-primary)" }}
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
					<h2
						className="mb-2 text-xl font-semibold"
						style={{ color: "var(--text-primary)" }}
					>
						Authentication Required
					</h2>
					<p className="mb-6" style={{ color: "var(--text-secondary)" }}>
						Please log in to access your dashboard.
					</p>
					<Link href="/login" className="inline-block btn">
						Go to Login
					</Link>
				</div>
			</div>
		);
	}

	// Compute stats (align with items page header widgets)
	const stats = {
		listings: userListings.length,
		purchases: userPurchases.length,
		swaps: swapRequests.length,
		points: currentUser?.points ?? 0,
	};

	return (
		<div className="pt-40 pb-12 min-h-screen" style={{ background: 'var(--bg-primary)', paddingTop: '160px' }}>
			{/* Header Section */}
			<div className="container px-4 sm:px-6 lg:px-8">
				<div className="mt-6 mb-8 text-center card" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)',
					boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
				}}>
					<h1 className="mt-6 mb-4 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 md:text-5xl">
						Your Dashboard
					</h1>
					<p className="mb-8 text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
						Overview of your activity and stats
					</p>
					<div className="grid grid-cols-1 gap-6 mx-auto max-w-4xl sm:grid-cols-3">
						<div className="px-6 py-5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105" style={{
							background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
							border: '1px solid rgba(99, 102, 241, 0.2)',
							boxShadow: '0 4px 16px rgba(99, 102, 241, 0.1)'
						}}>
							<span className="block mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
								{stats.listings}
							</span>
							<p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
								Your Listings
							</p>
						</div>
						<div className="px-6 py-5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105" style={{
							background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
							border: '1px solid rgba(99, 102, 241, 0.2)',
							boxShadow: '0 4px 16px rgba(99, 102, 241, 0.1)'
						}}>
							<span className="block mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
								{stats.swaps}
							</span>
							<p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
								Swap Requests
							</p>
						</div>
						<div className="px-6 py-5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105" style={{
							background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
							border: '1px solid rgba(99, 102, 241, 0.2)',
							boxShadow: '0 4px 16px rgba(99, 102, 241, 0.1)'
						}}>
							<span className="block mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
								{stats.points}
							</span>
							<p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
								Points
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container px-4 sm:px-6 lg:px-8">
				{/* Profile Overview */}
				<div className="p-6 mb-6 sm:p-8 sm:mb-8 card" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)'
				}}>
					<h2 className="mb-6 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Your Profile</h2>
					<div className="flex flex-col gap-6 items-center sm:flex-row sm:items-start">
						<div className="flex justify-center items-center w-28 h-28 rounded-full shadow-lg transition-all duration-300 hover:scale-110" style={{ 
							background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
							boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
						}}>
							<span className="text-3xl font-bold text-white">
								{(currentUser?.name || currentUser?.username || 'U')?.slice(0,1).toUpperCase()}
							</span>
						</div>
						<div className="flex-1 text-center sm:text-left">
							<p className="mb-2 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
								{currentUser?.name || currentUser?.username}
							</p>
							<p className="mb-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
								{currentUser?.email}
							</p>
							<div className="flex flex-wrap gap-4 justify-center sm:justify-start">
								<span className="text-sm font-semibold rounded-lg" style={{ 
									background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
									border: '1px solid rgba(99, 102, 241, 0.25)',
									color: 'var(--text-primary)',
									boxShadow: '0 2px 8px rgba(99, 102, 241, 0.12)',
									padding: '0.875rem 1.75rem'
								}}>Role: {currentUser?.role || 'user'}</span>
								<span className="text-sm font-semibold rounded-lg" style={{ 
									background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
									border: '1px solid rgba(99, 102, 241, 0.25)',
									color: 'var(--text-primary)',
									boxShadow: '0 2px 8px rgba(99, 102, 241, 0.12)',
									padding: '0.875rem 1.75rem'
								}}>Points: {currentUser?.points ?? 0}</span>
								<span className="text-sm font-semibold rounded-lg" style={{ 
									background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
									border: '1px solid rgba(99, 102, 241, 0.25)',
									color: 'var(--text-primary)',
									boxShadow: '0 2px 8px rgba(99, 102, 241, 0.12)',
									padding: '0.875rem 1.75rem'
								}}>Listings: {userListings.length}</span>
							</div>
						</div>
					</div>
				</div>

				<div className="p-6 mb-6 sm:p-8 sm:mb-8 card" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)'
				}}>
					<div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
						<h2 className="mb-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 sm:mb-0">
							Your Listings
						</h2>
						<div className="flex flex-col gap-3 sm:flex-row">
							<button className="btn" onClick={() => router.push("/items/new")}>Add Item</button>
							<button className="btn btn-outline" onClick={() => router.push("/items")} style={{
								background: 'transparent',
								border: '2px solid var(--accent)',
								color: 'var(--accent)'
							}}>Browse Items</button>
						</div>
					</div>
					{/* Listings grid or list here */}
					{userListings.length === 0 ? (
						<p className="text-secondary">You have no listings yet.</p>
					) : (
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{userListings.map((item) => (
								<ItemCard key={item._id} item={item} />
							))}
						</div>
					)}
				</div>
				<div className="p-6 sm:p-8 card" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)'
				}}>
					<h2 className="mb-6 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
						Redeem Requests
					</h2>
					{/* Redeem requests list here */}
					{swapRequests.length === 0 ? (
						<p className="text-secondary">No redeem requests yet.</p>
					) : (
						<div className="space-y-4">
							{swapRequests.map((req) => (
								<div key={req._id} className="card p-4" style={{ background: 'var(--bg-secondary)' }}>
									<div className="flex justify-between items-start mb-2">
										<div>
											<p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
												Redeem Request
											</p>
											<p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
												Status: <span className="font-medium">{req.status}</span>
											</p>
											{req.message && (
												<p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
													Message: {req.message}
												</p>
											)}
										</div>
										<span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
											{new Date(req.createdAt || Date.now()).toLocaleDateString()}
										</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Recent Activity */}
				<div className="p-6 mt-6 sm:p-8 sm:mt-8 card" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)'
				}}>
					<h2 className="mb-6 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Recent Activity</h2>
					{(swapRequests && swapRequests.length > 0) || (userListings && userListings.length > 0) ? (
						<ul className="space-y-2">
							{swapRequests.slice(0,5).map((s) => (
								<li key={s._id} className="flex justify-between items-center">
									<span style={{ color: 'var(--text-secondary)' }}>
										{`Redeem request ${s.status || ''}`}
									</span>
									<span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
										{new Date(s.createdAt || Date.now()).toLocaleString()}
									</span>
								</li>
							))}
							{userListings.slice(0,5).map((i) => (
								<li key={i._id} className="flex justify-between items-center">
									<span style={{ color: 'var(--text-secondary)' }}>{`Listed: ${i.title}`}</span>
									<span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
										{new Date(i.createdAt || Date.now()).toLocaleDateString()}
									</span>
								</li>
							))}
						</ul>
					) : (
						<p className="text-secondary">No recent activity yet.</p>
					)}
				</div>
			</div>
		</div>
	);
}
