"use client";
import { useEffect, useState, useRef, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
	const { user, setUser } = useContext(UserContext);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const router = useRouter();

	const handleLogout = async () => {
		await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
		setUser(null);
		router.push("/login");
	};

	const navLinks = [
		{ name: "Home", href: "/" },
		{ name: "Browse", href: "/items" },
		{ name: "Dashboard", href: "/dashboard" },
	];

	// Close mobile menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				mobileMenuOpen &&
				!event.target.closest(".mobile-menu") &&
				!event.target.closest(".mobile-menu-button")
			) {
				setMobileMenuOpen(false);
			}
		};

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, [mobileMenuOpen]);

	return (
		<nav className="fixed top-0 left-0 w-full z-50 gradient-bg backdrop-blur border-b border-black/10 shadow-sm transition-all duration-300">
			<div className="container mx-auto px-4 lg:px-8">
				<div className="flex justify-between items-center py-2">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight"
					>
						<span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
							ReWear
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-8">
						<ul className="flex items-center gap-6">
							{navLinks.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className={`px-3 py-1.5 rounded-lg transition-all duration-200 font-medium text-sm ${
											pathname === link.href
												? "bg-gray-100 text-gray-900 shadow-sm"
												: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
										}`}
									>
										{link.name}
									</Link>
								</li>
							))}
							{/* Admin link only for admin users */}
							{user && user.role === "admin" && (
								<li>
									<Link
										href="/admin"
										className={`px-3 py-1.5 rounded-lg transition-all duration-200 font-medium text-sm ${
											pathname === "/admin"
												? "bg-gray-100 text-gray-900 shadow-sm"
												: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
										}`}
									>
										Admin
									</Link>
								</li>
							)}
						</ul>

						{/* User Section */}
						{user ? (
							<div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
								<button
									onClick={() => router.push("/profile")}
									className={`relative w-8 h-8 rounded-full border border-gray-300 shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-105 hover:border-gray-400 ${
										pathname === "/profile"
											? "ring-2 ring-gray-400 ring-opacity-50"
											: ""
									}`}
									title="Profile"
								>
									{user.avatar ? (
										<img
											src={user.avatar}
											alt={user.username || user.name || "User"}
											className="w-8 h-8 rounded-full object-cover"
										/>
									) : (
										<div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
											<svg
												className="w-4 h-4 text-gray-500"
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
								</button>
								<div className="flex flex-col">
									<span className="text-xs font-medium text-gray-800">
										{user.username || user.name || user.email}
									</span>
									{user.email && (user.username || user.name) && (
										<span className="text-xs text-gray-500">{user.email}</span>
									)}
								</div>
								<button onClick={handleLogout} className="btn">
									Logout
								</button>
							</div>
						) : (
							<Link
								href="/login"
								className={`px-3 py-1.5 rounded-lg transition-all duration-200 font-medium text-sm ${
									pathname === "/login"
										? "bg-gray-100 text-gray-900 shadow-sm"
										: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
								}`}
							>
								Login
							</Link>
						)}
					</div>

					{/* Mobile Menu Button */}
					<button
						className="mobile-menu-button p-2 text-gray-700 rounded-lg transition-all duration-200 md:hidden hover:bg-gray-100 hover:scale-105"
						aria-label="Toggle menu"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-6 h-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							{mobileMenuOpen ? (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							) : (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							)}
						</svg>
					</button>
				</div>
			</div>

			{/* Mobile Navigation Drawer */}
			{mobileMenuOpen && (
				<div className="mobile-menu fixed inset-0 z-50 md:hidden">
					<div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm" />
					<div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white border-l border-gray-200 shadow-2xl">
						<div className="flex flex-col h-full">
							{/* Header */}
							<div className="flex items-center justify-between p-4 border-b border-gray-200">
								<span className="text-lg font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
									ReWear
								</span>
								<button
									className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
									onClick={() => setMobileMenuOpen(false)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-6 h-6"
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
							</div>

							{/* Navigation Links */}
							<div className="flex-1 overflow-y-auto p-4">
								<ul className="space-y-2">
									{navLinks.map((link) => (
										<li key={link.name}>
											<Link
												href={link.href}
												className={`block px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
													pathname === link.href
														? "bg-gray-100 text-gray-900 shadow-sm"
														: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
												}`}
												onClick={() => setMobileMenuOpen(false)}
											>
												{link.name}
											</Link>
										</li>
									))}
									{user && user.role === "admin" && (
										<li>
											<Link
												href="/admin"
												className={`block px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
													pathname === "/admin"
														? "bg-gray-100 text-gray-900 shadow-sm"
														: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
												}`}
												onClick={() => setMobileMenuOpen(false)}
											>
												Admin
											</Link>
										</li>
									)}
								</ul>
							</div>

							{/* User Section */}
							<div className="p-4 border-t border-gray-200 bg-gray-50">
								{user ? (
									<div className="space-y-4">
										{/* User Info */}
										<div className="flex items-center gap-4">
											<button
												onClick={() => {
													router.push("/profile");
													setMobileMenuOpen(false);
												}}
												className={`relative w-8 h-8 rounded-full border border-gray-300 shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-105 hover:border-gray-400 ${
													pathname === "/profile"
														? "ring-2 ring-gray-400 ring-opacity-50"
														: ""
												}`}
												title="Profile"
											>
												{user.avatar ? (
													<img
														src={user.avatar}
														alt={user.username || user.name || "User"}
														className="w-8 h-8 rounded-full object-cover"
													/>
												) : (
													<div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
														<svg
															className="w-4 h-4 text-gray-500"
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
											</button>
											<div className="flex flex-col">
												<span className="text-xs font-medium text-gray-800">
													{user.username || user.name || user.email}
												</span>
												{user.email && (user.username || user.name) && (
													<span className="text-xs text-gray-500">
														{user.email}
													</span>
												)}
											</div>
										</div>

										{/* Logout Button */}
										<button
											onClick={() => {
												setMobileMenuOpen(false);
												handleLogout();
											}}
											className="w-full px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-200 hover:scale-105"
										>
											Logout
										</button>
									</div>
								) : (
									<Link
										href="/login"
										className={`block w-full px-3 py-2 text-center rounded-lg transition-all duration-200 font-medium text-sm ${
											pathname === "/login"
												? "bg-gray-100 text-gray-900 shadow-sm"
												: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
										}`}
										onClick={() => setMobileMenuOpen(false)}
									>
										Login
									</Link>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
