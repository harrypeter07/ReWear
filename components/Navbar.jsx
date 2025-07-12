export default function Navbar() {
	return (
		<nav className="flex items-center justify-between p-4 bg-white shadow">
			<div className="font-bold text-xl">ReWear</div>
			<ul className="flex gap-4">
				<li>
					<a href="/" className="hover:underline">
						Home
					</a>
				</li>
				<li>
					<a href="/items" className="hover:underline">
						Browse
					</a>
				</li>
				<li>
					<a href="/dashboard" className="hover:underline">
						Dashboard
					</a>
				</li>
				<li>
					<a href="/admin" className="hover:underline">
						Admin
					</a>
				</li>
				<li>
					<a href="/login" className="hover:underline">
						Login
					</a>
				</li>
			</ul>
		</nav>
	);
}
