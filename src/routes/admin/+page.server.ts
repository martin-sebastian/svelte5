import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { vehicle } from '$lib/server/db/schema';
import { count } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export const load = (async () => {
	try {
		const totalVehicles = await db.select({ count: count() }).from(vehicle);

		const totalNewVehicles = await db
			.select({ count: count() })
			.from(vehicle)
			.where(sql`usage = 'New'`);

		const totalUsedVehicles = await db
			.select({ count: count() })
			.from(vehicle)
			.where(sql`usage = 'Used'`);

		const totalSoldVehicles = await db
			.select({ count: count() })
			.from(vehicle)
			.where(sql`status = 'Sold'`);

		console.log('Server load function - total vehicles:', totalVehicles?.[0]?.count ?? 0);

		return {
			stats: {
				totalVehicles: totalVehicles?.[0]?.count ?? 0,
				totalNewVehicles: totalNewVehicles?.[0]?.count ?? 0,
				totalUsedVehicles: totalUsedVehicles?.[0]?.count ?? 0,
				totalSoldVehicles: totalSoldVehicles?.[0]?.count ?? 0
			}
		};
	} catch (error) {
		console.error('Error loading admin stats:', error);
		return {
			stats: {
				totalVehicles: 0,
				totalNewVehicles: 0,
				totalUsedVehicles: 0,
				totalSoldVehicles: 0
			}
		};
	}
}) satisfies PageServerLoad;
