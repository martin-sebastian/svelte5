import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { vehicle } from '$lib/server/db/schema';
import { count } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load = (async () => {
	try {
		const [totalVehicles, totalNewVehicles, totalUsedVehicles] = await Promise.all([
			db.select({ count: count() }).from(vehicle),
			db
				.select({ count: count() })
				.from(vehicle)
				.where(sql`usage = 'New'`),
			db
				.select({ count: count() })
				.from(vehicle)
				.where(sql`usage = 'Used'`)
		]);

		console.log('Server load function - total vehicles:', totalVehicles[0].count);

		return {
			stats: {
				totalVehicles: totalVehicles[0].count,
				totalNewVehicles: totalNewVehicles[0].count,
				totalUsedVehicles: totalUsedVehicles[0].count
			}
		};
	} catch (err) {
		console.error('Error loading admin dashboard:', err);
		throw error(
			500,
			'Failed to load admin dashboard: ' + (err instanceof Error ? err.message : 'Unknown error')
		);
	}
}) satisfies PageServerLoad;
