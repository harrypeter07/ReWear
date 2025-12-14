import useSWR from 'swr';

const fetcher = async (url) => {
	const res = await fetch(url, { credentials: 'include' });
	if (!res.ok) {
		const error = new Error('An error occurred while fetching the data.');
		error.info = await res.json();
		error.status = res.status;
		throw error;
	}
	return res.json();
};

export function useSwaps(userId) {
	const { data, error, isLoading, mutate } = useSWR(
		userId ? `/api/swaps?userId=${userId}` : null,
		fetcher,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: true,
			dedupingInterval: 5000,
		}
	);

	const swaps = data?.swaps || data || [];
	return {
		swaps: Array.isArray(swaps) ? swaps : [],
		isLoading,
		isError: error,
		mutate,
	};
}

