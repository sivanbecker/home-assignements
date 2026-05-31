import type { FastifySchema } from 'fastify';

export interface PostLemoBody {
  name: string;
  value: string;
}

export interface PostLemoResponse {
  received: true;
  name: string;
  value: string;
}

const errorResponseSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'number' },
    error: { type: 'string' },
    message: { type: 'string' },
  },
};

export const getLemoSchema: FastifySchema = {
  response: {
    200: { type: 'null', description: 'OK' },
    500: errorResponseSchema,
  },
};

export const postLemoBodySchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['name', 'value'],
    properties: {
      name: { type: 'string' },
      value: { type: 'string' },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: 'object',
      properties: {
        received: { type: 'boolean' },
        name: { type: 'string' },
        value: { type: 'string' },
      },
    },
    400: errorResponseSchema,
    500: errorResponseSchema,
  },
};
