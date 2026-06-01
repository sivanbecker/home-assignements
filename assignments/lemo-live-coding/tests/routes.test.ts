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

  describe('GET /cars', () => {
    it('should return 200 with annotated cars for a known userId', async () => {
      const response = await app.inject({ method: 'GET', url: '/cars?userId=user-1' });
      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
      expect(body[0]).toMatchObject({ id: expect.any(String), insurable: expect.any(Boolean) });
    });

    it('should return 400 when userId is unknown', async () => {
      const response = await app.inject({ method: 'GET', url: '/cars?userId=unknown' });
      expect(response.statusCode).toBe(400);
    });

    it('should return 400 when userId query param is missing', async () => {
      const response = await app.inject({ method: 'GET', url: '/cars' });
      expect(response.statusCode).toBe(400);
    });

    it('should include non-insurable cars in the response', async () => {
      const response = await app.inject({ method: 'GET', url: '/cars?userId=user-1' });
      const body = response.json();
      expect(body.some((c: { insurable: boolean }) => !c.insurable)).toBe(true);
    });
  });

  describe('POST /quote', () => {
    const validPayload = {
      userId: 'user-1',
      user: { age: 30, licenseYear: 2010, zipCode: '10001' },
      carIds: ['car-1'],
    };

    it('should return 200 with quotes and combinedPremium for a valid request', async () => {
      const response = await app.inject({ method: 'POST', url: '/quote', payload: validPayload });
      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body).toMatchObject({
        quotes: [{ carId: 'car-1', premium: expect.any(Number) }],
        combinedPremium: expect.any(Number),
      });
    });

    it('should return 400 when driver is under 18', async () => {
      const response = await app.inject({
        method: 'POST', url: '/quote',
        payload: { ...validPayload, user: { age: 17, licenseYear: 2010, zipCode: '10001' } },
      });
      expect(response.statusCode).toBe(400);
    });

    it('should return 400 when a carId does not belong to the user', async () => {
      const response = await app.inject({
        method: 'POST', url: '/quote',
        payload: { ...validPayload, carIds: ['car-4'] },
      });
      expect(response.statusCode).toBe(400);
    });

    it('should return 400 when a selected car is not insurable', async () => {
      const response = await app.inject({
        method: 'POST', url: '/quote',
        payload: { ...validPayload, carIds: ['car-3'] },
      });
      expect(response.statusCode).toBe(400);
    });

    it('should return 400 when userId is unknown', async () => {
      const response = await app.inject({
        method: 'POST', url: '/quote',
        payload: { ...validPayload, userId: 'unknown' },
      });
      expect(response.statusCode).toBe(400);
    });

    it('should return 400 when required body fields are missing', async () => {
      const response = await app.inject({ method: 'POST', url: '/quote', payload: {} });
      expect(response.statusCode).toBe(400);
    });

    it('should apply multi-car discount when 2 cars are selected', async () => {
      const response = await app.inject({
        method: 'POST', url: '/quote',
        payload: { ...validPayload, carIds: ['car-1', 'car-2'] },
      });
      expect(response.statusCode).toBe(200);
      const body = response.json();
      // car-1: 1000, car-2: 1100, total 2100 × 0.95 = 1995
      expect(body.combinedPremium).toBe(1995);
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
