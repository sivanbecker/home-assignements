import { getLemoHandler, postLemoHandler } from '../src/handlers';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { PostLemoBody } from '../src/schemas';

type PostLemoRequest = FastifyRequest<{ Body: PostLemoBody }>;

function makeReply(): jest.Mocked<Pick<FastifyReply, 'code' | 'send'>> {
  const reply = {
    code: jest.fn(),
    send: jest.fn(),
  };
  reply.code.mockReturnValue(reply);
  return reply;
}

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
