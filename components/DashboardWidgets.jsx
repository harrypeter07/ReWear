export default function DashboardWidgets({ stats }) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
			<div className="card p-6">
				<h3 className="text-lg font-bold text-primary mb-2">Listings</h3>
				<p className="text-secondary text-2xl font-semibold">
					{stats.listings}
				</p>
			</div>
			<div className="card p-6">
				<h3 className="text-lg font-bold text-primary mb-2">Redeem Requests</h3>
				<p className="text-secondary text-2xl font-semibold">{stats.swaps}</p>
			</div>
			<div className="card p-6">
				<h3 className="text-lg font-bold text-primary mb-2">Purchases</h3>
				<p className="text-secondary text-2xl font-semibold">{stats.purchases ?? 0}</p>
			</div>
			<div className="card p-6">
				<h3 className="text-lg font-bold text-primary mb-2">Points</h3>
				<p className="text-secondary text-2xl font-semibold">{stats.points ?? 0}</p>
			</div>
		</div>
	);
}
