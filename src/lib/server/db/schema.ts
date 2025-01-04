import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
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

export const motorcycle = sqliteTable('motorcycle', {
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
	lastModified: integer('last_modified', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const motorcycleImage = sqliteTable('motorcycle_image', {
	id: text('id').primaryKey(),
	motorcycleId: text('motorcycle_id')
		.notNull()
		.references(() => motorcycle.id),
	imageUrl: text('image_url').notNull()
});

export const motorcycleAttribute = sqliteTable('motorcycle_attribute', {
	id: text('id').primaryKey(),
	motorcycleId: text('motorcycle_id')
		.notNull()
		.references(() => motorcycle.id),
	name: text('name').notNull(),
	value: text('value')
});

export const motorcycleRelations = relations(motorcycle, ({ many }) => ({
	images: many(motorcycleImage),
	attributes: many(motorcycleAttribute)
}));

export const motorcycleImageRelations = relations(motorcycleImage, ({ one }) => ({
	motorcycle: one(motorcycle, {
		fields: [motorcycleImage.motorcycleId],
		references: [motorcycle.id]
	})
}));

export const motorcycleAttributeRelations = relations(motorcycleAttribute, ({ one }) => ({
	motorcycle: one(motorcycle, {
		fields: [motorcycleAttribute.motorcycleId],
		references: [motorcycle.id]
	})
}));

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Motorcycle = typeof motorcycle.$inferSelect;
export type MotorcycleImage = typeof motorcycleImage.$inferSelect;
export type MotorcycleAttribute = typeof motorcycleAttribute.$inferSelect;
