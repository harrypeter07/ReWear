export default function DashboardWidgets({ stats }) {
	return (
		<div className="grid grid-cols-2 gap-4">
			<div className="card p-6">
				<h3 className="text-lg font-bold text-primary mb-2">Listings</h3>
				<p className="text-secondary text-2xl font-semibold">
					{stats.listings}
				</p>
			</div>
			<div className="card p-6">
				<h3 className="text-lg font-bold text-primary mb-2">Swaps</h3>
				<p className="text-secondary text-2xl font-semibold">{stats.swaps}</p>
			</div>
			{/* TODO: Add more widgets as needed */}
		</div>
	);
}
