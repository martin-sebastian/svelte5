CREATE TABLE IF NOT EXISTS "customer" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_number" text,
	"title" text,
	"description" text,
	"modified" text,
	"address1" text,
	"address2" text,
	"address3" text,
	"country" text,
	"state" text,
	"city" text,
	"zip" text,
	"phone" text,
	"email" text,
	"company_url" text,
	"company_logo" text,
	"last_updated" timestamp DEFAULT now()
);
