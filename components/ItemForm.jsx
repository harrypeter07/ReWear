import { useState } from "react";

export default function ItemForm({ onSubmit }) {
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState("");
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		setSelectedFile(file);
		setPreviewUrl(URL.createObjectURL(file));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSubmitting(true);
		const form = e.target;
		const formData = new FormData();
		formData.append("title", form.title.value.trim());
		formData.append("category", form.category.value.trim());
		formData.append("size", form.size.value.trim());
		formData.append("condition", form.condition.value.trim());
		formData.append("description", form.description.value.trim());
		const points = Number(form.pointsValue.value);
		formData.append("pointsValue", String(points));
		if (form.uploaderId) formData.append("uploaderId", form.uploaderId.value);
		if (selectedFile) {
			formData.append("file", selectedFile);
		} else {
			setError("Image is required.");
			setSubmitting(false);
			return;
		}

		try {
			if (points > 10) {
				const proceed = window.confirm(
					"Points are greater than 10. This item will be sent for admin review. Continue?"
				);
				if (!proceed) {
					setSubmitting(false);
					return;
				}
			}
			await onSubmit(formData);
		} catch (err) {
			setError(err.message || "Failed to add item");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<form
			className="space-y-6"
			onSubmit={handleSubmit}
			encType="multipart/form-data"
		>
			{error && (
				<div className="bg-red-100 text-red-700 p-4 rounded-lg border border-red-200">
					{error}
				</div>
			)}
			<div className="space-y-2">
				<label htmlFor="title" className="block text-sm font-medium text-gray-700">
					Title
				</label>
				<input
					id="title"
					type="text"
					name="title"
					placeholder="Enter item title"
					className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					required
				/>
			</div>
			<div className="space-y-2">
				<label htmlFor="category" className="block text-sm font-medium text-gray-700">
					Category
				</label>
				<input
					id="category"
					type="text"
					name="category"
					placeholder="Enter category"
					className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					required
				/>
			</div>
			<div className="space-y-2">
				<label htmlFor="size" className="block text-sm font-medium text-gray-700">
					Size
				</label>
				<input
					id="size"
					type="text"
					name="size"
					placeholder="Enter size"
					className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					required
				/>
			</div>
			<div className="space-y-2">
				<label htmlFor="condition" className="block text-sm font-medium text-gray-700">
					Condition
				</label>
				<input
					id="condition"
					type="text"
					name="condition"
					placeholder="e.g. New, Like New, Used"
					className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					required
				/>
			</div>
			<div className="space-y-2">
				<label htmlFor="description" className="block text-sm font-medium text-gray-700">
					Description
				</label>
				<textarea
					id="description"
					name="description"
					placeholder="Enter description"
					rows={4}
					className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
					required
				/>
			</div>
			<div className="space-y-2">
				<label htmlFor="pointsValue" className="block text-sm font-medium text-gray-700">
					Points Value
				</label>
				<input
					id="pointsValue"
					type="number"
					name="pointsValue"
					placeholder="Enter points value"
					className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					min={1}
					required
				/>
			</div>
			<div className="space-y-2">
				<label htmlFor="file" className="block text-sm font-medium text-gray-700">
					Image
				</label>
				<input
					id="file"
					type="file"
					accept="image/*"
					onChange={handleImageChange}
					className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
				/>
			</div>
			{previewUrl && (
				<div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
					<img
						src={previewUrl}
						alt="Preview"
						className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300"
					/>
					<span className="text-sm text-gray-600">Image selected</span>
				</div>
			)}
			{submitting && (
				<div className="text-blue-600 text-sm font-medium p-3 bg-blue-50 rounded-lg border border-blue-200">
					Submitting...
				</div>
			)}
			<button 
				type="submit" 
				className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
				disabled={submitting}
			>
				Submit
			</button>
		</form>
	);
}
