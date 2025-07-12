export default function ItemForm({ onSubmit }) {
	return (
		<form className="flex flex-col gap-2" onSubmit={onSubmit}>
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
			<textarea
				name="description"
				placeholder="Description"
				className="border p-2 rounded"
				required
			/>
			<input
				type="url"
				name="image"
				placeholder="Image URL"
				className="border p-2 rounded"
			/>
			<button type="submit" className="bg-blue-600 text-white p-2 rounded">
				Submit
			</button>
		</form>
	);
}
