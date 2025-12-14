"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProfilePage() {
	const [user, setUser] = useState(null);
	const [form, setForm] = useState({ name: "", avatar: "" });
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState(false);
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");
	const [changingUsername, setChangingUsername] = useState(false);
	const [newUsername, setNewUsername] = useState("");

	useEffect(() => {
		async function fetchUser() {
			setLoading(true);
			try {
				const res = await fetch("/api/auth/me", { credentials: "include" });
				if (res.ok) {
					const data = await res.json();
					setUser(data.user);
					setForm({
						name: data.user.name || "",
						avatar: data.user.avatar || "",
					});
					setNewUsername(data.user.username || "");
					if (!data.user.username) {
						console.log(
							"[Profile] Username not found in user data:",
							data.user
						);
						alert("Username not found");
					}
				} else {
					setUser(null);
				}
			} catch {
				setUser(null);
			} finally {
				setLoading(false);
			}
		}
		fetchUser();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((f) => ({ ...f, [name]: value }));
	};

	const handleAvatarChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => {
			setForm((f) => ({ ...f, avatar: ev.target.result }));
		};
		reader.readAsDataURL(file);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSuccess("");
		setError("");
		setEditing(true);
		try {
			// Only send name and avatar, not username
			const res = await fetch("/api/auth/me", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ name: form.name, avatar: form.avatar }),
			});
			if (res.ok) {
				setSuccess("Profile updated successfully!");
				const data = await res.json();
				setUser(data.user);
			} else {
				const data = await res.json();
				setError(data.error || "Failed to update profile");
			}
		} catch (err) {
			setError("Failed to update profile");
		} finally {
			setEditing(false);
		}
	};

	const handleUsernameChange = async () => {
		setSuccess("");
		setError("");
		setEditing(true);
		try {
			const res = await fetch("/api/auth/me", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					username: newUsername,
					name: user.name,
					avatar: user.avatar,
				}),
			});
			if (res.ok) {
				setSuccess("Username updated successfully!");
				const data = await res.json();
				setUser(data.user);
				setChangingUsername(false);
			} else {
				const data = await res.json();
				setError(data.error || "Failed to update username");
			}
		} catch (err) {
			setError("Failed to update username");
		} finally {
			setEditing(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center gradient-bg">
				<LoadingSpinner text="Loading profile..." />
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center gradient-bg">
				<div className="bg-white rounded-xl shadow-lg p-8 text-center">
					<h2 className="text-2xl font-bold mb-2 text-red-600">
						Not logged in
					</h2>
					<p className="text-stone-600 mb-4">
						Please log in to view your profile.
					</p>
					<a
						href="/login"
						className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
					>
						Go to Login
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center py-12 px-4 pt-40" style={{ background: 'var(--bg-primary)' }}>
			<div className="card w-full max-w-md p-8" style={{
				background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
				backdropFilter: 'blur(20px)',
				border: '1px solid rgba(99, 102, 241, 0.1)',
				boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15)'
			}}>
				<h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
					My Profile
				</h1>
				{!user.username && (
					<div className="bg-red-50 text-red-700 p-4 rounded-xl text-center mb-6 border border-red-200 flex items-center justify-center gap-2">
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
						</svg>
						Username not found
					</div>
				)}
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="flex flex-col items-center mb-6">
						<label htmlFor="avatar-upload" className="cursor-pointer group">
							{form.avatar ? (
								<div className="relative w-24 h-24 mb-3">
									<Image
										src={form.avatar}
										alt="Avatar"
										fill
										className="rounded-full border-4 border-blue-200 shadow-lg object-cover group-hover:opacity-80 transition-opacity"
										sizes="96px"
									/>
								</div>
							) : (
								<div className="w-24 h-24 rounded-full border-4 border-blue-200 shadow-lg mb-3 flex items-center justify-center bg-gray-100">
									<svg
										className="w-10 h-10 text-gray-400"
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
							<input
								id="avatar-upload"
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleAvatarChange}
								disabled={editing}
							/>
							<span className="block text-sm text-blue-600 hover:underline cursor-pointer font-medium">
								Change Avatar
							</span>
						</label>
					</div>
					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700">
							Username
						</label>
						{!changingUsername ? (
							<div className="flex items-center gap-3">
								<span className="font-mono px-4 py-2 bg-gray-100 rounded-lg text-gray-700 border border-gray-200">
									{user.username}
								</span>
								<button
									type="button"
									className="text-sm text-blue-600 hover:underline font-medium"
									onClick={() => setChangingUsername(true)}
								>
									Change
								</button>
							</div>
						) : (
							<div className="flex gap-2 items-center">
								<input
									type="text"
									value={newUsername}
									onChange={(e) => setNewUsername(e.target.value)}
									className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
									minLength={2}
									required
									disabled={editing}
								/>
								<button
									type="button"
									className="text-sm text-green-600 hover:underline font-medium px-3 py-2"
									disabled={editing}
									onClick={handleUsernameChange}
								>
									Save
								</button>
								<button
									type="button"
									className="text-sm text-gray-600 hover:underline font-medium px-3 py-2"
									onClick={() => setChangingUsername(false)}
									disabled={editing}
								>
									Cancel
								</button>
							</div>
						)}
					</div>
					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700">
							Name
						</label>
						<input
							type="text"
							name="name"
							value={form.name}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							minLength={2}
							required
							disabled={editing}
						/>
					</div>
					{success && (
						<div className="bg-green-50 text-green-700 p-4 rounded-lg text-center border border-green-200">
							{success}
						</div>
					)}
					{error && (
						<div className="bg-red-50 text-red-700 p-4 rounded-lg text-center border border-red-200">
							{error}
						</div>
					)}
					<button
						type="submit"
						className="w-full px-6 py-3.5 font-semibold text-base rounded-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						style={{
							background: editing ? 'rgba(99, 102, 241, 0.5)' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
							color: 'white',
							border: 'none',
							boxShadow: editing ? 'none' : '0 8px 24px rgba(99, 102, 241, 0.3)'
						}}
						disabled={editing}
					>
						{editing ? "Saving..." : "Save Changes"}
					</button>
				</form>
			</div>
		</div>
	);
}
