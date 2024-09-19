import type { Config } from 'drizzle-kit'

import { env } from './env.mjs'

if (!env.DATABASE_URL) {
  console.log('Cannot find database url')
  throw new Error('DATABASE_URL environment variable is not set')
}

export default {
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config
