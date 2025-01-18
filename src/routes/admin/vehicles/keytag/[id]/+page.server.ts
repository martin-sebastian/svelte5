import { db } from '$lib/server/db';
import { vehicle } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	try {
		console.log('Debug: Received vehicle id:', params.id);

		if (!params.id) {
			throw error(400, 'Vehicle ID is required');
		}

		const [vehicleData] = await db.select().from(vehicle).where(eq(vehicle.id, params.id));

		console.log('Debug: Found vehicle:', vehicleData);

		if (!vehicleData) {
			throw error(404, 'Vehicle not found');
		}

		return { vehicle: vehicleData };
	} catch (e) {
		console.error('Failed to load vehicle:', {
			id: params.id,
			error: e.message,
			stack: e.stack
		});

		throw error(500, {
			message: 'Failed to load vehicle details',
			cause: e.message
		});
	}
};
