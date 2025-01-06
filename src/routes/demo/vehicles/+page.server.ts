import { db } from '$lib/server/db';
import { motorcycle, motorcycleImage, motorcycleAttribute } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// First, get all vehicles
	const vehicles = await db.select().from(motorcycle).all();

	// Then, for each vehicle, get its first image and attributes
	const vehiclesWithRelations = await Promise.all(
		vehicles.map(async (vehicle) => {
			const images = await db
				.select()
				.from(motorcycleImage)
				.where(eq(motorcycleImage.motorcycleId, vehicle.id))
				.limit(1)
				.all();

			const attributes = await db
				.select()
				.from(motorcycleAttribute)
				.where(eq(motorcycleAttribute.motorcycleId, vehicle.id))
				.all();

			return {
				...vehicle,
				primaryImage: images[0]?.imageUrl || null,
				attributes
			};
		})
	);

	return {
		vehicles: vehiclesWithRelations
	};
};
