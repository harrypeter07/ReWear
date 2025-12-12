import ItemCard from "@/components/ItemCard";
import Link from "next/link";

async function getItems() {
	let baseUrl =
		process.env.NEXT_PUBLIC_BASE_URL ||
		(process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: "http://localhost:3000");
	const res = await fetch(`${baseUrl}/api/items`, { cache: "no-store" });
	if (!res.ok) return [];
	return await res.json();
}

export default async function ItemsPage() {
	const items = await getItems();

	return (
		<div className="min-h-screen pt-28 pb-12" style={{ background: 'var(--bg-primary)' }}>
			{/* Header Section */}
			<div className="container">
				<div className="card text-center mb-8" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)'
				}}>
					<h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
						Discover Amazing Items
					</h1>
					<p className="text-lg mb-8 font-medium" style={{ color: 'var(--text-secondary)' }}>
						Find unique treasures and swap with our community
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-6 mb-6">
						<div className="px-6 py-5 rounded-xl transition-all duration-300 hover:scale-105" style={{
							background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
							border: '1px solid rgba(99, 102, 241, 0.2)',
							boxShadow: '0 4px 16px rgba(99, 102, 241, 0.1)'
						}}>
							<span className="text-3xl font-bold block mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
								{items.length}
							</span>
							<p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
								Items Available
							</p>
						</div>
						<div className="px-6 py-5 rounded-xl transition-all duration-300 hover:scale-105" style={{
							background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
							border: '1px solid rgba(99, 102, 241, 0.2)',
							boxShadow: '0 4px 16px rgba(99, 102, 241, 0.1)'
						}}>
							<span className="text-3xl font-bold block mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
								24/7
							</span>
							<p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
								Active Trading
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Filter Section */}
			<div className="container">
				<div className="card mb-8" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)'
				}}>
					<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
						<div className="flex items-center gap-4 flex-wrap">
							<div className="flex items-center gap-2">
								<svg
									className="w-5 h-5"
									style={{ color: 'var(--text-secondary)' }}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
									/>
								</svg>
								<span className="font-medium" style={{ color: 'var(--text-primary)' }}>
									Filter by:
								</span>
							</div>
							<select className="px-4 py-2 text-sm" style={{ 
								background: 'var(--bg-secondary)', 
								border: '1px solid var(--border-color)', 
								borderRadius: 'var(--radius)',
								color: 'var(--text-primary)'
							}}>
								<option>All Categories</option>
								<option>Jackets</option>
								<option>Dresses</option>
								<option>Shoes</option>
								<option>Accessories</option>
								<option>Home & Garden</option>
							</select>
							<select className="px-4 py-2 text-sm" style={{ 
								background: 'var(--bg-secondary)', 
								border: '1px solid var(--border-color)', 
								borderRadius: 'var(--radius)',
								color: 'var(--text-primary)'
							}}>
								<option>Sort By</option>
								<option>Newest First</option>
								<option>Points: Low to High</option>
								<option>Points: High to Low</option>
								<option>Most Popular</option>
							</select>
						</div>
						<div className="flex items-center gap-3">
							<button className="btn flex items-center gap-2 px-4 py-2 text-sm">
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 10h16M4 14h16M4 18h16"
									/>
								</svg>
								List View
							</button>
							<button className="btn flex items-center gap-2 px-4 py-2 text-sm" style={{
								background: 'var(--accent)',
								transform: 'scale(1.05)'
							}}>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
									/>
								</svg>
								Grid View
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container">
				{items.length > 0 ? (
					<>
						{/* Featured Items Section */}
						<div className="mb-12">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
									Featured Items
								</h2>
								<Link
									href="/items/featured"
									className="font-medium text-sm hover:underline transition-all"
									style={{ color: 'var(--text-secondary)' }}
								>
									View All Featured →
								</Link>
							</div>
							<div className="bento-grid mb-8">
								{/* Large Featured Card */}
								<div className="card relative overflow-hidden min-h-[400px] flex flex-col justify-between" style={{
									background: 'linear-gradient(145deg, var(--accent), #f0dcc9)',
									gridColumn: 'span 2',
									gridRow: 'span 2'
								}}>
									<div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16"></div>
									<div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full -ml-12 -mb-12"></div>
									<div className="relative z-10">
										<div className="bg-white/40 backdrop-blur-sm px-4 py-2 text-xs font-semibold mb-4 w-fit rounded-full" style={{
											borderRadius: 'var(--radius)',
											color: 'var(--text-primary)',
											boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
										}}>
											🔥 TRENDING
										</div>
										<h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
											Premium Collection
										</h3>
										<p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
											Discover our most sought-after items with exclusive deals
										</p>
										<button className="btn bg-white hover:bg-gray-50" style={{
											color: 'var(--text-primary)',
											boxShadow: 'var(--shadow)'
										}}>
											Explore Now
										</button>
									</div>
								</div>

								{/* Quick Stats Cards */}
								<div className="card hover:shadow-lg transition-all duration-300">
									<div className="flex items-center justify-between mb-4">
										<div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
											<svg
												className="w-6 h-6"
												style={{ color: 'var(--text-primary)' }}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
												/>
											</svg>
										</div>
										<span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
											+12% this week
										</span>
									</div>
									<h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
										2,847
									</h3>
									<p style={{ color: 'var(--text-secondary)' }}>Total Swaps</p>
								</div>

								<div className="card hover:shadow-lg transition-all duration-300">
									<div className="flex items-center justify-between mb-4">
										<div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
											<svg
												className="w-6 h-6"
												style={{ color: 'var(--text-primary)' }}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
												/>
											</svg>
										</div>
										<span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
											+8% this month
										</span>
									</div>
									<h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
										1,234
									</h3>
									<p style={{ color: 'var(--text-secondary)' }}>Active Users</p>
								</div>

								<div className="card hover:shadow-lg transition-all duration-300">
									<div className="flex items-center justify-between mb-4">
										<div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
											<svg
												className="w-6 h-6"
												style={{ color: 'var(--text-primary)' }}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
												/>
											</svg>
										</div>
										<span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
											New!
										</span>
									</div>
									<h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
										156
									</h3>
									<p style={{ color: 'var(--text-secondary)' }}>Premium Items</p>
								</div>

								<div className="card hover:shadow-lg transition-all duration-300">
									<div className="flex items-center justify-between mb-4">
										<div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
											<svg
												className="w-6 h-6"
												style={{ color: 'var(--text-primary)' }}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
												/>
											</svg>
										</div>
										<span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
											24h avg
										</span>
									</div>
									<h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
										1,456
									</h3>
									<p style={{ color: 'var(--text-secondary)' }}>Points Earned</p>
								</div>
							</div>
						</div>

						{/* All Items Section */}
						<div className="mb-6">
							<h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
								All Items
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{items.map((item) => (
									<div key={item._id || item.id}>
										<ItemCard item={item} />
									</div>
								))}
							</div>
						</div>

						{/* Load More Section */}
						<div className="text-center mt-12">
							<button className="btn px-8 py-3 font-semibold" style={{
								background: 'var(--accent)',
								boxShadow: 'var(--shadow)'
							}}>
								Load More Items
							</button>
						</div>
					</>
				) : (
					<div className="text-center py-20">
						<div className="max-w-md mx-auto">
							<div className="w-24 h-24 flex items-center justify-center mx-auto mb-6" style={{
								background: 'var(--bg-secondary)',
								borderRadius: '50%'
							}}>
								<svg
									className="w-12 h-12"
									style={{ color: 'var(--text-secondary)' }}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
									/>
								</svg>
							</div>
							<h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
								No Items Yet
							</h3>
							<p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
								Be the first to list an item and start the community!
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Link
									href="/items/new"
									className="btn px-8 py-3 font-semibold inline-block text-center"
									style={{
										background: 'var(--accent)',
										color: 'var(--text-primary)',
										textDecoration: 'none',
										boxShadow: 'var(--shadow)'
									}}
								>
									List Your First Item
								</Link>
								<Link
									href="/how-it-works"
									className="btn px-8 py-3 font-semibold inline-block text-center"
									style={{
										background: 'var(--bg-secondary)',
										color: 'var(--text-primary)',
										textDecoration: 'none',
										border: '1px solid var(--border-color)'
									}}
								>
									Learn How It Works
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Newsletter Section */}
			<div className="container mt-16">
				<div className="card text-center">
					<h3 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
						Stay in the Loop
					</h3>
					<p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
						Get notified about new items, exclusive deals, and community updates
					</p>
					<div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
						<input
							type="email"
							placeholder="Enter your email"
							className="flex-1 px-4 py-3"
							style={{
								background: 'var(--bg-secondary)',
								border: '1px solid var(--border-color)',
								borderRadius: 'var(--radius)',
								color: 'var(--text-primary)'
							}}
						/>
						<button className="btn px-6 py-3 font-semibold" style={{
							background: 'var(--accent)',
							color: 'var(--text-primary)'
						}}>
							Subscribe
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}