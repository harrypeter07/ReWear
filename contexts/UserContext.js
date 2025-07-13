"use client";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({ user: null, setUser: () => {} });

export function UserProvider({ children }) {
	const [user, setUser] = useState(null);
	useEffect(() => {
		async function fetchUser() {
			try {
				const res = await fetch("/api/auth/me", { credentials: "include" });
				if (res.ok) {
					const data = await res.json();
					setUser(data.user);
				} else {
					setUser(null);
				}
			} catch {
				setUser(null);
			}
		}
		fetchUser();
	}, []);
	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
}
