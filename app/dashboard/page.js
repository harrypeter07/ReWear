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
				className="min-h-screen flex items-center justify-center"
				style={{ background: "var(--bg-primary)" }}
			>
				<div className="card text-center">
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
				className="min-h-screen flex items-center justify-center"
				style={{ background: "var(--bg-primary)" }}
			>
				<div className="card text-center max-w-md">
					<div
						className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full"
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
						className="text-xl font-semibold mb-2"
						style={{ color: "var(--text-primary)" }}
					>
						Authentication Required
					</h2>
					<p className="mb-6" style={{ color: "var(--text-secondary)" }}>
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
		<div className="min-h-screen gradient-bg py-8 px-2">
			<div className="container mx-auto max-w-5xl">
				<h1 className="text-4xl font-bold gradient-text mb-6 text-center">
					Your Dashboard
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					{/* Dashboard widgets */}
					<DashboardWidgets stats={stats} />
				</div>
				<div className="card p-6 mb-8">
					<h2 className="text-2xl font-semibold text-primary mb-4">
						Your Listings
					</h2>
					{/* Listings grid or list here */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{listings.map((item) => (
							<ItemCard key={item._id} item={item} />
						))}
					</div>
				</div>
				<div className="card p-6">
					<h2 className="text-2xl font-semibold text-primary mb-4">
						Swap Requests
					</h2>
					{/* Swap requests list here */}
					<div className="space-y-4">
						{swapRequests.map((req) => (
							<SwapRequestForm key={req._id} request={req} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
