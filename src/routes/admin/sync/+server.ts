import { db } from '$lib/server/db';
import {
	vehicle as vehicle,
	vehicleImage as vehicleImage,
	vehicleAttribute as vehicleAttribute,
	type VehicleStatus
} from '$lib/server/db/schema';
import { createId } from '@paralleldrive/cuid2';
import { Parser } from 'xml2js';
import fetch from 'node-fetch';
import { eq, sql } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateSessionToken } from '$lib/server/auth';

async function processVehicleImages(vehicleId: string, imageData: any) {
	console.log('Full image data:', JSON.stringify(imageData, null, 2));

	// Get existing images for this vehicle
	const existingImages = await db
		.select()
		.from(vehicleImage)
		.where(eq(vehicleImage.vehicleId, vehicleId));

	const existingUrls = new Set(existingImages.map((img) => img.imageUrl));
	const newImages = new Set<string>();

	// Extract image URLs from the nested structure
	if (imageData?.images?.[0]?.imageurl) {
		const imageUrls = imageData.images[0].imageurl;
		imageUrls.forEach((url: string) => {
			if (url && typeof url === 'string' && !existingUrls.has(url)) {
				newImages.add(url);
			}
		});
	}

	// Only insert new images that don't already exist
	const imageInserts = Array.from(newImages).map((imageUrl) => ({
		id: createId(),
		vehicleId: vehicleId,
		imageUrl: imageUrl
	}));

	if (imageInserts.length > 0) {
		try {
			await db.insert(vehicleImage).values(imageInserts);
			console.log(`Added ${imageInserts.length} new images for vehicle ${vehicleId}`);
		} catch (error) {
			console.error('Error inserting images:', error);
		}
	}
}

async function processVehicleAttributes(vehicleId: string, item: any) {
	// Get existing attributes
	const existingAttributes = await db
		.select()
		.from(vehicleAttribute)
		.where(eq(vehicleAttribute.vehicleId, vehicleId));

	const existingMap = new Map(existingAttributes.map((attr) => [attr.name, attr]));
	const attributes: any[] = [];

	// Process each attribute from the XML
	const attributeFields = [
		'transmission',
		'engine',
		'drivetrain',
		'exteriorColor',
		'interiorColor',
		'doors',
		'bodyStyle',
		'fuelType' // Add any other attributes you want to track
	];

	attributeFields.forEach((field) => {
		const value = item[field]?.[0];
		if (value) {
			attributes.push({
				id: existingMap.get(field)?.id || createId(),
				vehicleId: vehicleId,
				name: field,
				value: value
			});
		}
	});

	if (attributes.length > 0) {
		try {
			// Use upsert to handle both new and existing attributes
			for (const attr of attributes) {
				await db
					.insert(vehicleAttribute)
					.values(attr)
					.onConflict((columns) => columns.vehicleId.name)
					.merge();
			}
			console.log(`Processed ${attributes.length} attributes for vehicle ${vehicleId}`);
		} catch (error) {
			console.error('Error processing attributes:', error);
		}
	}
}

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
		// Initialize metrics
		const metrics = {
			total: 0,
			inserted: 0,
			updated: 0,
			removed: 0
		};

		// Get existing vehicles for comparison
		const existingVehicles = await db
			.select({
				id: vehicle.id,
				vin: vehicle.vin,
				stockNumber: vehicle.stockNumber
			})
			.from(vehicle);

		// Create lookup maps for existing vehicles
		const existingVinMap = new Map(existingVehicles.filter((v) => v.vin).map((v) => [v.vin, v.id]));
		const existingStockMap = new Map(
			existingVehicles.filter((v) => v.stockNumber).map((v) => [v.stockNumber, v.id])
		);

		// 1. Fetch the XML feed
		const response = await fetch('https://www.flatoutmotorcycles.com/unitinventory_univ.xml');
		const xmlData = await response.text();

		// 2. Parse XML to JavaScript object
		const parser = new Parser();
		const result = await parser.parseStringPromise(xmlData);

		// 3. Extract items from parsed data (using feed.item path)
		const items = result.feed.item || [];

		// Track processed vehicles to identify removed ones
		const processedIds = new Set<string>();

		// 4. Process each item
		for (const item of items) {
			metrics.total++;
			const vin = item.vin?.[0] || '';
			const stockNumber = item.stocknumber?.[0] || '';

			// Find existing vehicle
			let existingId = vin ? existingVinMap.get(vin) : null;
			if (!existingId && stockNumber) {
				existingId = existingStockMap.get(stockNumber);
			}

			const id = existingId || createId();
			processedIds.add(id);

			// Extract inventory data
			const vehicleData = {
				id,
				title: item.title?.[0] || '',
				link: item.link?.[0] || '',
				description: item.description?.[0] || '',
				price: parseInt((parseFloat(item.price?.[0] || '0') * 100).toString()),
				priceType: item.price_type?.[0] || '',
				stockNumber: stockNumber,
				vin: vin,
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
				lastModified: new Date(),
				status: 'ACTIVE'
			};

			// Remove id from update data
			const { id: _id, ...updateData } = vehicleData;

			// Insert or update vehicle
			if (existingId) {
				metrics.updated++;
			} else {
				metrics.inserted++;
			}

			// Insert or update inventory
			await db
				.insert(vehicle)
				.values(vehicleData)
				.onConflictDoUpdate({
					target: vehicle.vin,
					set: {
						...updateData,
						stockNumber: stockNumber,
						lastModified: new Date(),
						status: 'ACTIVE' as VehicleStatus
					}
				});

			// Pass the entire image data object
			await processVehicleImages(id, {
				images: item.images,
				primaryImage: item.primary_image?.[0] || item.primaryImage?.[0]
			});

			// Handle attributes
			if (item.attributes?.[0]?.attribute) {
				const existingAttributes = await db
					.select()
					.from(vehicleAttribute)
					.where(eq(vehicleAttribute.vehicleId, id));

				const existingAttributeMap = new Map(
					existingAttributes.map((attr) => [`${attr.name}-${attr.value}`, attr])
				);

				for (const attr of item.attributes[0].attribute) {
					const name = attr.name?.[0] || '';
					const value = attr.value?.[0] || '';
					const key = `${name}-${value}`;

					if (!existingAttributeMap.has(key)) {
						await db.insert(vehicleAttribute).values({
							id: createId(),
							vehicleId: id,
							name,
							value
						});
					}
				}

				const newAttributeKeys = new Set(
					item.attributes[0].attribute.map(
						(attr) => `${attr.name?.[0] || ''}-${attr.value?.[0] || ''}`
					)
				);

				for (const [key, existingAttr] of existingAttributeMap) {
					if (!newAttributeKeys.has(key)) {
						await db.delete(vehicleAttribute).where(eq(vehicleAttribute.id, existingAttr.id));
					}
				}
			}

			// Process both images and attributes
			await processVehicleImages(id, {
				images: item.images,
				primaryImage: item.primary_image?.[0] || item.primaryImage?.[0]
			});

			await processVehicleAttributes(id, item);
		}

		// Find vehicles that are no longer in the feed
		const removedVehicles = existingVehicles.filter((v) => !processedIds.has(v.id));
		metrics.removed = removedVehicles.length;

		// Optionally mark removed vehicles as sold instead of deleting them
		if (removedVehicles.length > 0) {
			await db
				.update(vehicle)
				.set({
					status: 'SOLD',
					lastModified: new Date()
				})
				.where(sql`id IN ${removedVehicles.map((v) => v.id)}`);
		}

		return json({
			success: true,
			metrics: {
				total: metrics.total,
				inserted: metrics.inserted,
				updated: metrics.updated,
				removed: metrics.removed
			},
			message: `Sync completed: ${metrics.inserted} new vehicles, ${metrics.updated} updated, ${metrics.removed} marked as sold`
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
