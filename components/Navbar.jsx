"use client";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

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
		<nav className="fixed top-0 left-0 w-full z-50 h-14 bg-gradient-to-r from-blue-100 via-white to-blue-200 backdrop-blur-md border-b border-blue-100 shadow-sm transition-all duration-300">
			<div className="container mx-auto px-4 lg:px-8">
				<div className="flex justify-between items-center h-14">
					<Link href="/" className="flex items-center gap-2">
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 font-bold text-xl">
							ReWear
						</span>
					</Link>

					<div className="hidden md:flex items-center gap-6">
						<ul className="flex items-center gap-4">
							{navLinks.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className={`px-3 py-1 rounded-md transition duration-200 font-medium text-sm ${
											pathname === link.href
												? "text-blue-700 bg-white/30"
												: "text-blue-900 hover:bg-white/20 hover:text-blue-700"
										}`}
									>
										{link.name}
									</Link>
								</li>
							))}
							{user && user.role === "admin" && (
								<li>
									<Link
										href="/admin"
										className={`px-3 py-1 rounded-md transition duration-200 font-medium text-sm ${
											pathname === "/admin"
												? "text-blue-700 bg-white/30"
												: "text-blue-900 hover:bg-white/20 hover:text-blue-700"
										}`}
									>
										Admin
									</Link>
								</li>
							)}
						</ul>

						{user ? (
							<div className="flex items-center gap-3 ml-2">
								<button
									onClick={() => router.push("/profile")}
									className={`relative w-8 h-8 rounded-full border border-blue-200 flex items-center justify-center transition duration-200 hover:scale-105 hover:border-blue-300 ${
										pathname === "/profile" ? "ring-2 ring-blue-300/50" : ""
									}`}
									title="Profile"
								>
									{user.avatar ? (
										<Image
											src={user.avatar}
											alt={user.username || "User"}
											width={32}
											height={32}
											className="rounded-full object-cover"
										/>
									) : (
										<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
											<svg
												className="w-4 h-4"
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
								<div className="flex flex-col text-xs text-blue-900">
									<span>{user.username || user.name || user.email}</span>
									{user.email && (user.username || user.name) && (
										<span className="text-blue-600">{user.email}</span>
									)}
								</div>
								<button
									onClick={handleLogout}
									className="px-3 py-1 text-sm rounded-md bg-white/30 text-blue-700 hover:bg-white/40 transition"
								>
									Logout
								</button>
							</div>
						) : (
							<Link
								href="/login"
								className={`px-3 py-1 rounded-md transition duration-200 font-medium text-sm ${
									pathname === "/login"
										? "text-blue-700 bg-white/30"
										: "text-blue-900 hover:bg-white/20 hover:text-blue-700"
								}`}
							>
								Login
							</Link>
						)}
					</div>

					{/* Mobile Button */}
					<button
						className="mobile-menu-button p-2 text-blue-800 rounded-md transition duration-200 md:hidden hover:bg-white/20 hover:text-blue-700"
						aria-label="Toggle menu"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							{mobileMenuOpen ? (
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							) : (
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							)}
						</svg>
					</button>
				</div>
			</div>

			{/* Mobile Menu Drawer */}
			{mobileMenuOpen && (
				<div className="mobile-menu fixed inset-0 z-40 md:hidden">
					<div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
					<div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-blue-50 via-white to-blue-100 border-l border-blue-100 shadow-xl p-4 flex flex-col">
						<div className="flex justify-between items-center mb-4">
							<span className="text-xl font-bold text-blue-800">ReWear</span>
							<button
								onClick={() => setMobileMenuOpen(false)}
								className="p-2 rounded-full hover:bg-blue-100"
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						<ul className="space-y-2 flex-1 overflow-y-auto">
							{navLinks.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										onClick={() => setMobileMenuOpen(false)}
										className={`block px-4 py-2 rounded-md text-sm font-medium transition ${
											pathname === link.href
												? "bg-white/40 text-blue-800"
												: "text-blue-700 hover:bg-white/30"
										}`}
									>
										{link.name}
									</Link>
								</li>
							))}
							{user && user.role === "admin" && (
								<li>
									<Link
										href="/admin"
										onClick={() => setMobileMenuOpen(false)}
										className={`block px-4 py-2 rounded-md text-sm font-medium transition ${
											pathname === "/admin"
												? "bg-white/40 text-blue-800"
												: "text-blue-700 hover:bg-white/30"
										}`}
									>
										Admin
									</Link>
								</li>
							)}
						</ul>

						<div className="pt-4 border-t border-blue-100">
							{user ? (
								<>
									<div className="flex items-center gap-3 mb-3">
										{user.avatar ? (
											<Image
												src={user.avatar}
												alt="User"
												width={32}
												height={32}
												className="rounded-full object-cover"
											/>
										) : (
											<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
												<svg
													className="w-4 h-4"
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
										<div className="text-sm text-blue-900">
											{user.username || user.name || user.email}
										</div>
									</div>
									<button
										onClick={() => {
											setMobileMenuOpen(false);
											handleLogout();
										}}
										className="w-full px-3 py-2 text-sm text-blue-700 bg-white/30 rounded-md hover:bg-white/40 transition"
									>
										Logout
									</button>
								</>
							) : (
								<Link
									href="/login"
									onClick={() => setMobileMenuOpen(false)}
									className={`block w-full text-center px-4 py-2 rounded-md text-sm font-medium transition ${
										pathname === "/login"
											? "bg-white/40 text-blue-800"
											: "text-blue-700 hover:bg-white/30"
									}`}
								>
									Login
								</Link>
							)}
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
