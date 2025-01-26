import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.POSTGRES_URL_NON_POOLING) {
	throw new Error('POSTGRES_URL_NON_POOLING environment variable is required');
}

export default {
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.POSTGRES_URL_NON_POOLING,
		ssl: {
			rejectUnauthorized: false,
			sslmode: 'require'
		}
	}
} satisfies Config;
