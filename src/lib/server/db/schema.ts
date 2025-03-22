import { relations } from 'drizzle-orm';
import { pgTable, text, integer, timestamp, numeric } from 'drizzle-orm/pg-core';

export type VehicleStatus = 'ACTIVE' | 'SOLD' | 'HIDDEN' | 'ARCHIVED';

export const customer = pgTable('customer', {
	id: text('id').primaryKey(),
	customerNumber: text('customer_number'),
	title: text('title'),
	description: text('description'),
	modified: text('modified'),
	address1: text('address1'),
	address2: text('address2'),
	address3: text('address3'),
	country: text('country'),
	state: text('state'),
	city: text('city'),
	zip: text('zip'),
	phone: text('phone'),
	email: text('email'),
	companyUrl: text('company_url'),
	companyLogo: text('company_logo'),
	lastUpdated: timestamp('last_updated').defaultNow()
});

export const vehicle = pgTable('vehicle', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	link: text('link'),
	description: text('description'),
	price: numeric('price', { precision: 10, scale: 2 }),
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

export const motorcycles = pgTable('motorcycles', {
	id: text('id').primaryKey(),
	title: text('title'),
	link: text('link'),
	description: text('description'),
	price: numeric('price', { precision: 10, scale: 2 }),
	price_type: text('price_type'),
	stock_number: text('stock_number'),
	vin: text('vin'),
	manufacturer: text('manufacturer'),
	year: integer('year'),
	color: text('color'),
	model_type: text('model_type'),
	model_typestyle: text('model_typestyle'),
	model_name: text('model_name'),
	trim_name: text('trim_name'),
	trim_color: text('trim_color'),
	condition: text('condition'),
	usage: text('usage'),
	location: text('location'),
	updated: text('updated'),
	metric_type: text('metric_type'),
	metric_value: integer('metric_value'),
	status: text('status', { enum: ['ACTIVE', 'SOLD', 'HIDDEN', 'ARCHIVED'] })
		.notNull()
		.default('ACTIVE'),
	last_modified: text('last_modified')
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

export type Vehicle = typeof vehicle.$inferSelect;
export type VehicleImage = typeof vehicleImage.$inferSelect;
export type VehicleAttribute = typeof vehicleAttribute.$inferSelect;
export type Customer = typeof customer.$inferSelect;
export type Motorcycle = typeof motorcycles.$inferSelect;
