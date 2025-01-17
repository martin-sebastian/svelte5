import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import postgres from 'postgres';
import { POSTGRES_URL } from '$env/static/private';

if (!POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not defined');
}

// Add SSL requirement and connection pooling
const connectionString = POSTGRES_URL + "?sslmode=require&pool=true";

// Configure postgres client with proper settings
const client = postgres(connectionString, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: {
        rejectUnauthorized: false // Required for Supabase
    }
});

// Initialize Drizzle with the client
export const db = drizzle(client, {
    logger: process.env.NODE_ENV === 'development'
});

// Remove the test query for now to get the app back up
// We can add it back later in a separate file if needed
