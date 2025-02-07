import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { invalidate } from '$app/navigation';

const CACHE_DURATION = 60 * 1000; // 1 minute

function createVehiclesCache() {
	const { subscribe, set, update } = writable<any>(null);

	return {
		subscribe,
		set,
		update,
		invalidate: () => {
			if (browser) {
				sessionStorage.removeItem('vehiclesData');
				invalidate('vehicles');
			}
		},
		getCached: () => {
			if (!browser) return null;

			const cached = sessionStorage.getItem('vehiclesData');
			if (!cached) return null;

			const { data, timestamp } = JSON.parse(cached);
			const age = Date.now() - timestamp;

			// Return cached data if it's fresh enough
			if (age < CACHE_DURATION) {
				return data;
			}

			// Clear expired cache
			sessionStorage.removeItem('vehiclesData');
			return null;
		}
	};
}

export const vehiclesCache = createVehiclesCache();
