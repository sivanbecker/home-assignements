import { buildApp } from '../src/app';
import type { FastifyInstance } from 'fastify';

describe('routes', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await buildApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /lemo', () => {
    it('should return 200 with no body', async () => {
      const response = await app.inject({ method: 'GET', url: '/lemo' });
      expect(response.statusCode).toBe(200);
      expect(response.body).toBe('');
    });
  });

  describe('POST /lemo', () => {
    it('should return 200 with received true and echoed fields', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/lemo',
        payload: { name: 'example', value: 'demo' },
      });
      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ received: true, name: 'example', value: 'demo' });
    });

    it('should return 400 when name is missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/lemo',
        payload: { value: 'demo' },
      });
      expect(response.statusCode).toBe(400);
    });

    it('should return 400 when value is missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/lemo',
        payload: { name: 'example' },
      });
      expect(response.statusCode).toBe(400);
    });

    it('should return 400 when body is empty', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/lemo',
        payload: {},
      });
      expect(response.statusCode).toBe(400);
    });

    it('should strip extra fields and still return 200', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/lemo',
        payload: { name: 'example', value: 'demo', extra: 'field' },
      });
      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ received: true, name: 'example', value: 'demo' });
    });
  });
});
