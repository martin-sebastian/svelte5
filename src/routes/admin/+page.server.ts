import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { vehicle } from '$lib/server/db/schema';
import { count } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export const load = (async () => {
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

	console.log('Server load function - total vehicles:', totalVehicles[0].count);

	return {
		stats: {
			totalVehicles: totalVehicles[0].count,
			totalNewVehicles: totalNewVehicles[0].count,
			totalUsedVehicles: totalUsedVehicles[0].count,
			totalSoldVehicles: totalSoldVehicles[0].count
		}
	};
}) satisfies PageServerLoad;
