import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';

type VehicleImage = {
	id: string;
	image_url: string;
};

type VehicleData = {
	id: string;
	title: string;
	stockNumber: string | null;
	vin: string | null;
	manufacturer: string | null;
	year: number | null;
	color: string | null;
	modelType: string | null;
	modelName: string | null;
	modelTypeStyle: string | null;
	usage: string | null;
	metricType: string | null;
	metricValue: number | null;
	condition: string | null;
	price: number | null;
	status: string;
	images: VehicleImage[];
};

export const load = (async ({ params, locals }) => {
	const session = await locals.getSession();

	try {
		// Get vehicle with its images using a raw query
		const result = await db.execute(sql`
			SELECT 
				v.id,
				v.title,
				v.stock_number as "stockNumber",
				v.vin,
				v.manufacturer,
				v.year,
				v.color,
				v.model_type as "modelType",
				v.model_name as "modelName",
				v.model_typestyle as "modelTypeStyle",
				v.usage,
				v.metric_type as "metricType",
				v.metric_value as "metricValue",
				v.condition,
				v.price,
				v.status,
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
			GROUP BY 
				v.id, v.title, v.stock_number, v.vin, v.manufacturer, 
				v.year, v.color, v.model_type, v.model_name, v.model_typestyle,
				v.usage, v.metric_type, v.metric_value, v.condition, v.price, v.status
		`);

		const vehicleData = result[0] as VehicleData;

		if (!vehicleData) {
			throw error(404, 'Vehicle not found');
		}

		// Transform the data to match the expected format
		const vehicle = {
			...vehicleData,
			primaryImage: vehicleData.images?.[0]?.image_url || null,
			images: vehicleData.images || [],
			imageCount: vehicleData.images?.length || 0
		};

		return {
			vehicle,
			user: session?.user || null
		};
	} catch (err) {
		console.error('Error loading vehicle:', err);
		throw error(500, 'Error loading vehicle data');
	}
}) satisfies PageServerLoad;
