"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ItemForm from "@/components/ItemForm";
import { createItem } from "@/utils/helpers";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AddItemPage() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const router = useRouter();

	useEffect(() => {
		async function fetchUser() {
			try {
				const res = await fetch("/api/auth/me", { credentials: "include" });
				if (res.ok) {
					const data = await res.json();
					setUser(data.user);
				} else {
					setUser(null);
					router.push("/login");
				}
			} catch {
				setUser(null);
				router.push("/login");
			} finally {
				setLoading(false);
			}
		}
		fetchUser();
	}, [router]);

	const handleSubmit = async (formData) => {
		setError("");
		setSuccess("");
		setSubmitting(true);

		console.log("Current user:", user);
		if (
			!user ||
			!user._id ||
			typeof user._id !== "string" ||
			user._id.length !== 24
		) {
			setError(
				"User ID is missing or invalid. Please log out and log in again."
			);
			setSubmitting(false);
			return;
		}

		try {
			formData.append("uploaderId", user._id);
			console.log("Submitting item formData");
			const res = await fetch("/api/items/create", {
				method: "POST",
				body: formData,
			});
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Failed to add item");
			}
			setSuccess("Item submitted for review!");
			setTimeout(() => router.push("/dashboard"), 1500);
		} catch (err) {
			console.log("Item creation error:", err);
			setError(err.message || "Failed to add item");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="loading-container">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<main className="container">
			<div className="add-item-wrapper">
				{/* Header */}
				<div className="page-header">
					<h1>Add New Item</h1>
					<p>Share something special with the community</p>
				</div>

				{/* Main Form Card */}
				<div className="card form-card">
					{/* Status Messages */}
					{error && (
						<div className="status-message error-message">
							<svg className="status-icon" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clipRule="evenodd"
								/>
							</svg>
							{error}
						</div>
					)}

					{success && (
						<div className="status-message success-message">
							<svg className="status-icon" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							{success}
						</div>
					)}

					{/* Form Container */}
					<div className={`form-wrapper ${submitting ? 'submitting' : ''}`}>
						<ItemForm onSubmit={handleSubmit} />
					</div>

					{/* Loading Overlay */}
					{submitting && (
						<div className="loading-overlay">
							<LoadingSpinner />
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="form-footer">
					<p>Your item will be reviewed before being published</p>
				</div>
			</div>

			{/* Component Styles */}
			<style jsx>{`
				.loading-container {
					min-height: 100vh;
					display: flex;
					align-items: center;
					justify-content: center;
					background: var(--bg-primary);
				}

				.add-item-wrapper {
					max-width: 600px;
					margin: 0 auto;
					padding: 2rem 0;
				}

				.page-header {
					text-align: center;
					margin-bottom: 2rem;
					opacity: 0;
					animation: fadeInUp 0.6s ease-out forwards;
				}

				.page-header h1 {
					font-size: 2rem;
					color: var(--text-primary);
					margin-bottom: 0.5rem;
					font-weight: 600;
				}

				.page-header p {
					color: var(--text-secondary);
					font-size: 1rem;
				}

				.form-card {
					position: relative;
					margin-bottom: 2rem;
					opacity: 0;
					animation: fadeInUp 0.8s ease-out 0.2s forwards;
				}

				.form-card:hover {
					transform: translateY(-2px);
					box-shadow: 0 8px 24px rgba(0,0,0,0.06);
				}

				.status-message {
					display: flex;
					align-items: center;
					padding: 1rem;
					margin-bottom: 1.5rem;
					border-radius: var(--radius);
					font-size: 0.9rem;
					font-weight: 500;
					transition: var(--transition);
				}

				.status-icon {
					width: 1.25rem;
					height: 1.25rem;
					margin-right: 0.5rem;
					flex-shrink: 0;
				}

				.error-message {
					background: #fef2f2;
					color: #dc2626;
					border: 1px solid #fecaca;
					animation: shake 0.5s ease-in-out;
				}

				.success-message {
					background: #f0fdf4;
					color: #16a34a;
					border: 1px solid #bbf7d0;
					animation: bounceIn 0.6s ease-out;
				}

				.form-wrapper {
					transition: var(--transition);
				}

				.form-wrapper.submitting {
					opacity: 0.6;
					pointer-events: none;
				}

				.loading-overlay {
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: rgba(255, 253, 248, 0.8);
					backdrop-filter: blur(2px);
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: var(--radius);
					opacity: 0;
					animation: fadeIn 0.3s ease-out forwards;
				}

				.form-footer {
					text-align: center;
					opacity: 0;
					animation: fadeInUp 0.8s ease-out 0.4s forwards;
				}

				.form-footer p {
					color: var(--text-secondary);
					font-size: 0.875rem;
				}

				/* Form Styling */
				.form-wrapper :global(form) {
					display: flex;
					flex-direction: column;
					gap: 1.5rem;
				}

				.form-wrapper :global(label) {
					color: var(--text-primary);
					font-weight: 500;
					font-size: 0.95rem;
					margin-bottom: 0.5rem;
					display: block;
				}

				.form-wrapper :global(input),
				.form-wrapper :global(textarea),
				.form-wrapper :global(select) {
					width: 100%;
					padding: 0.75rem 1rem;
					border: 1px solid var(--border-color);
					border-radius: var(--radius);
					background: #fffdf9;
					color: var(--text-primary);
					font-size: 0.95rem;
					transition: var(--transition);
					outline: none;
					margin-bottom: 1rem;
				}

				.form-wrapper :global(input:focus),
				.form-wrapper :global(textarea:focus),
				.form-wrapper :global(select:focus) {
					border-color: #d5c3b8;
					box-shadow: 0 0 0 3px #f1e3d3;
				}

				.form-wrapper :global(input::placeholder),
				.form-wrapper :global(textarea::placeholder) {
					color: #a8a29e;
				}

				.form-wrapper :global(textarea) {
					min-height: 120px;
					resize: vertical;
				}

				.form-wrapper :global(button[type="submit"]) {
					background: var(--accent);
					color: var(--text-primary);
					border: none;
					padding: 0.875rem 2rem;
					border-radius: var(--radius);
					font-size: 1rem;
					font-weight: 600;
					cursor: pointer;
					transition: var(--transition);
					box-shadow: var(--shadow);
					margin-top: 1rem;
				}

				.form-wrapper :global(button[type="submit"]:hover) {
					background: #ecd6c0;
					transform: translateY(-1px);
					box-shadow: 0 6px 18px rgba(0,0,0,0.08);
				}

				.form-wrapper :global(button[type="submit"]:disabled) {
					background: #f5f5f4;
					color: #a8a29e;
					cursor: not-allowed;
					transform: none;
					box-shadow: none;
				}

				.form-wrapper :global(.form-group) {
					margin-bottom: 1.5rem;
				}

				.form-wrapper :global(.file-input) {
					border: 2px dashed var(--border-color);
					border-radius: var(--radius);
					padding: 2rem;
					text-align: center;
					background: var(--bg-secondary);
					transition: var(--transition);
					cursor: pointer;
				}

				.form-wrapper :global(.file-input:hover) {
					border-color: #d5c3b8;
					background: #f4e8da;
				}

				.form-wrapper :global(.file-input input[type="file"]) {
					display: none;
				}

				.form-wrapper :global(.file-input label) {
					cursor: pointer;
					color: var(--text-secondary);
					font-weight: 500;
				}

				.form-wrapper :global(.file-input label:hover) {
					color: var(--text-primary);
				}

				.form-wrapper :global(.form-error) {
					color: #dc2626;
					font-size: 0.875rem;
					margin-top: 0.25rem;
				}

				.form-wrapper :global(.form-help) {
					color: var(--text-secondary);
					font-size: 0.875rem;
					margin-top: 0.25rem;
				}

				/* Animations */
				@keyframes fadeInUp {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}

				@keyframes shake {
					0%, 100% { transform: translateX(0); }
					25% { transform: translateX(-5px); }
					75% { transform: translateX(5px); }
				}

				@keyframes bounceIn {
					0% {
						opacity: 0;
						transform: scale(0.9);
					}
					50% {
						transform: scale(1.05);
					}
					100% {
						opacity: 1;
						transform: scale(1);
					}
				}

				/* Responsive Design */
				@media (max-width: 768px) {
					.add-item-wrapper {
						padding: 1rem;
					}
					
					.page-header h1 {
						font-size: 1.75rem;
					}
					
					.form-wrapper :global(input),
					.form-wrapper :global(textarea),
					.form-wrapper :global(select) {
						font-size: 16px; /* Prevents zoom on iOS */
					}
				}
			`}</style>
		</main>
	);
}