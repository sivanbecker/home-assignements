import { buildApp } from '../src/app';

describe('app', () => {
  it('should build without throwing', async () => {
    const app = await buildApp();
    await app.close();
  });

  it('should expose the swagger docs route', async () => {
    const app = await buildApp();
    const response = await app.inject({ method: 'GET', url: '/docs' });
    expect(response.statusCode).toBe(200);
    await app.close();
  });

  it('should return 404 for unknown routes', async () => {
    const app = await buildApp();
    const response = await app.inject({ method: 'GET', url: '/unknown' });
    expect(response.statusCode).toBe(404);
    await app.close();
  });
});
