import useSWR from 'swr';

const fetcher = async (url) => {
	const res = await fetch(url, { credentials: 'include' });
	if (!res.ok) {
		if (res.status === 401) {
			return null; // Not authenticated
		}
		const error = new Error('An error occurred while fetching the data.');
		error.info = await res.json();
		error.status = res.status;
		throw error;
	}
	return res.json();
};

export function useUser() {
	const { data, error, isLoading, mutate } = useSWR('/api/auth/me', fetcher, {
		revalidateOnFocus: true,
		revalidateOnReconnect: true,
		dedupingInterval: 2000,
		shouldRetryOnError: false,
	});

	return {
		user: data?.user || null,
		isLoading,
		isError: error,
		mutate,
	};
}

