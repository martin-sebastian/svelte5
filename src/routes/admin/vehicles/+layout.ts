import { browser } from '$app/environment';

export const load = async ({ data, depends }) => {
	// Add dependency on 'vehicles' key
	depends('vehicles');

	if (browser) {
		// Store the latest data in sessionStorage
		sessionStorage.setItem('vehiclesData', JSON.stringify({ data, timestamp: Date.now() }));
	}

	return data;
};
