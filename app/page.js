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
		<div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
			{/* Hero Section */}
			<section className="container">
				<div className="card text-center py-16">
					<h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
						Sustainable Fashion Through Swapping
					</h1>
					<p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
						Refresh your wardrobe sustainably by swapping clothes with our community
					</p>
					<div className="flex justify-center gap-4 flex-wrap">
						<button
							onClick={handleStartSwapping}
							className="btn"
							style={{ 
								background: 'linear-gradient(135deg, #e8f5e8, #d4edda)',
								color: 'var(--text-primary)',
								fontWeight: '600'
							}}
						>
							Start Swapping
						</button>
						<Link
							href="/items"
							className="btn"
							style={{ 
								background: 'var(--bg-secondary)',
								color: 'var(--text-primary)',
								textDecoration: 'none',
								display: 'inline-block'
							}}
						>
							Browse Items
						</Link>
					</div>
				</div>
			</section>

			{/* Featured Items Carousel */}
			<section className="container">
				<div className="card">
					<h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--text-primary)' }}>
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
				<div className="card">
					<h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--text-primary)' }}>
						Our Community Impact
					</h2>
					<div className="bento-grid">
						<div className="card text-center" style={{ background: 'var(--bg-secondary)' }}>
							<div className="text-4xl font-bold mb-2" style={{ color: '#6b8e6b' }}>1,200+</div>
							<div style={{ color: 'var(--text-secondary)' }}>Items Swapped</div>
						</div>
						<div className="card text-center" style={{ background: 'var(--bg-secondary)' }}>
							<div className="text-4xl font-bold mb-2" style={{ color: '#6b8e6b' }}>500+</div>
							<div style={{ color: 'var(--text-secondary)' }}>Active Members</div>
						</div>
						<div className="card text-center" style={{ background: 'var(--bg-secondary)' }}>
							<div className="text-4xl font-bold mb-2" style={{ color: '#6b8e6b' }}>2.5K+</div>
							<div style={{ color: 'var(--text-secondary)' }}>Textile Waste Saved (kg)</div>
						</div>
						<div className="card text-center" style={{ background: 'var(--bg-secondary)' }}>
							<div className="text-4xl font-bold mb-2" style={{ color: '#6b8e6b' }}>$50K+</div>
							<div style={{ color: 'var(--text-secondary)' }}>Value Exchanged</div>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="container">
				<div className="card">
					<h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--text-primary)' }}>
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
				<div className="card text-center" style={{ background: 'var(--accent)' }}>
					<h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
						Ready to Start Your Sustainable Journey?
					</h2>
					<p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
						Join thousands of fashion-conscious individuals making a positive impact
					</p>
					<button
						onClick={handleStartSwapping}
						className="btn"
						style={{ 
							background: 'var(--bg-secondary)',
							color: 'var(--text-primary)',
							fontWeight: '600',
							padding: '1rem 2rem'
						}}
					>
						Get Started Today
					</button>
				</div>
			</section>
		</div>
	);
}