import { WebError } from '../errors/WebError';

export class SessionNotFoundError extends Error {
  constructor(sessionId: string) {
    super(`Session not found: ${sessionId}`);
    this.name = 'SessionNotFoundError';
  }
}

export class SessionExpiredError extends Error {
  constructor(sessionId: string) {
    super(`Session expired: ${sessionId}`);
    this.name = 'SessionExpiredError';
  }
}

export class StepOrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StepOrderError';
  }
}

export class OnboardingWebError extends WebError {
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.name = 'OnboardingWebError';
  }
}
