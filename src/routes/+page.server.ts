import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { vehicle } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
		// Fetch counts using a single SQL query
		const result = await db.execute(
			sql`
			SELECT 
				COUNT(*) AS totalVehicles,
				COUNT(CASE WHEN usage = 'New' THEN 1 END) AS totalNewVehicles,
				COUNT(CASE WHEN usage = 'Used' THEN 1 END) AS totalUsedVehicles
			FROM ${vehicle}
		`
		);

		// Ensure the result is always valid
		const stats = result[0] ?? { totalVehicles: 0, totalNewVehicles: 0, totalUsedVehicles: 0 };

		return { stats };
	} catch (err) {
		console.error('Error loading admin dashboard:', err);
		throw error(
			500,
			'Failed to load admin dashboard: ' + (err instanceof Error ? err.message : 'Unknown error')
		);
	}
};
