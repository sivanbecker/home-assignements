import { SessionStore } from './SessionStore';
import { QuoteEngine } from './QuoteEngine';
import { StepAlreadyDoneError, StepPrerequisiteError } from './errors';
import { SessionStep, type Session, type CarOption, type ProfileBody } from './types';
import { getAllCars } from './carRepository';

export interface QuoteBody {
  carIds: string[];
}

const ELIGIBILITY_MIN_YEAR = 2008;
const ELIGIBILITY_MAX_VALUE = 150000;

function isEligible(car: CarOption): boolean {
  return car.year >= ELIGIBILITY_MIN_YEAR && car.value < ELIGIBILITY_MAX_VALUE;
}

const STEP_ORDER = [SessionStep.STARTED, SessionStep.PROFILED, SessionStep.QUOTED, SessionStep.BOUND];

function requireStep(session: Session, expected: SessionStep): void {
  if (session.step === expected) return;
  const currentIdx = STEP_ORDER.indexOf(session.step);
  const expectedIdx = STEP_ORDER.indexOf(expected);
  if (currentIdx > expectedIdx) {
    throw new StepAlreadyDoneError(
      `Step ${expected} already completed — session is at ${session.step}`,
    );
  }
  throw new StepPrerequisiteError(
    `Expected step ${expected} but session is at ${session.step}`,
  );
}

export function startSession(store: SessionStore): Session {
  return store.create();
}

export function submitProfile(
  store: SessionStore,
  sessionId: string,
  profile: ProfileBody,
): Session {
  const session = store.get(sessionId);
  requireStep(session, SessionStep.STARTED);
  const eligibleCars = getAllCars().filter(isEligible);
  store.update(sessionId, { profile, eligibleCars });
  return store.advanceStep(sessionId, SessionStep.PROFILED);
}

export function submitQuote(
  store: SessionStore,
  engine: QuoteEngine,
  sessionId: string,
  body: QuoteBody,
): Session {
  const session = store.get(sessionId);
  requireStep(session, SessionStep.PROFILED);
  const sessionWithCars = store.update(sessionId, { selectedCarIds: body.carIds });
  const quote = engine.calculate(sessionWithCars);
  store.update(sessionId, { quote });
  return store.advanceStep(sessionId, SessionStep.QUOTED);
}

export function bindSession(store: SessionStore, sessionId: string): Session {
  const session = store.get(sessionId);
  requireStep(session, SessionStep.QUOTED);
  store.update(sessionId, { boundAt: new Date() });
  return store.advanceStep(sessionId, SessionStep.BOUND);
}

export function getStatus(store: SessionStore, sessionId: string): Session {
  return store.get(sessionId);
}
