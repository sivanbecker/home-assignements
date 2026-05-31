import { buildApp } from './app';
import { config } from './config';

async function start(): Promise<void> {
  const app = await buildApp();
  await app.listen({ port: config.port, host: config.host });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
