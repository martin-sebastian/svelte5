import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

// Cache duration in milliseconds (e.g., 1 minute)
const CACHE_DURATION = 60 * 1000;

export const load = (async ({ locals, setHeaders }) => {
	const session = await locals.getSession();

	try {
		// Set cache headers
		setHeaders({
			'Cache-Control': `max-age=${CACHE_DURATION / 1000}`,
			'Surrogate-Control': `max-age=${CACHE_DURATION / 1000}`
		});

		// Get vehicles with their images using a raw query for better performance
		const vehicles = await db.execute(sql`
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
			GROUP BY v.id
			ORDER BY v.last_modified DESC NULLS LAST
		`);

		// Get unique model types for filtering
		const modelTypes = await db.execute(sql`
			SELECT DISTINCT model_type 
			FROM vehicle 
			WHERE model_type IS NOT NULL 
			ORDER BY model_type ASC
		`);

		return {
			vehicles: vehicles.map((v: any) => ({
				...v,
				primaryImage: v.images?.[0]?.image_url || null,
				images: v.images || []
			})),
			modelTypes: modelTypes.map((m: any) => ({ model_type: m.model_type })),
			user: session?.user || null,
			timestamp: Date.now() // Add timestamp for cache invalidation
		};
	} catch (err) {
		console.error('Error loading vehicles:', err);
		throw error(500, 'Error loading vehicles');
	}
}) satisfies PageServerLoad;
