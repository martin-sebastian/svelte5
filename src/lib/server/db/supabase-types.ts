import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('auth.users', {
	id: uuid('id').primaryKey(),
	email: text('email'),
	created_at: timestamp('created_at'),
	updated_at: timestamp('updated_at')
});
