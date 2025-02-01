import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { vehicle } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const [vehicleData] = await db.select().from(vehicle).where(eq(vehicle.id, params.id)).limit(1);

		if (!vehicleData) {
			throw error(404, 'Vehicle not found');
		}

		return {
			vehicle: vehicleData
		};
	} catch (err) {
		console.error('Error loading vehicle:', err);
		throw error(500, 'Error loading vehicle data');
	}
};
