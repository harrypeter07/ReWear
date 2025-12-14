"use client";
import { createContext, useMemo, useCallback } from "react";
import { useUser } from "@/hooks/useUser";

export const UserContext = createContext({ user: null, setUser: () => {}, isLoading: true, refetchUser: async () => {} });

export function UserProvider({ children }) {
	const { user, isLoading, mutate } = useUser();
	
	const setUser = useCallback((newUser) => {
		mutate({ user: newUser }, false);
	}, [mutate]);
	
	const refetchUser = useCallback(async () => {
		await mutate();
	}, [mutate]);
	
	const value = useMemo(() => ({
		user,
		setUser,
		isLoading,
		refetchUser
	}), [user, isLoading, setUser, refetchUser]);
	
	return (
		<UserContext.Provider value={value}>
			{children}
		</UserContext.Provider>
	);
}
