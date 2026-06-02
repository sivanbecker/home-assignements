import { randomUUID } from 'crypto';
import { SessionNotFoundError, SessionExpiredError } from './errors';
import type { Session } from './types';
import { SessionStep } from './types';

const DEFAULT_TTL_MS = 30 * 60 * 1000;

export class SessionStore {
  private readonly sessions = new Map<string, Session>();
  private readonly ttlMs: number;

  constructor(options?: { ttlMs?: number }) {
    this.ttlMs = options?.ttlMs ?? DEFAULT_TTL_MS;
  }

  create(): Session {
    const session: Session = {
      sessionId: randomUUID(),
      step: SessionStep.STARTED,
      createdAt: new Date(),
    };
    this.sessions.set(session.sessionId, session);
    return session;
  }

  get(sessionId: string): Session {
    const session = this.sessions.get(sessionId);
    if (!session) throw new SessionNotFoundError(sessionId);
    if (Date.now() - session.createdAt.getTime() > this.ttlMs) {
      throw new SessionExpiredError(sessionId);
    }
    return session;
  }

  update(sessionId: string, patch: Omit<Partial<Session>, 'sessionId' | 'createdAt' | 'step'>): Session {
    const session = this.sessions.get(sessionId);
    if (!session) throw new SessionNotFoundError(sessionId);
    const updated = { ...session, ...patch };
    this.sessions.set(sessionId, updated);
    return updated;
  }

  advanceStep(sessionId: string, step: SessionStep): Session {
    const session = this.sessions.get(sessionId);
    if (!session) throw new SessionNotFoundError(sessionId);
    const updated = { ...session, step };
    this.sessions.set(sessionId, updated);
    return updated;
  }
}
