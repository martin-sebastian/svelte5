import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';
import { vehicle } from '$lib/server/db/schema';
import type { VehicleType, ModelType } from '../types/vehicle';

export class VehicleService {
	static async getModelTypes(): Promise<ModelType[]> {
		try {
			// Using Drizzle with efficient query caching
			const modelTypes = await db.execute(sql`
                SELECT DISTINCT model_type, COUNT(*) as count
                FROM vehicle
                WHERE model_type IS NOT NULL
                GROUP BY model_type
                ORDER BY model_type ASC
            `);

			return modelTypes;
		} catch (error) {
			throw new VehicleServiceError('Failed to fetch model types', error);
		}
	}

	static async getVehicles({
		page,
		pageSize,
		search,
		modelType,
		sortBy,
		sortOrder
	}: {
		page: number;
		pageSize: number;
		search: string;
		modelType: string;
		sortBy: string;
		sortOrder: string;
	}): Promise<{ vehicles: VehicleType[]; totalCount: number }> {
		try {
			const offset = (page - 1) * pageSize;
			const whereConditions = [];

			if (search) {
				whereConditions.push(sql`(
                    v.manufacturer ILIKE '%' || ${search} || '%' OR 
                    v.title ILIKE '%' || ${search} || '%' OR 
                    v.vin ILIKE '%' || ${search} || '%' OR
                    v.stock_number ILIKE '%' || ${search} || '%'
                )`);
			}

			if (modelType) {
				whereConditions.push(sql`v.model_type = ${modelType}`);
			}

			const whereClause = whereConditions.length
				? sql`WHERE ${sql.join(whereConditions, sql` AND `)}`
				: sql``;

			const result = await db.execute(sql`
                WITH filtered_vehicles AS (
                    SELECT 
                        v.*,
                        ri.image_url as primary_image,
                        COUNT(*) OVER() as total_count
                    FROM vehicle v
                    LEFT JOIN LATERAL (
                        SELECT image_url
                        FROM vehicle_image vi
                        WHERE vi.vehicle_id = v.id
                        ORDER BY vi.id
                        LIMIT 1
                    ) ri ON true
                    ${whereClause}
                    ORDER BY 
                        CASE 
                            WHEN ${sortBy} = 'manufacturer' THEN v.manufacturer
                            WHEN ${sortBy} = 'model_type' THEN v.model_type
                            WHEN ${sortBy} = 'year' THEN v.year::text
                            WHEN ${sortBy} = 'price' THEN v.price::text
                            ELSE v.last_modified::text
                        END ${sql.raw(sortOrder)} NULLS LAST
                    LIMIT ${pageSize}
                    OFFSET ${offset}
                )
                SELECT *
                FROM filtered_vehicles
            `);

			return {
				vehicles: result,
				totalCount: result[0]?.total_count ? Number(result[0].total_count) : 0
			};
		} catch (error) {
			throw new VehicleServiceError('Failed to fetch vehicles', error);
		}
	}
}

// Custom error class for better error handling
export class VehicleServiceError extends Error {
	constructor(
		message: string,
		public originalError?: unknown
	) {
		super(message);
		this.name = 'VehicleServiceError';
	}
}
