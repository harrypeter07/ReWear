"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ItemCard from "@/components/ItemCard";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import DashboardWidgets from "@/components/DashboardWidgets";
import SwapRequestForm from "@/components/SwapRequestForm";

export default function DashboardPage() {
	const [activeTab, setActiveTab] = useState("listings");
	const [user, setUser] = useState(null);
	const [userListings, setUserListings] = useState([]);
	const [userPurchases, setUserPurchases] = useState([]);
	const [swapRequests, setSwapRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

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

	if (!user) {
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
		points: user?.points ?? 0,
	};

	return (
		<div className="min-h-screen pt-28 pb-12" style={{ background: 'var(--bg-primary)' }}>
			{/* Header Section */}
			<div className="container">
				<div className="mb-8 text-center card" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)',
					boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
				}}>
					<h1 className="mb-4 text-4xl font-bold md:text-5xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
						Your Dashboard
					</h1>
					<p className="mb-8 text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
						Overview of your activity and stats
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
						<div className="px-6 py-5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105" style={{
							background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
							border: '1px solid rgba(99, 102, 241, 0.2)',
							boxShadow: '0 4px 16px rgba(99, 102, 241, 0.1)'
						}}>
							<span className="block text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
							<span className="block text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
							<span className="block text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
			<div className="container">
				{/* Profile Overview */}
				<div className="p-8 mb-8 card" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)'
				}}>
					<h2 className="mb-6 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Your Profile</h2>
					<div className="flex flex-col gap-6 items-center sm:flex-row sm:items-start">
						<div className="flex justify-center items-center w-28 h-28 rounded-full shadow-lg transition-all duration-300 hover:scale-110" style={{ 
							background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
							boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
						}}>
							<span className="text-3xl font-bold text-white">
								{(user?.name || user?.username || 'U')?.slice(0,1).toUpperCase()}
							</span>
						</div>
						<div className="flex-1 text-center sm:text-left">
							<p className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
								{user?.name || user?.username}
							</p>
							<p className="mb-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
								{user?.email}
							</p>
							<div className="flex flex-wrap gap-4 justify-center sm:justify-start">
								<span className="px-6 py-3 text-sm font-semibold rounded-lg" style={{ 
									background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
									border: '1px solid rgba(99, 102, 241, 0.25)',
									color: 'var(--text-primary)',
									boxShadow: '0 2px 8px rgba(99, 102, 241, 0.12)'
								}}>Role: {user?.role || 'user'}</span>
								<span className="px-6 py-3 text-sm font-semibold rounded-lg" style={{ 
									background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
									border: '1px solid rgba(99, 102, 241, 0.25)',
									color: 'var(--text-primary)',
									boxShadow: '0 2px 8px rgba(99, 102, 241, 0.12)'
								}}>Points: {user?.points ?? 0}</span>
								<span className="px-6 py-3 text-sm font-semibold rounded-lg" style={{ 
									background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
									border: '1px solid rgba(99, 102, 241, 0.25)',
									color: 'var(--text-primary)',
									boxShadow: '0 2px 8px rgba(99, 102, 241, 0.12)'
								}}>Listings: {userListings.length}</span>
							</div>
						</div>
					</div>
				</div>

				<div className="p-8 mb-8 card" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)'
				}}>
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
						<h2 className="mb-4 sm:mb-0 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
							Your Listings
						</h2>
						<div className="flex flex-col sm:flex-row gap-3">
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
				<div className="p-8 card" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)'
				}}>
					<h2 className="mb-6 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
						Swap Requests
					</h2>
					{/* Swap requests list here */}
					{swapRequests.length === 0 ? (
						<p className="text-secondary">No swap requests yet.</p>
					) : (
						<div className="space-y-4">
							{swapRequests.map((req) => (
								<SwapRequestForm key={req._id} request={req} />
							))}
						</div>
					)}
					<div className="mt-4 flex gap-3">
						<button className="btn" onClick={() => router.push("/swaps")}>View All Swaps</button>
					</div>
				</div>

				{/* Recent Activity */}
				<div className="p-8 mt-8 card" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)'
				}}>
					<h2 className="mb-6 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Recent Activity</h2>
					{(swapRequests && swapRequests.length > 0) || (userListings && userListings.length > 0) ? (
						<ul className="space-y-2">
							{swapRequests.slice(0,5).map((s) => (
								<li key={s._id} className="flex justify-between items-center">
									<span style={{ color: 'var(--text-secondary)' }}>
										{`Swap ${s.type || 'request'} ${s.status || ''}`}
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
