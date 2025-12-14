"use client";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UserContext } from "@/contexts/UserContext";

export default function OrdersPage() {
	const { user: contextUser, isLoading: userLoading, refetchUser } = useContext(UserContext);
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("all"); // "all", "purchases", "sales"
	const router = useRouter();

	useEffect(() => {
		async function fetchOrders() {
			if (userLoading) return;
			
			const currentUser = contextUser;
			if (!currentUser) {
				setLoading(false);
				return;
			}
			
			// Skip for admin user
			const isAdminUser = currentUser._id === 'admin' || currentUser.role === 'admin';
			const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(String(currentUser._id));
			
			if (isAdminUser || !isValidObjectId) {
				setOrders([]);
				setLoading(false);
				return;
			}
			
			setLoading(true);
			try {
				const res = await fetch(`/api/orders?userId=${currentUser._id}`, {
					credentials: "include",
				});
				if (res.ok) {
					const data = await res.json();
					setOrders(data.orders || []);
				}
			} catch (err) {
				console.error("[ORDERS] Error fetching orders:", err);
			} finally {
				setLoading(false);
			}
		}
		fetchOrders();
	}, [contextUser, userLoading]);

	if (userLoading || loading) {
		return (
			<div
				className="flex justify-center items-center min-h-screen"
				style={{ background: "var(--bg-primary)" }}
			>
				<div className="text-center card">
					<div className="loader"></div>
					<p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>
						Loading orders...
					</p>
				</div>
			</div>
		);
	}

	const currentUser = contextUser;
	if (!currentUser) {
		return (
			<div
				className="flex justify-center items-center min-h-screen"
				style={{ background: "var(--bg-primary)" }}
			>
				<div className="max-w-md text-center card">
					<h2
						className="mb-2 text-xl font-semibold"
						style={{ color: "var(--text-primary)" }}
					>
						Authentication Required
					</h2>
					<p className="mb-6" style={{ color: "var(--text-secondary)" }}>
						Please log in to view your orders.
					</p>
					<Link href="/login" className="inline-block btn">
						Go to Login
					</Link>
				</div>
			</div>
		);
	}

	const filteredOrders = orders.filter((order) => {
		if (activeTab === "purchases") return order.isPurchase;
		if (activeTab === "sales") return order.isSale;
		return true;
	});

	const purchasesCount = orders.filter((o) => o.isPurchase).length;
	const salesCount = orders.filter((o) => o.isSale).length;

	return (
		<div className="pt-40 pb-12 min-h-screen" style={{ background: 'var(--bg-primary)', paddingTop: '160px' }}>
			<div className="container px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8 text-center card" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)',
					boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
				}}>
					<h1 className="mt-6 mb-4 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 md:text-5xl">
						Order History
					</h1>
					<p className="mb-6 text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
						View all your purchases and sales
					</p>
				</div>

				{/* Tabs */}
				<div className="mb-6 card" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)'
				}}>
					<div className="flex gap-2 p-2" style={{ background: 'rgba(99, 102, 241, 0.05)', borderRadius: '0.75rem' }}>
						<button
							onClick={() => setActiveTab("all")}
							className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
								activeTab === "all"
									? "text-white"
									: "text-gray-600 hover:text-gray-900"
							}`}
							style={
								activeTab === "all"
									? {
											background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
											boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
										}
									: { background: 'transparent' }
							}
						>
							All ({orders.length})
						</button>
						<button
							onClick={() => setActiveTab("purchases")}
							className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
								activeTab === "purchases"
									? "text-white"
									: "text-gray-600 hover:text-gray-900"
							}`}
							style={
								activeTab === "purchases"
									? {
											background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
											boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
										}
									: { background: 'transparent' }
							}
						>
							Purchases ({purchasesCount})
						</button>
						<button
							onClick={() => setActiveTab("sales")}
							className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
								activeTab === "sales"
									? "text-white"
									: "text-gray-600 hover:text-gray-900"
							}`}
							style={
								activeTab === "sales"
									? {
											background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
											boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
										}
									: { background: 'transparent' }
							}
						>
							Sales ({salesCount})
						</button>
					</div>
				</div>

				{/* Orders List */}
				<div className="card" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)'
				}}>
					{filteredOrders.length === 0 ? (
						<div className="p-12 text-center">
							<svg
								className="w-16 h-16 mx-auto mb-4"
								style={{ color: 'var(--text-secondary)' }}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
								/>
							</svg>
							<p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
								No orders found
							</p>
							<p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
								{activeTab === "purchases"
									? "You haven't made any purchases yet."
									: activeTab === "sales"
									? "You haven't made any sales yet."
									: "You don't have any orders yet."}
							</p>
							<Link href="/items" className="inline-block btn">
								Browse Items
							</Link>
						</div>
					) : (
						<div className="space-y-4 p-6">
							{filteredOrders.map((order) => (
								<div
									key={order._id}
									className="p-6 rounded-xl transition-all duration-300 hover:shadow-lg"
									style={{
										background: order.isPurchase
											? 'linear-gradient(135deg, rgba(240, 253, 244, 0.5) 0%, rgba(220, 252, 231, 0.5) 100%)'
											: 'linear-gradient(135deg, rgba(239, 246, 255, 0.5) 0%, rgba(219, 234, 254, 0.5) 100%)',
										border: `1px solid ${order.isPurchase ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
									}}
								>
									<div className="flex flex-col gap-4 sm:flex-row sm:items-start">
										{/* Item Image */}
										{order.item?.image && (
											<Link
												href={`/items/${order.item._id}`}
												className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
											>
												<Image
													src={order.item.image}
													alt={order.item.title || "Item"}
													width={128}
													height={128}
													className="w-full h-full object-cover"
												/>
											</Link>
										)}
										
										{/* Order Details */}
										<div className="flex-1 min-w-0">
											<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-2">
														<span
															className="px-3 py-1 text-xs font-semibold rounded-full"
															style={{
																background: order.isPurchase
																	? 'rgba(16, 185, 129, 0.15)'
																	: 'rgba(59, 130, 246, 0.15)',
																color: order.isPurchase ? '#059669' : '#2563eb',
															}}
														>
															{order.isPurchase ? "Purchase" : "Sale"}
														</span>
														<span
															className="px-3 py-1 text-xs font-semibold rounded-full"
															style={{
																background: 'rgba(16, 185, 129, 0.15)',
																color: '#059669',
															}}
														>
															Completed
														</span>
													</div>
													
													{order.item && (
														<Link
															href={`/items/${order.item._id}`}
															className="block mb-2 text-lg font-bold transition-colors hover:text-indigo-600"
															style={{ color: 'var(--text-primary)' }}
														>
															{order.item.title}
														</Link>
													)}
													
													{order.item?.category && (
														<p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
															Category: {order.item.category}
														</p>
													)}
													
													{order.isPurchase && order.seller && (
														<p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
															<span className="font-semibold">Seller:</span> {order.seller.username || order.seller.email}
														</p>
													)}
													
													{order.isSale && order.requester && (
														<p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
															<span className="font-semibold">Buyer:</span> {order.requester.username || order.requester.email}
														</p>
													)}
													
													{order.message && (
														<p className="text-sm mt-2 italic" style={{ color: 'var(--text-secondary)' }}>
															&ldquo;{order.message}&rdquo;
														</p>
													)}
												</div>
												
												{/* Points and Date */}
												<div className="flex flex-col items-end gap-2 sm:items-end">
													{order.item && (
														<div className="text-right">
															<p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
																{order.isPurchase ? "Paid" : "Earned"}
															</p>
															<p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
																{order.item.pointsValue}
															</p>
															<p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
																points
															</p>
														</div>
													)}
													
													{order.resolvedAt && (
														<p className="text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
															{new Date(order.resolvedAt).toLocaleDateString()}
														</p>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

