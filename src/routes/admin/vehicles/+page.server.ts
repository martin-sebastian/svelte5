import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

type VehicleRecord = {
	id: string;
	images: Array<{ id: string; image_url: string }>;
	title?: string;
	stock_number?: string;
	vin?: string;
	manufacturer?: string;
	year?: number;
	color?: string;
	model_type?: string;
	usage?: string;
	price?: number;
	status?: string;
	last_modified?: string;
};

type ModelTypeRecord = {
	model_type: string;
};

export const load = (async () => {
	try {
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
			vehicles: (vehicles as VehicleRecord[]).map((v) => ({
				...v,
				primaryImage: v.images?.[0]?.image_url || null,
				images: v.images || []
			})),
			modelTypes: (modelTypes as ModelTypeRecord[]).map((m) => ({ model_type: m.model_type }))
		};
	} catch (err) {
		console.error('Error loading vehicles:', err);
		throw error(500, 'Failed to load vehicles');
	}
}) satisfies PageServerLoad;
