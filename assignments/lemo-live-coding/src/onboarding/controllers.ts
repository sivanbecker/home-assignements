import { SessionStore } from './SessionStore';
import { QuoteEngine } from './QuoteEngine';
import { StepOrderError } from './errors';
import { SessionStep, type Session, type CarOption, type ProfileBody } from './types';

export interface QuoteBody {
  carIds: string[];
}

const CAR_CATALOGUE: CarOption[] = [
  { carId: 'car-1', make: 'Toyota', model: 'Camry', year: 2018, value: 20000 },
  { carId: 'car-2', make: 'Honda', model: 'Civic', year: 2020, value: 18000 },
  { carId: 'car-3', make: 'Ford', model: 'Mustang', year: 2019, value: 45000 },
  { carId: 'car-4', make: 'Ferrari', model: '488', year: 2021, value: 280000 },
  { carId: 'car-5', make: 'Toyota', model: 'Corolla', year: 2005, value: 8000 },
];

const ELIGIBILITY_MIN_YEAR = 2008;
const ELIGIBILITY_MAX_VALUE = 150000;

function isEligible(car: CarOption): boolean {
  return car.year >= ELIGIBILITY_MIN_YEAR && car.value < ELIGIBILITY_MAX_VALUE;
}

function requireStep(session: Session, expected: SessionStep): void {
  if (session.step !== expected) {
    throw new StepOrderError(
      `Expected step ${expected} but session is at ${session.step}`,
    );
  }
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
  const eligibleCars = CAR_CATALOGUE.filter(isEligible);
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
  store.update(sessionId, { selectedCarIds: body.carIds });
  const updatedSession = store.get(sessionId);
  const quote = engine.calculate(updatedSession);
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
