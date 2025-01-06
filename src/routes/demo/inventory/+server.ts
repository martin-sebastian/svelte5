import { db } from '$lib/server/db';
import { motorcycle, motorcycleImage, motorcycleAttribute } from '$lib/server/db/schema';
import { createId } from '@paralleldrive/cuid2';
import { Parser } from 'xml2js';
import fetch from 'node-fetch';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateSessionToken } from '$lib/server/auth';

export const GET: RequestHandler = async ({ cookies }) => {
	// Get the session token from cookies
	const sessionToken = cookies.get('auth-session');

	// If no session token exists, return unauthorized
	if (!sessionToken) {
		return json(
			{
				success: false,
				error: 'Unauthorized'
			},
			{
				status: 401
			}
		);
	}

	// Validate the session token
	const { user } = await validateSessionToken(sessionToken);

	// If no valid user, return unauthorized
	if (!user) {
		return json(
			{
				success: false,
				error: 'Unauthorized'
			},
			{
				status: 401
			}
		);
	}

	try {
		// 1. Fetch the XML feed
		const response = await fetch('https://www.flatoutmotorcycles.com/unitinventory_univ.xml');
		const xmlData = await response.text();

		// 2. Parse XML to JavaScript object
		const parser = new Parser();
		const result = await parser.parseStringPromise(xmlData);

		// 3. Extract items from parsed data (using feed.item path)
		const items = result.feed.item || [];

		// 4. Process each item
		for (const item of items) {
			const vin = item.vin?.[0] || '';

			// Find existing motorcycle by VIN
			const existingMotorcycle = await db
				.select()
				.from(motorcycle)
				.where(eq(motorcycle.vin, vin))
				.limit(1)
				.then((rows) => rows[0]);

			const id = existingMotorcycle?.id || createId();

			// Extract motorcycle data
			const motorcycleData = {
				id,
				title: item.title?.[0] || '',
				link: item.link?.[0] || '',
				description: item.description?.[0] || '',
				price: parseInt((parseFloat(item.price?.[0] || '0') * 100).toString()),
				priceType: item.price_type?.[0] || '',
				stockNumber: item.stocknumber?.[0] || '',
				vin: item.vin?.[0] || '',
				manufacturer: item.manufacturer?.[0] || '',
				year: parseInt(item.year?.[0]) || null,
				color: item.color?.[0] || '',
				modelType: item.model_type?.[0] || '',
				modelTypeStyle: item.model_typestyle?.[0] || '',
				modelName: item.model_name?.[0] || '',
				trimName: item.trim_name?.[0] || '',
				trimColor: item.trim_color?.[0] || '',
				condition: item.condition?.[0] || '',
				usage: item.usage?.[0] || '',
				location: item.location?.[0] || '',
				updated: item.updated?.[0] || '',
				metricType: item.metric_type?.[0] || '',
				metricValue: parseInt(item.metric_value?.[0]) || null,
				lastModified: new Date()
			};

			// Remove id from update data
			const { id: _id, ...updateData } = motorcycleData;

			// Insert or update motorcycle
			await db.insert(motorcycle).values(motorcycleData).onConflictDoUpdate({
				target: motorcycle.vin,
				set: updateData // Using updateData without the id field
			});

			// Handle images
			if (item.images?.[0]?.imageurl) {
				// Delete existing images for this motorcycle
				await db.delete(motorcycleImage).where(eq(motorcycleImage.motorcycleId, id));

				// Insert new images
				for (const imageUrl of item.images[0].imageurl) {
					await db.insert(motorcycleImage).values({
						id: createId(),
						motorcycleId: id,
						imageUrl: imageUrl
					});
				}
			}

			// Handle attributes
			if (item.attributes?.[0]?.attribute) {
				// Delete existing attributes for this motorcycle
				await db.delete(motorcycleAttribute).where(eq(motorcycleAttribute.motorcycleId, id));

				// Insert new attributes
				for (const attr of item.attributes[0].attribute) {
					await db.insert(motorcycleAttribute).values({
						id: createId(),
						motorcycleId: id,
						name: attr.name?.[0] || '',
						value: attr.value?.[0] || ''
					});
				}
			}
		}

		return json({
			success: true,
			message: `Imported ${items.length} motorcycles`
		});
	} catch (err) {
		const error = err as Error;
		console.error('Import error:', {
			message: error.message,
			stack: error.stack,
			timestamp: new Date().toISOString()
		});
		return json(
			{
				success: false,
				error: error.message
			},
			{ status: 500 }
		);
	}
};
