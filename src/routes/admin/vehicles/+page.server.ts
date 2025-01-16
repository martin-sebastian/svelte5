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
				images: sql<string[]>`json_group_array(distinct ${vehicleImage.imageUrl})`,
				attributes: sql<string>`json_group_array(json_object('name', ${vehicleAttribute.name}, 'value', ${vehicleAttribute.value}))`
			})
			.from(vehicle)
			.leftJoin(vehicleImage, eq(vehicle.id, vehicleImage.vehicleId))
			.leftJoin(vehicleAttribute, eq(vehicle.id, vehicleAttribute.vehicleId))
			.where(eq(vehicle.status, 'ACTIVE'))
			.groupBy(vehicle.id);

		console.log('Raw query result:', vehicles);

		return {
			vehicles: vehicles.map((v) => ({
				...v,
				images: (() => {
					try {
						const imgs = JSON.parse(v.images);
						return Array.isArray(imgs)
							? imgs.sort((a: string, b: string) => {
									const getNumber = (url: string) => {
										const match = url.match(/(\d+)\.JPG$/i);
										return match ? parseInt(match[1]) : 999;
									};
									return getNumber(a) - getNumber(b);
								})
							: [];
					} catch (e) {
						console.error('Error parsing images:', e);
						return [];
					}
				})(),
				attributes: (() => {
					try {
						return JSON.parse(v.attributes || '[]');
					} catch (e) {
						console.error('Error parsing attributes:', e);
						return [];
					}
				})()
			}))
		};
	} catch (error) {
		console.error('Full error details:', error);
		return { vehicles: [] };
	}
};
