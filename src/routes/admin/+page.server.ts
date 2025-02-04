import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { vehicle } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';

export const load = (async () => {
	const stats = await db.execute(sql`
		SELECT 
			COUNT(*) as total_vehicles,
			COUNT(CASE WHEN usage = 'New' THEN 1 END) as total_new_vehicles,
			COUNT(CASE WHEN usage = 'Used' THEN 1 END) as total_used_vehicles
		FROM ${vehicle}
	`);

	return {
		stats: {
			totalVehicles: Number(stats[0].total_vehicles),
			totalNewVehicles: Number(stats[0].total_new_vehicles),
			totalUsedVehicles: Number(stats[0].total_used_vehicles)
		}
	};
}) satisfies PageServerLoad;
