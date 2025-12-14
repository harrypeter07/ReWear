"use client";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export default function Navbar() {
	const { user, setUser, isLoading } = useContext(UserContext);
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
		{ name: "Orders", href: "/orders" },
	];

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!mobileMenuOpen) return;
			if (event.target.closest("a")) return;
			if (
				event.target.closest(".mobile-menu") ||
				event.target.closest(".mobile-menu-button")
			) {
				return;
			}
			setMobileMenuOpen(false);
		};
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, [mobileMenuOpen]);

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
		<nav className="fixed top-0 left-0 w-full z-[9999] h-20 backdrop-blur-xl border-b bg-background/95" style={{ height: '80px' }}>
			<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-full">
				<div className="flex justify-between items-center h-full gap-6">
					{/* Spacer for centering on desktop */}
					<div className="hidden md:block w-32 flex-shrink-0"></div>

					{/* Desktop Navigation with ReWear centered */}
					<div className="hidden md:flex items-center gap-2 flex-1 justify-center">
						<Link href="/" className="flex items-center gap-2 group mr-8">
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 font-bold text-xl sm:text-2xl whitespace-nowrap transition-all duration-300 group-hover:scale-105">
								ReWear
							</span>
						</Link>
						<ul className="flex items-center gap-3">
							{navLinks.map((link) => (
								<li key={link.name}>
									<Button
										asChild
										variant={pathname === link.href ? "default" : "ghost"}
										className={cn(
											pathname === link.href && "bg-gradient-to-r from-indigo-600 to-purple-600"
										)}
									>
										<Link href={link.href} prefetch={true}>{link.name}</Link>
									</Button>
								</li>
							))}
							{user && user.role === "admin" && (
								<li>
									<Button
										asChild
										variant={pathname === "/admin" ? "default" : "ghost"}
										className={cn(
											pathname === "/admin" && "bg-gradient-to-r from-indigo-600 to-purple-600"
										)}
									>
										<Link href="/admin" prefetch={true}>Admin</Link>
									</Button>
								</li>
							)}
						</ul>
					</div>

					{/* Desktop User Actions */}
					<div className="hidden md:flex items-center gap-4 flex-shrink-0">
						{!isLoading && user ? (
							<div className="flex items-center gap-4">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => router.push("/profile")}
									className={cn(
										"relative h-10 w-10 rounded-full",
										pathname === "/profile" && "ring-2 ring-primary"
									)}
								>
									<Avatar className="h-10 w-10">
										{user.avatar && <AvatarImage src={user.avatar} alt={user.username || "User"} />}
										<AvatarFallback className="bg-primary/10 text-primary">
											{(user.username || user.name || 'U')?.slice(0,1).toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</Button>
								<div className="flex flex-col min-w-0">
									<span className="truncate max-w-[160px] font-semibold text-sm">
										{user.username || user.name || "User"}
									</span>
									{user.email && (
										<span className="text-xs truncate max-w-[160px] text-muted-foreground">
											{user.email}
										</span>
									)}
									<span className="text-xs font-semibold mt-0.5" style={{ color: 'var(--accent)' }}>
										{user.points ?? 0} points
									</span>
								</div>
								<Button
									variant="outline"
									onClick={handleLogout}
								>
									Logout
								</Button>
							</div>
						) : !isLoading ? (
							<Button asChild variant={pathname === "/login" ? "default" : "outline"}>
								<Link href="/login">Login</Link>
							</Button>
						) : null}
					</div>

					{/* Mobile Logo */}
					<Link href="/" className="md:hidden flex items-center gap-2 group">
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 font-bold text-xl whitespace-nowrap transition-all duration-300 group-hover:scale-105">
							ReWear
						</span>
					</Link>

					{/* Mobile User Avatar */}
					{user && (
						<div className="md:hidden flex items-center gap-2 flex-shrink-0 mr-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => router.push("/profile")}
								className="h-9 w-9 rounded-full"
							>
								<Avatar className="h-9 w-9">
									{user.avatar && <AvatarImage src={user.avatar} alt={user.username || "User"} />}
									<AvatarFallback className="bg-primary/10 text-primary text-xs">
										{(user.username || user.name || 'U')?.slice(0,1).toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</Button>
							<div className="text-xs min-w-0 max-w-[90px] hidden sm:block">
								<span className="truncate block font-semibold">
									{user.username || user.name || "User"}
								</span>
								{user.email && (
									<span className="truncate block text-muted-foreground">
										{user.email}
									</span>
								)}
								<span className="truncate block font-semibold mt-0.5" style={{ color: 'var(--accent)' }}>
									{user.points ?? 0} pts
								</span>
							</div>
						</div>
					)}

					{/* Mobile Menu Button */}
					<Button
						variant="ghost"
						size="icon"
						className="mobile-menu-button md:hidden"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label="Toggle menu"
					>
						{mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
					</Button>
				</div>
			</div>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className="mobile-menu fixed inset-0 z-[10000] md:hidden">
					<div 
						className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
						onClick={() => setMobileMenuOpen(false)}
					/>
					<div className="absolute right-0 top-20 h-[calc(100vh-5rem)] w-72 max-w-[85vw] flex flex-col bg-background border-l shadow-xl">
						<div className="flex justify-between items-center p-5 border-b">
							<span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
								Menu
							</span>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setMobileMenuOpen(false)}
							>
								<X className="h-5 w-5" />
							</Button>
						</div>
						
						<div className="flex-1 overflow-y-auto p-4">
							<ul className="space-y-2">
								{navLinks.map((link) => (
									<li key={link.name}>
										<Button
											asChild
											variant={pathname === link.href ? "default" : "ghost"}
											className="w-full justify-start"
											onClick={() => setMobileMenuOpen(false)}
										>
											<Link href={link.href}>{link.name}</Link>
										</Button>
									</li>
								))}
								{user && user.role === "admin" && (
									<li>
										<Button
											asChild
											variant={pathname === "/admin" ? "default" : "ghost"}
											className="w-full justify-start"
											onClick={() => setMobileMenuOpen(false)}
										>
											<Link href="/admin">Admin</Link>
										</Button>
									</li>
								)}
							</ul>
						</div>

						<div className="p-5 border-t bg-muted/50">
							{user ? (
								<>
									<div className="flex items-center gap-3 mb-4">
										<Avatar className="h-10 w-10">
											{user.avatar && <AvatarImage src={user.avatar} alt="User" />}
											<AvatarFallback className="bg-primary/10 text-primary">
												{(user.username || user.name || 'U')?.slice(0,1).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="text-sm min-w-0 flex-1 flex flex-col">
											<div className="truncate font-semibold">
												{user.username || user.name || user.email}
											</div>
											{user.email && (user.username || user.name) && (
												<div className="truncate text-xs text-muted-foreground">
													{user.email}
												</div>
											)}
											<div className="truncate text-xs font-semibold mt-1" style={{ color: 'var(--accent)' }}>
												{user.points ?? 0} points
											</div>
										</div>
									</div>
									<Button
										className="w-full"
										onClick={() => {
											setMobileMenuOpen(false);
											handleLogout();
										}}
									>
										Logout
									</Button>
								</>
							) : (
								<Button
									asChild
									variant={pathname === "/login" ? "default" : "outline"}
									className="w-full"
									onClick={() => setMobileMenuOpen(false)}
								>
									<Link href="/login">Login</Link>
								</Button>
							)}
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
