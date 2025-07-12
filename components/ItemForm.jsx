import { useState } from "react";

export default function ItemForm({ onSubmit }) {
	const [imageBase64, setImageBase64] = useState("");

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
		const form = e.target;
		const data = {
			title: form.title.value,
			category: form.category.value,
			size: form.size.value,
			condition: form.condition.value,
			description: form.description.value,
			image: imageBase64,
		};
		onSubmit(data);
	};

	return (
		<form className="flex flex-col gap-2" onSubmit={handleSubmit}>
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
