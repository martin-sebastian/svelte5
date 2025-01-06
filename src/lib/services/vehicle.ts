import { db } from '$lib/server/db';
import { motorcycle, motorcycleImage, motorcycleAttribute } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function getVehicleWithCaching(stockNumber: string) {
	// First, get the vehicle
	const vehicle = await db
		.select()
		.from(motorcycle)
		.where(eq(motorcycle.stockNumber, stockNumber))
		.limit(1)
		.then((rows) => rows[0]);

	if (!vehicle) {
		throw new Error('Vehicle not found');
	}

	// Get images and attributes
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
}
