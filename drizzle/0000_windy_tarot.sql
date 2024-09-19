CREATE TABLE IF NOT EXISTS "sensor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"unique_name" text NOT NULL,
	"ip_address" text,
	"air_quality" text,
	"co_level" text
);
