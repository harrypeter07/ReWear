"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function AdminPanel() {
	const [activeTab, setActiveTab] = useState("users");
	const [users, setUsers] = useState([]);
	const [listings, setListings] = useState([]);
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [selectedUser, setSelectedUser] = useState(null);
	const [actionLoading, setActionLoading] = useState("");
	const [actionError, setActionError] = useState("");
	const [deleteConfirm, setDeleteConfirm] = useState(null);

	// Fetch users from API
	useEffect(() => {
		if (activeTab !== "users") return;
		setLoading(true);
		setError("");
		fetch("/api/admin/users", { credentials: "include" })
			.then(async (res) => {
				if (!res.ok) throw new Error("Failed to fetch users");
				const data = await res.json();
				setUsers(data.users || []);
			})
			.catch((err) => setError(err.message || "Failed to fetch users"))
			.finally(() => setLoading(false));
	}, [activeTab]);

	// Fetch listings (only pending)
	useEffect(() => {
		if (activeTab !== "listings") return;
		setLoading(true);
		setError("");
		fetch("/api/items?status=pending", { credentials: "include" })
			.then(async (res) => {
				if (!res.ok) throw new Error("Failed to fetch listings");
				const data = await res.json();
				setListings(Array.isArray(data) ? data : []);
			})
			.catch((err) => setError(err.message || "Failed to fetch listings"))
			.finally(() => setLoading(false));
	}, [activeTab]);

	// Fetch orders (swaps)
	useEffect(() => {
		if (activeTab !== "orders") return;
		setLoading(true);
		setError("");
		fetch("/api/swaps", { credentials: "include" })
			.then(async (res) => {
				if (!res.ok) throw new Error("Failed to fetch orders");
				const data = await res.json();
				setOrders(Array.isArray(data.swaps) ? data.swaps : []);
			})
			.catch((err) => setError(err.message || "Failed to fetch orders"))
			.finally(() => setLoading(false));
	}, [activeTab]);

	// Admin actions
	const handleUserAction = async (userId, action) => {
		setActionLoading(userId + action);
		setActionError("");
		try {
			const res = await fetch("/api/admin/users", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ userId, action }),
			});
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Action failed");
			}
			setUsers((prev) =>
				prev.map((u) =>
					u._id === userId
						? { ...u, status: action === "suspend" ? "suspended" : "active" }
						: u
				)
			);
		} catch (err) {
			setActionError(err.message || "Action failed");
		} finally {
			setActionLoading("");
		}
	};

	const handleDeleteUser = async (userId) => {
		setActionLoading(userId + "delete");
		setActionError("");
		try {
			const res = await fetch("/api/admin/users", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ userId }),
			});
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Delete failed");
			}
			setUsers((prev) => prev.filter((u) => u._id !== userId));
			setDeleteConfirm(null);
		} catch (err) {
			setActionError(err.message || "Delete failed");
		} finally {
			setActionLoading("");
		}
	};

	// Listing actions
	const handleApproveListing = async (itemId) => {
		setActionLoading(itemId + "approve");
		setActionError("");
		try {
			const res = await fetch("/api/items", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ itemId }),
			});
			if (!res.ok) throw new Error("Failed to approve listing");
			setListings((prev) => prev.filter((l) => l._id !== itemId));
		} catch (err) {
			setActionError(err.message || "Failed to approve listing");
		} finally {
			setActionLoading("");
		}
	};

	const handleCancelListing = async (itemId) => {
		setActionLoading(itemId + "cancel");
		setActionError("");
		try {
			const res = await fetch(`/api/items/${itemId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ isVisible: false, status: "cancelled" }),
			});
			if (!res.ok) throw new Error("Failed to cancel listing");
			setListings((prev) => prev.filter((l) => l._id !== itemId));
		} catch (err) {
			setActionError(err.message || "Failed to cancel listing");
		} finally {
			setActionLoading("");
		}
	};

	// Order actions
	const handleOrderAction = async (swapId, action) => {
		setActionLoading(swapId + action);
		setActionError("");
		try {
			const res = await fetch("/api/swaps", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ swapId, action }),
			});
			if (!res.ok) throw new Error("Failed to update order");
			setOrders((prev) =>
				prev.map((o) =>
					o._id === swapId
						? {
								...o,
								status:
									action === "accept"
										? "accepted"
										: action === "reject"
										? "rejected"
										: o.status,
						  }
						: o
				)
			);
		} catch (err) {
			setActionError(err.message || "Failed to update order");
		} finally {
			setActionLoading("");
		}
	};

	const tabStyle = (isActive) => `
		px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 ease-in-out
		${
			isActive
				? "bg-gradient-to-r from-orange-100 to-amber-50 text-amber-800 shadow-md transform scale-105"
				: "text-stone-600 hover:text-stone-800 hover:bg-stone-50"
		}
	`;

	const buttonStyle = (variant = "primary") => {
		const variants = {
			primary:
				"bg-gradient-to-r from-stone-100 to-stone-50 text-stone-700 hover:from-stone-200 hover:to-stone-100 border border-stone-200",
			approve:
				"bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 hover:from-emerald-100 hover:to-green-100 border border-emerald-200",
			warning:
				"bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 hover:from-amber-100 hover:to-orange-100 border border-amber-200",
			danger:
				"bg-gradient-to-r from-red-50 to-rose-50 text-red-700 hover:from-red-100 hover:to-rose-100 border border-red-200",
		};
		return `${variants[variant]} px-4 py-2 rounded-2xl text-xs font-medium transition-all duration-300 ease-in-out hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`;
	};

	return (
		<div className="p-4 min-h-screen bg-gradient-to-br via-orange-50 to-amber-50 from-stone-50">
			<div className="mx-auto max-w-7xl">
				{/* Header */}
				<div className="p-8 mb-8 bg-gradient-to-r to-orange-100 rounded-3xl border shadow-lg from-stone-100 border-stone-200">
					<h1 className="mb-2 text-4xl font-bold text-stone-800">
						Admin Panel
					</h1>
					<p className="text-stone-600">Manage your platform with elegance</p>
				</div>

				{/* Tab Navigation */}
				<div className="p-6 mb-8 rounded-2xl border shadow-lg backdrop-blur-sm bg-white/80 border-stone-200">
					<div className="flex flex-wrap gap-4 justify-center">
						<button
							onClick={() => setActiveTab("users")}
							className={tabStyle(activeTab === "users")}
						>
							👥 Manage Users
						</button>
						<button
							onClick={() => setActiveTab("listings")}
							className={tabStyle(activeTab === "listings")}
						>
							📝 Review Listings
						</button>
						<button
							onClick={() => setActiveTab("orders")}
							className={tabStyle(activeTab === "orders")}
						>
							📦 Orders
						</button>
					</div>
				</div>

				{/* Users Tab */}
				{activeTab === "users" && (
					<div className="p-8 rounded-3xl border shadow-lg backdrop-blur-sm bg-white/80 border-stone-200">
						<div className="flex items-center mb-6">
							<div className="flex justify-center items-center mr-3 w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
								<span className="text-sm text-blue-600">👥</span>
							</div>
							<h2 className="text-2xl font-semibold text-stone-800">
								User Management
							</h2>
						</div>

						{loading ? (
							<div className="flex justify-center items-center py-16">
								<div className="w-8 h-8 rounded-full border-4 animate-spin border-stone-200 border-t-amber-400"></div>
								<span className="ml-3 text-stone-600">Loading users...</span>
							</div>
						) : error ? (
							<div className="p-4 text-center text-red-700 bg-red-50 rounded-2xl border border-red-200">
								{error}
							</div>
						) : users.length === 0 ? (
							<div className="py-16 text-center text-stone-500">
								<div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 rounded-full bg-stone-100">
									<span className="text-2xl">🤷</span>
								</div>
								No users found
							</div>
						) : (
							<div className="grid gap-6">
								{users.map((user) => (
									<div
										key={user._id}
										className="p-6 bg-gradient-to-r to-orange-50 rounded-2xl border transition-all duration-300 from-stone-50 border-stone-200 hover:shadow-md"
									>
										<div className="flex justify-between items-center">
											<div className="flex items-center space-x-4">
												<div className="flex overflow-hidden justify-center items-center w-16 h-16 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
													{user.avatar && typeof user.avatar === 'string' ? (
														<Image
															src={user.avatar}
															alt={user.name || user.username || "User Avatar"}
															width={64}
															height={64}
															className="object-cover rounded-full"
															onError={(e) => { e.currentTarget.style.display = 'none'; }}
														/>
													) : (
														<span className="text-2xl text-amber-600">👤</span>
													)}
												</div>
												<div>
													<h3 className="text-lg font-semibold text-stone-800">
														{user.name || user.username}
													</h3>
													<p className="text-sm text-stone-600">{user.email}</p>
													<div className="flex items-center mt-2 space-x-4">
														<span className="text-xs text-stone-500">
															Joined:{" "}
															{user.createdAt
																? new Date(user.createdAt).toLocaleDateString()
																: "-"}
														</span>
														<span className="text-xs text-stone-500">
															Items: {user.itemsListed ?? "-"}
														</span>
														<span className="text-xs text-stone-500">
															Swaps: {user.swapsCompleted ?? "-"}
														</span>
													</div>
													<div className="mt-2">
														<span
															className={`px-3 py-1 text-xs font-medium rounded-full ${
																user.status === "active"
																	? "bg-emerald-100 text-emerald-700"
																	: "bg-red-100 text-red-700"
															}`}
														>
															{user.status}
														</span>
													</div>
												</div>
											</div>
											<div className="flex flex-col space-y-2">
												<button
													onClick={() => setSelectedUser(user)}
													className={buttonStyle("primary")}
													disabled={!!actionLoading}
												>
													View Details
												</button>
												{user.status === "active" ? (
													<button
														onClick={() =>
															handleUserAction(user._id, "suspend")
														}
														className={buttonStyle("warning")}
														disabled={actionLoading === user._id + "suspend"}
													>
														{actionLoading === user._id + "suspend"
															? "Suspending..."
															: "Suspend"}
													</button>
												) : (
													<button
														onClick={() =>
															handleUserAction(user._id, "activate")
														}
														className={buttonStyle("approve")}
														disabled={actionLoading === user._id + "activate"}
													>
														{actionLoading === user._id + "activate"
															? "Activating..."
															: "Activate"}
													</button>
												)}
												<button
													onClick={() => setDeleteConfirm(user)}
													className={buttonStyle("danger")}
													disabled={actionLoading === user._id + "delete"}
												>
													Delete
												</button>
											</div>
										</div>
									</div>
								))}
								{actionError && (
									<div className="p-4 mt-4 text-center text-red-700 bg-red-50 rounded-2xl border border-red-200">
										{actionError}
									</div>
								)}
							</div>
						)}
					</div>
				)}

				{/* Listings Tab */}
				{activeTab === "listings" && (
					<div className="p-8 rounded-3xl border shadow-lg backdrop-blur-sm bg-white/80 border-stone-200">
						<div className="flex items-center mb-6">
							<div className="flex justify-center items-center mr-3 w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
								<span className="text-sm text-green-600">📝</span>
							</div>
							<h2 className="text-2xl font-semibold text-stone-800">
								Pending Listings
							</h2>
						</div>

						{loading ? (
							<div className="flex justify-center items-center py-16">
								<div className="w-8 h-8 rounded-full border-4 animate-spin border-stone-200 border-t-emerald-400"></div>
								<span className="ml-3 text-stone-600">Loading listings...</span>
							</div>
						) : error ? (
							<div className="p-4 text-center text-red-700 bg-red-50 rounded-2xl border border-red-200">
								{error}
							</div>
						) : (
							<div className="grid gap-6">
								{listings.map((item) => (
									<div
										key={item._id}
										className="p-6 bg-gradient-to-r to-green-50 rounded-2xl border transition-all duration-300 from-stone-50 border-stone-200 hover:shadow-md"
									>
										<div className="flex gap-6 justify-between items-start">
											<div className="flex-1">
												<h3 className="mb-2 text-lg font-semibold text-stone-800">{item.title}</h3>
												<div className="flex flex-wrap gap-2 items-center mb-2">
													<span className="px-3 py-1 text-xs font-medium rounded-full bg-stone-100 text-stone-700">{item.category}</span>
													<span className="px-3 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full">Points: {item.pointsValue}</span>
													<span className="px-3 py-1 text-xs font-medium rounded-full bg-stone-100 text-stone-700">Owner: {item.ownerUsername || item.ownerName || 'Unknown'}</span>
												</div>
											<p className="text-sm text-stone-600">{item.description}</p>
										</div>
										<div className="flex ml-6 space-x-3">
											<button onClick={() => handleApproveListing(item._id)} className={buttonStyle("approve")} disabled={actionLoading === item._id + "approve"}>
												{actionLoading === item._id + "approve" ? "Approving..." : "Approve"}
											</button>
											<button onClick={() => handleCancelListing(item._id)} className={buttonStyle("danger")} disabled={actionLoading === item._id + "cancel"}>
												{actionLoading === item._id + "cancel" ? "Rejecting..." : "Reject"}
											</button>
										</div>
									</div>
								</div>
								))}
								{listings.length === 0 && (
									<div className="py-16 text-center text-stone-500">
										<div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 rounded-full bg-stone-100">
											<span className="text-2xl">✅</span>
										</div>
										All listings have been reviewed
									</div>
								)}
							</div>
						)}
						{actionError && (
							<div className="p-4 mt-4 text-center text-red-700 bg-red-50 rounded-2xl border border-red-200">
								{actionError}
							</div>
						)}
					</div>
				)}

				{/* Orders Tab */}
				{activeTab === "orders" && (
					<div className="p-8 rounded-3xl border shadow-lg backdrop-blur-sm bg-white/80 border-stone-200">
						<div className="flex items-center mb-6">
							<div className="flex justify-center items-center mr-3 w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
								<span className="text-sm text-purple-600">📦</span>
							</div>
							<h2 className="text-2xl font-semibold text-stone-800">
								Orders Management
							</h2>
						</div>

						{loading ? (
							<div className="flex justify-center items-center py-16">
								<div className="w-8 h-8 rounded-full border-4 animate-spin border-stone-200 border-t-purple-400"></div>
								<span className="ml-3 text-stone-600">Loading orders...</span>
							</div>
						) : error ? (
							<div className="p-4 text-center text-red-700 bg-red-50 rounded-2xl border border-red-200">
								{error}
							</div>
						) : (
							<div className="grid gap-6">
								{orders.map((order) => (
									<div
										key={order._id}
										className="p-6 bg-gradient-to-r to-purple-50 rounded-2xl border transition-all duration-300 from-stone-50 border-stone-200 hover:shadow-md"
									>
										<div className="flex justify-between items-center">
											<div className="flex-1">
												<h3 className="mb-2 text-lg font-semibold text-stone-800">
													Order for Item: {order.item}
												</h3>
												<div className="flex items-center mb-2 space-x-4">
													<span className="px-3 py-1 text-xs font-medium rounded-full bg-stone-100 text-stone-700">
														{order.type}
													</span>
													<span
														className={`px-3 py-1 text-xs font-medium rounded-full ${
															order.status === "accepted"
																? "bg-emerald-100 text-emerald-700"
																: order.status === "rejected"
																? "bg-red-100 text-red-700"
																: "bg-amber-100 text-amber-700"
														}`}
													>
														{order.status}
													</span>
												</div>
												<p className="text-sm text-stone-600">
													{order.message}
												</p>
											</div>
											<div className="flex ml-6 space-x-3">
												<button
													onClick={() => handleOrderAction(order._id, "accept")}
													className={buttonStyle("approve")}
													disabled={actionLoading === order._id + "accept"}
												>
													{actionLoading === order._id + "accept"
														? "Accepting..."
														: "Accept"}
												</button>
												<button
													onClick={() => handleOrderAction(order._id, "reject")}
													className={buttonStyle("danger")}
													disabled={actionLoading === order._id + "reject"}
												>
													{actionLoading === order._id + "reject"
														? "Rejecting..."
														: "Reject"}
												</button>
											</div>
										</div>
									</div>
								))}
								{orders.length === 0 && (
									<div className="py-16 text-center text-stone-500">
										<div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 rounded-full bg-stone-100">
											<span className="text-2xl">📭</span>
										</div>
										No orders found
									</div>
								)}
							</div>
						)}
						{actionError && (
							<div className="p-4 mt-4 text-center text-red-700 bg-red-50 rounded-2xl border border-red-200">
								{actionError}
							</div>
						)}
					</div>
				)}

				{/* User Detail Modal */}
				{selectedUser && (
					<div className="flex fixed inset-0 z-50 justify-center items-center p-4 backdrop-blur-sm bg-black/20">
						<div className="p-8 w-full max-w-md bg-white rounded-3xl border shadow-2xl border-stone-200">
							<div className="flex justify-between items-start mb-6">
								<div>
									<h3 className="text-2xl font-bold text-stone-800">
										{selectedUser.name || selectedUser.username}
									</h3>
									<p className="text-sm text-stone-600">User Details</p>
								</div>
								<button
									onClick={() => setSelectedUser(null)}
									className="flex justify-center items-center w-8 h-8 rounded-full transition-colors bg-stone-100 text-stone-600 hover:bg-stone-200"
								>
									✕
								</button>
							</div>
							<div className="space-y-6">
								<div className="p-4 bg-gradient-to-r to-orange-50 rounded-2xl from-stone-50">
									<p className="mb-1 text-xs text-stone-500">Email Address</p>
									<p className="font-medium text-stone-800">
										{selectedUser.email}
									</p>
								</div>
								<div className="p-4 bg-gradient-to-r to-orange-50 rounded-2xl from-stone-50">
									<p className="mb-1 text-xs text-stone-500">Member Since</p>
									<p className="font-medium text-stone-800">
										{selectedUser.createdAt
											? new Date(selectedUser.createdAt).toLocaleDateString()
											: "-"}
									</p>
								</div>
								<div className="p-4 bg-gradient-to-r to-orange-50 rounded-2xl from-stone-50">
									<p className="mb-1 text-xs text-stone-500">Account Status</p>
									<span
										className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
											selectedUser.status === "active"
												? "bg-emerald-100 text-emerald-700"
												: "bg-red-100 text-red-700"
										}`}
									>
										{selectedUser.status}
									</span>
								</div>
								<div className="pt-4 space-y-3 border-t border-stone-200">
									{selectedUser.status === "active" ? (
										<button
											className="px-4 py-3 w-full font-medium text-amber-700 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 transition-all duration-300 hover:from-amber-100 hover:to-orange-100"
											onClick={() =>
												handleUserAction(selectedUser._id, "suspend")
											}
											disabled={actionLoading === selectedUser._id + "suspend"}
										>
											{actionLoading === selectedUser._id + "suspend"
												? "Suspending..."
												: "Suspend User"}
										</button>
									) : (
										<button
											className="px-4 py-3 w-full font-medium text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 transition-all duration-300 hover:from-emerald-100 hover:to-green-100"
											onClick={() =>
												handleUserAction(selectedUser._id, "activate")
											}
											disabled={actionLoading === selectedUser._id + "activate"}
										>
											{actionLoading === selectedUser._id + "activate"
												? "Activating..."
												: "Activate User"}
										</button>
									)}
									<button
										className="px-4 py-3 w-full font-medium text-red-700 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl border border-red-200 transition-all duration-300 hover:from-red-100 hover:to-rose-100"
										onClick={() => setDeleteConfirm(selectedUser)}
										disabled={actionLoading === selectedUser._id + "delete"}
									>
										Delete User
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Delete Confirmation Modal */}
				{deleteConfirm && (
					<div className="flex fixed inset-0 z-50 justify-center items-center p-4 backdrop-blur-sm bg-black/20">
						<div className="p-8 w-full max-w-md bg-white rounded-3xl border shadow-2xl border-stone-200">
							<div className="mb-6 text-center">
								<div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full">
									<span className="text-2xl text-red-600">⚠️</span>
								</div>
								<h3 className="mb-2 text-xl font-bold text-stone-800">
									Delete User
								</h3>
								<p className="text-stone-600">
									Are you sure you want to delete{" "}
									<span className="font-semibold text-stone-800">
										{deleteConfirm.name || deleteConfirm.username}
									</span>
									? This action cannot be undone.
								</p>
							</div>
							<div className="flex space-x-4">
								<button
									className="flex-1 py-3 font-medium bg-gradient-to-r rounded-2xl border transition-all duration-300 from-stone-100 to-stone-50 text-stone-700 hover:from-stone-200 hover:to-stone-100 border-stone-200"
									onClick={() => setDeleteConfirm(null)}
									disabled={!!actionLoading}
								>
									Cancel
								</button>
								<button
									className="flex-1 py-3 font-medium text-red-700 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl border border-red-200 transition-all duration-300 hover:from-red-100 hover:to-rose-100"
									onClick={() => handleDeleteUser(deleteConfirm._id)}
									disabled={actionLoading === deleteConfirm._id + "delete"}
								>
									{actionLoading === deleteConfirm._id + "delete"
										? "Deleting..."
										: "Delete"}
								</button>
							</div>
							{actionError && (
								<div className="p-4 mt-4 text-center text-red-700 bg-red-50 rounded-2xl border border-red-200">
									{actionError}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
