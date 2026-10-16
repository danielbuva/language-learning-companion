CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`language` text NOT NULL,
	`name` text NOT NULL,
	`settings` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`created` text NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `profiles_owner` ON `profiles` (`owner`);--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`profile` text NOT NULL,
	`kind` text NOT NULL,
	`fingerprint` text NOT NULL,
	`payload` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`created` text NOT NULL,
	`updated` text NOT NULL,
	FOREIGN KEY (`profile`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `records_scope` ON `records` (`owner`,`profile`,`kind`);--> statement-breakpoint
CREATE UNIQUE INDEX `records_dedupe` ON `records` (`owner`,`profile`,`kind`,`fingerprint`);