"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function ItemCard({ item }) {
	const [imageError, setImageError] = useState(false);

	const isImageMissing =
		!item.image ||
		item.image === null ||
		item.image === undefined ||
		item.image === "" ||
		imageError;

	const getImageSrc = () => {
		if (!item.image || typeof item.image !== "string")
			return "/images/default.jpg";
		if (item.image.startsWith("/uploads/")) return item.image;
		if (item.image.startsWith("http://") || item.image.startsWith("https://"))
			return item.image;
		if (item.image.startsWith("data:")) return item.image;
		return "/images/default.jpg";
	};

	const handleImageError = () => {
		setImageError(true);
	};

	return (
		<div 
			className="card flex flex-col h-full overflow-hidden group"
			style={{
				background: 'var(--gradient)',
				border: '1px solid var(--border-color)',
				borderRadius: 'var(--radius)',
				boxShadow: 'var(--shadow)',
				transition: 'var(--transition)'
			}}
		>
			{/* Image Container */}
			<div 
				className="relative w-full h-48 flex items-center justify-center overflow-hidden"
				style={{
					background: 'linear-gradient(135deg, var(--bg-secondary), var(--accent))',
					borderRadius: 'var(--radius) var(--radius) 0 0'
				}}
			>
				{isImageMissing ? (
					<div 
						className="flex flex-col items-center justify-center h-full"
						style={{ color: 'var(--text-secondary)' }}
					>
						<svg
							className="w-12 h-12 mb-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							style={{ opacity: 0.6 }}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<span className="text-sm font-medium">No Image</span>
					</div>
				) : (
					<Image
						src={getImageSrc()}
						alt={item.title || "Item image"}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						onError={handleImageError}
						unoptimized={
							item.image?.startsWith("data:") || item.image?.startsWith("http")
						}
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
						style={{ borderRadius: 'var(--radius) var(--radius) 0 0' }}
					/>
				)}
				
				{/* Status Badge */}
				{typeof item.isApproved !== "undefined" ? (
					<div
						className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold"
						style={{
							background: item.isApproved 
								? 'rgba(220, 252, 231, 0.9)' 
								: 'rgba(254, 243, 199, 0.9)',
							color: item.isApproved ? '#065f46' : '#92400e',
							border: item.isApproved 
								? '1px solid #a7f3d0' 
								: '1px solid #fcd34d',
							backdropFilter: 'blur(8px)',
							boxShadow: 'var(--shadow)'
						}}
					>
						{item.isApproved ? "Approved" : "Pending Approval"}
					</div>
				) : (
					item.status && (
						<div
							className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold"
							style={{
								background: item.status === "available"
									? 'rgba(220, 252, 231, 0.9)'
									: item.status === "pending"
									? 'rgba(254, 243, 199, 0.9)'
									: 'rgba(245, 245, 244, 0.9)',
								color: item.status === "available"
									? '#065f46'
									: item.status === "pending"
									? '#92400e'
									: 'var(--text-secondary)',
								border: item.status === "available"
									? '1px solid #a7f3d0'
									: item.status === "pending"
									? '1px solid #fcd34d'
									: '1px solid var(--border-color)',
								backdropFilter: 'blur(8px)',
								boxShadow: 'var(--shadow)'
							}}
						>
							{item.status}
						</div>
					)
				)}
			</div>

			{/* Content Container */}
			<div className="p-6 flex flex-col flex-grow">
				{/* Title */}
				<h2 
					className="font-semibold text-xl mb-3 line-clamp-2 leading-tight"
					style={{ color: 'var(--text-primary)' }}
				>
					{item.title || "Untitled Item"}
				</h2>
				
				<div 
					className="mt-2 text-sm mb-4"
					style={{ color: 'var(--text-secondary)' }}
				>
					Owner: {item.ownerUsername || item.ownerName || item.owner || "Unknown"}
				</div>

				{/* Item Details */}
				<div className="space-y-3 mb-4">
					{item.category && (
						<div className="flex items-center gap-2">
							<span 
								className="text-sm"
								style={{ color: 'var(--text-secondary)' }}
							>
								Category:
							</span>
							<span 
								className="px-2 py-1 rounded-full text-xs font-medium"
								style={{
									background: 'var(--accent)',
									color: 'var(--text-primary)',
									border: '1px solid var(--border-color)'
								}}
							>
								{item.category}
							</span>
						</div>
					)}

					{item.size && (
						<div className="flex items-center gap-2">
							<span 
								className="text-sm"
								style={{ color: 'var(--text-secondary)' }}
							>
								Size:
							</span>
							<span 
								className="text-sm font-medium"
								style={{ color: 'var(--text-primary)' }}
							>
								{item.size}
							</span>
						</div>
					)}

					{item.condition && (
						<div className="flex items-center gap-2">
							<span 
								className="text-sm"
								style={{ color: 'var(--text-secondary)' }}
							>
								Condition:
							</span>
							<span
								className="px-2 py-1 rounded-full text-xs font-medium"
								style={{
									background: item.condition.toLowerCase() === "new"
										? 'rgba(220, 252, 231, 0.8)'
										: item.condition.toLowerCase() === "like new"
										? 'rgba(219, 234, 254, 0.8)'
										: item.condition.toLowerCase() === "good"
										? 'rgba(254, 243, 199, 0.8)'
										: 'var(--bg-secondary)',
									color: item.condition.toLowerCase() === "new"
										? '#065f46'
										: item.condition.toLowerCase() === "like new"
										? '#1e40af'
										: item.condition.toLowerCase() === "good"
										? '#92400e'
										: 'var(--text-primary)',
									border: '1px solid var(--border-color)'
								}}
							>
								{item.condition}
							</span>
						</div>
					)}

					{item.pointsValue !== undefined && item.pointsValue !== null && (
						<div className="flex items-center gap-2">
							<span 
								className="text-sm"
								style={{ color: 'var(--text-secondary)' }}
							>
								Points:
							</span>
							<span 
								className="px-2 py-1 rounded-full text-xs font-bold"
								style={{
									background: 'linear-gradient(135deg, #fef3c7, #fed7aa)',
									color: '#92400e',
									border: '1px solid #fcd34d'
								}}
							>
								💰 {item.pointsValue}
							</span>
						</div>
					)}
				</div>

				{/* Description */}
				{item.description && (
					<p 
						className="text-sm leading-relaxed line-clamp-3 mb-4 flex-grow"
						style={{ color: 'var(--text-secondary)' }}
					>
						{item.description}
					</p>
				)}

				{/* Action Button */}
				<div 
					className="mt-auto pt-4"
					style={{ borderTop: '1px solid var(--border-color)' }}
				>
					<Link
						href={`/items/${item._id || item.id}`}
						className="btn w-full py-3 px-4 font-medium flex items-center justify-center gap-2 group"
						style={{
							background: 'var(--accent)',
							color: 'var(--text-primary)',
							border: '1px solid var(--border-color)',
							borderRadius: 'var(--radius)',
							boxShadow: 'var(--shadow)',
							transition: 'var(--transition)',
							textDecoration: 'none'
						}}
					>
						<span>View Details</span>
						<svg
							className="w-4 h-4 transition-transform group-hover:translate-x-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</Link>
				</div>
			</div>
		</div>
	);
}