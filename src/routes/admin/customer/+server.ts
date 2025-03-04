import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { customer } from '$lib/server/db/schema';

export const GET: RequestHandler = async () => {
	try {
		// Fetch the customer data
		const customers = await db.select().from(customer);
		
		// Return the first customer (or null if none exists)
		return json({
			success: true,
			customer: customers.length > 0 ? customers[0] : null
		});
	} catch (error) {
		console.error('Error fetching customer data:', error);
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Failed to fetch customer data'
		}, { status: 500 });
	}
}; 