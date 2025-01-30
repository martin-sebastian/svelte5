import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { vehicle, vehicleImage, vehicleAttribute } from '$lib/server/db/schema';
import { eq, and, notInArray } from 'drizzle-orm';
import { XMLParser } from 'fast-xml-parser';
import { sql } from 'drizzle-orm';

// Helper functions at the top
function formatDate(date: Date) {
    return date.toISOString();
}

function setsAreEqual(a: Set<string>, b: Set<string>) {
    if (a.size !== b.size) return false;
    for (const item of a) {
        if (!b.has(item)) return false;
    }
    return true;
}

function mapsAreEqual(a: Map<string, any>, b: Map<string, any>) {
    if (a.size !== b.size) return false;
    for (const [key, value] of a) {
        if (!b.has(key)) return false;
    }
    return true;
}

// Existing fetch and parse functions
[... keep existing fetchXMLData and parseXML functions unchanged ...]

function getChangedFields(existing: any, updated: any) {
    const changes: Record<string, any> = {};
    for (const key in updated) {
        if (existing[key] !== updated[key]) {
            changes[key] = updated[key];
        }
    }
    return Object.keys(changes).length ? changes : null;
}

export const GET: RequestHandler = async () => {
    try {
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
        let batchCount = 0;
        const BATCH_SIZE = 50;

        // Use the batch processing from main
        for (let i = 0; i < parsedData.length; i += BATCH_SIZE) {
            batchCount++;
            const batch = parsedData.slice(i, i + BATCH_SIZE);
            console.log(`Processing batch ${batchCount} of ${Math.ceil(parsedData.length / BATCH_SIZE)}`);

            await Promise.all(
                batch.map(async (data) => {
                    if (!data) return;
                    const { vehicle: vehicleData, images, attributes } = data;
                    processedIds.add(vehicleData.id);

                    try {
                        const existingVehicles = await db
                            .select()
                            .from(vehicle)
                            .where(eq(vehicle.id, vehicleData.id));

                        const existingVehicle = existingVehicles[0];

                        if (existingVehicle) {
                            const vehicleChanges = getChangedFields(existingVehicle, vehicleData);
                            if (vehicleChanges) {
                                await db
                                    .update(vehicle)
                                    .set({
                                        ...vehicleChanges,
                                        lastModified: formatDate(new Date())
                                    })
                                    .where(eq(vehicle.id, vehicleData.id));
                                results.updated++;
                            }

                            // Keep the improved image and attribute handling from main
                            [... keep the image and attribute handling from main branch ...]
                        } else {
                            await db.insert(vehicle).values({
                                ...vehicleData,
                                status: 'ACTIVE',
                                lastModified: formatDate(new Date())
                            });

                            // Keep the improved image and attribute handling for new vehicles
                            [... keep the new vehicle image and attribute handling from main branch ...]

                            results.added++;
                        }
                    } catch (dbError) {
                        console.error(`Error processing vehicle ${vehicleData.id}:`, dbError.message);
                    }
                })
            );
        }

        // Keep the sold vehicle handling
        [... keep the existing sold vehicle handling code unchanged ...]

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

// Keep the cleaner DELETE endpoint from supabase-auth
export const DELETE: RequestHandler = async ({ request }) => {
    try {
        const { table } = await request.json();

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
                return json({ success: false, error: 'Invalid table specified' }, { status: 400 });
        }
    } catch (error) {
        console.error('Delete error:', error);
        return json({ success: false, error: 'Failed to delete data' }, { status: 500 });
    }
};

// Keep the POST endpoint for truncate operations
[... keep the existing POST endpoint unchanged ...]