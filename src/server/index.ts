import { OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'

import { aqiApp } from './routes'

const app = new OpenAPIHono().basePath('api/v1')

app.use(
  'api/v1',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  }),
)

app.use(csrf())

app.doc31('api/v1/swagger.json', {
  openapi: '3.1.0',
  info: {
    title: 'Digital AQI API Documentation',
    version: '1.0.0',
  },
})

app.get(
  '/scalar',
  apiReference({
    spec: {
      url: 'api/v1/swagger.json',
    },
  }),
)

const routes = app.route('/', aqiApp)

export type AppType = typeof routes

export { app }
