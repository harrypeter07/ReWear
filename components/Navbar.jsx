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
			className="flex items-center justify-between p-4 shadow sticky top-0 z-50 bg-[var(--surface)]"
			style={{ color: "var(--foreground)" }}
		>
			{/* Logo */}
			<Link
				href="/"
				className="font-bold text-xl hover:opacity-90 transition-opacity"
				style={{ color: "var(--foreground)", opacity: 0.9 }}
			>
				ReWear
			</Link>

			{/* Desktop Navigation */}
			<ul className="hidden md:flex gap-6 items-center">
				{navLinks.map((link) => (
					<li key={link.name}>
						<Link
							href={link.href}
							className={`hover:underline transition-all ${
								pathname === link.href
									? "opacity-100 font-medium"
									: "opacity-70"
							}`}
							style={{ color: "var(--foreground)" }}
						>
							{link.name}
						</Link>
					</li>
				))}
				{user ? (
					<li className="flex items-center gap-2 ml-4">
						<img
							src={user.avatar || "/images/default-avatar.png"}
							alt={user.username || user.name || "User"}
							className="w-8 h-8 rounded-full border"
						/>
						<span className="font-medium">
							{user.username || user.name || user.email}
						</span>
						{user.email && (user.username || user.name) && (
							<span className="text-xs text-gray-500">{user.email}</span>
						)}
						<button
							onClick={handleLogout}
							className="ml-4 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
						>
							Logout
						</button>
					</li>
				) : (
					<li>
						<Link
							href="/login"
							className={`hover:underline transition-all ${
								pathname === "/login" ? "opacity-100 font-medium" : "opacity-70"
							}`}
							style={{ color: "var(--foreground)" }}
						>
							Login
						</Link>
					</li>
				)}
			</ul>

			{/* Mobile Menu Button */}
			<button
				className="md:hidden p-1"
				aria-label="Toggle menu"
				style={{ color: "var(--foreground)", opacity: 0.7 }}
				onClick={() => setMobileMenuOpen((open) => !open)}
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
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>

			{/* Mobile Navigation Drawer */}
			{mobileMenuOpen && (
				<div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end md:hidden">
					<div className="w-2/3 max-w-xs bg-[var(--surface)] h-full shadow-lg p-6 flex flex-col gap-6">
						<button
							className="self-end mb-4"
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
										className={`hover:underline transition-all block py-2 ${
											pathname === link.href
												? "opacity-100 font-medium"
												: "opacity-70"
										}`}
										style={{ color: "var(--foreground)" }}
										onClick={() => setMobileMenuOpen(false)}
									>
										{link.name}
									</Link>
								</li>
							))}
							{user ? (
								<li className="flex items-center gap-2 mt-4">
									<img
										src={user.avatar || "/images/default-avatar.png"}
										alt={user.username || user.name || "User"}
										className="w-8 h-8 rounded-full border"
									/>
									<span className="font-medium">
										{user.username || user.name || user.email}
									</span>
									<button
										onClick={() => {
											setMobileMenuOpen(false);
											handleLogout();
										}}
										className="ml-2 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
									>
										Logout
									</button>
								</li>
							) : (
								<li>
									<Link
										href="/login"
										className={`hover:underline transition-all block py-2 ${
											pathname === "/login"
												? "opacity-100 font-medium"
												: "opacity-70"
										}`}
										style={{ color: "var(--foreground)" }}
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
