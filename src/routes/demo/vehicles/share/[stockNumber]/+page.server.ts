import { getVehicleWithCaching } from '$lib/services/vehicle';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	try {
		console.log('Debug: Received stock number:', params.stockNumber);

		if (!params.stockNumber) {
			throw error(400, 'Stock number is required');
		}

		const vehicle = await getVehicleWithCaching(params.stockNumber);
		console.log('Debug: Found vehicle:', vehicle); // This will help us see if we get data

		if (!vehicle) {
			throw error(404, 'Vehicle not found');
		}

		return { vehicle };
	} catch (e) {
		// Log the full error details to your server console
		console.error('Failed to load vehicle:', {
			stockNumber: params.stockNumber,
			error: e.message,
			stack: e.stack
		});

		// Re-throw as a proper HTTP error
		throw error(500, {
			message: 'Failed to load vehicle details',
			cause: e.message
		});
	}
};
