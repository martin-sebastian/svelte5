import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';

export const load = (async ({ depends, setHeaders, parent }) => {
	const { user } = await parent();

	if (!user) {
		throw redirect(303, `/auth`);
	}

	setHeaders({
		'cache-control': 'max-age=60'
	});

	depends('vehicles:list');

	// Get unique model_types
	const modelTypes = await db.execute(sql`
		SELECT DISTINCT model_type 
		FROM vehicle 
		WHERE model_type IS NOT NULL 
		AND model_type != ''
		ORDER BY model_type ASC
	`);

	const vehiclesStream = new Promise(async (resolve) => {
		const vehicles = await db.execute(sql`
			SELECT 
				v.*,
				COALESCE(
					(
						SELECT json_agg(
							json_build_object(
								'url', vi.image_url,
								'id', vi.id
							)
						)
						FROM vehicle_image vi 
						WHERE vi.vehicle_id = v.id
					),
					'[]'::json
				) as images
			FROM vehicle v
			ORDER BY v.year DESC
		`);

		// Transform the data - just handle images
		const processedVehicles = vehicles.map((vehicle) => ({
			...vehicle,
			images: vehicle.images || [],
			primaryImage: vehicle.images?.[0]?.url || null
		}));

		resolve(processedVehicles);
	});

	return {
		vehiclesPromise: vehiclesStream,
		modelTypes,
		user,
		revalidate: 60
	};
}) satisfies PageServerLoad;
