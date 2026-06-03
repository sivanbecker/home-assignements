import type { FastifyRequest, FastifyReply } from 'fastify';
import { SessionStore } from './SessionStore';
import { QuoteEngine, AgeFactor, CarCountFactor } from './QuoteEngine';
import { startSession, submitProfile, submitQuote, bindSession, getStatus, type QuoteBody } from './controllers';
import { SessionNotFoundError, SessionExpiredError, StepAlreadyDoneError, StepPrerequisiteError, OnboardingWebError } from './errors';
import type { ProfileBody } from './types';

const store = new SessionStore();
const engine = new QuoteEngine({
  perCarFactors: [new AgeFactor()],
  totalFactors: [new CarCountFactor()],
});

type SessionParams = { sessionId: string };

function mapDomainError(error: unknown): never {
  if (error instanceof SessionNotFoundError) throw new OnboardingWebError(404, error.message);
  if (error instanceof SessionExpiredError) throw new OnboardingWebError(410, error.message);
  if (error instanceof StepAlreadyDoneError) throw new OnboardingWebError(409, error.message);
  if (error instanceof StepPrerequisiteError) throw new OnboardingWebError(422, error.message);
  throw error;
}

export async function startHandler(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const session = startSession(store);
  reply.send(session);
}

export async function profileHandler(
  request: FastifyRequest<{ Params: SessionParams; Body: ProfileBody }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const session = submitProfile(store, request.params.sessionId, request.body);
    reply.send(session);
  } catch (error) {
    mapDomainError(error);
  }
}

export async function quoteHandler(
  request: FastifyRequest<{ Params: SessionParams; Body: QuoteBody }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const session = submitQuote(store, engine, request.params.sessionId, request.body);
    reply.send(session);
  } catch (error) {
    mapDomainError(error);
  }
}

export async function bindHandler(
  request: FastifyRequest<{ Params: SessionParams }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const session = bindSession(store, request.params.sessionId);
    reply.send(session);
  } catch (error) {
    mapDomainError(error);
  }
}

export async function statusHandler(
  request: FastifyRequest<{ Params: SessionParams }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const session = getStatus(store, request.params.sessionId);
    reply.send(session);
  } catch (error) {
    mapDomainError(error);
  }
}
