export function formatDate(date) {
	return new Date(date).toLocaleDateString();
}

// Fetch all approved and visible items
export async function fetchItems() {
	const res = await fetch("/api/items");
	if (!res.ok) throw new Error("Failed to fetch items");
	return res.json();
}

// Fetch a single item by ID
export async function fetchItemById(id) {
	const res = await fetch(`/api/items/${id}`);
	if (!res.ok) throw new Error("Failed to fetch item");
	return res.json();
}

// Create a new item
export async function createItem(data) {
	const res = await fetch("/api/items/create", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok)
		throw new Error((await res.json()).message || "Failed to create item");
	return res.json();
}

// Approve an item (admin)
export async function approveItem(itemId) {
	const res = await fetch("/api/admin/approve-item", {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ itemId }),
	});
	if (!res.ok)
		throw new Error((await res.json()).error || "Failed to approve item");
	return res.json();
}

// Create a swap or redeem request
export async function createSwapRequest({ itemId, requesterId, type }) {
	const res = await fetch("/api/swaps", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ itemId, requesterId, type }),
	});
	if (!res.ok)
		throw new Error(
			(await res.json()).message || "Failed to create swap request"
		);
	return res.json();
}
