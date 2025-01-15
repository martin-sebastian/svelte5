import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { vehicle, type Vehicle } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { XMLParser } from 'fast-xml-parser';

async function fetchXMLData() {
	const response = await fetch('https://www.flatoutmotorcycles.com/unitinventory_univ.xml');
	const xmlText = await response.text();
	return xmlText;
}

async function parseXML(xmlText: string) {
	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: "@_"
	});
	
	const result = parser.parse(xmlText);
	
	// Check if result is an array, if not, wrap it in an array
	const inventory = Array.isArray(result.item) ? result.item : [result.item];
	
	// Map the XML data to our vehicle schema with the correct property names
	return inventory.map((item: any) => ({
		title: item.title || '',
		link: item.link || '',
		description: item.description || '',
		price: parseFloat(item.price) || 0,
		priceType: item.price_type || '',
		stockNumber: item.stocknumber || '',
		vin: item.vin || '',
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
		metricValue: parseInt(item.metric_value) || 1
	}));
}

export const GET: RequestHandler = async ({ locals }) => {
	try {
		const { user } = await locals.auth.validate();

		// Fetch and parse XML
		const xmlText = await fetchXMLData();
		const vehicles = await parseXML(xmlText);

		const results = {
			added: 0,
			updated: 0,
			markedAsSold: 0
		};

		// Process each vehicle
		for (const vehicleData of vehicles) {
			const existingVehicle = await db.query.vehicle.findFirst({
				where: eq(vehicle.vin, vehicleData.vin)
			});

			if (existingVehicle) {
				// Update existing vehicle
				await db.update(vehicle).set({
					stockNumber: vehicleData.stockNumber,
					year: vehicleData.year,
					manufacturer: vehicleData.manufacturer,
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
					description: vehicleData.description,
					price: vehicleData.price,
					priceType: vehicleData.priceType,
					lastModified: new Date()
				}).where(eq(vehicle.id, existingVehicle.id));
				results.updated++;
			} else {
				// Insert new vehicle
				await db.insert(vehicle).values(vehicleData);
				results.added++;
			}
		}

		return json({
			success: true,
			message: `Sync completed: ${results.added} added, ${results.updated} updated, ${results.markedAsSold} marked as sold`,
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
