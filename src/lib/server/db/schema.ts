import { pgTable, text, integer, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users as authUsers } from '$lib/server/db/supabase-types';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	firstName: text('first_name'),
	lastName: text('last_name'),
	age: text('age')
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: text('expires_at').notNull()
});

export type VehicleStatus = 'ACTIVE' | 'SOLD' | 'HIDDEN' | 'ARCHIVED';

export const vehicle = pgTable('vehicle', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	link: text('link'),
	description: text('description'),
	price: integer('price'),
	priceType: text('price_type'),
	stockNumber: text('stock_number'),
	vin: text('vin'),
	manufacturer: text('manufacturer'),
	year: integer('year'),
	color: text('color'),
	modelType: text('model_type'),
	modelTypestyle: text('model_typestyle'),
	modelName: text('model_name'),
	trimName: text('trim_name'),
	trimColor: text('trim_color'),
	condition: text('condition'),
	usage: text('usage'),
	location: text('location'),
	updated: text('updated'),
	metricType: text('metric_type'),
	metricValue: integer('metric_value'),
	status: text('status', { enum: ['ACTIVE', 'SOLD', 'HIDDEN', 'ARCHIVED'] })
		.notNull()
		.default('ACTIVE'),
	lastModified: text('last_modified')
});

export const vehicleImage = pgTable('vehicle_image', {
	id: text('id').primaryKey(),
	vehicle_id: text('vehicle_id').references(() => vehicle.id, { onDelete: 'cascade' }),
	image_url: text('image_url')
});

export const vehicleAttribute = pgTable('vehicle_attribute', {
	id: text('id').primaryKey(),
	vehicle_id: text('vehicle_id').references(() => vehicle.id, { onDelete: 'cascade' }),
	name: text('name'),
	value: text('value')
});

export const vehicleRelations = relations(vehicle, ({ many }) => ({
	images: many(vehicleImage),
	attributes: many(vehicleAttribute)
}));

export const vehicleImageRelations = relations(vehicleImage, ({ one }) => ({
	vehicle: one(vehicle, {
		fields: [vehicleImage.vehicle_id],
		references: [vehicle.id]
	})
}));

export const vehicleAttributeRelations = relations(vehicleAttribute, ({ one }) => ({
	vehicle: one(vehicle, {
		fields: [vehicleAttribute.vehicle_id],
		references: [vehicle.id]
	})
}));

export const profile = pgTable('profile', {
	// Correct table name
	id: uuid('id')
		.primaryKey()
		.references(() => authUsers.id)
		.notNull(), // Foreign key to auth.users.id
	name: text('name'),
	phone: text('phone'),
	email: text('email')
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Vehicle = typeof vehicle.$inferSelect;
export type VehicleImage = typeof vehicleImage.$inferSelect;
export type VehicleAttribute = typeof vehicleAttribute.$inferSelect;
export type Profile = typeof profile.$inferSelect; // Type for the profiles table
