import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { POSTGRES_URL } from '$env/static/private';
import * as schema from './schema';

if (!POSTGRES_URL) {
	throw new Error('POSTGRES_URL is not defined');
}

// Add SSL requirement and connection pooling
const connectionString = POSTGRES_URL + '?sslmode=require&pool=true';

// Configure postgres client with proper settings
const client = postgres(connectionString, {
	max: 10, // Increase max connections
	idle_timeout: 30, // Longer idle timeout
	connect_timeout: 20, // Longer connect timeout
	max_lifetime: 60 * 30, // Connection lifetime in seconds
	ssl: {
		rejectUnauthorized: false // Required for Supabase
	},
	connection: {
		application_name: 'svelte5' // Helps identify connections in logs
	},
	types: {
		// Add custom type parsers if needed
		bigint: postgres.BigInt,
		date: {
			to: 1184,
			from: [1082, 1083, 1114, 1184],
			serialize: (date: Date) => date.toISOString(),
			parse: (str: string) => new Date(str)
		}
	},
	onnotice: () => {}, // Ignore notice messages
	debug: false, // Disable debug logging
	transform: {
		undefined: null // Transform undefined to null
	}
});

// Initialize Drizzle with the client and schema
export const db = drizzle(client, { schema });

// Remove the test query for now to get the app back up
// We can add it back later in a separate file if needed
