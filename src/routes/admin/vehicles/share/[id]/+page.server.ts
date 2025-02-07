import { db } from '$lib/server/db';
import { vehicle, vehicleImage } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const vehicleWithImages = await db
			.select({
				id: vehicle.id,
				title: vehicle.title,
				description: vehicle.description,
				price: vehicle.price,
				stockNumber: vehicle.stockNumber,
				vin: vehicle.vin,
				status: vehicle.status,
				link: vehicle.link,
				location: vehicle.location,
				usage: vehicle.usage,
				condition: vehicle.condition,
				metricValue: vehicle.metricValue,
				metricType: vehicle.metricType,
				images: vehicleImage
			})
			.from(vehicle)
			.leftJoin(vehicleImage, eq(vehicle.id, vehicleImage.vehicle_id))
			.where(eq(vehicle.id, params.id));

		if (!vehicleWithImages.length) {
			throw error(404, 'Vehicle not found');
		}

		// Restructure the data to include all images
		const vehicleData = {
			...vehicleWithImages[0],
			images: vehicleWithImages
				.filter((v) => v.images)
				.map((v) => ({
					url: v.images?.image_url,
					id: v.images?.id
				}))
		};

		return { vehicle: vehicleData };
	} catch (e) {
		console.error('Failed to load vehicle:', e);
		throw error(500, { message: 'Failed to load vehicle details', cause: e.message });
	}
};
