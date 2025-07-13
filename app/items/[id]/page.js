"use client";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import SwapRequestForm from "@/components/SwapRequestForm";
import { useState, useEffect } from "react";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";

async function fetchItem(id) {
	const res = await fetch(`/api/items/${id}`);
	if (!res.ok) return null;
	return await res.json();
}

function isImageMissing(image) {
	return !image || image === null || image === undefined || image === "";
}

export default function ItemDetailPage() {
	const params = useParams();
	const id = params.id;
	const [item, setItem] = useState(null);
	const [showSwap, setShowSwap] = useState(false);
	const [showRedeem, setShowRedeem] = useState(false);
	const [previousListings, setPreviousListings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);

	useEffect(() => {
		async function load() {
			try {
				const data = await fetchItem(id);
				setItem(data);
				if (data && data.uploaderId) {
					const res = await fetch(`/api/items?uploaderId=${data.uploaderId}`);
					if (res.ok) {
						const apiData = await res.json();
						if (Array.isArray(apiData.items)) {
							setPreviousListings(apiData.items.filter((i) => i._id !== id));
						} else {
							setPreviousListings([]);
						}
					} else {
						setPreviousListings([]);
					}
				}
				// Fetch current user
				const userRes = await fetch("/api/auth/me", { credentials: "include" });
				if (userRes.ok) {
					const userData = await userRes.json();
					setUser(userData.user);
				} else {
					setUser(null);
				}
			} catch (error) {
				setUser(null);
			} finally {
				setLoading(false);
			}
		}
		if (id) {
			load();
		}
	}, [id]);

	if (loading) {
		return (
			<div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
				<div className="container">
					<div className="flex items-center justify-center min-h-[60vh]">
						<div className="loader"></div>
					</div>
				</div>
			</div>
		);
	}

	if (!item) {
		return (
			<div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
				<div className="container">
					<div className="flex items-center justify-center min-h-[60vh]">
						<div className="card text-center max-w-md">
							<div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full" style={{ background: 'var(--accent)' }}>
								<svg className="w-8 h-8" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</div>
							<h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
								Item Not Found
							</h2>
							<p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
								The item you e looking for doesn t exist or has been removed.
							</p>
							<Link href="/items" className="btn inline-flex items-center">
								← Back to Items
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	const getStatusColor = (status) => {
		switch (status) {
			case "available":
				return { background: '#e8f5e8', color: '#2d5d2d' };
			case "pending":
				return { background: '#fff4e6', color: '#8b4513' };
			case "swapped":
				return { background: 'var(--accent)', color: 'var(--text-secondary)' };
			default:
				return { background: 'var(--accent)', color: 'var(--text-primary)' };
		}
	};

	const getConditionColor = (condition) => {
		switch (condition) {
			case "new":
				return { background: '#e8f8e8', color: '#1a5a1a' };
			case "like new":
				return { background: '#f0f8f0', color: '#2d5d2d' };
			case "good":
				return { background: '#f0f4f8', color: '#2d4a5d' };
			case "fair":
				return { background: '#fff8e6', color: '#8b6914' };
			case "poor":
				return { background: '#ffeaea', color: '#8b2d2d' };
			default:
				return { background: 'var(--accent)', color: 'var(--text-secondary)' };
		}
	};

	return (
		<div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
			<div className="container">
				{/* Main Item Card */}
				<div className="card mb-8">
					<div className="bento-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
						{/* Image Section */}
						<div className="flex items-center justify-center p-4">
							<div className="relative w-full max-w-md aspect-square">
								{isImageMissing(item.image) ? (
									<div className="w-full h-full flex items-center justify-center border-2 border-dashed rounded-lg" style={{ 
										borderColor: 'var(--border-color)',
										background: 'var(--bg-secondary)'
									}}>
										<div className="text-center">
											<svg className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
											<p style={{ color: 'var(--text-secondary)' }}>No image available</p>
										</div>
									</div>
								) : (
									<Image
										src={item.image}
										alt={`${item.title} image`}
										fill
										className="object-cover"
										style={{ borderRadius: 'var(--radius)' }}
										onError={(e) => {
											e.target.onerror = null;
											e.target.src = "";
										}}
										unoptimized={item.image.startsWith("data:")}
									/>
								)}
							</div>
						</div>

						{/* Details Section */}
						<div className="space-y-6">
							<div>
								<h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
									{item.title}
								</h1>
								<div className="flex flex-wrap gap-2 mb-4">
									<span className="px-3 py-1 rounded-full text-sm font-medium" style={getStatusColor(item.status)}>
										{item.status}
									</span>
									<span className="px-3 py-1 rounded-full text-sm font-medium" style={getConditionColor(item.condition)}>
										{item.condition}
									</span>
									{item.isApproved && (
										<span className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1" style={{ background: '#e8f4f8', color: '#2d4a5d' }}>
											<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
												<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
											</svg>
											Approved
										</span>
									)}
								</div>
							</div>

							<div>
								<p className="leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
									{item.description}
								</p>
							</div>

							<div className="bento-grid">
								<div className="card" style={{ background: 'var(--bg-secondary)', padding: '1rem' }}>
									<h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Details</h3>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span style={{ color: 'var(--text-secondary)' }}>Category:</span>
											<span className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.category}</span>
										</div>
										<div className="flex justify-between">
											<span style={{ color: 'var(--text-secondary)' }}>Size:</span>
											<span className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.size}</span>
										</div>
									</div>
								</div>
								<div className="card" style={{ background: 'var(--accent)', padding: '1rem' }}>
									<h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Value</h3>
									<div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
										{item.pointsValue} <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>points</span>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							{user && item && String(item.owner) !== String(user._id) && String(item.uploaderId) !== String(user._id) && (
								<div className="space-y-4">
									<div className="flex gap-3">
										<button
											className="btn flex-1 flex items-center justify-center gap-2"
											onClick={() => setShowSwap((v) => !v)}
											style={{ background: showSwap ? '#d5c3b8' : 'var(--accent)' }}
										>
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
											</svg>
											{showSwap ? "Hide Swap Form" : "Request Swap"}
										</button>
										<button
											className="btn flex-1 flex items-center justify-center gap-2"
											onClick={() => setShowRedeem((v) => !v)}
											style={{ background: showRedeem ? '#d5c3b8' : 'var(--accent)' }}
										>
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8" />
											</svg>
											{showRedeem ? "Hide Redeem Form" : "Redeem with Points"}
										</button>
									</div>
									{showSwap && (
										<div className="card" style={{ background: 'var(--bg-secondary)' }}>
											<SwapRequestForm itemId={item._id} type="swap" />
										</div>
									)}
									{showRedeem && (
										<div className="card" style={{ background: 'var(--bg-secondary)' }}>
											<SwapRequestForm itemId={item._id} type="redeem" />
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Previous Listings Section */}
				<div className="card">
					<h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
						<svg className="w-6 h-6" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
						</svg>
						More from this seller
					</h2>

					{previousListings.length === 0 ? (
						<div className="text-center py-8">
							<svg className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
							</svg>
							<p className="font-medium" style={{ color: 'var(--text-secondary)' }}>
								No other listings from this seller
							</p>
						</div>
					) : (
						<div className="bento-grid">
							{previousListings.slice(0, 4).map((prev) => (
								<Link
									key={prev._id}
									href={`/items/${prev._id}`}
									className="card block group"
									style={{ 
										padding: '0',
										transition: 'var(--transition)',
										textDecoration: 'none'
									}}
								>
									<div className="aspect-square relative overflow-hidden" style={{ borderRadius: 'var(--radius) var(--radius) 0 0' }}>
										{isImageMissing(prev.image) ? (
											<div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
												<div className="text-center">
													<svg className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
													</svg>
													<p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No image</p>
												</div>
											</div>
										) : (
											<Image
												src={prev.image}
												alt={`${prev.title} image`}
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-300"
												onError={(e) => {
													e.target.onerror = null;
													e.target.src = "";
												}}
												unoptimized={prev.image.startsWith("data:")}
											/>
										)}
									</div>
									<div className="p-4">
										<h3 className="font-semibold line-clamp-2" style={{ color: 'var(--text-primary)' }}>
											{prev.title}
										</h3>
										<p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
											{prev.pointsValue} points
										</p>
									</div>
								</Link>
							))}
						</div>
					)}
				</div>

				{/* Back Navigation */}
				<div className="mt-8 flex justify-center">
					<Link
						href="/items"
						className="btn inline-flex items-center"
					>
						<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Back to Items
					</Link>
				</div>
			</div>
		</div>
	);
}