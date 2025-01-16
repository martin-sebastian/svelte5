import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { vehicle, vehicleImage, vehicleAttribute } from '$lib/server/db/schema';
import { eq, and, notInArray } from 'drizzle-orm';
import { XMLParser } from 'fast-xml-parser';
import { sql } from 'drizzle-orm';


async function fetchXMLData() {
	const response = await fetch('https://www.flatoutmotorcycles.com/unitinventory_univ.xml');
	const xmlText = await response.text();
	return xmlText;
}

async function parseXML(xmlText: string) {
	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: "@_",
		ignoreDeclaration: true,
		parseAttributeValue: true,
		arrayMode: true // Force arrays for elements that can appear multiple times
	});
	
	const result = parser.parse(xmlText);
	console.log('Parsed XML structure:', JSON.stringify(result, null, 2)); // Debug

	// More flexible inventory detection
	let inventory;
	if (result.feed?.item) {
		inventory = result.feed.item;
	} else if (result.item) {
		inventory = result.item;
	} else if (result.items?.item) {
		inventory = result.items.item;
	} else {
		throw new Error('Could not find valid inventory items in XML');
	}
	
	// Ensure we have an array
	const items = Array.isArray(inventory) ? inventory : [inventory];
	
	// Map the XML data, maintaining exact field names but adding null checks
	return items.filter(item => item).map((item: any) => {
		// Require VIN as it's our unique identifier
		if (!item.vin) {
			console.warn('Skipping item without VIN:', item);
			return null;
		}

		// Extract images and attributes
		const images = item.images?.imageurl || [];
		const attributes = item.attributes?.attribute || [];

		// Convert to arrays if single items
		const imageUrls = Array.isArray(images) ? images : [images];
		const attributeList = Array.isArray(attributes) ? attributes : [attributes];

		console.log(`Found ${imageUrls.length} images and ${attributeList.length} attributes for VIN: ${item.vin}`);

		return {
			vehicle: {
				id: item.id,
				title: item.title || '',
				link: item.link || '',
				description: item.description || '',
				price: parseFloat(item.price) || 0,
				priceType: item.price_type || '',
				stockNumber: item.stocknumber || '',
				vin: item.vin,
				manufacturer: item.manufacturer || '',
				year: parseInt(item.year) || null,
				color: item.color || '',
				modelType: item.model_type || '',
				modelTypestyle: item.model_typestyle || '',
				modelName: item.model_name || '',
				trimName: item.trim_name || '',
				trimColor: item.trim_color || '',
				condition: item.condition || 'unknown',
				usage: item.usage || '',
				location: item.location || '',
				updated: item.updated || '',
				metricType: item.metric_type || '',
				metricValue: parseInt(item.metric_value) || 0
			},
			images: imageUrls.filter(Boolean).map((url: string) => ({
				vehicle_id: item.vin,
				image_url: url
			})),
			attributes: attributeList.filter(Boolean).map((attr: any) => ({
				vehicle_id: item.vin,
				name: attr.name || '',
				value: attr.value || ''
			}))
		};
	}).filter(item => item !== null); // Remove any null items
}

export const GET: RequestHandler = async ({ locals }) => {
	try {
		const { user } = await locals.auth.validate();

		// Debug logging
		console.log('Starting sync process');

		const xmlText = await fetchXMLData();
		const parsedData = await parseXML(xmlText);

		if (!parsedData.length) {
			return json({
				success: false,
				error: 'No valid vehicles found in XML data'
			}, { status: 400 });
		}

		const results = {
			added: 0,
			updated: 0,
			markedAsSold: 0,
			imagesAdded: 0,
			attributesAdded: 0
		};

		// Keep track of all vehicle IDs from XML
		const processedIds = new Set<string>();

		// Process each vehicle from XML
		for (const data of parsedData) {
			if (!data) continue;
			const { vehicle: vehicleData, images, attributes } = data;

			// Add this ID to our processed set
			processedIds.add(vehicleData.id);

			try {
				const existingVehicles = await db
					.select()
					.from(vehicle)
					.where(eq(vehicle.id, vehicleData.id));

				const existingVehicle = existingVehicles[0];

				if (existingVehicle) {
					// Update existing vehicle
					await db.update(vehicle)
						.set({
							...vehicleData,
							lastModified: new Date()
						})
						.where(eq(vehicle.id, vehicleData.id));
					
					try {
						// Try the delete operations, but don't fail if they don't work
						try {
							// Delete images
							await db
								.delete(vehicleImage)
								.where(eq(vehicleImage.vehicle_id, vehicleData.vin));
						} catch (imageError) {
							console.warn('Image deletion skipped:', imageError);
						}
						
						try {
							// Delete attributes
							await db
								.delete(vehicleAttribute)
								.where(eq(vehicleAttribute.vehicle_id, vehicleData.vin));
						} catch (attrError) {
							console.warn('Attribute deletion skipped:', attrError);
						}
						
						results.updated++;
					} catch (deleteError) {
						console.error('Delete operation failed:', deleteError);
						// Continue processing even if deletes fail
					}
				} else {
					// Insert new vehicle
					await db.insert(vehicle).values({
						...vehicleData,
						status: 'ACTIVE',
						lastModified: new Date()
					});
					
					// Insert images
					if (images.length > 0) {
						try {
							console.log(`Attempting to insert ${images.length} images for vehicle ID: ${vehicleData.id}`);
							await db.insert(vehicleImage).values(images);
							results.imagesAdded += images.length;
						} catch (imageError) {
							console.error('Failed to insert images:', imageError);
						}
					}

					// Insert attributes
					if (attributes.length > 0) {
						try {
							await db.insert(vehicleAttribute).values(attributes);
							results.attributesAdded += attributes.length;
						} catch (attrError) {
							console.error('Failed to insert attributes:', attrError);
						}
					}
					
					results.added++;
				}

			} catch (dbError) {
				console.error('Database operation failed for ID:', vehicleData.id, dbError);
				throw dbError;
			}
		}

		// Mark vehicles as SOLD if they're no longer in the XML feed
		try {
			const soldUpdate = await db
				.update(vehicle)
				.set({ 
					status: 'SOLD',
					lastModified: new Date()
				})
				.where(
					and(
						notInArray(vehicle.id, Array.from(processedIds).map(id => String(id))),
						eq(vehicle.status, 'ACTIVE')
					)
				);
			
			// Get count of vehicles marked as sold
			const soldCount = await db
				.select({ count: sql`count(*)` })
				.from(vehicle)
				.where(
					and(
						eq(vehicle.status, 'SOLD'),
						eq(vehicle.lastModified, new Date())
					)
				);

			results.markedAsSold = Number(soldCount[0]?.count) || 0;
			
			console.log(`Marked ${results.markedAsSold} vehicles as SOLD`);
		} catch (soldError) {
			console.error('Error marking vehicles as SOLD:', soldError);
			console.error('Processed IDs:', Array.from(processedIds)); // Debug logging
		}

		return json({
			success: true,
			message: `Sync completed: ${results.added} added, ${results.updated} updated, ${results.markedAsSold} marked as sold, ${results.imagesAdded} images added, ${results.attributesAdded} attributes added`,
			results
		});
	} catch (error) {
		console.error('Sync error:', error);
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Failed to sync inventory'
			},
			{ status: 500 }
		);
	}
};

export const POST = async ({ request }) => {
	const xmlData = await request.text();
	const parser = new XMLParser({
		ignoreAttributes: false,
		parseTagValue: true,
		trimValues: true
	});
	
	const parsedData = parser.parse(xmlData);
	console.log('Parsed feed:', parsedData); // Debug

	// Access items array
	const items = parsedData.feed.item;
	if (!Array.isArray(items)) {
		// Handle single item case
		const itemsArray = items ? [items] : [];
		// Process single item
	}

	// Process each item
	for (const item of Array.isArray(items) ? items : [items]) {
		const vehicleData = {
			title: item.title,
			link: item.link,
			description: item.description,
			price: parseFloat(item.price),
			priceType: item.price_type,
			stockNumber: item.stocknumber,
			vin: item.vin,
			manufacturer: item.manufacturer,
			year: parseInt(item.year),
			color: item.color,
			modelType: item.model_type,
			modelTypestyle: item.model_typestyle,
			modelName: item.model_name,
			trimName: item.trim_name || null,
			trimColor: item.trim_color || null,
			condition: item.condition,
			usage: item.usage,
			location: item.location,
			updated: item.updated,
			metricType: item.metric_type,
			metricValue: parseInt(item.metric_value)
		};

		console.log('Processing vehicle:', vehicleData.title); // Debug

		// ... rest of your existing processing code ...
	}
};
