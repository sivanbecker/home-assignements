import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  port: number;
  host: string;
  logLevel: string;
}

export const config: Config = {
  port: parseInt(process.env['PORT'] ?? '3000', 10),
  host: process.env['HOST'] ?? '127.0.0.1',
  logLevel: process.env['LOG_LEVEL'] ?? 'info',
};
