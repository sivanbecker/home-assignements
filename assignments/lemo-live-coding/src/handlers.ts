import type { FastifyRequest, FastifyReply } from 'fastify';
import type { PostLemoBody, QuoteRequest } from './types';
import { getLemo, postLemo, getCars, postQuote } from './controllers';
import { QuoteError } from './errors';

export async function getLemoHandler(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
  getLemo();
  reply.code(200).send();
}

export async function postLemoHandler(
  request: FastifyRequest<{ Body: PostLemoBody }>,
  reply: FastifyReply,
): Promise<void> {
  const result = postLemo(request.body);
  reply.send(result);
}

export async function getCarsHandler(
  request: FastifyRequest<{ Querystring: { userId: string } }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const cars = getCars(request.query.userId);
    reply.send(cars);
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new QuoteError(err.message);
    }
    throw new QuoteError('Unknown error');
  }
}

export async function postQuoteHandler(
  request: FastifyRequest<{ Body: QuoteRequest }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const result = postQuote(request.body);
    reply.send(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new QuoteError(err.message);
    }
    throw new QuoteError('Unknown error');
  }
}
