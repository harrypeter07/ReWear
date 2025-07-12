export default function UserCard({ user }) {
	return (
		<div className="border rounded p-4 shadow flex flex-col items-center">
			<img
				src={user.avatar || "/images/default.png"}
				alt={user.name}
				className="w-20 h-20 rounded-full mb-2"
			/>
			<h2 className="font-semibold text-lg">{user.name}</h2>
			<p className="text-gray-600">{user.email}</p>
			<p className="text-sm">Points: {user.points}</p>
			{/* TODO: Add more user info or actions */}
		</div>
	);
}
