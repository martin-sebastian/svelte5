import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	try {
		const vehicle = await db.execute(sql`
			SELECT 
				v.*,
				COALESCE(
					json_agg(
						json_build_object(
							'id', vi.id,
							'image_url', vi.image_url
						)
					) FILTER (WHERE vi.id IS NOT NULL),
					'[]'
				) as images
			FROM vehicle v
			LEFT JOIN vehicle_image vi ON v.id = vi.vehicle_id
			WHERE v.id = ${params.id}
			GROUP BY v.id
		`);

		if (!vehicle || vehicle.length === 0) {
			throw error(404, 'Vehicle not found');
		}

		return {
			vehicle: vehicle[0]
		};
	} catch (err) {
		console.error('Error loading vehicle:', err);
		throw error(500, 'Error loading vehicle');
	}
}) satisfies PageServerLoad;
