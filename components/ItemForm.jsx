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
		formData.append("pointsValue", form.pointsValue.value);
		if (form.uploaderId) formData.append("uploaderId", form.uploaderId.value);
		if (selectedFile) {
			formData.append("file", selectedFile);
		} else {
			setError("Image is required.");
			setSubmitting(false);
			return;
		}

		try {
			await onSubmit(formData);
		} catch (err) {
			setError(err.message || "Failed to add item");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<form
			className="card p-8"
			onSubmit={handleSubmit}
			encType="multipart/form-data"
		>
			{error && (
				<div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
			)}
			<input
				type="text"
				name="title"
				placeholder="Title"
				className="border p-2 rounded"
				required
			/>
			<input
				type="text"
				name="category"
				placeholder="Category"
				className="border p-2 rounded"
				required
			/>
			<input
				type="text"
				name="size"
				placeholder="Size"
				className="border p-2 rounded"
				required
			/>
			<input
				type="text"
				name="condition"
				placeholder="Condition (e.g. New, Like New, Used)"
				className="border p-2 rounded"
				required
			/>
			<textarea
				name="description"
				placeholder="Description"
				className="border p-2 rounded"
				required
			/>
			<input
				type="number"
				name="pointsValue"
				placeholder="Points Value"
				className="border p-2 rounded"
				min={1}
				required
			/>
			<input
				type="file"
				accept="image/*"
				onChange={handleImageChange}
				className="border p-2 rounded"
			/>
			{submitting && <div className="text-blue-600 text-sm">Submitting...</div>}
			{previewUrl && (
				<div className="flex items-center gap-2 mt-2">
					<img
						src={previewUrl}
						alt="Preview"
						className="w-24 h-24 object-cover rounded border"
					/>
					<span className="text-xs text-gray-500">Image selected</span>
				</div>
			)}
			<button type="submit" className="btn w-full" disabled={submitting}>
				Submit
			</button>
		</form>
	);
}
