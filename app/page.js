"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
	const [currentSlide, setCurrentSlide] = useState(0);

	// Sample featured items data
	const featuredItems = [
		{
			id: 1,
			title: "Vintage Denim Jacket",
			category: "Jackets",
			image: "/images/denim-jacket.jpg",
		},
		{
			id: 2,
			title: "Summer Floral Dress",
			category: "Dresses",
			image: "/images/floral-dress.jpg",
		},
		{
			id: 3,
			title: "Classic White Sneakers",
			category: "Shoes",
			image: "/images/sneakers.jpg",
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

	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-r from-green-50 to-blue-50 py-20">
				<div className="container mx-auto px-4 text-center">
					<h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
						Sustainable Fashion Through Swapping
					</h1>
					<p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
						Refresh your wardrobe sustainably by swapping clothes with our
						community
					</p>
					<div className="flex justify-center gap-4">
						<Link
							href="/register"
							className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
						>
							Start Swapping
						</Link>
						<Link
							href="/items"
							className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 px-6 border border-gray-300 rounded-lg transition"
						>
							Browse Items
						</Link>
					</div>
				</div>
			</section>

			{/* Featured Items Carousel */}
			<section className="py-16 bg-white">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
						Featured Items
					</h2>
					<div className="relative">
						<div className="flex overflow-hidden">
							{featuredItems.map((item, index) => (
								<div
									key={item.id}
									className={`min-w-full transition-transform duration-300 ${
										index === currentSlide ? "block" : "hidden"
									}`}
								>
									<div className="bg-gray-50 rounded-xl p-6 flex flex-col md:flex-row items-center gap-8">
										<div className="w-full md:w-1/2">
											<Image
												src={item.image}
												alt={item.title}
												width={600}
												height={400}
												className="w-full h-64 object-cover rounded-lg shadow-md"
											/>
										</div>
										<div className="w-full md:w-1/2 text-center md:text-left">
											<span className="text-green-600 font-medium">
												{item.category}
											</span>
											<h3 className="text-2xl font-bold text-gray-800 mt-2">
												{item.title}
											</h3>
											<Link
												href={`/items/${item.id}`}
												className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium"
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
									className={`w-3 h-3 rounded-full ${
										index === currentSlide ? "bg-green-600" : "bg-gray-300"
									}`}
									aria-label={`Go to slide ${index + 1}`}
								/>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Impact Metrics */}
			<section className="py-16 bg-gray-50">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
						Our Community Impact
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
						<div className="p-6 bg-white rounded-xl shadow-sm">
							<div className="text-4xl font-bold text-green-600">1,200+</div>
							<div className="text-gray-600 mt-2">Items Swapped</div>
						</div>
						<div className="p-6 bg-white rounded-xl shadow-sm">
							<div className="text-4xl font-bold text-green-600">500+</div>
							<div className="text-gray-600 mt-2">Active Members</div>
						</div>
						<div className="p-6 bg-white rounded-xl shadow-sm">
							<div className="text-4xl font-bold text-green-600">2.5K+</div>
							<div className="text-gray-600 mt-2">Textile Waste Saved (kg)</div>
						</div>
						<div className="p-6 bg-white rounded-xl shadow-sm">
							<div className="text-4xl font-bold text-green-600">$50K+</div>
							<div className="text-gray-600 mt-2">Value Exchanged</div>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="py-16 bg-white">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
						What Our Community Says
					</h2>
					<div className="grid md:grid-cols-2 gap-8">
						{testimonials.map((testimonial, index) => (
							<div key={index} className="bg-gray-50 p-8 rounded-xl">
								<blockquote className="text-lg italic text-gray-700 mb-4">
									&quot;{testimonial.quote}&quot;
								</blockquote>
								<div className="text-gray-600 font-medium">
									— {testimonial.author}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
