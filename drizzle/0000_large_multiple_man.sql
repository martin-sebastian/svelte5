CREATE TABLE IF NOT EXISTS "vehicle" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"link" text,
	"description" text,
	"price" integer,
	"price_type" text,
	"stock_number" text,
	"vin" text,
	"manufacturer" text,
	"year" integer,
	"color" text,
	"model_type" text,
	"model_typestyle" text,
	"model_name" text,
	"trim_name" text,
	"trim_color" text,
	"condition" text,
	"usage" text,
	"location" text,
	"updated" text,
	"metric_type" text,
	"metric_value" integer,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"last_modified" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicle_attribute" (
	"id" text PRIMARY KEY NOT NULL,
	"vehicle_id" text,
	"name" text,
	"value" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicle_image" (
	"id" text PRIMARY KEY NOT NULL,
	"vehicle_id" text,
	"image_url" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicle_attribute" ADD CONSTRAINT "vehicle_attribute_vehicle_id_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicle"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicle_image" ADD CONSTRAINT "vehicle_image_vehicle_id_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicle"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
