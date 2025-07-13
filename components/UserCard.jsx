export default function UserCard({ user }) {
	return (
		<div className="card flex flex-col items-center p-6 max-w-sm mx-auto text-center hover:transform hover:scale-105 transition-[var(--transition)]">
			{/* Avatar */}
			<div className="relative mb-4">
				<img
					src={user.avatar || "/images/default-avatar.png"}
					alt={user.username || user.name || "User"}
					className="w-20 h-20 rounded-full border-3 border-[var(--border-color)] shadow-[var(--shadow)] object-cover transition-[var(--transition)] hover:border-[#c9b9a7]"
				/>
				<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--accent)] rounded-full border-2 border-[var(--bg-primary)] flex items-center justify-center">
					<svg
						className="w-3 h-3 text-[var(--text-secondary)]"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
			</div>

			{/* User Info */}
			<div className="space-y-2 w-full">
				{/* Username/Name */}
				<div className="font-semibold text-lg text-[var(--text-primary)] leading-tight">
					{user.username || user.name}
				</div>

				{/* Email */}
				<div className="text-sm text-[var(--text-secondary)] break-all">
					{user.email}
				</div>

				{/* Points Badge */}
				{user.points !== undefined && (
					<div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#e8f5e8] to-[#d4edda] text-[#2d5a2d] text-xs font-medium rounded-full border border-[#c3e6cb] shadow-sm mt-3">
						<svg
							className="w-3 h-3"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clipRule="evenodd"
							/>
						</svg>
						<span>{user.points} Points</span>
					</div>
				)}

				{/* Optional Role Badge */}
				{user.role && user.role !== 'user' && (
					<div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#fff3cd] to-[#ffeaa7] text-[#856404] text-xs font-medium rounded-full border border-[#ffeaa7] shadow-sm">
						<svg
							className="w-3 h-3"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 01-1.414-1.414A7.972 7.972 0 0017 12a7.972 7.972 0 00-1.343-4.243 1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
						<span className="capitalize">{user.role}</span>
					</div>
				)}
			</div>

			{/* Optional Action Buttons */}
			<div className="flex gap-2 mt-4 w-full">
				<button className="btn flex-1 text-sm py-2 px-4 hover:transform hover:scale-105">
					View Profile
				</button>
				<button className="btn flex-1 text-sm py-2 px-4 bg-[var(--bg-secondary)] hover:bg-[var(--accent)] hover:transform hover:scale-105">
					Message
				</button>
			</div>
		</div>
	);
}