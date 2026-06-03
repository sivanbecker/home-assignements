import type { FastifySchema } from 'fastify';

const errorResponseSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'number' },
    error: { type: 'string' },
    message: { type: 'string' },
  },
};

const sessionResponseSchema = {
  type: 'object',
  properties: {
    sessionId: { type: 'string' },
    step: { type: 'string' },
    profile: {
      type: 'object',
      properties: {
        age: { type: 'number' },
        licenseYear: { type: 'number' },
        zipCode: { type: 'string' },
      },
    },
    eligibleCars: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          carId: { type: 'string' },
          make: { type: 'string' },
          model: { type: 'string' },
          year: { type: 'number' },
          value: { type: 'number' },
        },
      },
    },
    quote: {
      type: 'object',
      properties: {
        perCar: { type: 'object', additionalProperties: { type: 'number' } },
        total: { type: 'number' },
      },
    },
    boundAt: { type: 'string' },
  },
};

export const startSchema: FastifySchema = {
  response: {
    200: sessionResponseSchema,
    500: errorResponseSchema,
  },
};

export const profileSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['sessionId'],
    properties: { sessionId: { type: 'string' } },
  },
  body: {
    type: 'object',
    required: ['age', 'licenseYear', 'zipCode'],
    additionalProperties: false,
    properties: {
      age: { type: 'number' },
      licenseYear: { type: 'number' },
      zipCode: { type: 'string' },
    },
  },
  response: {
    200: sessionResponseSchema,
    400: errorResponseSchema,
    404: errorResponseSchema,
    409: errorResponseSchema,
    410: errorResponseSchema,
  },
};

export const quoteSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['sessionId'],
    properties: { sessionId: { type: 'string' } },
  },
  body: {
    type: 'object',
    required: ['carIds'],
    additionalProperties: false,
    properties: {
      carIds: { type: 'array', items: { type: 'string' }, minItems: 1 },
    },
  },
  response: {
    200: sessionResponseSchema,
    400: errorResponseSchema,
    404: errorResponseSchema,
    409: errorResponseSchema,
    410: errorResponseSchema,
    422: errorResponseSchema,
  },
};

export const bindSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['sessionId'],
    properties: { sessionId: { type: 'string' } },
  },
  response: {
    200: sessionResponseSchema,
    404: errorResponseSchema,
    409: errorResponseSchema,
    410: errorResponseSchema,
    422: errorResponseSchema,
  },
};

export const statusSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['sessionId'],
    properties: { sessionId: { type: 'string' } },
  },
  response: {
    200: sessionResponseSchema,
    404: errorResponseSchema,
    410: errorResponseSchema,
  },
};
