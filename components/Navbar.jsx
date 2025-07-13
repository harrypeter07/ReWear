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

	// Lock body scroll when mobile menu is open
	useEffect(() => {
		if (mobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [mobileMenuOpen]);

	return (
		<nav className="fixed top-0 left-0 w-full z-[9999] h-16 bg-gradient-to-r from-blue-100 via-white to-blue-200 backdrop-blur-md border-b border-blue-100 shadow-sm transition-all duration-300">
			<div className="container mx-auto px-4 lg:px-8 h-full">
				<div className="flex justify-between items-center h-full">
					<Link href="/" className="flex items-center gap-2 flex-shrink-0">
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 font-bold text-xl whitespace-nowrap">
							ReWear
						</span>
					</Link>

					<div className="hidden md:flex items-center gap-6 flex-1 justify-center">
						<ul className="flex items-center gap-4">
							{navLinks.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className={`px-3 py-2 rounded-md transition duration-200 font-medium text-sm whitespace-nowrap ${
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
										className={`px-3 py-2 rounded-md transition duration-200 font-medium text-sm whitespace-nowrap ${
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
					</div>

					<div className="hidden md:flex items-center gap-3 flex-shrink-0">
						{user ? (
							<div className="flex items-center gap-3">
								<button
									onClick={() => router.push("/profile")}
									className={`relative w-8 h-8 rounded-full border border-blue-200 flex items-center justify-center transition duration-200 hover:scale-105 hover:border-blue-300 flex-shrink-0 ${
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
								<div className="flex flex-col text-xs text-blue-900 min-w-0">
									<span className="truncate max-w-[120px]">{user.username || user.name || user.email}</span>
									{user.email && (user.username || user.name) && (
										<span className="text-blue-600 truncate max-w-[120px]">{user.email}</span>
									)}
								</div>
								<button
									onClick={handleLogout}
									className="px-3 py-2 text-sm rounded-md bg-white/30 text-blue-700 hover:bg-white/40 transition whitespace-nowrap flex-shrink-0"
								>
									Logout
								</button>
							</div>
						) : (
							<Link
								href="/login"
								className={`px-3 py-2 rounded-md transition duration-200 font-medium text-sm whitespace-nowrap ${
									pathname === "/login"
										? "text-blue-700 bg-white/30"
										: "text-blue-900 hover:bg-white/20 hover:text-blue-700"
								}`}
							>
								Login
							</Link>
						)}
					</div>

					{/* Mobile User Info - Only show when logged in */}
					{user && (
						<div className="md:hidden flex items-center gap-2 flex-shrink-0 mr-2">
							<button
								onClick={() => router.push("/profile")}
								className={`relative w-7 h-7 rounded-full border border-blue-200 flex items-center justify-center transition duration-200 hover:scale-105 hover:border-blue-300 flex-shrink-0 ${
									pathname === "/profile" ? "ring-2 ring-blue-300/50" : ""
								}`}
								title="Profile"
							>
								{user.avatar ? (
									<Image
										src={user.avatar}
										alt={user.username || "User"}
										width={28}
										height={28}
										className="rounded-full object-cover"
									/>
								) : (
									<div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
										<svg
											className="w-3 h-3"
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
							<div className="text-xs text-blue-900 min-w-0 max-w-[80px]">
								<span className="truncate block">{user.username || user.name || user.email}</span>
							</div>
						</div>
					)}

					{/* Mobile Button */}
					<button
						className="mobile-menu-button p-2 text-blue-800 rounded-md transition duration-200 md:hidden hover:bg-white/20 hover:text-blue-700 flex-shrink-0"
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
				<div className="mobile-menu fixed inset-0 z-[10000] md:hidden">
					<div 
						className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" 
						onClick={() => setMobileMenuOpen(false)}
					/>
					<div className="absolute right-0 top-16 h-[calc(100vh-4rem)] w-64 max-w-[85vw] bg-white border-l border-blue-100 shadow-xl flex flex-col">
						<div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
							<span className="text-lg font-bold text-blue-800">Menu</span>
							<button
								onClick={() => setMobileMenuOpen(false)}
								className="p-1 rounded-full hover:bg-blue-100 flex-shrink-0"
							>
								<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						
						<div className="flex-1 overflow-y-auto p-4">
							<ul className="space-y-1">
								{navLinks.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											onClick={() => setMobileMenuOpen(false)}
											className={`block px-4 py-3 rounded-md text-sm font-medium transition ${
												pathname === link.href
													? "bg-blue-100 text-blue-800"
													: "text-blue-700 hover:bg-blue-50"
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
											className={`block px-4 py-3 rounded-md text-sm font-medium transition ${
												pathname === "/admin"
													? "bg-blue-100 text-blue-800"
													: "text-blue-700 hover:bg-blue-50"
											}`}
										>
											Admin
										</Link>
									</li>
								)}
							</ul>
						</div>

						<div className="p-4 border-t border-blue-100 bg-blue-50">
							{user ? (
								<>
									<div className="flex items-center gap-3 mb-4">
										{user.avatar ? (
											<Image
												src={user.avatar}
												alt="User"
												width={36}
												height={36}
												className="rounded-full object-cover flex-shrink-0"
											/>
										) : (
											<div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
												<svg
													className="w-5 h-5"
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
										<div className="text-sm text-blue-900 min-w-0 flex-1">
											<div className="truncate font-medium">{user.username || user.name || user.email}</div>
											{user.email && (user.username || user.name) && (
												<div className="text-blue-600 truncate text-xs">{user.email}</div>
											)}
										</div>
									</div>
									<button
										onClick={() => {
											setMobileMenuOpen(false);
											handleLogout();
										}}
										className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition font-medium"
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
											? "bg-blue-600 text-white"
											: "text-blue-700 bg-white hover:bg-blue-50"
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