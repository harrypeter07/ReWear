"use client";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import SwapRequestForm from "@/components/SwapRequestForm";
import { useState, useEffect } from "react";

async function fetchItem(id) {
	const res = await fetch(`/api/items/${id}`);
	if (!res.ok) return null;
	return await res.json();
}

const fallbackImages = [
	"https://i.pinimg.com/60x60/7d/3f/2f/7d3f2f6cf9664994ee3ae56a268f26b9.jpg",
	"https://i.pinimg.com/60x60/04/5a/cb/045acbc218006ec6857a31ebf48330e9.jpg",
	"https://i.pinimg.com/60x60/81/35/c5/8135c5f8ef39526076ac30432ad403b3.jpg",
	"https://i.pinimg.com/60x60/94/8f/7a/948f7a63203b896e38bbc94584595185.jpg",
	"https://i.pinimg.com/60x60/30/c2/f8/30c2f8ba91a415a87894fd3a2b98cc16.jpg",
	"https://i.pinimg.com/60x60/57/de/cf/57decfab8feb4ae820f423ca854a9c40.jpg",
	"https://i.pinimg.com/60x60/50/db/cd/50dbcd4265648f000435fe6916fc1f64.jpg",
	"https://i.pinimg.com/60x60/3c/46/58/3c4658c9e526fa01ca2502a1bd0666b7.jpg",
	"https://i.pinimg.com/60x60/db/08/95/db0895011eaf57e30c961061bc8daa0f.jpg",
	"https://i.pinimg.com/60x60/c2/4b/18/c24b18486862ad0cb712d490c5023f5f.jpg",
	"https://i.pinimg.com/60x60/6f/18/e9/6f18e98732bf594c91db9b30aa312a11.jpg",
	"https://i.pinimg.com/60x60/97/25/35/972535fe749562e2ab645d49e53059f8.jpg",
	"https://i.pinimg.com/60x60/10/0e/83/100e83a7bc1e277b59beb35f25e95699.jpg",
	"https://i.pinimg.com/60x60/93/7f/d4/937fd46b9c08e050fdd9160b4a13d28e.jpg",
	"https://i.pinimg.com/60x60/a3/b0/d2/a3b0d29974f7e00a708c8a7fd1873bbb.jpg",
	"https://i.pinimg.com/60x60/69/68/0a/69680a0274ad6cebbf12eedbda2a8ebe.jpg",
	"https://i.pinimg.com/60x60/82/8d/73/828d7394556a00842aa19f6549e2a1fb.jpg",
	"https://i.pinimg.com/60x60/82/7e/e2/827ee297a3142a24a4dccc41fe3f9fdf.jpg",
	"https://i.pinimg.com/60x60/80/74/6d/80746db97891afd60f89eb36a3166983.jpg",
	"https://i.pinimg.com/60x60/9a/fc/d4/9afcd46fb75bccab9163037e44532730.jpg",
	"https://i.pinimg.com/60x60/a0/b3/78/a0b37803268877f0f243a1c3f1a2bf15.jpg",
	"https://i.pinimg.com/60x60/34/80/9b/34809b86b998da77775908481281954c.jpg",
	"https://i.pinimg.com/60x60/d8/37/0c/d8370c2816e2e10a9033f9b0e62240b7.jpg",
	"https://i.pinimg.com/60x60/91/fd/55/91fd5569abd956ea3968a07466b2f104.jpg",
	"https://i.pinimg.com/60x60/49/26/32/49263296e5fa1f402d4245deeeeb906e.jpg",
	"https://i.pinimg.com/236x/18/49/8e/18498eddf60795d2a6c2778a95d2bed0.jpg",
	"https://i.pinimg.com/236x/93/6f/6c/936f6ca1b2801cccab21d8b9006f038c.jpg",
	"https://i.pinimg.com/236x/f5/d4/5e/f5d45ec9136f063e610d85e80c1a169d.jpg",
	"https://i.pinimg.com/236x/e7/61/7f/e7617fbcf801f05e72d89999714df9e1.jpg",
	"https://i.pinimg.com/236x/0a/24/83/0a24832a85b4aa488b9769baf266574a.jpg",
	"https://i.pinimg.com/236x/e7/62/5f/e7625fe383da46abc54bd86077542168.jpg",
	"https://i.pinimg.com/236x/cd/d8/69/cdd869465a80b59c7a6a7aa6758b5c84.jpg",
	"https://i.pinimg.com/236x/31/ba/eb/31baeb526daba562bde059111588110e.jpg",
	"https://i.pinimg.com/236x/8f/e4/9a/8fe49a5d5b26747bd6e75977a01c03ea.jpg",
	"https://i.pinimg.com/236x/0f/71/d5/0f71d551ec5e1ab3d06d392e9f2f5780.jpg",
	"https://i.pinimg.com/236x/09/8a/d1/098ad187c66201bedd7cead487b0122f.jpg",
	"https://i.pinimg.com/236x/27/77/fc/2777fc7199949375e3d99463c2019434.jpg",
];
function getRandomFallbackImage() {
	return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
}
function getImageSrc(image) {
	const defaultImage = "/images/default.jpg";
	if (!image || typeof image !== "string") return getRandomFallbackImage();
	if (image.startsWith("/uploads/")) return image;
	if (image.startsWith("http://") || image.startsWith("https://")) return image;
	return getRandomFallbackImage();
}

export default function ItemDetailPage() {
	const params = useParams();
	const id = params.id;
	const [item, setItem] = useState(null);
	const [showSwap, setShowSwap] = useState(false);
	const [showRedeem, setShowRedeem] = useState(false);
	const [previousListings, setPreviousListings] = useState([]);

	useEffect(() => {
		async function load() {
			const data = await fetchItem(id);
			console.log("[ITEM DETAIL] Loaded item:", data);
			if (data && data.image) {
				console.log("[ITEM DETAIL] item.image:", data.image);
				console.log("[ITEM DETAIL] typeof item.image:", typeof data.image);
			}
			setItem(data);
			if (data && data.uploaderId) {
				const res = await fetch(`/api/items?uploaderId=${data.uploaderId}`);
				if (res.ok) {
					const apiData = await res.json();
					if (Array.isArray(apiData.items)) {
						setPreviousListings(apiData.items.filter((i) => i._id !== id));
					} else {
						console.log("[ITEM DETAIL] No items array in response", apiData);
						setPreviousListings([]);
					}
				} else {
					console.log("[ITEM DETAIL] Failed to fetch previous listings");
					setPreviousListings([]);
				}
			}
		}
		if (id) load();
	}, [id]);

	if (!item) {
		return <div className="p-8 text-center">Item not found.</div>;
	}

	const imageSrc = getImageSrc(item.image);

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="bg-white rounded shadow p-6 flex flex-col md:flex-row gap-8">
				{/* Image Section */}
				<div className="flex-1 flex flex-col items-center">
					<img
						src={imageSrc}
						alt={item.title}
						className="w-full max-w-xs h-72 object-cover rounded border shadow-md hover:shadow-xl transition mb-4 bg-gray-50"
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = getRandomFallbackImage();
						}}
					/>
					{imageSrc === "/images/default.jpg" && (
						<div className="text-xs text-gray-500 mt-1">No image available</div>
					)}
				</div>
				{/* Description Section */}
				<div className="flex-1 flex flex-col justify-between">
					<div>
						<h1 className="text-2xl font-bold mb-2">{item.title}</h1>
						<div className="mb-2 text-gray-700 whitespace-pre-line">
							{item.description}
						</div>
						<div className="text-gray-700 mb-1">Category: {item.category}</div>
						<div className="text-gray-700 mb-1">Size: {item.size}</div>
						<div className="text-gray-700 mb-1">
							Condition: {item.condition}
						</div>
						<div className="text-gray-700 mb-1">
							Points Value: {item.pointsValue}
						</div>
						<div className="text-gray-700 mb-1">Status: {item.status}</div>
						<div className="text-gray-700 mb-1">
							Approved: {item.isApproved ? "Yes" : "No"}
						</div>
					</div>
					<div className="mt-4 flex gap-4">
						<button
							className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
							onClick={() => setShowRedeem((v) => !v)}
						>
							Available/Swap
						</button>
					</div>
					{showRedeem && <SwapRequestForm itemId={item._id} type="redeem" />}
				</div>
			</div>
			{/* Previous Listings Section */}
			<div className="mt-10">
				<h2 className="text-lg font-semibold mb-2">Previous Listings:</h2>
				<div className="flex gap-4 flex-wrap">
					{previousListings.length === 0 && (
						<div className="text-gray-500">No previous listings.</div>
					)}
					{previousListings.slice(0, 4).map((prev) => (
						<Link
							key={prev._id}
							href={`/items/${prev._id}`}
							className="block w-32 h-40 bg-gray-100 rounded shadow hover:shadow-lg transition overflow-hidden"
						>
							<img
								src={getImageSrc(prev.image)}
								alt={prev.title}
								className="w-full h-24 object-cover mb-2"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = "/images/default.jpg";
								}}
							/>
							<div className="px-2 text-sm font-medium truncate">
								{prev.title}
							</div>
						</Link>
					))}
				</div>
			</div>
			<div className="mt-6">
				<Link href="/items" className="text-blue-600 hover:underline">
					Back to Items
				</Link>
			</div>
		</div>
	);
}
