"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AlertCircle, Users, FileText, Package, Loader2, Shield, X } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import useSWR from "swr";

const fetcher = (url) => fetch(url, { credentials: "include" }).then(res => res.json());

export default function AdminPanel() {
	const { user: currentUser } = useUser();
	const [activeTab, setActiveTab] = useState("users");
	const [isAdminVerified, setIsAdminVerified] = useState(false);
	const [checkingAdmin, setCheckingAdmin] = useState(true);
	const [adminCode, setAdminCode] = useState("");
	const [adminCodeError, setAdminCodeError] = useState("");
	const [adminSubmitting, setAdminSubmitting] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [deleteConfirm, setDeleteConfirm] = useState(null);
	const [actionLoading, setActionLoading] = useState("");
	const [actionError, setActionError] = useState("");

	// Check admin access
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				setCheckingAdmin(true);
				const res = await fetch("/api/admin/users", { credentials: "include" });
				if (!cancelled) setIsAdminVerified(res.ok);
			} catch (_) {
				if (!cancelled) setIsAdminVerified(false);
			} finally {
				if (!cancelled) setCheckingAdmin(false);
			}
		})();
		return () => { cancelled = true; };
	}, []);

	// Fetch data with SWR
	const { data: usersData, mutate: mutateUsers } = useSWR(
		isAdminVerified && activeTab === "users" ? "/api/admin/users" : null,
		fetcher
	);
	const { data: listingsData, mutate: mutateListings } = useSWR(
		isAdminVerified && activeTab === "listings" ? "/api/items?status=pending" : null,
		fetcher
	);
	const { data: ordersData, mutate: mutateOrders } = useSWR(
		isAdminVerified && activeTab === "orders" ? "/api/swaps" : null,
		fetcher
	);

	const users = usersData?.users || [];
	const listings = Array.isArray(listingsData) ? listingsData : [];
	const orders = Array.isArray(ordersData?.swaps) ? ordersData.swaps : (Array.isArray(ordersData) ? ordersData : []);

	const submitAdminCode = async (e) => {
		e.preventDefault();
		setAdminCodeError("");
		setAdminSubmitting(true);
		try {
			const res = await fetch('/api/auth/admin-code', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ code: adminCode }),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				setAdminCodeError(data.message || 'Invalid code');
				return;
			}
			try {
				await fetch('/api/auth/admin-login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({ code: adminCode }),
				});
			} catch (_) {}
			setIsAdminVerified(true);
		} catch (err) {
			setAdminCodeError('Something went wrong');
		} finally {
			setAdminSubmitting(false);
		}
	};

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
			await mutateUsers();
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
			await mutateUsers();
			setDeleteConfirm(null);
		} catch (err) {
			setActionError(err.message || "Delete failed");
		} finally {
			setActionLoading("");
		}
	};

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
			await mutateListings();
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
			await mutateListings();
		} catch (err) {
			setActionError(err.message || "Failed to cancel listing");
		} finally {
			setActionLoading("");
		}
	};

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
			await mutateOrders();
		} catch (err) {
			setActionError(err.message || "Failed to update order");
		} finally {
			setActionLoading("");
		}
	};

	// Admin code gate
	if (!isAdminVerified) {
		return (
			<div className="min-h-screen flex items-center justify-center p-4 pt-40 pb-12 bg-gradient-to-br from-slate-50 to-slate-100">
				<div className="w-full max-w-[420px] mx-auto">
					<Card className="shadow-xl">
						<CardHeader className="text-center">
							<div className="flex justify-center mb-4">
								<Shield className="h-12 w-12 text-primary" />
							</div>
							<CardTitle className="text-3xl sm:text-4xl">Admin Panel</CardTitle>
							<CardDescription className="text-base">Enter admin access code to continue</CardDescription>
						</CardHeader>
						<CardContent>
							{adminCodeError && (
								<Alert variant="destructive" className="mb-6">
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>{adminCodeError}</AlertDescription>
								</Alert>
							)}
							<form onSubmit={submitAdminCode} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="adminCode">Access Code</Label>
									<Input
										id="adminCode"
										type="password"
										placeholder="Enter admin code"
										value={adminCode}
										onChange={(e) => setAdminCode(e.target.value)}
										required
									/>
								</div>
								<Button type="submit" disabled={adminSubmitting || checkingAdmin} className="w-full">
									{adminSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Verifying...
										</>
									) : (
										"Continue"
									)}
								</Button>
							</form>
							<p className="mt-4 text-xs text-center text-muted-foreground">
								Tip: If admin APIs still show 403 after this, re-enter the code.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen pt-40 pb-12 bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="container mx-auto px-4">
				{/* Header */}
				<Card className="mb-8 shadow-lg">
					<CardHeader>
						<CardTitle className="text-4xl font-bold">Admin Panel</CardTitle>
						<CardDescription className="text-lg">Manage your platform with elegance</CardDescription>
					</CardHeader>
				</Card>

				{/* Tabs */}
				<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="users" className="flex items-center gap-2">
							<Users className="h-4 w-4" />
							Manage Users
						</TabsTrigger>
						<TabsTrigger value="listings" className="flex items-center gap-2">
							<FileText className="h-4 w-4" />
							Review Listings
						</TabsTrigger>
						<TabsTrigger value="orders" className="flex items-center gap-2">
							<Package className="h-4 w-4" />
							Orders
						</TabsTrigger>
					</TabsList>

					{actionError && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{actionError}</AlertDescription>
						</Alert>
					)}

					{/* Users Tab */}
					<TabsContent value="users" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Users className="h-5 w-5" />
									User Management
								</CardTitle>
							</CardHeader>
							<CardContent>
								{!usersData ? (
									<div className="flex justify-center items-center py-16">
										<Loader2 className="h-8 w-8 animate-spin text-primary" />
									</div>
								) : users.length === 0 ? (
									<div className="py-16 text-center text-muted-foreground">
										<Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
										<p>No users found</p>
									</div>
								) : (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>User</TableHead>
												<TableHead>Email</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Joined</TableHead>
												<TableHead className="text-right">Actions</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{users.map((user) => (
												<TableRow key={user._id}>
													<TableCell>
														<div className="flex items-center gap-3">
															<Avatar>
																{user.avatar && <AvatarImage src={user.avatar} alt={user.name || user.username} />}
																<AvatarFallback>
																	{(user.name || user.username || 'U')?.slice(0,1).toUpperCase()}
																</AvatarFallback>
															</Avatar>
															<span className="font-medium">{user.name || user.username}</span>
														</div>
													</TableCell>
													<TableCell>{user.email}</TableCell>
													<TableCell>
														<Badge variant={user.status === "active" ? "default" : "destructive"}>
															{user.status || "active"}
														</Badge>
													</TableCell>
													<TableCell>
														{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
													</TableCell>
													<TableCell className="text-right">
														<div className="flex justify-end gap-2">
															<Button
																variant="outline"
																size="sm"
																onClick={() => setSelectedUser(user)}
															>
																View
															</Button>
															{user.status === "active" ? (
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() => handleUserAction(user._id, "suspend")}
																	disabled={actionLoading === user._id + "suspend"}
																>
																	{actionLoading === user._id + "suspend" ? (
																		<Loader2 className="h-4 w-4 animate-spin" />
																	) : (
																		"Suspend"
																	)}
																</Button>
															) : (
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() => handleUserAction(user._id, "activate")}
																	disabled={actionLoading === user._id + "activate"}
																>
																	{actionLoading === user._id + "activate" ? (
																		<Loader2 className="h-4 w-4 animate-spin" />
																	) : (
																		"Activate"
																	)}
																</Button>
															)}
															<Button
																variant="destructive"
																size="sm"
																onClick={() => setDeleteConfirm(user)}
																disabled={actionLoading === user._id + "delete"}
															>
																Delete
															</Button>
														</div>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Listings Tab */}
					<TabsContent value="listings" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<FileText className="h-5 w-5" />
									Pending Listings
								</CardTitle>
							</CardHeader>
							<CardContent>
								{!listingsData ? (
									<div className="flex justify-center items-center py-16">
										<Loader2 className="h-8 w-8 animate-spin text-primary" />
									</div>
								) : listings.length === 0 ? (
									<div className="py-16 text-center text-muted-foreground">
										<FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
										<p>All listings have been reviewed</p>
									</div>
								) : (
									<div className="space-y-4">
										{listings.map((item) => (
											<Card key={item._id}>
												<CardContent className="pt-6">
													<div className="flex justify-between items-start gap-4">
														<div className="flex-1">
															<h3 className="text-lg font-semibold mb-2">{item.title}</h3>
															<div className="flex flex-wrap gap-2 mb-2">
																<Badge>{item.category}</Badge>
																<Badge variant="secondary">Points: {item.pointsValue}</Badge>
																<Badge variant="outline">Owner: {item.ownerUsername || item.ownerName || 'Unknown'}</Badge>
															</div>
															<p className="text-sm text-muted-foreground">{item.description}</p>
														</div>
														<div className="flex gap-2">
															<Button
																variant="default"
																size="sm"
																onClick={() => handleApproveListing(item._id)}
																disabled={actionLoading === item._id + "approve"}
															>
																{actionLoading === item._id + "approve" ? (
																	<Loader2 className="h-4 w-4 animate-spin" />
																) : (
																	"Approve"
																)}
															</Button>
															<Button
																variant="destructive"
																size="sm"
																onClick={() => handleCancelListing(item._id)}
																disabled={actionLoading === item._id + "cancel"}
															>
																{actionLoading === item._id + "cancel" ? (
																	<Loader2 className="h-4 w-4 animate-spin" />
																) : (
																	"Reject"
																)}
															</Button>
														</div>
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Orders Tab */}
					<TabsContent value="orders" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Package className="h-5 w-5" />
									Orders Management
								</CardTitle>
							</CardHeader>
							<CardContent>
								{!ordersData ? (
									<div className="flex justify-center items-center py-16">
										<Loader2 className="h-8 w-8 animate-spin text-primary" />
									</div>
								) : orders.length === 0 ? (
									<div className="py-16 text-center text-muted-foreground">
										<Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
										<p>No orders yet</p>
									</div>
								) : (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Item</TableHead>
												<TableHead>Type</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Message</TableHead>
												<TableHead className="text-right">Actions</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{orders.map((order) => (
												<TableRow key={order._id}>
													<TableCell className="font-medium">{order.item || "N/A"}</TableCell>
													<TableCell>
														<Badge variant="outline">{order.type}</Badge>
													</TableCell>
													<TableCell>
														<Badge
															variant={
																order.status === "accepted"
																	? "default"
																	: order.status === "rejected"
																	? "destructive"
																	: "secondary"
															}
														>
															{order.status}
														</Badge>
													</TableCell>
													<TableCell className="max-w-xs truncate">{order.message}</TableCell>
													<TableCell className="text-right">
														<div className="flex justify-end gap-2">
															<Button
																variant="default"
																size="sm"
																onClick={() => handleOrderAction(order._id, "accept")}
																disabled={actionLoading === order._id + "accept"}
															>
																{actionLoading === order._id + "accept" ? (
																	<Loader2 className="h-4 w-4 animate-spin" />
																) : (
																	"Accept"
																)}
															</Button>
															<Button
																variant="destructive"
																size="sm"
																onClick={() => handleOrderAction(order._id, "reject")}
																disabled={actionLoading === order._id + "reject"}
															>
																{actionLoading === order._id + "reject" ? (
																	<Loader2 className="h-4 w-4 animate-spin" />
																) : (
																	"Reject"
																)}
															</Button>
														</div>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{/* User Detail Dialog */}
				<Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{selectedUser?.name || selectedUser?.username}</DialogTitle>
							<DialogDescription>User Details</DialogDescription>
						</DialogHeader>
						{selectedUser && (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label>Email Address</Label>
									<p className="text-sm font-medium">{selectedUser.email}</p>
								</div>
								<div className="space-y-2">
									<Label>Member Since</Label>
									<p className="text-sm font-medium">
										{selectedUser.createdAt
											? new Date(selectedUser.createdAt).toLocaleDateString()
											: "-"}
									</p>
								</div>
								<div className="space-y-2">
									<Label>Account Status</Label>
									<Badge variant={selectedUser.status === "active" ? "default" : "destructive"}>
										{selectedUser.status || "active"}
									</Badge>
								</div>
								<DialogFooter>
									{selectedUser.status === "active" ? (
										<Button
											variant="outline"
											onClick={() => handleUserAction(selectedUser._id, "suspend")}
											disabled={actionLoading === selectedUser._id + "suspend"}
										>
											{actionLoading === selectedUser._id + "suspend" ? (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											) : null}
											Suspend User
										</Button>
									) : (
										<Button
											variant="default"
											onClick={() => handleUserAction(selectedUser._id, "activate")}
											disabled={actionLoading === selectedUser._id + "activate"}
										>
											{actionLoading === selectedUser._id + "activate" ? (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											) : null}
											Activate User
										</Button>
									)}
									<Button
										variant="destructive"
										onClick={() => {
											setSelectedUser(null);
											setDeleteConfirm(selectedUser);
										}}
									>
										Delete User
									</Button>
								</DialogFooter>
							</div>
						)}
					</DialogContent>
				</Dialog>

				{/* Delete Confirmation Dialog */}
				<Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Delete User</DialogTitle>
							<DialogDescription>
								Are you sure you want to delete{" "}
								<span className="font-semibold">
									{deleteConfirm?.name || deleteConfirm?.username}
								</span>
								? This action cannot be undone.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button variant="outline" onClick={() => setDeleteConfirm(null)}>
								Cancel
							</Button>
							<Button
								variant="destructive"
								onClick={() => deleteConfirm && handleDeleteUser(deleteConfirm._id)}
								disabled={actionLoading === deleteConfirm?._id + "delete"}
							>
								{actionLoading === deleteConfirm?._id + "delete" ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Deleting...
									</>
								) : (
									"Delete"
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
