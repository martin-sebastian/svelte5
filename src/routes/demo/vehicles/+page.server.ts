import { db } from '$lib/server/db';
import { motorcycle, motorcycleImage, motorcycleAttribute } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// First, get all motorcycles
	const motorcycles = await db.select().from(motorcycle).all();

	// Then, for each motorcycle, get its first image and attributes
	const motorcyclesWithRelations = await Promise.all(
		motorcycles.map(async (moto) => {
			const images = await db
				.select()
				.from(motorcycleImage)
				.where(eq(motorcycleImage.motorcycleId, moto.id))
				.limit(1)
				.all();

			const attributes = await db
				.select()
				.from(motorcycleAttribute)
				.where(eq(motorcycleAttribute.motorcycleId, moto.id))
				.all();

			return {
				...moto,
				primaryImage: images[0]?.imageUrl || null,
				attributes
			};
		})
	);

	return {
		motorcycles: motorcyclesWithRelations
	};
};
