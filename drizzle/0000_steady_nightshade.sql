CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`age` integer,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`first_name` text,
	`last_name` text
);
--> statement-breakpoint
CREATE TABLE `vehicle` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`link` text,
	`description` text,
	`price` integer,
	`price_type` text,
	`stock_number` text,
	`vin` text,
	`manufacturer` text,
	`year` integer,
	`color` text,
	`model_type` text,
	`model_typestyle` text,
	`model_name` text,
	`trim_name` text,
	`trim_color` text,
	`condition` text,
	`usage` text,
	`location` text,
	`updated` text,
	`metric_type` text,
	`metric_value` integer,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`last_modified` integer
);
--> statement-breakpoint
CREATE TABLE `vehicle_attribute` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`name` text NOT NULL,
	`value` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `vehicle_image` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`image_url` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `vehicle_vin_unique` ON `vehicle` (`vin`);--> statement-breakpoint
CREATE UNIQUE INDEX `uniq_vin` ON `vehicle` (`vin`);--> statement-breakpoint
CREATE UNIQUE INDEX `uniq_stock` ON `vehicle` (`stock_number`);