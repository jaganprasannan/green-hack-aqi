import { OpenAPIHono } from '@hono/zod-openapi'

import { chatApp } from './chat.route'
import { sensorDataApp } from './sensor.route'

export const aqiApp = new OpenAPIHono()
  .route('/', sensorDataApp)
  .route('/', chatApp)
