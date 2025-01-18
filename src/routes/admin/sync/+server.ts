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
		attributeNamePrefix: '@_',
		ignoreDeclaration: true,
		parseAttributeValue: true,
		arrayMode: true
	});

	const result = parser.parse(xmlText);
	console.log('Parsed XML structure:', JSON.stringify(result, null, 2));

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

	const items = Array.isArray(inventory) ? inventory : [inventory];

	return items
		.filter((item) => item)
		.map((item: any) => {
			if (!item.vin) {
				console.warn('Skipping item without VIN:', item);
				return null;
			}

			const images = item.images?.imageurl || [];
			const attributes = item.attributes?.attribute || [];

			const imageUrls = Array.isArray(images) ? images : [images];
			const attributeList = Array.isArray(attributes) ? attributes : [attributes];

			console.log(
				`Found ${imageUrls.length} images and ${attributeList.length} attributes for VIN: ${item.vin}`
			);

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
					vehicle_id: item.id,
					image_url: url
				})),
				attributes: attributeList.filter(Boolean).map((attr: any) => ({
					vehicle_id: item.id,
					name: attr.name || '',
					value: attr.value || ''
				}))
			};
		})
		.filter((item) => item !== null);
}

export const GET: RequestHandler = async () => {
	try {
		console.log('Starting sync process');

		const xmlText = await fetchXMLData();
		const parsedData = await parseXML(xmlText);

		if (!parsedData.length) {
			return json(
				{
					success: false,
					error: 'No valid vehicles found in XML data'
				},
				{ status: 400 }
			);
		}

		const results = {
			added: 0,
			updated: 0,
			markedAsSold: 0,
			imagesAdded: 0,
			attributesAdded: 0
		};

		const processedIds = new Set<string>();

		for (const data of parsedData) {
			if (!data) continue;
			const { vehicle: vehicleData, images, attributes } = data;

			processedIds.add(vehicleData.id);

			try {
				const existingVehicles = await db
					.select()
					.from(vehicle)
					.where(eq(vehicle.id, vehicleData.id));

				const existingVehicle = existingVehicles[0];

				if (existingVehicle) {
					await db
						.update(vehicle)
						.set({
							...vehicleData
						})
						.where(eq(vehicle.id, vehicleData.id));

					try {
						try {
							await db.delete(vehicleImage).where(eq(vehicleImage.vehicle_id, vehicleData.id));
						} catch (imageError) {
							console.warn('Image deletion skipped:', imageError);
						}

						try {
							await db
								.delete(vehicleAttribute)
								.where(eq(vehicleAttribute.vehicle_id, vehicleData.id));
						} catch (attrError) {
							console.warn('Attribute deletion skipped:', attrError);
						}

						results.updated++;
					} catch (deleteError) {
						console.error('Delete operation failed:', deleteError);
					}
				} else {
					await db.insert(vehicle).values({
						...vehicleData,
						status: 'ACTIVE'
					});

					if (images.length > 0) {
						try {
							console.log(
								`Attempting to insert ${images.length} images for vehicle ID: ${vehicleData.id}`
							);
							await db.insert(vehicleImage).values(
								images.map((image) => ({
									id: crypto.randomUUID(),
									vehicle_id: vehicleData.id,
									image_url: image.image_url
								}))
							);
							results.imagesAdded += images.length;
						} catch (imageError) {
							console.error('Failed to insert images:', imageError);
						}
					}

					if (attributes.length > 0) {
						try {
							await db.insert(vehicleAttribute).values(
								attributes.map(({ name, value }) => ({
									id: crypto.randomUUID(),
									vehicle_id: vehicleData.id,
									name,
									value
								}))
							);
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

		try {
			const soldUpdate = await db
				.update(vehicle)
				.set({
					status: 'SOLD'
				})
				.where(
					and(
						notInArray(
							vehicle.id,
							Array.from(processedIds).map((id) => String(id))
						),
						eq(vehicle.status, 'ACTIVE')
					)
				);

			const soldCount = await db
				.select({ count: sql`count(*)` })
				.from(vehicle)
				.where(and(eq(vehicle.status, 'SOLD'), sql`DATE(${vehicle.lastModified}) = CURRENT_DATE`));

			results.markedAsSold = Number(soldCount[0]?.count) || 0;

			console.log(`Marked ${results.markedAsSold} vehicles as SOLD`);
		} catch (soldError) {
			console.error('Error marking vehicles as SOLD:', soldError);
			console.error('Processed IDs:', Array.from(processedIds));
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

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		for (const item of data) {
			const [existingVehicle] = await db
				.select()
				.from(vehicle)
				.where(eq(vehicle.stockNumber, item.stockNumber))
				.limit(1);

			const vehicleData = {
				stockNumber: item.stockNumber,
				vin: item.vin,
				year: item.year,
				manufacturer: item.manufacturer,
				modelType: item.type,
				modelTypestyle: item.style,
				trimName: item.trimName,
				trimColor: item.trimColor,
				usage: item.usage,
				title: item.title,
				description: item.description,
				price: item.price,
				color: item.color,
				metricType: item.metricType,
				metricValue: item.metricValue,
				status: 'ACTIVE'
			};

			let vehicleId;
			if (existingVehicle) {
				await db.update(vehicle).set(vehicleData).where(eq(vehicle.id, existingVehicle.id));
				vehicleId = existingVehicle.id;
			} else {
				const [newVehicle] = await db
					.insert(vehicle)
					.values(vehicleData)
					.returning({ id: vehicle.id });
				vehicleId = newVehicle.id;
			}

			if (item.images?.length) {
				await db.delete(vehicleImage).where(eq(vehicleImage.vehicleId, vehicleId));

				await db.insert(vehicleImage).values(
					item.images.map((url: string) => ({
						vehicleId,
						imageUrl: url
					}))
				);
			}

			if (item.attributes?.length) {
				await db.delete(vehicleAttribute).where(eq(vehicleAttribute.vehicleId, vehicleId));

				await db.insert(vehicleAttribute).values(
					item.attributes.map(({ name, value }: { name: string; value: string }) => ({
						id: crypto.randomUUID(),
						vehicle_id: vehicleId,
						name,
						value
					}))
				);
			}
		}

		return json({ success: true });
	} catch (error) {
		console.error('Sync error:', error);
		return json({ error: 'Sync failed' }, { status: 500 });
	}
};
