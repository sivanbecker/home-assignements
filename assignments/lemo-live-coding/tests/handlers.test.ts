import { getLemoHandler, postLemoHandler, getCarsHandler, postQuoteHandler } from '../src/handlers';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { PostLemoBody, QuoteRequest } from '../src/types';
import {
  UserNotFoundError,
  CarNotFoundError,
  CarNotInsurableError,
  DriverTooYoungError,
  EmptyCarSelectionError,
  QuoteError,
} from '../src/errors';

type PostLemoRequest = FastifyRequest<{ Body: PostLemoBody }>;
type GetCarsRequest = FastifyRequest<{ Querystring: { userId: string } }>;
type PostQuoteRequest = FastifyRequest<{ Body: QuoteRequest }>;

function makeReply(): jest.Mocked<Pick<FastifyReply, 'code' | 'send'>> {
  const reply = {
    code: jest.fn(),
    send: jest.fn(),
  };
  reply.code.mockReturnValue(reply);
  return reply;
}

// ─── getCarsHandler ───────────────────────────────────────────────────────────

describe('getCarsHandler', () => {
  it('should send the list of insurable cars for a known user', async () => {
    const request = { query: { userId: 'user-1' } } as GetCarsRequest;
    const reply = makeReply();

    await getCarsHandler(request, reply as unknown as FastifyReply);

    expect(reply.send).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: 'car-1', insurable: expect.any(Boolean) })]),
    );
  });

  it('should throw QuoteError with statusCode 400 when userId is unknown', async () => {
    const request = { query: { userId: 'unknown' } } as GetCarsRequest;
    const reply = makeReply();

    await expect(getCarsHandler(request, reply as unknown as FastifyReply)).rejects.toThrow(QuoteError);
  });

  it('should wrap UserNotFoundError message in the thrown QuoteError', async () => {
    const request = { query: { userId: 'ghost' } } as GetCarsRequest;
    const reply = makeReply();

    await expect(getCarsHandler(request, reply as unknown as FastifyReply)).rejects.toThrow(
      "user 'ghost' not found",
    );
  });
});

// ─── postQuoteHandler ─────────────────────────────────────────────────────────

describe('postQuoteHandler', () => {
  const validBody: QuoteRequest = {
    userId: 'user-1',
    user: { age: 30, licenseYear: 2010, zipCode: '10001' },
    carIds: ['car-1'],
  };

  it('should send the quote result for a valid request', async () => {
    const request = { body: validBody } as PostQuoteRequest;
    const reply = makeReply();

    await postQuoteHandler(request, reply as unknown as FastifyReply);

    expect(reply.send).toHaveBeenCalledWith(
      expect.objectContaining({ quotes: expect.any(Array), combinedPremium: expect.any(Number) }),
    );
  });

  it.each([
    ['DriverTooYoungError', new DriverTooYoungError()],
    ['CarNotFoundError', new CarNotFoundError('car-x')],
    ['CarNotInsurableError', new CarNotInsurableError('car-x', ['exotic'])],
    ['EmptyCarSelectionError', new EmptyCarSelectionError()],
    ['UserNotFoundError', new UserNotFoundError('u')],
  ])('should throw QuoteError when controller throws %s', async (_name, domainError) => {
    jest.spyOn(require('../src/controllers'), 'postQuote').mockImplementationOnce(() => { throw domainError; });
    const request = { body: validBody } as PostQuoteRequest;
    const reply = makeReply();

    await expect(postQuoteHandler(request, reply as unknown as FastifyReply)).rejects.toThrow(QuoteError);
  });

  it('should preserve the domain error message in the thrown QuoteError', async () => {
    jest.spyOn(require('../src/controllers'), 'postQuote').mockImplementationOnce(() => {
      throw new DriverTooYoungError();
    });
    const request = { body: validBody } as PostQuoteRequest;
    const reply = makeReply();

    await expect(postQuoteHandler(request, reply as unknown as FastifyReply)).rejects.toThrow(
      'driver must be at least 18 years old',
    );
  });
});

describe('handlers', () => {
  describe('getLemoHandler', () => {
    it('should reply with status 200 and no body', async () => {
      const request = {} as FastifyRequest;
      const reply = makeReply();

      await getLemoHandler(request, reply as unknown as FastifyReply);

      expect(reply.code).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith();
    });
  });

  describe('postLemoHandler', () => {
    it('should reply with the postLemo result', async () => {
      const request = { body: { name: 'example', value: 'demo' } } as PostLemoRequest;
      const reply = makeReply();

      await postLemoHandler(request, reply as unknown as FastifyReply);

      expect(reply.send).toHaveBeenCalledWith({
        received: true,
        name: 'example',
        value: 'demo',
      });
    });

    it('should echo back whatever name and value are in the body', async () => {
      const request = { body: { name: 'foo', value: 'bar' } } as PostLemoRequest;
      const reply = makeReply();

      await postLemoHandler(request, reply as unknown as FastifyReply);

      expect(reply.send).toHaveBeenCalledWith({
        received: true,
        name: 'foo',
        value: 'bar',
      });
    });
  });
});
