jest.mock('dotenv', () => ({ config: jest.fn() }));

describe('config', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    jest.resetModules();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('defaults', () => {
    it('should use port 3018 when PORT is not set', async () => {
      delete process.env['PORT'];
      const { config } = await import('../src/config');
      expect(config.port).toBe(3018);
    });

    it('should use 127.0.0.1 when HOST is not set', async () => {
      delete process.env['HOST'];
      const { config } = await import('../src/config');
      expect(config.host).toBe('127.0.0.1');
    });

    it('should use info when LOG_LEVEL is not set', async () => {
      delete process.env['LOG_LEVEL'];
      const { config } = await import('../src/config');
      expect(config.logLevel).toBe('info');
    });
  });

  describe('from env', () => {
    it('should parse PORT as a number', async () => {
      process.env['PORT'] = '4000';
      const { config } = await import('../src/config');
      expect(config.port).toBe(4000);
      expect(typeof config.port).toBe('number');
    });

    it('should read HOST from env', async () => {
      process.env['HOST'] = '0.0.0.0';
      const { config } = await import('../src/config');
      expect(config.host).toBe('0.0.0.0');
    });

    it('should read LOG_LEVEL from env', async () => {
      process.env['LOG_LEVEL'] = 'debug';
      const { config } = await import('../src/config');
      expect(config.logLevel).toBe('debug');
    });
  });
});
