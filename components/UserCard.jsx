export default function UserCard({ user }) {
	return (
		<div className="flex flex-col items-center p-4">
			<img
				src={user.avatar || "/images/default-avatar.png"}
				alt={user.username || user.name || "User"}
				className="w-16 h-16 rounded-full border mb-2"
			/>
			<div className="font-semibold text-base">
				{user.username || user.name}
			</div>
			<div className="text-xs text-gray-500 mb-1">{user.email}</div>
			{user.points !== undefined && (
				<div className="text-xs text-green-700">Points: {user.points}</div>
			)}
		</div>
	);
}
