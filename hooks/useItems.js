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

export function useItems(uploaderId = null) {
	const key = uploaderId ? `/api/items?uploaderId=${uploaderId}` : '/api/items';
	const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
		dedupingInterval: 5000, // Dedupe requests within 5 seconds
		refreshInterval: 0, // Disable auto-refresh
	});

	return {
		items: data || [],
		isLoading,
		isError: error,
		mutate,
	};
}

export function useItem(id) {
	const { data, error, isLoading, mutate } = useSWR(
		id ? `/api/items/${id}` : null,
		fetcher,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: true,
			dedupingInterval: 5000,
		}
	);

	return {
		item: data,
		isLoading,
		isError: error,
		mutate,
	};
}


