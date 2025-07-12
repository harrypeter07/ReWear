"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
	const [user, setUser] = useState(null);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const dropdownRef = useRef(null);
	const pathname = usePathname();
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

	const navLinks = [
		{ name: "Home", href: "/" },
		{ name: "Browse", href: "/items" },
		{ name: "Dashboard", href: "/dashboard" },
		{ name: "Admin", href: "/admin" },
	];

	return (
		<nav
			className="flex items-center justify-between p-4 shadow sticky top-0 z-50 bg-[var(--surface)]/80 backdrop-blur border-b border-gray-200"
			style={{ color: "var(--foreground)" }}
		>
			{/* Logo */}
			<Link
				href="/"
				className="font-extrabold text-2xl tracking-tight hover:opacity-90 transition-opacity flex items-center gap-2"
				style={{ color: "var(--foreground)", opacity: 0.95 }}
			>
				<span className="inline-block bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
					ReWear
				</span>
			</Link>

			{/* Desktop Navigation */}
			<ul className="hidden md:flex gap-8 items-center">
				{navLinks.map((link) => (
					<li key={link.name}>
						<Link
							href={link.href}
							className={`px-2 py-1 rounded-lg hover:bg-gray-100/80 transition-all ${
								pathname === link.href
									? "font-semibold text-blue-600"
									: "text-gray-700"
							}`}
						>
							{link.name}
						</Link>
					</li>
				))}
				{user ? (
					<li className="flex items-center gap-3 ml-6">
						<img
							src={user.avatar || "/images/default-avatar.png"}
							alt={user.username || user.name || "User"}
							className="w-9 h-9 rounded-full border-2 border-blue-400 shadow"
						/>
						<div className="flex flex-col">
							<span className="font-medium text-sm">
								{user.username || user.name || user.email}
							</span>
							{user.email && (user.username || user.name) && (
								<span className="text-xs text-gray-400">{user.email}</span>
							)}
						</div>
						<button
							onClick={handleLogout}
							className="ml-4 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition text-sm shadow"
						>
							Logout
						</button>
					</li>
				) : (
					<li>
						<Link
							href="/login"
							className={`px-3 py-1 rounded-lg hover:bg-blue-50 transition-all ${
								pathname === "/login"
									? "font-semibold text-blue-600"
									: "text-gray-700"
							}`}
						>
							Login
						</Link>
					</li>
				)}
			</ul>

			{/* Mobile Menu Button */}
			<button
				className="md:hidden p-2 rounded-full hover:bg-gray-100/80 transition"
				aria-label="Toggle menu"
				style={{ color: "var(--foreground)", opacity: 0.7 }}
				onClick={() => setMobileMenuOpen((open) => !open)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-7 w-7"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>

			{/* Mobile Navigation Drawer */}
			{mobileMenuOpen && (
				<div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end md:hidden">
					<div className="w-2/3 max-w-xs bg-white/90 h-full shadow-xl p-6 flex flex-col gap-6 rounded-l-2xl border-l border-gray-200">
						<button
							className="self-end mb-4 p-2 rounded-full hover:bg-gray-100"
							aria-label="Close menu"
							onClick={() => setMobileMenuOpen(false)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
						<ul className="flex flex-col gap-4">
							{navLinks.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className={`block px-3 py-2 rounded-lg hover:bg-blue-50 transition-all ${
											pathname === link.href
												? "font-semibold text-blue-600"
												: "text-gray-700"
										}`}
										onClick={() => setMobileMenuOpen(false)}
									>
										{link.name}
									</Link>
								</li>
							))}
							{user ? (
								<li className="flex items-center gap-3 mt-6">
									<img
										src={user.avatar || "/images/default-avatar.png"}
										alt={user.username || user.name || "User"}
										className="w-9 h-9 rounded-full border-2 border-blue-400 shadow"
									/>
									<div className="flex flex-col">
										<span className="font-medium text-sm">
											{user.username || user.name || user.email}
										</span>
										{user.email && (user.username || user.name) && (
											<span className="text-xs text-gray-400">
												{user.email}
											</span>
										)}
									</div>
									<button
										onClick={() => {
											setMobileMenuOpen(false);
											handleLogout();
										}}
										className="ml-2 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition text-sm shadow"
									>
										Logout
									</button>
								</li>
							) : (
								<li>
									<Link
										href="/login"
										className={`block px-3 py-2 rounded-lg hover:bg-blue-50 transition-all ${
											pathname === "/login"
												? "font-semibold text-blue-600"
												: "text-gray-700"
										}`}
										onClick={() => setMobileMenuOpen(false)}
									>
										Login
									</Link>
								</li>
							)}
						</ul>
					</div>
				</div>
			)}
		</nav>
	);
}
