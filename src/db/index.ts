import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import { env } from '../../env.mjs'
import * as schema from './schema'

if (!env.DATABASE_URL) {
  console.error('Missing DATABASE_URL environment variable')
  throw new Error('Missing DATABASE_URL environment variable')
}

const client = neon(env.DATABASE_URL)
const db = drizzle(client, { schema: schema, logger: true })

export default db
