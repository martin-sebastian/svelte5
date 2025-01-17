import {
	pgTable,
	text,
	integer,
	timestamp,
	primaryKey,
	uniqueIndex
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	email: text('email').notNull(),
	name: text('name')
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at').notNull()
});

export type VehicleStatus = 'ACTIVE' | 'SOLD' | 'HIDDEN' | 'ARCHIVED';

export const vehicle = pgTable(
	'vehicle',
	{
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
		lastModified: timestamp('last_modified').notNull().defaultNow()
	},
	(table) => ({
		uniqVin: uniqueIndex('uniq_vin').on(table.vin)
	})
);

export const vehicleImage = pgTable('vehicle_image', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }).notNull(),
	vehicle_id: text('vehicle_id').references(() => vehicle.id, { onDelete: 'cascade' }),
	image_url: text('image_url')
});

export const vehicleAttribute = pgTable('vehicle_attribute', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }).notNull(),
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

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Vehicle = typeof vehicle.$inferSelect;
export type VehicleImage = typeof vehicleImage.$inferSelect;
export type VehicleAttribute = typeof vehicleAttribute.$inferSelect;
