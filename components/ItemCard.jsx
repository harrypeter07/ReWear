"use client";
import Link from "next/link";

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

export default function ItemCard({ item }) {
	const defaultImage = "/images/default.jpg";
	let imageSrc = defaultImage;
	if (item.image && typeof item.image === "string") {
		if (item.image.startsWith("/uploads/")) {
			imageSrc = item.image;
		} else if (
			item.image.startsWith("http://") ||
			item.image.startsWith("https://")
		) {
			imageSrc = item.image;
		}
	}
	// If imageSrc is still default, use a random fallback
	if (imageSrc === defaultImage) {
		imageSrc = getRandomFallbackImage();
	}

	return (
		<div className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white flex flex-col h-full">
			<div className="w-full h-40 mb-2 bg-gray-50 flex items-center justify-center rounded overflow-hidden">
				<img
					src={imageSrc}
					alt={item.title}
					className="max-w-full max-h-full object-contain"
					onError={(e) => {
						e.target.onerror = null;
						e.target.src = getRandomFallbackImage();
					}}
				/>
			</div>
			<h2 className="font-semibold text-lg mb-1 truncate">{item.title}</h2>
			<div className="text-gray-600 text-sm mb-1">
				Category: <span className="font-medium">{item.category}</span>
			</div>
			<div className="text-gray-600 text-sm mb-1">
				Size: <span className="font-medium">{item.size}</span>
			</div>
			<div className="text-gray-600 text-sm mb-1">
				Condition: <span className="font-medium">{item.condition}</span>
			</div>
			{item.pointsValue !== undefined && (
				<div className="text-gray-600 text-sm mb-1">
					Points: <span className="font-medium">{item.pointsValue}</span>
				</div>
			)}
			<div className="text-gray-700 text-sm mt-2 line-clamp-3">
				{item.description}
			</div>
			<div className="mt-auto pt-4 flex justify-end">
				<Link
					href={`/items/${item._id || item.id}`}
					className="text-blue-600 hover:underline text-sm font-medium"
				>
					View Details
				</Link>
			</div>
		</div>
	);
}
