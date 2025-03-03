import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { vehicle, vehicleImage, vehicleAttribute, type VehicleStatus } from '$lib/server/db/schema';
import { eq, and, notInArray } from 'drizzle-orm';
import { XMLParser } from 'fast-xml-parser';
import { sql } from 'drizzle-orm';
import type { InferInsertModel } from 'drizzle-orm';

type VehicleInsert = InferInsertModel<typeof vehicle>;
type VehicleImageInsert = InferInsertModel<typeof vehicleImage>;
type VehicleAttributeInsert = InferInsertModel<typeof vehicleAttribute>;

function formatDate(date: Date) {
	return date.toISOString();
}

async function fetchXMLData() {
	const response = await fetch('https://www.bigrockpowersportsmarine.com/unitinventory_univ.xml');
	const xmlText = await response.text();
	return xmlText;
}

interface XMLVehicle {
	id: string;
	title: string;
	link: string;
	description: string;
	price: string | number;
	price_type: string;
	stocknumber: string;
	vin: string;
	manufacturer: string;
	year: string | number;
	color: string;
	model_type: string;
	model_typestyle: string;
	model_name: string;
	trim_name: string;
	trim_color: string;
	condition: string;
	usage: string;
	location: string;
	updated: string;
	metric_type: string;
	metric_value: string | number;
	images?: { image: string[] };
	attributes?: { attribute: Array<{ name: string; value: string }> };
}

async function parseXML(xmlText: string) {
	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: '',
		textNodeName: 'text',
		ignoreDeclaration: true,
		parseAttributeValue: true,
		isArray: (tagName: string) => ['images', 'attributes'].includes(tagName)
	});

	const result = parser.parse(xmlText);

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
		.map((item: XMLVehicle) => {
			if (!item.id) {
				return null;
			}

			const images = item.images?.image || [];
			const attributes = item.attributes?.attribute || [];

			const imageUrls = Array.isArray(images) ? images : [images];
			const attributeList = Array.isArray(attributes) ? attributes : [attributes];

			// Convert price to numeric value
			const price = item.price ? item.price.toString() : null;

			const vehicleData: VehicleInsert = {
				id: item.id,
				title: item.title || '',
				link: item.link || '',
				description: item.description || '',
				price,
				priceType: item.price_type || '',
				stockNumber: item.stocknumber || '',
				vin: item.vin || '',
				manufacturer: item.manufacturer || '',
				year: typeof item.year === 'string' ? parseInt(item.year) : item.year || null,
				color: item.color || '',
				modelType: item.model_type || '',
				modelTypestyle: item.model_typestyle || '',
				modelName: item.model_name || '',
				trimName: item.trim_name || '',
				trimColor: item.trim_color || '',
				condition: item.condition || '',
				usage: item.usage || '',
				location: item.location || '',
				updated: item.updated || '',
				metricType: item.metric_type || '',
				metricValue: typeof item.metric_value === 'string' ? parseInt(item.metric_value) : item.metric_value || 0,
				status: 'ACTIVE' as const,
				lastModified: formatDate(new Date())
			};

			const imagesData: VehicleImageInsert[] = imageUrls.filter(Boolean).map((url: string) => ({
				id: crypto.randomUUID(),
				vehicle_id: item.id,
				image_url: url
			}));

			const attributesData: VehicleAttributeInsert[] = attributeList.filter(Boolean).map((attr: { name: string; value: string }) => ({
				id: crypto.randomUUID(),
				vehicle_id: item.id,
				name: attr.name || '',
				value: attr.value || ''
			}));

			return {
				vehicle: vehicleData,
				images: imagesData,
				attributes: attributesData
			};
		})
		.filter((item) => item !== null);
}

export const GET: RequestHandler = async () => {
	try {
		const xmlText = await fetchXMLData();
		const parsedData = await parseXML(xmlText);
		
		const BATCH_SIZE = 50;
		const syncState = {
			added: 0,
			updated: 0,
			markedAsSold: 0,
			imagesAdded: 0,
			attributesAdded: 0,
			currentBatch: 0,
			totalBatches: Math.ceil(parsedData.length / BATCH_SIZE)
		};

		const processedIds = new Set<string>();
		
		// Process in batches
		for (let i = 0; i < parsedData.length; i += BATCH_SIZE) {
			const batch = parsedData.slice(i, i + BATCH_SIZE);
			syncState.currentBatch = Math.floor(i/BATCH_SIZE) + 1;
			console.log(`Processing batch ${syncState.currentBatch} of ${syncState.totalBatches}`);

			// Process each vehicle in the batch
			for (const data of batch) {
				if (!data) continue;
				const { vehicle: vehicleData, images, attributes } = data;
				processedIds.add(vehicleData.id);

				// Check if vehicle exists and has changes
				const existingVehicle = await db
					.select()
					.from(vehicle)
					.where(eq(vehicle.id, vehicleData.id))
					.then(rows => rows[0]);

				if (existingVehicle) {
					// Compare fields to see if update is needed
					const hasChanges = (
						existingVehicle.title !== vehicleData.title ||
						existingVehicle.price !== vehicleData.price ||
						existingVehicle.description !== vehicleData.description ||
						existingVehicle.stockNumber !== vehicleData.stockNumber ||
						existingVehicle.vin !== vehicleData.vin ||
						existingVehicle.manufacturer !== vehicleData.manufacturer ||
						existingVehicle.year !== vehicleData.year ||
						existingVehicle.color !== vehicleData.color ||
						existingVehicle.modelType !== vehicleData.modelType ||
						existingVehicle.modelTypestyle !== vehicleData.modelTypestyle ||
						existingVehicle.modelName !== vehicleData.modelName ||
						existingVehicle.trimName !== vehicleData.trimName ||
						existingVehicle.trimColor !== vehicleData.trimColor ||
						existingVehicle.condition !== vehicleData.condition ||
						existingVehicle.usage !== vehicleData.usage ||
						existingVehicle.location !== vehicleData.location ||
						existingVehicle.updated !== vehicleData.updated ||
						existingVehicle.metricType !== vehicleData.metricType ||
						existingVehicle.metricValue !== vehicleData.metricValue
					);

					if (hasChanges) {
						await db.update(vehicle)
							.set({
								title: vehicleData.title,
								link: vehicleData.link,
								description: vehicleData.description,
								price: vehicleData.price,
								priceType: vehicleData.priceType,
								stockNumber: vehicleData.stockNumber,
								vin: vehicleData.vin,
								manufacturer: vehicleData.manufacturer,
								year: vehicleData.year,
								color: vehicleData.color,
								modelType: vehicleData.modelType,
								modelTypestyle: vehicleData.modelTypestyle,
								modelName: vehicleData.modelName,
								trimName: vehicleData.trimName,
								trimColor: vehicleData.trimColor,
								condition: vehicleData.condition,
								usage: vehicleData.usage,
								location: vehicleData.location,
								updated: vehicleData.updated,
								metricType: vehicleData.metricType,
								metricValue: vehicleData.metricValue,
								lastModified: formatDate(new Date())
							})
							.where(eq(vehicle.id, vehicleData.id));
						syncState.updated++;
					}

					// Update images if they've changed
					const existingImages = await db
						.select()
						.from(vehicleImage)
						.where(eq(vehicleImage.vehicle_id, vehicleData.id));
					const existingImageUrls = existingImages.map(img => img.image_url);
					const newImageUrls = images.map(img => img.image_url);

					if (JSON.stringify(existingImageUrls.sort()) !== JSON.stringify(newImageUrls.sort())) {
						await db.delete(vehicleImage)
							.where(eq(vehicleImage.vehicle_id, vehicleData.id));
						// Only insert if there are images to insert
						if (images.length > 0) {
							await db.insert(vehicleImage).values(images);
							syncState.imagesAdded += images.length;
						}
					}

					// Update attributes if they've changed
					const existingAttributes = await db.select().from(vehicleAttribute).where(eq(vehicleAttribute.vehicle_id, vehicleData.id));
					const existingAttributeValues = existingAttributes.map(attr => ({ name: attr.name, value: attr.value }));
					const newAttributeValues = attributes.map(attr => ({ name: attr.name, value: attr.value }));

					if (JSON.stringify(existingAttributeValues.sort()) !== JSON.stringify(newAttributeValues.sort())) {
						await db.delete(vehicleAttribute)
							.where(eq(vehicleAttribute.vehicle_id, vehicleData.id));
						// Only insert if there are attributes to insert
						if (attributes.length > 0) {
							await db.insert(vehicleAttribute).values(attributes);
							syncState.attributesAdded += attributes.length;
						}
					}
				} else {
					// Insert new vehicle with explicit status
					const status = 'ACTIVE' as const;
					const newVehicle = {
						id: vehicleData.id,
						title: vehicleData.title,
						link: vehicleData.link,
						description: vehicleData.description,
						price: vehicleData.price,
						priceType: vehicleData.priceType,
						stockNumber: vehicleData.stockNumber,
						vin: vehicleData.vin,
						manufacturer: vehicleData.manufacturer,
						year: vehicleData.year,
						color: vehicleData.color,
						modelType: vehicleData.modelType,
						modelTypestyle: vehicleData.modelTypestyle,
						modelName: vehicleData.modelName,
						trimName: vehicleData.trimName,
						trimColor: vehicleData.trimColor,
						condition: vehicleData.condition,
						usage: vehicleData.usage,
						location: vehicleData.location,
						updated: vehicleData.updated,
						metricType: vehicleData.metricType,
						metricValue: vehicleData.metricValue,
						status,
						lastModified: formatDate(new Date())
					} satisfies typeof vehicle.$inferInsert;

					await db.insert(vehicle).values(newVehicle);
					syncState.added++;

					if (images.length > 0) {
						await db.insert(vehicleImage).values(images);
						syncState.imagesAdded += images.length;
					}

					if (attributes.length > 0) {
						await db.insert(vehicleAttribute).values(attributes);
						syncState.attributesAdded += attributes.length;
					}
				}
			}
		}

		// Mark vehicles as sold in one operation
		await db.update(vehicle)
			.set({
				status: 'SOLD',
				lastModified: formatDate(new Date())
			})
			.where(and(
				notInArray(vehicle.id, Array.from(processedIds)),
				eq(vehicle.status, 'ACTIVE')
			));

		const soldCount = await db
			.select({ count: sql`count(*)` })
			.from(vehicle)
			.where(and(
				eq(vehicle.status, 'SOLD'),
				sql`DATE(${vehicle.lastModified}) = CURRENT_DATE`
			));

		syncState.markedAsSold = Number(soldCount[0]?.count) || 0;

		return json({
			success: true,
			message: `Sync completed: ${syncState.added} added, ${syncState.updated} updated, ${syncState.markedAsSold} marked as sold`,
			results: {
				added: syncState.added,
				updated: syncState.updated,
				markedAsSold: syncState.markedAsSold,
				imagesAdded: syncState.imagesAdded,
				attributesAdded: syncState.attributesAdded
			}
		});
	} catch (error) {
		console.error('Sync error:', error);
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Failed to sync inventory'
		}, { status: 500 });
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
				await db.delete(vehicleImage).where(eq(vehicleImage.vehicle_id, vehicleId));

				await db.insert(vehicleImage).values(
					item.images.map((url: string) => ({
						id: crypto.randomUUID(),
						vehicle_id: vehicleId,
						image_url: url
					}))
				);
			}

			if (item.attributes?.length) {
				await db.delete(vehicleAttribute).where(eq(vehicleAttribute.vehicle_id, vehicleId));

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

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const { table } = await request.json();
		console.log('Attempting to delete from table:', table); // Debug log

		switch (table) {
			case 'vehicle':
				await db.delete(vehicle);
				return json({ success: true, message: 'All vehicles deleted successfully' });

			case 'vehicle_image':
				await db.delete(vehicleImage);
				return json({ success: true, message: 'All vehicle images deleted successfully' });

			case 'vehicle_attribute':
				await db.delete(vehicleAttribute);
				return json({ success: true, message: 'All vehicle attributes deleted successfully' });

			default:
				console.error('Invalid table specified:', table); // Debug log
				return json({ success: false, error: 'Invalid table specified' }, { status: 400 });
		}
	} catch (error) {
		console.error('Delete error:', error);
		return json({ success: false, error: 'Failed to delete data' }, { status: 500 });
	}
};
