import { db } from '$lib/server/db';
import { motorcycle, motorcycleImage, motorcycleAttribute } from '$lib/server/db/schema';
import { createId } from '@paralleldrive/cuid2';
import { xml2js } from 'xml2js';
import fetch from 'node-fetch';
import { eq } from 'drizzle-orm';

export async function GET() {
	try {
		// 1. Fetch the XML feed
		const response = await fetch('https://www.flatoutmotorcycles.com/unitinventory_univ.xml');
		const xmlData = await response.text();

		// 2. Parse XML to JavaScript object
		const parser = new xml2js.Parser();
		const result = await parser.parseStringPromise(xmlData);

		// 3. Extract items from parsed data (using feed.item path)
		const items = result.feed.item || [];

		// 4. Process each item
		for (const item of items) {
			const id = createId();

			// Extract motorcycle data
			const motorcycleData = {
				id,
				title: item.title?.[0] || '',
				link: item.link?.[0] || '',
				description: item.description?.[0] || '',
				price: parseInt((parseFloat(item.price?.[0] || '0') * 100).toString()), // Convert to cents
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
				updated: item.updated?.[0] ? new Date(item.updated[0]).getTime() : null,
				metricType: item.metric_type?.[0] || '',
				metricValue: parseInt(item.metric_value?.[0]) || null
			};

			// Insert or update motorcycle
			await db.insert(motorcycle).values(motorcycleData).onConflictDoUpdate({
				target: motorcycle.vin,
				set: motorcycleData
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

		return new Response(
			JSON.stringify({
				success: true,
				message: `Imported ${items.length} motorcycles`
			}),
			{
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} catch (error) {
		console.error('Import error:', error);
		return new Response(
			JSON.stringify({
				success: false,
				error: error.message
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
}
