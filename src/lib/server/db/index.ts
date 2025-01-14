import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const client = createClient({
	url: 'file:./local.db'
});

export const db = drizzle(client);

// Optional: Add connection testing
try {
	await client.execute('SELECT 1');
	console.log('Database connection successful');
} catch (error) {
	console.error('Database connection failed:', error);
}
