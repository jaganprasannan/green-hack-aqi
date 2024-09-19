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
                    id: z.string(),
                    location: z.string(),
                    aqiGeneral: z.string(),
                    aqiCo: z.string(),
                  }),
                )
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
            .uuid()
            .min(1, { message: 'ID required' })
            .openapi({
              param: {
                name: 'id',
                in: 'path',
              },
              example: 'd4e5f6a7-b8c9-4d01-9e23-456f78901234',
            }),
        }),
      },
      responses: {
        200: {
          description: 'Successfully retrieved AQI data.',
          content: {
            'application/json': {
              schema: z
                .array(
                  z.object({
                    id: z.string(),
                    location: z.string(),
                    aqiGeneral: z.string(),
                    aqiCo: z.string(),
                  }),
                )
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
          where: eq(sensors.id, id),
        })
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
          description: 'The sensor data to post.',
          content: {
            'application/json': {
              schema: z
                .object({
                  uniqueName: z.string(),
                  ipAddress: z.string(),
                  airQuality: z.string(),
                  coLevel: z.string(),
                })
                .openapi('Sensor Data'),
            },
          },
          required: true,
        },
      },
      responses: {
        200: {
          description: 'Successful added sensor data.',
        },
        500: {
          description: 'Internal Server Error',
        },
      },
    }),

    async (c) => {
      try {
        const sensorData = c.req.valid('json')
        await db.insert(sensors).values({
          uniqueName: sensorData.uniqueName,
          ipAddress: sensorData.ipAddress,
          airQuality: sensorData.airQuality,
          coLevel: sensorData.coLevel,
        })

        return c.json({ status: 'Successful added sensor data.' }, 200)
      } catch (error) {
        return c.json({ error: `An unexpected error occurred: ${error}` }, 500)
      }
    },
  )
