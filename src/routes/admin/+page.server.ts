import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
		// Use a single SQL query to get all three counts in one call
		const result = await db.execute(
			sql`
			SELECT 
				COUNT(*) as total_vehicles,
				COUNT(CASE WHEN usage = 'New' THEN 1 END) as total_new_vehicles,
				COUNT(CASE WHEN usage = 'Used' THEN 1 END) as total_used_vehicles
			FROM vehicle
		`
		);

		// Add console.log to debug the result
		console.log('Query result:', result);

		if (!result || result.length === 0) {
			return {
				stats: {
					totalVehicles: 0,
					totalNewVehicles: 0,
					totalUsedVehicles: 0
				}
			};
		}

		const counts = result[0] as {
			total_vehicles: number;
			total_new_vehicles: number;
			total_used_vehicles: number;
		};

		// Add console.log to debug the returned data
		const returnData = {
			stats: {
				totalVehicles: Number(counts.total_vehicles),
				totalNewVehicles: Number(counts.total_new_vehicles),
				totalUsedVehicles: Number(counts.total_used_vehicles)
			}
		};
		console.log('Returning data:', returnData);

		return returnData;
	} catch (err) {
		console.error('Error loading admin dashboard:', err);
		throw error(
			500,
			'Failed to load admin dashboard: ' + (err instanceof Error ? err.message : 'Unknown error')
		);
	}
};
