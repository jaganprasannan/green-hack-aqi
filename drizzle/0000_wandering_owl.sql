CREATE TABLE IF NOT EXISTS "sensor" (
	"id" serial PRIMARY KEY NOT NULL,
	"unique_name" text NOT NULL,
	"ip_address" text,
	"air_quality" text,
	"co_level" text
);
