"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPanel() {
	const [activeTab, setActiveTab] = useState("users");
	const [users, setUsers] = useState([]);
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
			// Refresh users
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

	// UI
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

				{/* Tab Navigation */}
				<div className="border-b border-gray-200 mb-8">
					<nav className="flex space-x-8">
						<button
							onClick={() => setActiveTab("users")}
							className={`py-4 px-1 font-medium text-sm border-b-2 ${
								activeTab === "users"
									? "border-black text-black"
									: "border-transparent text-gray-500 hover:text-gray-700"
							}`}
						>
							Manage Users
						</button>
						<button
							onClick={() => setActiveTab("listings")}
							className={`py-4 px-1 font-medium text-sm border-b-2 ${
								activeTab === "listings"
									? "border-black text-black"
									: "border-transparent text-gray-500 hover:text-gray-700"
							}`}
						>
							Manage Listings
						</button>
						<button
							onClick={() => setActiveTab("orders")}
							className={`py-4 px-1 font-medium text-sm border-b-2 ${
								activeTab === "orders"
									? "border-black text-black"
									: "border-transparent text-gray-500 hover:text-gray-700"
							}`}
						>
							Manage Orders
						</button>
					</nav>
				</div>

				{/* Users Tab - Card/List Layout */}
				{activeTab === "users" && (
					<div className="bg-white shadow rounded-lg p-6">
						<h2 className="text-xl font-semibold mb-4">Manage Users</h2>
						{loading ? (
							<div className="text-center py-8 text-gray-500">
								Loading users...
							</div>
						) : error ? (
							<div className="text-center py-8 text-red-600">{error}</div>
						) : users.length === 0 ? (
							<div className="text-center py-8 text-gray-500">
								No users found.
							</div>
						) : (
							<div className="space-y-6">
								{users.map((user) => (
									<div
										key={user._id}
										className="flex items-center bg-gray-50 rounded-lg p-4 shadow-sm"
									>
										{/* Avatar */}
										<div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
											{user.avatar ? (
												<img
													src={user.avatar}
													alt={user.name || user.username}
													className="w-full h-full object-cover"
												/>
											) : (
												<span className="text-2xl text-gray-400">👤</span>
											)}
										</div>
										{/* Details */}
										<div className="flex-1 ml-6">
											<div className="font-semibold text-lg text-gray-900">
												{user.name || user.username}
											</div>
											<div className="text-gray-500 text-sm">{user.email}</div>
											<div className="text-xs text-gray-400">
												Joined:{" "}
												{user.createdAt
													? new Date(user.createdAt).toLocaleDateString()
													: "-"}
											</div>
											<div className="text-xs text-gray-500 mt-1">
												Listed: {user.itemsListed ?? "-"} | Swaps:{" "}
												{user.swapsCompleted ?? "-"}
											</div>
											<div className="mt-1">
												<span
													className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
														user.status === "active"
															? "bg-green-100 text-green-800"
															: "bg-red-100 text-red-800"
													}`}
												>
													{user.status}
												</span>
											</div>
										</div>
										{/* Actions */}
										<div className="flex flex-col gap-2 ml-6">
											<button
												onClick={() => setSelectedUser(user)}
												className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition text-sm"
												disabled={!!actionLoading}
											>
												View
											</button>
											{user.status === "active" ? (
												<button
													onClick={() => handleUserAction(user._id, "suspend")}
													className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition text-sm"
													disabled={actionLoading === user._id + "suspend"}
												>
													{actionLoading === user._id + "suspend"
														? "Suspending..."
														: "Suspend"}
												</button>
											) : (
												<button
													onClick={() => handleUserAction(user._id, "activate")}
													className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition text-sm"
													disabled={actionLoading === user._id + "activate"}
												>
													{actionLoading === user._id + "activate"
														? "Activating..."
														: "Activate"}
												</button>
											)}
											<button
												onClick={() => setDeleteConfirm(user)}
												className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition text-sm"
												disabled={actionLoading === user._id + "delete"}
											>
												Delete
											</button>
										</div>
									</div>
								))}
								{actionError && (
									<div className="text-center text-red-600 mt-4">
										{actionError}
									</div>
								)}
							</div>
						)}
					</div>
				)}

				{/* Listings Tab */}
				{activeTab === "listings" && (
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Listings Management</h2>
						<p className="text-gray-500">
							Listing management content goes here...
						</p>
					</div>
				)}

				{/* Orders Tab */}
				{activeTab === "orders" && (
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Orders Management</h2>
						<p className="text-gray-500">
							Order management content goes here...
						</p>
					</div>
				)}

				{/* User Detail Modal */}
				{selectedUser && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
						<div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
							<div className="flex justify-between items-start mb-4">
								<h3 className="text-lg font-bold">
									{selectedUser.name || selectedUser.username}
								</h3>
								<button
									onClick={() => setSelectedUser(null)}
									className="text-gray-400 hover:text-gray-500"
								>
									✕
								</button>
							</div>
							<div className="space-y-4">
								<div>
									<p className="text-sm text-gray-500">Email</p>
									<p className="text-black">{selectedUser.email}</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">Member Since</p>
									<p className="text-black">
										{selectedUser.createdAt
											? new Date(selectedUser.createdAt).toLocaleDateString()
											: "-"}
									</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">Status</p>
									<p
										className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${
											selectedUser.status === "active"
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{selectedUser.status}
									</p>
								</div>
								<div className="pt-4 border-t border-gray-200">
									{selectedUser.status === "active" ? (
										<button
											className="w-full bg-yellow-100 text-yellow-700 py-2 px-4 rounded hover:bg-yellow-200"
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
											className="w-full bg-green-100 text-green-700 py-2 px-4 rounded hover:bg-green-200"
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
								</div>
								<div>
									<button
										className="w-full bg-red-100 text-red-700 py-2 px-4 rounded hover:bg-red-200"
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
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
						<div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
							<h3 className="text-lg font-bold mb-4">Delete User</h3>
							<p className="mb-6">
								Are you sure you want to delete{" "}
								<span className="font-semibold">
									{deleteConfirm.name || deleteConfirm.username}
								</span>
								? This action cannot be undone.
							</p>
							<div className="flex gap-4">
								<button
									className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
									onClick={() => setDeleteConfirm(null)}
									disabled={!!actionLoading}
								>
									Cancel
								</button>
								<button
									className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
									onClick={() => handleDeleteUser(deleteConfirm._id)}
									disabled={actionLoading === deleteConfirm._id + "delete"}
								>
									{actionLoading === deleteConfirm._id + "delete"
										? "Deleting..."
										: "Delete"}
								</button>
							</div>
							{actionError && (
								<div className="text-center text-red-600 mt-4">
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
