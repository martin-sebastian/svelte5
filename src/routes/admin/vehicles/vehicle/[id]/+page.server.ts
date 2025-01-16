import { db } from '$lib/server/db';
import { vehicle, vehicleImage, vehicleAttribute } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	// Get the vehicle and its related data
	const results = await db
		.select({
			vehicle: vehicle,
			image: vehicleImage,
			attributes: vehicleAttribute
		})
		.from(vehicle)
		.where(eq(vehicle.id, id))
		.leftJoin(vehicleImage, eq(vehicle.id, vehicleImage.vehicle_id))
		.leftJoin(vehicleAttribute, eq(vehicle.id, vehicleAttribute.vehicle_id))
		.orderBy(asc(vehicleImage.id))
		.all();

	if (results.length === 0) {
		return {
			status: 404,
			error: 'Vehicle not found'
		};
	}

	// Process the results to get the vehicle with all its images and attributes
	const vehicleData = {
		...results[0].vehicle,
		primaryImage: results[0].image?.image_url || null,
		images: [...new Set(results.map((r) => r.image?.image_url).filter(Boolean))],
		attributes: results.map((r) => r.attributes).filter(Boolean)
	};

	return {
		vehicle: vehicleData
	};
};
