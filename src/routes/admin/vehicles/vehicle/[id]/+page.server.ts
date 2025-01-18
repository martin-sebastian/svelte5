import { db } from '$lib/server/db';
import { vehicle, vehicleImage, vehicleAttribute } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const { id } = params;

		if (!id) {
			throw error(400, 'Vehicle ID is required');
		}

		const results = await db
			.select({
				vehicle: vehicle,
				image: vehicleImage,
				attributes: vehicleAttribute
			})
			.from(vehicle)
			.where(eq(vehicle.id, id))
			.leftJoin(vehicleImage, eq(vehicle.id, vehicleImage.vehicle_id))
			.leftJoin(vehicleAttribute, eq(vehicle.id, vehicleAttribute.vehicle_id));

		if (results.length === 0) {
			throw error(404, 'Vehicle not found');
		}

		// Process the results to get the vehicle with all its images and attributes
		const vehicleData = {
			...results[0].vehicle,
			images: [...new Set(results.map((r) => r.image?.image_url).filter(Boolean))],
			attributes: results.map((r) => r.attributes).filter(Boolean)
		};

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
