import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import db from '@/db'
import { sensors } from '@/db/schema'

export const sensorDataApp = new OpenAPIHono()
  .openapi(
    createRoute({
      method: 'get',
      path: '/sensor/data',
      tags: ['Sensor'],
      summary:
        'Get the current concentration of the air pollution to find the Air Quality Index (AQI).',
      responses: {
        200: {
          description: 'Successfully retrieved AQI data.',
          content: {
            'application/json': {
              schema: z
                .array(
                  z.object({
                    id: z.number(),
                    uniqueName: z.string(),
                    ipAddress: z.string().nullable(),
                    airQuality: z.string().nullable(),
                    coLevel: z.string().nullable(),
                  }),
                )
                .openapi('Sensor AQI Data'),
            },
          },
        },
        500: {
          description: 'Internal Server Error',
        },
      },
    }),
    async (c) => {
      try {
        const sensorData = await db.query.sensors.findMany()
        return c.json(sensorData, 200)
      } catch (error) {
        return c.json({ error: `An unexpected error occurred: ${error}` }, 500)
      }
    },
  )
  .openapi(
    createRoute({
      method: 'get',
      path: '/sensor/data/{id}',
      tags: ['Sensor'],
      summary: 'Get the data by ID.',
      request: {
        params: z.object({
          id: z
            .string()
            .min(1, { message: 'ID required' })
            .openapi({
              param: {
                name: 'id',
                in: 'path',
              },
              example: '1',
            }),
        }),
      },
      responses: {
        200: {
          description: 'Successfully retrieved AQI data.',
          content: {
            'application/json': {
              schema: z
                .object({
                  id: z.number(),
                  uniqueName: z.string(),
                  ipAddress: z.string().nullable(),
                  airQuality: z.string().nullable(),
                  coLevel: z.string().nullable(),
                })
                .openapi('Sensor AQI Data'),
            },
          },
        },
        404: {
          description: 'Sensor Data Not Found',
        },
        500: {
          description: 'Internal Server Error',
        },
      },
    }),
    async (c) => {
      try {
        const { id } = c.req.valid('param')
        const sensorData = await db.query.sensors.findFirst({
          where: eq(sensors.id, parseInt(id)),
        })
        if (!sensorData) {
          return c.json({ error: 'Sensor Data Not Found' }, 404)
        }
        return c.json(sensorData, 200)
      } catch (error) {
        return c.json({ error: `An unexpected error occurred: ${error}` }, 500)
      }
    },
  )
  .openapi(
    createRoute({
      method: 'post',
      path: '/sensor/data',
      tags: ['Sensor'],
      summary:
        'Post the current concentration of the air pollution to find the Air Quality Index (AQI).',
      request: {
        body: {
          content: {
            'application/json': {
              schema: z
                .object({
                  uniqueName: z.string(),
                  ipAddress: z.string().optional(),
                  airQuality: z.string().optional(),
                  coLevel: z.string().optional(),
                })
                .openapi('Sensor Data'),
            },
          },
          required: true,
        },
      },
      responses: {
        200: {
          description: 'Successfully added sensor data.',
        },
        500: {
          description: 'Internal Server Error',
        },
      },
    }),
    async (c) => {
      try {
        const sensorData = c.req.valid('json')
        await db.insert(sensors).values(sensorData)
        return c.json({ status: 'Successfully added sensor data.' }, 200)
      } catch (error) {
        return c.json({ error: `An unexpected error occurred: ${error}` }, 500)
      }
    },
  )
