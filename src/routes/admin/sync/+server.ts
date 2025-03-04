import { XMLParser } from 'fast-xml-parser';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { eq, and, notInArray, sql, type InferInsertModel, inArray, not } from 'drizzle-orm';
import { vehicle, vehicleImage, vehicleAttribute, customer } from '$lib/server/db/schema';
import crypto from 'crypto';

// Define the sync progress type
interface SyncProgress {
	added: number;
	updated: number;
	markedAsSold: number;
	imagesAdded: number;
	attributesAdded: number;
	totalItems: number;
	processedItems: number;
	currentBatch?: number;
	totalBatches?: number;
	startTime?: number;
	estimatedTimeRemaining?: number | null;
	logs: string[]; // Array to store log messages
}

// Declare the global variable properly
declare global {
	// Using var is required for global declarations
	// eslint-disable-next-line no-var
	var syncProgress: SyncProgress | null;
}

// Initialize if not exists
global.syncProgress = global.syncProgress || null;

// Define proper types for XML parsing
type XMLImageItem = string | { _text?: string; url?: string; imageurl?: string };
type XMLAttributeItem = { name: string; value: string };

interface XMLParseResult {
	_text?: string;
	[key: string]: unknown;
}

type XMLItem = {
	id: string;
	title?: string;
	link?: string;
	description?: string;
	price?: string | number;
	price_type?: string;
	stocknumber?: string;
	vin?: string;
	manufacturer?: string;
	year?: string | number;
	color?: string;
	model_type?: string;
	model_typestyle?: string;
	model_name?: string;
	trim_name?: string;
	trim_color?: string;
	condition?: string;
	usage?: string;
	location?: string;
	updated?: string;
	metric_type?: string;
	metric_value?: string | number;
	images?: { imageurl?: XMLImageItem[] | XMLImageItem };
	attributes?: Array<{ name: string; value: string }> | { attribute?: Array<{ name: string; value: string }> };
	[key: string]: unknown; // Allow for other properties
};

// Remove the unused @ts-expect-error directive and properly define VehicleInsert
type VehicleInsert = InferInsertModel<typeof vehicle>;

// Define a type for the vehicle data
type VehicleData = {
	id: string;
	title: string;
	link: string;
	description: string;
	price: string; // Keep as string to match database schema
	priceType: string;
	stockNumber: string;
	vin: string;
	manufacturer: string;
	year: number | null;
	color: string;
	modelType: string;
	modelTypestyle: string;
	modelName: string;
	trimName: string;
	trimColor: string;
	condition: string;
	usage: string;
	location: string;
	updated: string;
	metricType: string;
	metricValue: number | null;
	status: 'ACTIVE' | 'SOLD' | 'HIDDEN' | 'ARCHIVED';
	lastModified: string;
};

// Define a more specific type for attributes
interface XMLAttribute {
	name: string;
	value: string;
}

async function fetchXMLData(): Promise<string> {
	// Inventory feed URL
	const inventoryURL = 'https://www.bigrockpowersportsmarine.com/unitinventory_univ.xml';
	console.log(`Fetching inventory from: ${inventoryURL}`);

	try {
		// Increase timeout to 2 minutes (120000ms) instead of 30s
		const abortController = new AbortController();
		const timeout = setTimeout(() => abortController.abort(), 120000); // 2 minutes timeout
		
		const response = await fetch(inventoryURL, { 
			signal: abortController.signal,
			headers: {
				'Accept': 'application/xml, text/xml',
				'User-Agent': 'BigRockPowerSports/1.0'
			}
		});
		
		clearTimeout(timeout);
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		console.log(`XML fetch successful (status ${response.status})`);
		const xmlText = await response.text();
		console.log(`XML size: ${Math.round(xmlText.length / 1024)} KB`);
		
		return xmlText;
	} catch (error) {
		console.error('Error fetching XML data:', error);
		// More detailed error information
		if (error instanceof DOMException && error.name === 'AbortError') {
			throw new Error(`XML fetch timed out after 2 minutes. The file may be too large or the server is slow to respond.`);
		} else if (error instanceof Error) {
			throw new Error(`Failed to fetch XML: ${error.message}`);
		} else {
			throw new Error('Unknown error fetching XML data');
		}
	}
}

async function parseXML(xmlText: string) {
	try {
		console.log('Parsing XML data...');
		
		// Configure parser to handle attributes correctly
		const parser = new XMLParser({
			ignoreAttributes: false,
			attributeNamePrefix: '_',
			isArray: (name) => ['item', 'imageurl', 'vehicleattr'].includes(name)
		});
		
		// Parse the XML text
		const parsed = parser.parse(xmlText) as { feed?: { item?: XMLItem[] } };
		
		// Check structure and debug
		console.log('Parsed XML structure:', Object.keys(parsed));
		
		// Make sure we have a feed
		if (!parsed.feed || !parsed.feed.item || !Array.isArray(parsed.feed.item)) {
			console.error('Invalid XML structure:', parsed);
			throw new Error('Invalid XML structure: feed.item array not found');
		}
		
		console.log(`Found ${parsed.feed.item.length} items in feed`);
		
		// Map the XML items to our database schema
		return parsed.feed.item
			.filter((item: XMLItem) => {
				// Skip items without ID
				if (!item.id) {
					console.warn('Skipping item without ID');
					return false;
				}
				return true;
			})
			.map((item: XMLItem) => {
				// Handle images - can be array of strings or array of objects with imageurl property
				const imageUrls: string[] = [];
				
				// Process different image formats
				if (item.images && item.images.imageurl) {
					const imageData = item.images.imageurl;
					if (Array.isArray(imageData)) {
						// Handle array of image urls (can be strings or objects)
						imageData.forEach((img: XMLImageItem) => {
							if (typeof img === 'string') {
								imageUrls.push(img);
							} else if (typeof img === 'object' && img !== null) {
								// Some feeds have imageurl as objects with text property or other formats
								const imgObj = img as XMLParseResult;
								if (imgObj._text) {
									imageUrls.push(imgObj._text);
								} else if ('url' in imgObj && typeof imgObj.url === 'string') {
									imageUrls.push(imgObj.url);
								} else if ('imageurl' in imgObj && typeof imgObj.imageurl === 'string') {
									imageUrls.push(imgObj.imageurl);
								}
							}
						});
					} else if (typeof imageData === 'string') {
						// Single string
						imageUrls.push(imageData);
					} else if (typeof imageData === 'object' && imageData !== null) {
						// Single object
						const imgObj = imageData as XMLParseResult;
						if (imgObj._text && typeof imgObj._text === 'string') {
							imageUrls.push(imgObj._text);
						}
					}
				}
				
				console.log(`Found ${imageUrls.length} images for vehicle ${item.id}`);
				
				// Process attributes
				const attributeList: { name: string; value: string }[] = [];
				
				if (item.attributes) {
					// Handle different attribute formats
					if (Array.isArray(item.attributes)) {
						// Direct array of attribute objects
						item.attributes.forEach((attr: unknown) => {
							if (attr && typeof attr === 'object' && 'name' in attr && 'value' in attr) {
								const typedAttr = attr as XMLAttribute;
								attributeList.push({
									name: String(typedAttr.name),
									value: String(typedAttr.value)
								});
							}
						});
					} else if (typeof item.attributes === 'object') {
						// Object with attribute array
						const attrs = item.attributes.attribute;
						if (Array.isArray(attrs)) {
							attrs.forEach((attr: unknown) => {
								if (attr && typeof attr === 'object' && 'name' in attr && 'value' in attr) {
									const typedAttr = attr as XMLAttribute;
									attributeList.push({
										name: String(typedAttr.name),
										value: String(typedAttr.value)
									});
								}
							});
						} else if (attrs && typeof attrs === 'object' && 'name' in attrs && 'value' in attrs) {
							// Single attribute object with explicit type assertion
							const typedAttrs = attrs as XMLAttribute;
							attributeList.push({
								name: String(typedAttrs.name),
								value: String(typedAttrs.value)
							});
						}
					}
				}
				
				// Create the vehicle data - using the correct field names from Drizzle schema and proper type conversions
				const vehicleData = {
					id: item.id,
					title: item.title || '',
					link: item.link || '',
					description: item.description || '',
					// Directly use the price from the XML feed
					price: item.price?.toString() || '0.00',
					priceType: item.price_type || 'default',
					// Fix stockNumber field - map from stocknumber in XML to stock_number in DB
					stockNumber: item.stocknumber || '',
					vin: item.vin || '',
					manufacturer: item.manufacturer || '',
					// Convert year to number for the database
					year: item.year ? Number(item.year) : null,
					color: item.color || '',
					modelType: item.model_type || '',
					modelTypestyle: item.model_typestyle || '',
					modelName: item.model_name || '',
					trimName: item.trim_name || '',
					trimColor: item.trim_color || '',
					condition: item.condition || '',
					usage: item.usage || '',
					location: item.location || '',
					// The updated field from the DMS is guaranteed to be present and reliable
					// We use it as our source of truth for change detection
					updated: item.updated as string,
					metricType: item.metric_type || '',
					// metricValue is defined as integer in schema
					metricValue: item.metric_value ? Number(item.metric_value) : null,
					status: 'ACTIVE' as const,
					lastModified: new Date().toISOString()
				};
				
				return {
					vehicle: vehicleData,
					images: imageUrls,
					attributes: attributeList
				};
			});
	} catch (error) {
		console.error('Error parsing XML:', error);
		throw error;
	}
}

// Add a function to parse customer data from XML
async function parseCustomerData(xmlText: string) {
	try {
		console.log('Parsing customer data from XML...');
		
		// Configure parser to handle attributes correctly
		const parser = new XMLParser({
			ignoreAttributes: false,
			attributeNamePrefix: '_',
			isArray: (name) => ['item'].includes(name) // Ensure item is always treated as array
		});
		
		// Parse the XML text
		const parsed = parser.parse(xmlText) as { feed?: Record<string, unknown> };
		
		// Check if we have feed data
		if (!parsed.feed) {
			console.error('Invalid XML structure for customer data:', parsed);
			throw new Error('Invalid XML structure: feed not found');
		}
		
		// Extract customer data fields from the feed
		const feedData = parsed.feed;
		
		// Try to extract customer data from different possible locations in the XML
		let customerInfo = feedData.customer as Record<string, unknown> || {};
		
		// If no dedicated customer section, try to extract from feed properties
		if (Object.keys(customerInfo).length === 0) {
			customerInfo = feedData;
		}
		
		// Helper function to safely extract string values - simplified version
		const getStringValue = (obj: Record<string, unknown>, key: string): string => {
			// Check for direct property
			if (key in obj) {
				const value = obj[key];
				if (typeof value === 'string') {
					return value;
				}
				if (typeof value === 'number') {
					return String(value);
				}
			}
			
			// Check for attribute version (XML attributes often have _ prefix)
			const attrKey = `_${key}`;
			if (attrKey in obj && typeof obj[attrKey] === 'string') {
				return obj[attrKey] as string;
			}
			
			return '';
		};
		
		// Create customer data object with exact field names from the XML
		const customerData = {
			id: getStringValue(customerInfo, 'customerId'), // Use customerId directly as the primary key
			customerNumber: getStringValue(customerInfo, 'customer'),
			title: getStringValue(customerInfo, 'title'),
			description: getStringValue(customerInfo, 'description'),
			modified: getStringValue(customerInfo, 'modified'),
			address1: getStringValue(customerInfo, 'address1'),
			address2: getStringValue(customerInfo, 'address2'),
			address3: getStringValue(customerInfo, 'address3'),
			country: getStringValue(customerInfo, 'country'),
			state: getStringValue(customerInfo, 'state'),
			city: getStringValue(customerInfo, 'city'),
			zip: getStringValue(customerInfo, 'zip'),
			phone: getStringValue(customerInfo, 'phone'),
			email: getStringValue(customerInfo, 'email'),
			companyUrl: getStringValue(customerInfo, 'companyurl'),
			companyLogo: getStringValue(customerInfo, 'companylogo')
		};
		
		// If no customerId was found, log a warning but don't generate a random UUID
		if (!customerData.id) {
			console.warn('No customerId found in XML. Customer data may not be saved correctly.');
		}
		
		// Log the final customer data
		console.log('Final customer data:', customerData);
		
		return customerData;
	} catch (error) {
		console.error('Error parsing customer data from XML:', error);
		throw error;
	}
}

export const GET: RequestHandler = async ({ url }) => {
	try {
		// Check if we should force update all vehicles (for price corrections)
		const forceUpdate = url.searchParams.get('forceUpdate') === 'true';
		
		// If diagnostic parameter is set, run diagnostics instead of sync
		const runDiagnostics = url.searchParams.get('diagnostics') === 'true';
		
		// If progress parameter is set, return current sync progress
		const checkProgress = url.searchParams.get('progress') === 'true';
		if (checkProgress) {
			// Return the current progress if a sync is in progress
			if (global.syncProgress) {
				return json({
					success: true,
					inProgress: true,
					progress: global.syncProgress
				});
			} else {
				return json({
					success: true,
					inProgress: false
				});
			}
		}
		
		if (runDiagnostics) {
			// Check image counts
			const vehicleCount = await db
				.select({ count: sql`count(*)` })
				.from(vehicle);
			
			const imageCount = await db
				.select({ count: sql`count(*)` })
				.from(vehicleImage);
			
			// Sample data
			const vehicleSample = await db
				.select()
				.from(vehicle)
				.limit(3);
			
			return json({
				vehicleCount: vehicleCount[0]?.count,
				imageCount: imageCount[0]?.count,
				vehicleSample
			});
		}
		
		// Start a background process for sync
		// This prevents the request from timing out
		(async () => {
			try {
				// Fetch XML data
				console.log("Fetching XML data...");
				const xmlText = await fetchXMLData();
				
				// Parse and store customer data
				try {
					const customerData = await parseCustomerData(xmlText);
					
					// Upsert customer data (insert if not exists, update if exists)
					await db.insert(customer)
						.values(customerData)
						.onConflictDoUpdate({
							target: customer.id,
							set: {
								customerNumber: customerData.customerNumber,
								title: customerData.title,
								description: customerData.description,
								modified: customerData.modified,
								address1: customerData.address1,
								address2: customerData.address2,
								address3: customerData.address3,
								country: customerData.country,
								state: customerData.state,
								city: customerData.city,
								zip: customerData.zip,
								phone: customerData.phone,
								email: customerData.email,
								companyUrl: customerData.companyUrl,
								companyLogo: customerData.companyLogo,
								lastUpdated: sql`now()`
							}
						});
					
					console.log("Customer data updated successfully");
				} catch (customerError) {
					console.error("Error processing customer data:", customerError);
					// Continue with vehicle sync even if customer data fails
				}
				
				// Continue with vehicle parsing and sync
				console.log("Parsing XML data for vehicles...");
				const parsedData = await parseXML(xmlText);
				console.log(`Found ${parsedData.length} vehicles to process`);
				
				// Process vehicles in smaller batches to prevent memory issues
				const BATCH_SIZE = 10;
				const processedIds = new Set<string>();
				
				// Simple counters for tracking progress
				const syncState: SyncProgress = {
					added: 0,
					updated: 0,
					markedAsSold: 0,
					imagesAdded: 0,
					attributesAdded: 0,
					totalItems: parsedData.length,
					processedItems: 0,
					logs: [], // Initialize empty logs array
					startTime: Date.now(),
					currentBatch: 0,
					totalBatches: Math.ceil(parsedData.length / BATCH_SIZE),
					estimatedTimeRemaining: null
				};
				
				// Store progress in global object for status checks
				global.syncProgress = syncState;
				
				// Add initial log messages
				addLog(`Starting sync process with ${parsedData.length} vehicles`);
				addLog(`Processing in ${syncState.totalBatches} batches of ${BATCH_SIZE} vehicles each`);
				
				// Helper function to add logs with timestamps
				function addLog(message: string) {
					const timestamp = new Date().toISOString().split('T')[1].substring(0, 8);
					const logMessage = `[${timestamp}] ${message}`;
					console.log(logMessage);
					
					// Add to sync state logs
					if (global.syncProgress?.logs) {
						// Keep only the last 500 logs to prevent memory issues
						if (global.syncProgress.logs.length >= 500) {
							global.syncProgress.logs.shift(); // Remove oldest log
						}
						global.syncProgress.logs.push(logMessage);
					} else {
						// Initialize logs array if it doesn't exist
						if (global.syncProgress) {
							global.syncProgress.logs = [logMessage];
						}
					}
				}
				
				// Process in batches
				for (let i = 0; i < parsedData.length; i += BATCH_SIZE) {
					const batch = parsedData.slice(i, i + BATCH_SIZE);
					const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
					syncState.currentBatch = batchNumber;
					
					addLog(`Processing batch ${batchNumber} of ${Math.ceil(parsedData.length/BATCH_SIZE)} (${batch.length} vehicles)`);
					
					// Prepare collections for bulk operations
					const vehiclesToInsert: VehicleData[] = [];
					const vehiclesToUpdate: { id: string; data: Partial<VehicleData> }[] = [];
					const imagesToInsert: { id: string; vehicle_id: string; image_url: string; position: string; created_at: string }[] = [];
					const attributesToInsert: { id: string; vehicle_id: string; name: string; value: string }[] = [];
					const vehicleIdsToCleanImages: string[] = [];
					const vehicleIdsToCleanAttributes: string[] = [];
					
					// First, query all existing vehicles in this batch to determine inserts vs updates
					const vehicleIds = batch.map(data => data?.vehicle?.id).filter(Boolean) as string[];
					addLog(`Checking ${vehicleIds.length} vehicles against database`);
					
					const existingVehicles = await db
						.select()
						.from(vehicle)
						.where(inArray(vehicle.id, vehicleIds));
					
					addLog(`Found ${existingVehicles.length} existing vehicles in database`);
					
					// Create a map for quick lookup
					const existingVehicleMap = new Map(
						existingVehicles.map(v => [v.id, v])
					);
					
					// Process each vehicle in the batch
					for (const data of batch) {
						if (!data || !data.vehicle) continue;
						
						try {
							const { vehicle: vehicleData, images, attributes } = data;
							processedIds.add(vehicleData.id);
							syncState.processedItems++;
							
							const existingVehicle = existingVehicleMap.get(vehicleData.id);
							
							if (!existingVehicle) {
								// New vehicle - add to insert collection
								vehiclesToInsert.push(vehicleData);
								
								// Prepare images for bulk insert
								if (images && images.length > 0) {
									images.forEach(url => {
										imagesToInsert.push({
											id: crypto.randomUUID(),
											vehicle_id: vehicleData.id,
											image_url: url,
											position: '0',
											created_at: ''
										});
									});
								}
								
								// Prepare attributes for bulk insert
								if (attributes && attributes.length > 0) {
									attributes.forEach(attr => {
										attributesToInsert.push({
											id: crypto.randomUUID(),
											vehicle_id: vehicleData.id,
											name: attr.name,
											value: attr.value
										});
									});
								}
							} else {
								// Vehicle exists - check if it needs to be updated based on the updated date
								// If forceUpdate is true, update regardless of the updated date
								if (forceUpdate || existingVehicle.updated !== vehicleData.updated) {
									// Only update if the updated date has changed or forceUpdate is true
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
											lastModified: new Date().toISOString()
										})
										.where(eq(vehicle.id, vehicleData.id));
									
									syncState.updated++;
									addLog(`Updated vehicle: ${vehicleData.stockNumber}${forceUpdate ? ' (forced update)' : ''}`);
								} else {
									// Skip update if the updated date hasn't changed - this is a major performance optimization
									addLog(`Skipped update for vehicle: ${vehicleData.stockNumber} (no changes detected)`);
								}
								
								// Mark for image cleanup and prepare new images
								if (images && images.length > 0) {
									vehicleIdsToCleanImages.push(vehicleData.id);
									
									images.forEach(url => {
										imagesToInsert.push({
											id: crypto.randomUUID(),
											vehicle_id: vehicleData.id,
											image_url: url,
											position: '0',
											created_at: ''
										});
									});
								}
								
								// Mark for attribute cleanup and prepare new attributes
								if (attributes && attributes.length > 0) {
									vehicleIdsToCleanAttributes.push(vehicleData.id);
									
									attributes.forEach(attr => {
										attributesToInsert.push({
											id: crypto.randomUUID(),
											vehicle_id: vehicleData.id,
											name: attr.name,
											value: attr.value
										});
									});
								}
							}
						} catch (vehicleError) {
							console.error(`Error processing vehicle ${data.vehicle.id}:`, vehicleError);
						}
					}
					
					// Execute bulk operations
					try {
						// Bulk insert new vehicles
						if (vehiclesToInsert.length > 0) {
							await db.insert(vehicle).values(vehiclesToInsert);
							syncState.added += vehiclesToInsert.length;
							addLog(`Bulk inserted ${vehiclesToInsert.length} new vehicles`);
						}
						
						// Bulk update existing vehicles
						for (const { id, data } of vehiclesToUpdate) {
							await db.update(vehicle).set(data).where(eq(vehicle.id, id));
						}
						syncState.updated += vehiclesToUpdate.length;
						if (vehiclesToUpdate.length > 0) {
							addLog(`Updated ${vehiclesToUpdate.length} existing vehicles`);
						}
						
						// Clean up images for vehicles being updated
						if (vehicleIdsToCleanImages.length > 0) {
							await db.delete(vehicleImage)
								.where(inArray(vehicleImage.vehicle_id, vehicleIdsToCleanImages));
							addLog(`Cleaned images for ${vehicleIdsToCleanImages.length} vehicles`);
						}
						
						// Bulk insert images
						if (imagesToInsert.length > 0) {
							// Insert in smaller chunks to avoid query size limits
							const IMAGE_CHUNK_SIZE = 100;
							for (let j = 0; j < imagesToInsert.length; j += IMAGE_CHUNK_SIZE) {
								const imageChunk = imagesToInsert.slice(j, j + IMAGE_CHUNK_SIZE);
								await db.insert(vehicleImage).values(imageChunk);
							}
							syncState.imagesAdded += imagesToInsert.length;
							addLog(`Bulk inserted ${imagesToInsert.length} images`);
						}
						
						// Clean up attributes for vehicles being updated
						if (vehicleIdsToCleanAttributes.length > 0) {
							await db.delete(vehicleAttribute)
								.where(inArray(vehicleAttribute.vehicle_id, vehicleIdsToCleanAttributes));
							addLog(`Cleaned attributes for ${vehicleIdsToCleanAttributes.length} vehicles`);
						}
						
						// Bulk insert attributes
						if (attributesToInsert.length > 0) {
							// Insert in smaller chunks to avoid query size limits
							const ATTR_CHUNK_SIZE = 100;
							for (let j = 0; j < attributesToInsert.length; j += ATTR_CHUNK_SIZE) {
								const attrChunk = attributesToInsert.slice(j, j + ATTR_CHUNK_SIZE);
								await db.insert(vehicleAttribute).values(attrChunk);
							}
							syncState.attributesAdded += attributesToInsert.length;
							addLog(`Bulk inserted ${attributesToInsert.length} attributes`);
						}
					} catch (bulkError) {
						addLog(`Error executing bulk operations: ${bulkError}`);
						console.error("Error executing bulk operations:", bulkError);
					}
					
					// Update estimated time remaining
					if (syncState.processedItems > 0 && syncState.startTime !== undefined) {
						const elapsedTime = Date.now() - syncState.startTime;
						const itemsPerMs = syncState.processedItems / elapsedTime;
						const remainingItems = syncState.totalItems - syncState.processedItems;
						syncState.estimatedTimeRemaining = Math.round(remainingItems / itemsPerMs / 1000);
					}
					
					// Add more detailed logs after batch processing
					addLog(`Batch ${batchNumber} complete: ${vehiclesToInsert.length} to insert, ${vehiclesToUpdate.length} to update`);
					if (vehiclesToInsert.length > 0) {
						addLog(`Inserting ${vehiclesToInsert.length} new vehicles`);
					}
					
					// Small delay between batches to prevent server overload
					await new Promise(resolve => setTimeout(resolve, 100));
				}
				
				// After processing all batches, check for vehicles that exist in the database but are not in the current XML feed
				addLog('Checking for vehicles no longer in the feed...');
				
				// Get all the IDs from the current XML feed
				const currentVehicleIds = new Set<string>();
				for (const item of parsedData) {
					currentVehicleIds.add(item.vehicle.id);
				}
				
				// Convert the Set to an array for the query
				const currentIdsArray = Array.from(currentVehicleIds);
				
				// Find vehicles in the database that are not in the current feed
				const missingVehicles = await db.query.vehicle.findMany({
					where: and(
						eq(vehicle.status, 'ACTIVE'),
						not(inArray(vehicle.id, currentIdsArray))
					)
				});
				
				// Mark these vehicles as SOLD
				if (missingVehicles.length > 0) {
					addLog(`Found ${missingVehicles.length} vehicles no longer in the feed. Marking as SOLD...`);
					
					for (const missingVehicle of missingVehicles) {
						await db.update(vehicle)
							.set({
								status: 'SOLD',
								lastModified: new Date().toISOString()
							})
							.where(eq(vehicle.id, missingVehicle.id));
						
						syncState.markedAsSold++;
						addLog(`Marked vehicle as SOLD: ${missingVehicle.stockNumber} (ID: ${missingVehicle.id})`);
					}
				} else {
					addLog('No vehicles found that need to be marked as SOLD.');
				}
				
				// Mark vehicles as sold in one operation
				try {
					await db.update(vehicle)
						.set({
							status: 'SOLD',
							lastModified: ''
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
					addLog(`Marked ${syncState.markedAsSold} vehicles as sold`);
				} catch (markSoldError) {
					addLog(`Error marking vehicles as sold: ${markSoldError}`);
					console.error("Error marking vehicles as sold:", markSoldError);
				}
				
				// Add more logs at the end of sync
				addLog(`Sync complete: ${syncState.added} added, ${syncState.updated} updated, ${syncState.markedAsSold} marked as sold`);
				addLog(`Images: ${syncState.imagesAdded} added, Attributes: ${syncState.attributesAdded} added`);
				const totalTime = Math.round((Date.now() - (syncState.startTime || Date.now())) / 1000);
				addLog(`Total time: ${Math.floor(totalTime / 60)}m ${totalTime % 60}s`);
				
				// Store the sync results for the return statement
				const syncResults = {
					added: syncState.added,
					updated: syncState.updated,
					markedAsSold: syncState.markedAsSold
				};
				
				// Clear the global progress object when done
				addLog(`Sync completed successfully`);
				global.syncProgress = null;
				
				// Return success response with the stored results
				return json({
					success: true,
					message: `Sync completed successfully. Added: ${syncResults.added}, Updated: ${syncResults.updated}, Marked as Sold: ${syncResults.markedAsSold}`
				});
			} catch (syncError) {
				console.error("Error syncing inventory:", syncError);
				// Clear the global progress object on error
				global.syncProgress = null;
				return json({
					success: false,
					error: syncError instanceof Error ? syncError.message : 'Failed to sync inventory'
				}, { status: 500 });
			}
		})();

		// Return immediately to prevent timeout
		return json({
			success: true,
			message: `Sync process started${forceUpdate ? ' with forced updates' : ''}. Check progress endpoint for updates.`
		});
	} catch (error) {
		console.error("Error in sync endpoint:", error);
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Failed to start sync process'
		}, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// Define a proper type for the POST data items
		interface PostVehicleItem {
			id?: string; // Add id property to match XML structure
			stockNumber: string;
			vin?: string;
			year?: number;
			manufacturer?: string;
			type?: string;
			style?: string;
			trimName?: string;
			trimColor?: string;
			usage?: string;
			title?: string;
			description?: string;
			price?: number;
			color?: string;
			metricType?: string;
			metricValue?: number;
			images?: string[];
			attributes?: Array<{ name: string; value: string }>;
			[key: string]: unknown; // Allow other properties
		}

		// Prepare collections for bulk operations
		const vehiclesToInsert: VehicleData[] = [];
		const vehiclesToUpdate: { id: string; data: Partial<VehicleData> }[] = [];
		const vehicleIdMap = new Map<string, string>(); // Maps stockNumber to vehicleId
		const imagesToInsert: { id: string; vehicle_id: string; image_url: string }[] = [];
		const attributesToInsert: { id: string; vehicle_id: string; name: string; value: string }[] = [];
		const vehicleIdsToCleanImages: string[] = [];
		const vehicleIdsToCleanAttributes: string[] = [];

		// First, get all existing vehicles in one query
		const stockNumbers = data.map((item: PostVehicleItem) => item.stockNumber).filter(Boolean);
		const existingVehicles = await db
			.select()
			.from(vehicle)
			.where(inArray(vehicle.stockNumber, stockNumbers));
		
		// Create a map for quick lookup by stockNumber
		const existingVehicleMap = new Map(
			existingVehicles.map(v => [v.stockNumber, v])
		);

		// Process each item
		for (const item of data as PostVehicleItem[]) {
			const existingVehicle = existingVehicleMap.get(item.stockNumber);
			
			// Prioritize using the ID from the XML file, then existing vehicle ID, then generate a new one
			const itemId = item.id || (existingVehicle?.id) || crypto.randomUUID();

			const vehicleData: VehicleData = {
				// Use the ID directly from the XML
				id: itemId,
				stockNumber: item.stockNumber || '',
				vin: item.vin || '',
				year: item.year || null,
				manufacturer: item.manufacturer || '',
				modelType: item.type || '',
				modelTypestyle: item.style || '',
				modelName: '', // Add missing required property
				trimName: item.trimName || '',
				trimColor: item.trimColor || '',
				usage: item.usage || '',
				title: item.title || '',
				description: item.description || '',
				// Directly use the price from the XML feed
				price: item.price?.toString() || '0.00',
				color: item.color || '',
				metricType: item.metricType || '',
				metricValue: item.metricValue || null,
				status: 'ACTIVE',
				link: '',
				location: '',
				// The updated field from the DMS is guaranteed to be present and reliable
				updated: item.updated as string,
				condition: '',
				priceType: '',
				lastModified: new Date().toISOString()
			};

			// Store the vehicle ID for later use with images and attributes
			vehicleIdMap.set(item.stockNumber, vehicleData.id);

			if (existingVehicle) {
				// Check if the updated date has changed - this is our key indicator that the record needs updating
				// This optimization avoids unnecessary updates when the data hasn't changed
				if (existingVehicle.updated !== vehicleData.updated) {
					console.log(`Updating vehicle ${existingVehicle.id} - Current price: ${existingVehicle.price}, New price: ${vehicleData.price}`);
					
					// When the updated date has changed, update all fields
					vehiclesToUpdate.push({
						id: existingVehicle.id,
						data: vehicleData
					});
					
					// Clean up existing images and attributes if they're being updated
					if (item.images?.length || item.attributes?.length) {
						vehicleIdsToCleanImages.push(existingVehicle.id);
						vehicleIdsToCleanAttributes.push(existingVehicle.id);
					}
				} else {
					console.log(`Skipping update for vehicle ${existingVehicle.id} - No changes detected (updated date matches)`);
				}
			} else {
				// Vehicle doesn't exist - insert it
				vehiclesToInsert.push(vehicleData);
			}

			// Handle images
			if (item.images?.length) {
				const vehicleId = vehicleData.id;
				vehicleIdsToCleanImages.push(vehicleId);
				
				item.images.forEach((url: string) => {
					imagesToInsert.push({
						id: crypto.randomUUID(),
						vehicle_id: vehicleId,
						image_url: url
					});
				});
			}

			// Handle attributes
			if (item.attributes?.length) {
				const vehicleId = vehicleData.id;
				vehicleIdsToCleanAttributes.push(vehicleId);
				
				item.attributes.forEach(({ name, value }: { name: string; value: string }) => {
					attributesToInsert.push({
						id: crypto.randomUUID(),
						vehicle_id: vehicleId,
						name,
						value
					});
				});
			}
		}

		// Execute bulk operations
		try {
			// Bulk insert new vehicles
			if (vehiclesToInsert.length > 0) {
				await db.insert(vehicle).values(vehiclesToInsert);
				console.log(`Bulk inserted ${vehiclesToInsert.length} new vehicles`);
			}
			
			// Bulk update existing vehicles
			for (const { id, data } of vehiclesToUpdate) {
				await db.update(vehicle).set(data).where(eq(vehicle.id, id));
			}
			if (vehiclesToUpdate.length > 0) {
				console.log(`Updated ${vehiclesToUpdate.length} existing vehicles`);
			}
			
			// Clean up and insert images
			if (vehicleIdsToCleanImages.length > 0) {
				await db.delete(vehicleImage)
					.where(inArray(vehicleImage.vehicle_id, vehicleIdsToCleanImages));
				
				if (imagesToInsert.length > 0) {
					// Insert in smaller chunks to avoid query size limits
					const IMAGE_CHUNK_SIZE = 100;
					for (let i = 0; i < imagesToInsert.length; i += IMAGE_CHUNK_SIZE) {
						const imageChunk = imagesToInsert.slice(i, i + IMAGE_CHUNK_SIZE);
						await db.insert(vehicleImage).values(imageChunk);
					}
					console.log(`Bulk inserted ${imagesToInsert.length} images`);
				}
			}
			
			// Clean up and insert attributes
			if (vehicleIdsToCleanAttributes.length > 0) {
				await db.delete(vehicleAttribute)
					.where(inArray(vehicleAttribute.vehicle_id, vehicleIdsToCleanAttributes));
				
				if (attributesToInsert.length > 0) {
					// Insert in smaller chunks to avoid query size limits
					const ATTR_CHUNK_SIZE = 100;
					for (let i = 0; i < attributesToInsert.length; i += ATTR_CHUNK_SIZE) {
						const attrChunk = attributesToInsert.slice(i, i + ATTR_CHUNK_SIZE);
						await db.insert(vehicleAttribute).values(attrChunk);
					}
					console.log(`Bulk inserted ${attributesToInsert.length} attributes`);
				}
			}
		} catch (bulkError) {
			console.error("Error executing bulk operations:", bulkError);
			throw bulkError;
		}

		return json({ success: true });
	} catch (error) {
		console.error('Sync error:', error);
		return json({ error: 'Sync failed' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ url, request }) => {
	try {
		// Check if this is a purge request via URL parameter
		const purgeAll = url.searchParams.get('purge') === 'true';
		
		if (purgeAll) {
			// First delete all related records in child tables
			console.log('Deleting all vehicle images...');
			await db.delete(vehicleImage);
			
			console.log('Deleting all vehicle attributes...');
			await db.delete(vehicleAttribute);
			
			console.log('Deleting all vehicles...');
			await db.delete(vehicle);
			
			// Also delete customer data if purging everything
			console.log('Deleting all customer data...');
			await db.delete(customer);
			
			return json({
				success: true,
				message: 'All vehicle and customer data purged successfully'
			});
		}
		
		// Handle the original table-based deletion (for the existing delete buttons)
		try {
			const { table, ids } = await request.json();
			
			// If ids are provided, delete specific records
			if (ids && Array.isArray(ids)) {
				for (const id of ids) {
					if (table === 'vehicle' || !table) {
						await db.delete(vehicleImage).where(eq(vehicleImage.vehicle_id, id));
						await db.delete(vehicleAttribute).where(eq(vehicleAttribute.vehicle_id, id));
						await db.delete(vehicle).where(eq(vehicle.id, id));
					} else if (table === 'customer') {
						await db.delete(customer).where(eq(customer.id, id));
					}
				}
				return json({ success: true, message: `Deleted ${ids.length} items` });
			}
			
			// If table is specified but no ids, delete all records in that table
			if (table) {
				console.log('Attempting to delete from table:', table);
				
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
						
					case 'customer':
						await db.delete(customer);
						return json({ success: true, message: 'All customer data deleted successfully' });
						
					default:
						console.error('Invalid table specified:', table);
						return json({ success: false, error: 'Invalid table specified' }, { status: 400 });
				}
			}
			
			return json({ error: 'No table or ids provided' }, { status: 400 });
		} catch (jsonError) {
			// If request.json() fails, it means there's no body, so just return an error
			console.log('No JSON body in request:', jsonError);
			return json({ error: 'Invalid request body' }, { status: 400 });
		}
	} catch (error) {
		console.error('Delete error:', error);
		return json({ error: 'Delete failed' }, { status: 500 });
	}
};
