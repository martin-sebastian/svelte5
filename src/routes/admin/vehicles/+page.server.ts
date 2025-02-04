import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

// Helper function to convert BigInt to Number
function convertBigIntToNumber(value: any): any {
	if (typeof value === 'bigint') {
		return Number(value);
	}
	if (typeof value === 'object' && value !== null) {
		Object.keys(value).forEach((key) => {
			value[key] = convertBigIntToNumber(value[key]);
		});
	}
	return value;
}

export const load = async ({ url, parent }) => {
	try {
		// Auth check is handled by parent layout
		await parent();

		const page = Number(url.searchParams.get('page')) || 1;
		const pageSize = 20;
		const offset = (page - 1) * pageSize;
		const search = url.searchParams.get('search') || '';
		const modelType = url.searchParams.get('modelType') || '';
		const sortBy = url.searchParams.get('sortBy') || 'last_modified';
		const sortOrder = url.searchParams.get('sortOrder') || 'DESC';

		// Build parameterized query for safety
		const whereConditions = [];
		const params: any[] = [];

		if (search) {
			whereConditions.push(`(
				v.manufacturer ILIKE $${params.length + 1} OR 
				v.title ILIKE $${params.length + 1} OR 
				v.vin ILIKE $${params.length + 1} OR
				v.stock_number ILIKE $${params.length + 1}
			)`);
			params.push(`%${search}%`);
		}

		if (modelType) {
			whereConditions.push(`v.model_type = $${params.length + 1}`);
			params.push(modelType);
		}

		const whereClause = whereConditions.length
			? sql`WHERE ${sql.raw(whereConditions.join(' AND '))}`
			: sql``;

		// Optimize the query to only get necessary fields and limit results
		const vehicles = await db.execute(sql`
			SELECT 
				id, manufacturer, title, stock_number, year, price,
				model_type, status, last_modified,
				(SELECT image_url FROM vehicle_image 
				 WHERE vehicle_id = v.id 
				 ORDER BY id LIMIT 1) as primary_image
			FROM vehicle v
			${whereClause}
			ORDER BY last_modified DESC
			LIMIT ${pageSize}
			OFFSET ${offset}
		`);

		// Get total count in a separate, fast query
		const [{ count }] = await db.execute(sql`
			SELECT COUNT(*) as count FROM vehicle
		`);

		const totalCount = Number(count);
		const hasMore = offset + vehicles.length < totalCount;

		return {
			vehicles: vehicles.map(v => ({
				...v,
				primaryImage: v.primary_image || null
			})),
			pagination: {
				page,
				pageSize,
				totalItems: totalCount,
				hasMore
			},
			filters: {
				search,
				modelType,
				sortBy,
				sortOrder
			}
		};
	} catch (err) {
		console.error('Error loading vehicles:', err);
		throw error(500, 'Failed to load vehicles');
	}
} satisfies PageServerLoad;
