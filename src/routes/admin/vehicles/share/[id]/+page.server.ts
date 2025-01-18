import { db } from '$lib/server/db';
import { vehicle, vehicleImage } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const [vehicleWithImage] = await db
			.select({
				id: vehicle.id,
				title: vehicle.title,
				description: vehicle.description,
				price: vehicle.price,
				stockNumber: vehicle.stockNumber,
				vin: vehicle.vin,
				status: vehicle.status,
				link: vehicle.link,
				primaryImage: vehicleImage.image_url
			})
			.from(vehicle)
			.leftJoin(vehicleImage, eq(vehicle.id, vehicleImage.vehicle_id))
			.where(eq(vehicle.id, params.id))
			.limit(1);

		if (!vehicleWithImage) {
			throw error(404, 'Vehicle not found');
		}

		return { vehicle: vehicleWithImage };
	} catch (e) {
		console.error('Failed to load vehicle:', e);
		throw error(500, { message: 'Failed to load vehicle details', cause: e.message });
	}
};
