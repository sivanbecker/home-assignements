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

// step already completed — client should start a new session (409)
export class StepAlreadyDoneError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StepAlreadyDoneError';
  }
}

// prerequisite step not yet completed (422)
export class StepPrerequisiteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StepPrerequisiteError';
  }
}

export class OnboardingWebError extends WebError {
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.name = 'OnboardingWebError';
  }
}
