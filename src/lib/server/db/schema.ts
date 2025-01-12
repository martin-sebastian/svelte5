import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	firstName: text('first_name'),
	lastName: text('last_name')
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export type VehicleStatus = 'ACTIVE' | 'SOLD' | 'HIDDEN' | 'ARCHIVED';

export const vehicle = sqliteTable(
	'vehicle',
	{
		id: text('id').primaryKey(),
		title: text('title').notNull(),
		link: text('link'),
		description: text('description'),
		price: integer('price'),
		priceType: text('price_type'),
		stockNumber: text('stock_number'),
		vin: text('vin').unique(),
		manufacturer: text('manufacturer'),
		year: integer('year'),
		color: text('color'),
		modelType: text('model_type'),
		modelTypeStyle: text('model_type_style'),
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
		lastModified: integer('last_modified', { mode: 'timestamp' }).$defaultFn(() => new Date())
	},
	(table) => ({
		uniqVin: uniqueIndex('uniq_vin').on(table.vin),
		uniqStock: uniqueIndex('uniq_stock').on(table.stockNumber)
	})
);

export const vehicleImage = sqliteTable('vehicle_image', {
	id: text('id').primaryKey(),
	vehicleId: text('vehicle_id')
		.notNull()
		.references(() => vehicle.id, { onDelete: 'cascade' }),
	imageUrl: text('image_url').notNull()
});

export const vehicleAttribute = sqliteTable('vehicle_attribute', {
	id: text('id').primaryKey(),
	vehicleId: text('vehicle_id')
		.notNull()
		.references(() => vehicle.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	value: text('value').notNull()
});

export const vehicleRelations = relations(vehicle, ({ many }) => ({
	images: many(vehicleImage),
	attributes: many(vehicleAttribute)
}));

export const vehicleImageRelations = relations(vehicleImage, ({ one }) => ({
	vehicle: one(vehicle, {
		fields: [vehicleImage.vehicleId],
		references: [vehicle.id]
	})
}));

export const vehicleAttributeRelations = relations(vehicleAttribute, ({ one }) => ({
	vehicle: one(vehicle, {
		fields: [vehicleAttribute.vehicleId],
		references: [vehicle.id]
	})
}));

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Vehicle = typeof vehicle.$inferSelect;
export type VehicleImage = typeof vehicleImage.$inferSelect;
export type VehicleAttribute = typeof vehicleAttribute.$inferSelect;
