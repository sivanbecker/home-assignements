import type { FastifySchema } from 'fastify';

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

// ─── GET /cars ────────────────────────────────────────────────────────────────

const carSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    userId: { type: 'string' },
    make: { type: 'string' },
    model: { type: 'string' },
    year: { type: 'number' },
    category: { type: 'string', enum: ['sedan', 'suv', 'sport', 'exotic'] },
    value: { type: 'number' },
    insurable: { type: 'boolean' },
  },
};

export const getCarsSchema: FastifySchema = {
  querystring: {
    type: 'object',
    required: ['userId'],
    properties: { userId: { type: 'string' } },
    additionalProperties: false,
  },
  response: {
    200: { type: 'array', items: carSchema },
    400: errorResponseSchema,
    500: errorResponseSchema,
  },
};

// ─── POST /quote ──────────────────────────────────────────────────────────────

const userProfileSchema = {
  type: 'object',
  required: ['age', 'licenseYear', 'zipCode'],
  properties: {
    age: { type: 'number' },
    licenseYear: { type: 'number' },
    zipCode: { type: 'string' },
  },
  additionalProperties: false,
};

export const postQuoteSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['userId', 'user', 'carIds'],
    properties: {
      userId: { type: 'string' },
      user: userProfileSchema,
      carIds: { type: 'array', items: { type: 'string' }, minItems: 1 },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: 'object',
      properties: {
        quotes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              carId: { type: 'string' },
              premium: { type: 'number' },
            },
          },
        },
        combinedPremium: { type: 'number' },
      },
    },
    400: errorResponseSchema,
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
