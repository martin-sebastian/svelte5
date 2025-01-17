import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.POSTGRES_URL) {
	throw new Error('POSTGRES_URL environment variable is required');
}

export default {
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dialect: 'pg',
	dbCredentials: {
		connectionString: process.env.POSTGRES_URL + "?sslmode=require",
	}
} satisfies Config;
