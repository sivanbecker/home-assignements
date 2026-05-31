import type { FastifyRequest, FastifyReply } from 'fastify';
import type { PostLemoBody } from './schemas';
import { getLemo, postLemo } from './controllers';

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
