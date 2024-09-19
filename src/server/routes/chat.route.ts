import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import OpenAI from 'openai'

import { env } from '../../../env.mjs'

const GEMINI_API_KEY = env.GEMINI_API_KEY
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

export const chatApp = new OpenAPIHono().openapi(
  createRoute({
    method: 'post',
    path: '/chat',
    tags: ['AIChat'],
    summary: 'Generate a response to the user input using Google Gemini model',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z
              .object({
                message: z.string().min(1, { message: 'Message is required' }),
              })
              .openapi('ChatRequest'),
          },
        },
        required: true,
      },
    },
    responses: {
      200: {
        description: 'Successfully generated response',
        content: {
          'application/json': {
            schema: z
              .object({
                response: z.string(),
              })
              .openapi('ChatResponse'),
          },
        },
      },
      400: {
        description: 'Bad Request',
      },
      500: {
        description: 'Internal Server Error',
      },
    },
  }),

  async (c) => {
    try {
      const { message } = await c.req.valid('json')

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const generatedText = data.candidates[0].content.parts[0].text

      if (!generatedText) {
        return c.json({ error: 'No response generated' }, 500)
      }

      return c.json({ response: generatedText }, 200)
    } catch (error) {
      return c.json({ error: `An unexpected error occurred: ${error}` }, 500)
    }
  },
)
