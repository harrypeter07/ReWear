"use client";
import { useEffect, useState, useRef } from "react";

import Link from "next/link";
import UserCard from "./UserCard";
import { useRouter } from "next/navigation";

export default function Navbar() {
	const [user, setUser] = useState(null);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);
	const router = useRouter();

	useEffect(() => {
		async function fetchUser() {
			try {
				const res = await fetch("/api/auth/me", { credentials: "include" });
				if (res.ok) {
					const data = await res.json();
					setUser(data.user);
				} else {
					setUser(null);
				}
			} catch {
				setUser(null);
			}
		}
		fetchUser();
	}, []);

	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setDropdownOpen(false);
			}
		}
		if (dropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [dropdownOpen]);

	const handleLogout = async () => {
		await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
		setUser(null);
		router.push("/login");
	};

	return (
		<nav
			className="flex items-center justify-between p-4 shadow"
			style={{ background: "var(--surface)", color: "var(--foreground)" }}
		>
			<div
				className="font-bold text-xl"
				style={{ color: "var(--foreground)", opacity: 0.9 }}
			>
				<Link href="/">ReWear</Link>
			</div>
			<ul className="flex gap-4 items-center">
				<li>
					<Link
						href="/"
						className="hover:underline"
						style={{ color: "var(--foreground)", opacity: 0.7 }}
					>
						Home
					</Link>
				</li>
				<li>
					<Link
						href="/items"
						className="hover:underline"
						style={{ color: "var(--foreground)", opacity: 0.7 }}
					>
						Browse
					</Link>
				</li>
				<li>
					<Link
						href="/dashboard"
						className="hover:underline"
						style={{ color: "var(--foreground)", opacity: 0.7 }}
					>
						Dashboard
					</Link>
				</li>
				<li>
					<Link
						href="/admin"
						className="hover:underline"
						style={{ color: "var(--foreground)", opacity: 0.7 }}
					>
						Admin
					</Link>
				</li>
				{user ? (
					<>
						<li className="flex items-center gap-2">
							<img
								src={user.avatar || "/images/default-avatar.png"}
								alt={user.username || user.name || "User"}
								className="w-8 h-8 rounded-full border"
							/>
							<span className="font-medium">
								{user.username || user.name || user.email}
							</span>
							<span className="text-xs text-gray-500">{user.email}</span>
							<button
								onClick={handleLogout}
								className="ml-4 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
							>
								Logout
							</button>
						</li>
					</>
				) : (
					<li>
						<Link
							href="/login"
							className="hover:underline"
							style={{ color: "var(--foreground)", opacity: 0.7 }}
						>
							Login
						</Link>
					</li>
				)}
			</ul>
		</nav>
	);
}
