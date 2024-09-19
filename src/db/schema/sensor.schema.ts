import { pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const sensors = pgTable('sensor', {
  id: uuid('id').defaultRandom().primaryKey(),
  uniqueName: text('unique_name').notNull(),
  ipAddress: text('ip_address'),
  airQuality: text('air_quality'),
  coLevel: text('co_level'),
})
