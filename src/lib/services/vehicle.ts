import { db } from '$lib/server/db';
import { vehicle as vehicleTable, vehicleImage, vehicleAttribute } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function getVehicleWithCaching(id: string) {
	// First, get the vehicle
	const vehicle = await db
		.select()
		.from(vehicleTable)
		.where(eq(vehicleTable.id, id))
		.limit(1)
		.get();

	if (!vehicle) {
		throw new Error('Vehicle not found');
	}

	// Get images and attributes
	const images = await db
		.select()
		.from(vehicleImage)
		.where(eq(vehicleImage.vehicle_id, vehicle.id))
		.limit(1)
		.all();

	const attributes = await db
		.select()
		.from(vehicleAttribute)
		.where(eq(vehicleAttribute.vehicle_id, vehicle.id))
		.all();

	return {
		...vehicle,
		primaryImage: images[0]?.image_url || null,
		attributes
	};
}
