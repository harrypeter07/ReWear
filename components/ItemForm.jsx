import { useState } from "react";

export default function ItemForm({ onSubmit }) {
	const [imageBase64, setImageBase64] = useState("");
	const [error, setError] = useState("");

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onloadend = () => {
			setImageBase64(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");
		const form = e.target;
		const data = {
			title: form.title.value.trim(),
			category: form.category.value.trim(),
			size: form.size.value.trim(),
			condition: form.condition.value.trim(),
			description: form.description.value.trim(),
			pointsValue: Number(form.pointsValue.value),
			image: imageBase64,
		};

		// Frontend validation
		if (!data.title) return setError("Title is required.");
		if (!data.category) return setError("Category is required.");
		if (!data.size) return setError("Size is required.");
		if (!data.condition) return setError("Condition is required.");
		if (!data.description || data.description.length < 2)
			return setError("Description must be at least 2 characters.");
		if (
			!form.pointsValue.value ||
			isNaN(data.pointsValue) ||
			data.pointsValue <= 0
		)
			return setError("Points Value must be a positive number.");
		// Optionally, check for image
		// if (!data.image) return setError("Image is required.");

		onSubmit(data);
	};

	return (
		<form className="flex flex-col gap-2" onSubmit={handleSubmit}>
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
			<button type="submit" className="bg-blue-600 text-white p-2 rounded">
				Submit
			</button>
		</form>
	);
}
