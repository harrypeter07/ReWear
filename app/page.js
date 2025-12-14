"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { STOCK_IMAGES } from "../utils/constants";

export default function Home() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const router = useRouter();

	// Sample featured items data
	const featuredItems = [
		{
			id: 1,
			title: "Vintage Denim Jacket",
			category: "Jackets",
			image: STOCK_IMAGES[0],
		},
		{
			id: 2,
			title: "Summer Floral Dress",
			category: "Dresses",
			image: STOCK_IMAGES[1],
		},
		{
			id: 3,
			title: "Classic White Sneakers",
			category: "Shoes",
			image: STOCK_IMAGES[2],
		},
	];

	// Sample testimonials
	const testimonials = [
		{
			quote: "Saved over $200 and 5kg of textile waste this year!",
			author: "Sarah, 28",
		},
		{
			quote: "My closet is fresh without buying anything new.",
			author: "James, 35",
		},
	];

	const handleStartSwapping = async () => {
		console.log("Start Swapping button clicked");
		try {
			const res = await fetch("/api/auth/me", { credentials: "include" });
			if (res.ok) {
				const data = await res.json();
				console.log("User is authenticated:", data.user);
				router.push("/items");
			} else {
				console.log("User not authenticated, redirecting to /register");
				router.push("/register");
			}
		} catch (err) {
			console.log("Error checking auth:", err);
			router.push("/register");
		}
	};

	return (
		<div className="min-h-screen pt-40 pb-12" style={{ background: 'var(--bg-primary)' }}>
			{/* Hero Section */}
			<section className="container px-4 sm:px-6 lg:px-8">
				<div className="card text-center py-16 md:py-24 px-6 sm:px-8 min-h-[60vh] flex flex-col items-center justify-center" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)'
				}}>
					<h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
						Sustainable Fashion Through Swapping
					</h1>
					<p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto font-medium" style={{ color: 'var(--text-secondary)' }}>
						Refresh your wardrobe sustainably by swapping clothes with our community
					</p>
					<div className="flex justify-center gap-4 flex-wrap">
						<button
							onClick={handleStartSwapping}
							className="px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200"
							style={{ 
								background: 'var(--accent-gradient)',
								color: 'white',
								boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
								border: 'none'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = 'translateY(-2px)';
								e.currentTarget.style.boxShadow = '0 12px 32px rgba(99, 102, 241, 0.4)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = 'translateY(0)';
								e.currentTarget.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.3)';
							}}
						>
							Start Swapping
						</button>
						<Link
							href="/items"
							className="px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200"
							style={{ 
								background: 'rgba(255, 255, 255, 0.9)',
								color: 'var(--accent)',
								border: '2px solid var(--accent)',
								textDecoration: 'none',
								display: 'inline-block',
								boxShadow: '0 4px 16px rgba(99, 102, 241, 0.15)'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = 'translateY(-2px)';
								e.currentTarget.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.25)';
								e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = 'translateY(0)';
								e.currentTarget.style.boxShadow = '0 4px 16px rgba(99, 102, 241, 0.15)';
								e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
							}}
						>
							Browse Items
						</Link>
					</div>
				</div>
			</section>

			{/* Featured Items Carousel */}
			<section className="container">
				<div className="card" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)'
				}}>
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
						Featured Items
					</h2>
					<div className="relative">
						<div className="overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
							{featuredItems.map((item, index) => (
								<div
									key={item.id}
									className={`transition-all duration-300 ${
										index === currentSlide ? "block" : "hidden"
									}`}
								>
									<div className="bento-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
										<div className="flex items-center justify-center p-4">
											<Image
												src={item.image}
												alt={item.title}
												width={600}
												height={400}
												sizes="(max-width: 768px) 100vw, 50vw"
												className="w-full h-64 object-cover"
												style={{ borderRadius: 'var(--radius)' }}
											/>
										</div>
										<div className="flex flex-col justify-center p-4 text-center md:text-left">
											<span className="font-medium mb-2" style={{ color: '#6b8e6b' }}>
												{item.category}
											</span>
											<h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
												{item.title}
											</h3>
											<Link
												href={`/items/${item.id}`}
												className="inline-block font-medium hover:underline"
												style={{ 
													color: 'var(--text-secondary)',
													textDecoration: 'none',
													transition: 'var(--transition)'
												}}
											>
												View Details →
											</Link>
										</div>
									</div>
								</div>
							))}
						</div>
						<div className="flex justify-center mt-6 gap-2">
							{featuredItems.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentSlide(index)}
									className={`w-3 h-3 rounded-full transition-colors duration-200`}
									style={{
										background: index === currentSlide ? '#a97b5f' : 'var(--border-color)'
									}}
									aria-label={`Go to slide ${index + 1}`}
								/>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Impact Metrics */}
			<section className="container">
				<div className="card" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)'
				}}>
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
						Our Community Impact
					</h2>
					<div className="bento-grid">
						<div className="card text-center transition-all duration-300 hover:scale-105" style={{ 
							background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
							border: '1px solid rgba(99, 102, 241, 0.2)'
						}}>
							<div className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">1,200+</div>
							<div className="font-medium" style={{ color: 'var(--text-secondary)' }}>Items Swapped</div>
						</div>
						<div className="card text-center transition-all duration-300 hover:scale-105" style={{ 
							background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
							border: '1px solid rgba(99, 102, 241, 0.2)'
						}}>
							<div className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">500+</div>
							<div className="font-medium" style={{ color: 'var(--text-secondary)' }}>Active Members</div>
						</div>
						<div className="card text-center transition-all duration-300 hover:scale-105" style={{ 
							background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
							border: '1px solid rgba(99, 102, 241, 0.2)'
						}}>
							<div className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">2.5K+</div>
							<div className="font-medium" style={{ color: 'var(--text-secondary)' }}>Textile Waste Saved (kg)</div>
						</div>
						<div className="card text-center transition-all duration-300 hover:scale-105" style={{ 
							background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
							border: '1px solid rgba(99, 102, 241, 0.2)'
						}}>
							<div className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">$50K+</div>
							<div className="font-medium" style={{ color: 'var(--text-secondary)' }}>Value Exchanged</div>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="container">
				<div className="card" style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(99, 102, 241, 0.1)'
				}}>
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
						What Our Community Says
					</h2>
					<div className="bento-grid">
						{testimonials.map((testimonial, index) => (
							<div 
								key={index} 
								className="card" 
								style={{ 
									background: 'var(--bg-secondary)',
									padding: '2rem'
								}}
							>
								<blockquote className="text-lg italic mb-4" style={{ color: 'var(--text-secondary)' }}>
									&quot;{testimonial.quote}&quot;
								</blockquote>
								<div className="font-medium" style={{ color: 'var(--text-primary)' }}>
									— {testimonial.author}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="container pb-8">
				<div className="card text-center" style={{ 
					background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
					border: '1px solid rgba(99, 102, 241, 0.2)',
					backdropFilter: 'blur(20px)'
				}}>
					<h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
						Ready to Start Your Sustainable Journey?
					</h2>
					<p className="mb-8 text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
						Join thousands of fashion-conscious individuals making a positive impact
					</p>
					<button
						onClick={handleStartSwapping}
						className="btn px-8 py-4 text-lg font-semibold"
						style={{ 
							background: 'var(--accent-gradient)',
							color: 'white',
							boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
						}}
					>
						Get Started Today
					</button>
				</div>
			</section>
		</div>
	);
}