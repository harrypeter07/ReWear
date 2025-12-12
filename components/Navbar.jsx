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
		<nav className="fixed top-0 left-0 w-full z-[9999] h-20 backdrop-blur-xl border-b transition-all duration-300" style={{
			background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
			borderColor: 'rgba(99, 102, 241, 0.1)',
			boxShadow: '0 4px 20px rgba(99, 102, 241, 0.08)'
		}}>
			<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-full">
				<div className="flex justify-between items-center h-full gap-6">
					<Link href="/" className="flex items-center gap-2 flex-shrink-0 group pl-2 sm:pl-0">
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 font-bold text-xl sm:text-2xl whitespace-nowrap transition-all duration-300 group-hover:scale-105">
							ReWear
						</span>
					</Link>

					<div className="hidden md:flex items-center gap-2 flex-1 justify-center">
						<ul className="flex items-center gap-3">
							{navLinks.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className={`px-5 py-2.5 rounded-lg transition-all duration-200 font-semibold text-sm whitespace-nowrap ${
											pathname === link.href
												? "text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md"
												: "text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"
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
										className={`px-5 py-2.5 rounded-lg transition-all duration-200 font-semibold text-sm whitespace-nowrap ${
											pathname === "/admin"
												? "text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md"
												: "text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"
										}`}
									>
										Admin
									</Link>
								</li>
							)}
						</ul>
					</div>

					<div className="hidden md:flex items-center gap-4 flex-shrink-0">
						{user ? (
							<div className="flex items-center gap-4">
								<button
									onClick={() => router.push("/profile")}
									className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 flex-shrink-0 ${
										pathname === "/profile" ? "ring-2 ring-indigo-500 ring-offset-2" : ""
									}`}
									style={{
										background: pathname === "/profile" 
											? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
											: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
										border: '1px solid rgba(99, 102, 241, 0.2)'
									}}
									title="Profile"
								>
									{user.avatar ? (
										<Image
											src={user.avatar}
											alt={user.username || "User"}
											width={40}
											height={40}
											className="rounded-full object-cover"
										/>
									) : (
										<div className="w-10 h-10 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
											<span className="text-sm">{(user.username || user.name || 'U')?.slice(0,1).toUpperCase()}</span>
										</div>
									)}
								</button>
								<div className="flex flex-col text-xs min-w-0 hidden lg:block gap-0.5">
									<span className="truncate max-w-[140px] font-semibold" style={{ color: 'var(--text-primary)' }}>
										{user.username || user.name || user.email}
									</span>
									{user.email && (user.username || user.name) && (
										<span className="text-xs truncate max-w-[140px]" style={{ color: 'var(--text-secondary)' }}>
											{user.email}
										</span>
									)}
								</div>
								<button
									onClick={handleLogout}
									className="px-5 py-2.5 text-sm rounded-lg font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 hover:scale-105"
									style={{
										background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
										color: 'var(--accent)',
										border: '1px solid rgba(99, 102, 241, 0.2)'
									}}
								>
									Logout
								</button>
							</div>
						) : (
							<Link
								href="/login"
								className={`px-5 py-2.5 rounded-lg transition-all duration-200 font-semibold text-sm whitespace-nowrap ${
									pathname === "/login"
										? "text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md"
										: "text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"
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
								className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 flex-shrink-0 ${
									pathname === "/profile" ? "ring-2 ring-indigo-500" : ""
								}`}
								style={{
									background: pathname === "/profile" 
										? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
										: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
									border: '1px solid rgba(99, 102, 241, 0.2)'
								}}
								title="Profile"
							>
								{user.avatar ? (
									<Image
										src={user.avatar}
										alt={user.username || "User"}
										width={36}
										height={36}
										className="rounded-full object-cover"
									/>
								) : (
									<div className="w-9 h-9 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
										<span className="text-xs">{(user.username || user.name || 'U')?.slice(0,1).toUpperCase()}</span>
									</div>
								)}
							</button>
							<div className="text-xs min-w-0 max-w-[90px] hidden sm:block">
								<span className="truncate block font-semibold" style={{ color: 'var(--text-primary)' }}>
									{user.username || user.name || user.email}
								</span>
							</div>
						</div>
					)}

					{/* Mobile Button */}
					<button
						className="mobile-menu-button p-2 rounded-lg transition-all duration-200 md:hidden flex-shrink-0"
						style={{
							color: 'var(--accent)',
							background: 'rgba(99, 102, 241, 0.1)'
						}}
						aria-label="Toggle menu"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							{mobileMenuOpen ? (
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
							) : (
								<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
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
					<div className="absolute right-0 top-20 h-[calc(100vh-5rem)] w-72 max-w-[85vw] flex flex-col backdrop-blur-xl" style={{
						background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
						borderLeft: '1px solid rgba(99, 102, 241, 0.15)',
						boxShadow: '-4px 0 20px rgba(99, 102, 241, 0.15)'
					}}>
						<div className="flex justify-between items-center p-5 border-b" style={{ borderColor: 'rgba(99, 102, 241, 0.1)' }}>
							<span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Menu</span>
							<button
								onClick={() => setMobileMenuOpen(false)}
								className="p-2 rounded-lg transition-all duration-200 hover:scale-110 flex-shrink-0"
								style={{
									background: 'rgba(99, 102, 241, 0.1)',
									color: 'var(--accent)'
								}}
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						
						<div className="flex-1 overflow-y-auto p-4">
							<ul className="space-y-2">
								{navLinks.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											onClick={() => setMobileMenuOpen(false)}
											className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
												pathname === link.href
													? "text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md"
													: "text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"
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
											className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
												pathname === "/admin"
													? "text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md"
													: "text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"
											}`}
										>
											Admin
										</Link>
									</li>
								)}
							</ul>
						</div>

						<div className="p-5 border-t" style={{ borderColor: 'rgba(99, 102, 241, 0.1)', background: 'rgba(99, 102, 241, 0.03)' }}>
							{user ? (
								<>
									<div className="flex items-center gap-3 mb-4">
										{user.avatar ? (
											<Image
												src={user.avatar}
												alt="User"
												width={40}
												height={40}
												className="rounded-full object-cover flex-shrink-0"
											/>
										) : (
											<div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-indigo-600" style={{
												background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
												border: '1px solid rgba(99, 102, 241, 0.2)'
											}}>
												<span className="text-sm">{(user.username || user.name || 'U')?.slice(0,1).toUpperCase()}</span>
											</div>
										)}
										<div className="text-sm min-w-0 flex-1">
											<div className="truncate font-semibold" style={{ color: 'var(--text-primary)' }}>
												{user.username || user.name || user.email}
											</div>
											{user.email && (user.username || user.name) && (
												<div className="truncate text-xs" style={{ color: 'var(--text-secondary)' }}>
													{user.email}
												</div>
											)}
										</div>
									</div>
									<button
										onClick={() => {
											setMobileMenuOpen(false);
											handleLogout();
										}}
										className="w-full px-4 py-3 text-sm text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105"
										style={{
											background: 'var(--accent-gradient)',
											boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)'
										}}
									>
										Logout
									</button>
								</>
							) : (
								<Link
									href="/login"
									onClick={() => setMobileMenuOpen(false)}
									className={`block w-full text-center px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
										pathname === "/login"
											? "text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md"
											: "text-slate-700 bg-white hover:bg-indigo-50 hover:text-indigo-600 border"
									}`}
									style={pathname !== "/login" ? { borderColor: 'rgba(99, 102, 241, 0.2)' } : {}}
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