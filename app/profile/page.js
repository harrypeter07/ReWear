"use client";
import { useEffect, useState } from "react";
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
		<div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4">
			<div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
				<h1 className="text-2xl font-bold mb-6 text-center text-blue-800">
					My Profile
				</h1>
				{!user.username && (
					<div className="bg-red-100 text-red-700 p-2 rounded text-center mb-4">
						Username not found
					</div>
				)}
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="flex flex-col items-center">
						<label htmlFor="avatar-upload" className="cursor-pointer group">
							{form.avatar ? (
								<img
									src={form.avatar}
									alt="Avatar"
									className="w-24 h-24 rounded-full border-4 border-blue-200 shadow mb-2 object-cover group-hover:opacity-80"
								/>
							) : (
								<div className="w-24 h-24 rounded-full border-4 border-blue-200 shadow mb-2 flex items-center justify-center bg-gray-100">
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
							<span className="block text-xs text-blue-600 hover:underline cursor-pointer">
								Change Avatar
							</span>
						</label>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Username
						</label>
						{!changingUsername ? (
							<div className="flex items-center gap-2">
								<span className="font-mono px-2 py-1 bg-gray-100 rounded text-gray-700">
									{user.username}
								</span>
								<button
									type="button"
									className="text-xs text-blue-600 hover:underline ml-2"
									onClick={() => setChangingUsername(true)}
								>
									Change
								</button>
							</div>
						) : (
							<div className="flex gap-2 items-center mt-2">
								<input
									type="text"
									value={newUsername}
									onChange={(e) => setNewUsername(e.target.value)}
									className="border rounded px-2 py-1 text-sm"
									minLength={2}
									required
									disabled={editing}
								/>
								<button
									type="button"
									className="text-xs text-green-600 hover:underline"
									disabled={editing}
									onClick={handleUsernameChange}
								>
									Save
								</button>
								<button
									type="button"
									className="text-xs text-gray-400 hover:underline"
									onClick={() => setChangingUsername(false)}
									disabled={editing}
								>
									Cancel
								</button>
							</div>
						)}
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Name
						</label>
						<input
							type="text"
							name="name"
							value={form.name}
							onChange={handleChange}
							className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
							minLength={2}
							required
							disabled={editing}
						/>
					</div>
					{success && (
						<div className="bg-green-100 text-green-700 p-2 rounded text-center">
							{success}
						</div>
					)}
					{error && (
						<div className="bg-red-100 text-red-700 p-2 rounded text-center">
							{error}
						</div>
					)}
					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
						disabled={editing}
					>
						{editing ? "Saving..." : "Save Changes"}
					</button>
				</form>
			</div>
		</div>
	);
}
