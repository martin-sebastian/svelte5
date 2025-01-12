import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { DATABASE_URL, DATABASE_AUTH_TOKEN } from '$env/static/private';

const client = createClient({
	url: DATABASE_URL,
	authToken: DATABASE_AUTH_TOKEN
});

export const db = drizzle(client);

// Optional: Add connection testing
try {
	await client.execute('SELECT 1');
	console.log('Database connection successful');
} catch (error) {
	console.error('Database connection failed:', error);
}
