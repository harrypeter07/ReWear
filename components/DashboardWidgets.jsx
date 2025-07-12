export default function DashboardWidgets({ stats }) {
	return (
		<div className="grid grid-cols-2 gap-4">
			<div className="bg-blue-100 p-4 rounded">Listings: {stats.listings}</div>
			<div className="bg-green-100 p-4 rounded">Swaps: {stats.swaps}</div>
			{/* TODO: Add more widgets as needed */}
		</div>
	);
}
