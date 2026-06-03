import type { FastifyRequest, FastifyReply } from 'fastify';
import type { SessionStore } from './SessionStore';
import type { QuoteEngine } from './QuoteEngine';
import { startSession, submitProfile, submitQuote, bindSession, getStatus, type QuoteBody } from './controllers';
import { SessionNotFoundError, SessionExpiredError, StepAlreadyDoneError, StepPrerequisiteError, OnboardingWebError } from './errors';
import type { ProfileBody } from './types';

type SessionParams = { sessionId: string };

function mapDomainError(error: unknown): never {
  if (error instanceof SessionNotFoundError) throw new OnboardingWebError(404, error.message);
  if (error instanceof SessionExpiredError) throw new OnboardingWebError(410, error.message);
  if (error instanceof StepAlreadyDoneError) throw new OnboardingWebError(409, error.message);
  if (error instanceof StepPrerequisiteError) throw new OnboardingWebError(422, error.message);
  throw error;
}

export function makeOnboardingHandlers(store: SessionStore, engine: QuoteEngine) {
  return {
    startHandler: async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const session = startSession(store);
      reply.send(session);
    },

    profileHandler: async (
      request: FastifyRequest<{ Params: SessionParams; Body: ProfileBody }>,
      reply: FastifyReply,
    ): Promise<void> => {
      try {
        const session = submitProfile(store, request.params.sessionId, request.body);
        reply.send(session);
      } catch (error) {
        mapDomainError(error);
      }
    },

    quoteHandler: async (
      request: FastifyRequest<{ Params: SessionParams; Body: QuoteBody }>,
      reply: FastifyReply,
    ): Promise<void> => {
      try {
        const session = submitQuote(store, engine, request.params.sessionId, request.body);
        reply.send(session);
      } catch (error) {
        mapDomainError(error);
      }
    },

    bindHandler: async (
      request: FastifyRequest<{ Params: SessionParams }>,
      reply: FastifyReply,
    ): Promise<void> => {
      try {
        const session = bindSession(store, request.params.sessionId);
        reply.send(session);
      } catch (error) {
        mapDomainError(error);
      }
    },

    statusHandler: async (
      request: FastifyRequest<{ Params: SessionParams }>,
      reply: FastifyReply,
    ): Promise<void> => {
      try {
        const session = getStatus(store, request.params.sessionId);
        reply.send(session);
      } catch (error) {
        mapDomainError(error);
      }
    },
  };
}
