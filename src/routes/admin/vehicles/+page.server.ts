import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { vehicle, vehicleImage, vehicleAttribute } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export const load = (async ({ depends, setHeaders, parent }) => {
	// Get parent data which includes verified user
	const { user } = await parent();

	// Log the user for debugging
	console.log('User from parent:', user);

	// Verify we have a user
	if (!user) {
		throw redirect(303, `/auth`);
	}

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
				condition: vehicle.condition,
				metricType: vehicle.metricType,
				metricValue: vehicle.metricValue,
				status: vehicle.status,
				primaryImage: sql<string | null>`(
					SELECT image_url 
					FROM ${vehicleImage} 
					WHERE vehicle_id = ${vehicle.id} 
					LIMIT 1
				)`,
				imageCount: sql<number>`(
					SELECT COUNT(*)::integer
					FROM ${vehicleImage}
					WHERE vehicle_id = ${vehicle.id}
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
				vehicle.condition,
				vehicle.metricType,
				vehicle.metricValue,
				vehicle.status
			);

		return {
			vehicles: vehicles.map((v) => ({
				...v,
				images: [],
				primaryImage: v.primaryImage || null,
				imageCount: v.imageCount || 0
			})),
			user,
			revalidate: 60
		};
	} catch (error) {
		console.error('Database error:', error);
		return {
			vehicles: [],
			user
		};
	}
}) satisfies PageServerLoad;
