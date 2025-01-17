import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL environment variable is required');
}

export default {
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		host: 'aws-0-us-east-1.pooler.supabase.com',
		port: 6543,
		database: 'postgres',
		user: 'postgres.migzphbkymyxlffytjid',
		password: 'cdCa9SwSW9teyPkt',
		ssl: 'require'
	}
} satisfies Config;
