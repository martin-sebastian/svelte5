import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { vehicle, vehicleImage, vehicleAttribute } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export const load = (async ({ depends, locals: { getSession, supabase }, setHeaders }) => {
	setHeaders({
		'cache-control': 'max-age=60'
	});

	depends('vehicles:list');

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
				primaryImage: sql`(
					SELECT image_url 
					FROM ${vehicleImage} 
					WHERE vehicle_id = ${vehicle.id} 
					LIMIT 1
				)`
			})
			.from(vehicle)
			.leftJoin(vehicleImage, eq(vehicle.id, vehicleImage.vehicle_id))
			.leftJoin(vehicleAttribute, eq(vehicle.id, vehicleAttribute.vehicle_id))
			.groupBy(
				vehicle.id,
				vehicle.stockNumber,
				vehicle.vin,
				vehicle.year,
				vehicle.manufacturer,
				vehicle.modelType,
				vehicle.modelTypestyle,
				vehicle.trimName,
				vehicle.trimColor,
				vehicle.usage,
				vehicle.title,
				vehicle.description,
				vehicle.price,
				vehicle.color,
				vehicle.metricType,
				vehicle.metricValue,
				vehicle.status
			);

		return {
			vehicles: vehicles.map((v) => ({
				...v,
				images: v.images ? v.images.split(',').filter(Boolean) : [],
				primaryImage: v.primaryImage || null
			})),
			revalidate: 60
		};
	} catch (error) {
		console.error('Database error:', error);
		return {
			vehicles: []
		};
	}
}) satisfies PageServerLoad;
