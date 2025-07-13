import React from "react";

export default function LoadingSpinner({
	text = "Loading...",
	className = "",
}) {
	return (
		<div className={`flex flex-col items-center justify-center ${className}`}>
			<div
				className="animate-spin rounded-full h-12 w-12 border-4"
				style={{
					borderColor:
						"var(--accent-1) var(--accent-1) var(--primary) transparent",
					borderStyle: "solid",
				}}
			></div>
			{text && (
				<p
					className="mt-3 text-lg font-medium text-primary"
					style={{ color: "var(--text-primary)" }}
				>
					{text}
				</p>
			)}
		</div>
	);
}
