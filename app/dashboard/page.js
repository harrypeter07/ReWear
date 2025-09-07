"use client";
import { useEffect, useState } from "react";
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
		<div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
			{/* Header Section */}
			<div className="container">
				<div className="mb-8 text-center card">
					<h1 className="mb-4 text-4xl font-bold md:text-5xl" style={{ color: 'var(--text-primary)' }}>
						Your Dashboard
					</h1>
					<p className="mb-6 text-lg" style={{ color: 'var(--text-secondary)' }}>
						Overview of your activity and stats
					</p>
					<div className="flex flex-col gap-4 justify-center mb-6 sm:flex-row">
						<div className="px-4 py-3 border-0 backdrop-blur-sm card bg-white/50">
							<span className="block text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
								{stats.listings}
							</span>
							<p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
								Your Listings
							</p>
						</div>
						<div className="px-4 py-3 border-0 backdrop-blur-sm card bg-white/50">
							<span className="block text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
								{stats.swaps}
							</span>
							<p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
								Swap Requests
							</p>
						</div>
						<div className="px-4 py-3 border-0 backdrop-blur-sm card bg-white/50">
							<span className="block text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
								{stats.points}
							</span>
							<p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
								Points
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container">
				<div className="p-6 mb-8 card">
					<h2 className="mb-4 text-2xl font-semibold text-primary">
						Your Listings
					</h2>
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
				<div className="p-6 card">
					<h2 className="mb-4 text-2xl font-semibold text-primary">
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
				</div>
			</div>
		</div>
	);
}
