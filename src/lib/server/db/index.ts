import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { DATABASE_URL } from '$env/static/private';

const queryClient = postgres(DATABASE_URL, { ssl: 'require' });
export const db = drizzle(queryClient);

// Optional: Add connection testing
try {
	await queryClient.connect();
	console.log('Database connection successful');
} catch (error) {
	console.error('Database connection failed:', error);
}
