import { db } from '$lib/server/db';
import { vehicle, vehicleImage, vehicleAttribute } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export const load = async () => {
	try {
		const vehicles = await db
			.select({
				id: vehicle.id,
				stockNumber: vehicle.stockNumber,
				vin: vehicle.vin,
				year: vehicle.year,
				manufacturer: vehicle.manufacturer,
				type: vehicle.modelType,
				style: vehicle.modelTypestyle,
				trimName: vehicle.trimName,
				trimColor: vehicle.trimColor,
				usage: vehicle.usage,
				title: vehicle.title,
				description: vehicle.description,
				price: vehicle.price,
				color: vehicle.color,
				metricType: vehicle.metricType,
				metricValue: vehicle.metricValue,
				status: vehicle.status,
				images: sql`group_concat(${vehicleImage.image_url})`,
				attributes: sql`group_concat(${vehicleAttribute.name} || ':' || ${vehicleAttribute.value})`
			})
			.from(vehicle)
			.leftJoin(vehicleImage, eq(vehicle.id, vehicleImage.vehicle_id))
			.leftJoin(vehicleAttribute, eq(vehicle.id, vehicleAttribute.vehicle_id))
			.where(eq(vehicle.status, 'ACTIVE'))
			.groupBy(vehicle.id);

		console.log('Raw query result:', vehicles);

		return {
			vehicles: vehicles.map((v) => ({
				...v,
				images: v.images ? v.images.split(',').filter(Boolean) : [],
				attributes: v.attributes ? v.attributes.split(',').map(attr => {
					const [name, value] = attr.split(':');
					return { name, value };
				}).filter(attr => attr.name && attr.value) : []
			}))
		};
	} catch (error) {
		console.error('Full error details:', error);
		return { vehicles: [] };
	}
};
