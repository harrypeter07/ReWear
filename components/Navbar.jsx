export default function Navbar() {
	return (
		<nav
			className="flex items-center justify-between p-4 shadow"
			style={{ background: "var(--surface)", color: "var(--foreground)" }}
		>
			<div
				className="font-bold text-xl"
				style={{ color: "var(--foreground)", opacity: 0.9 }}
			>
				ReWear
			</div>
			<ul className="flex gap-4">
				<li>
					<a
						href="/"
						className="hover:underline"
						style={{ color: "var(--foreground)", opacity: 0.7 }}
					>
						Home
					</a>
				</li>
				<li>
					<a
						href="/items"
						className="hover:underline"
						style={{ color: "var(--foreground)", opacity: 0.7 }}
					>
						Browse
					</a>
				</li>
				<li>
					<a
						href="/dashboard"
						className="hover:underline"
						style={{ color: "var(--foreground)", opacity: 0.7 }}
					>
						Dashboard
					</a>
				</li>
				<li>
					<a
						href="/admin"
						className="hover:underline"
						style={{ color: "var(--foreground)", opacity: 0.7 }}
					>
						Admin
					</a>
				</li>
				<li>
					<a
						href="/login"
						className="hover:underline"
						style={{ color: "var(--foreground)", opacity: 0.7 }}
					>
						Login
					</a>
				</li>
			</ul>
		</nav>
	);
}
