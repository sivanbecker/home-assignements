import { startSession, submitProfile, submitQuote, bindSession, getStatus } from '../../src/onboarding/controllers';
import { SessionStore } from '../../src/onboarding/SessionStore';
import { QuoteEngine, AgeFactor, CarCountFactor } from '../../src/onboarding/QuoteEngine';
import { SessionStep } from '../../src/onboarding/types';
import { StepAlreadyDoneError, StepPrerequisiteError, SessionNotFoundError } from '../../src/onboarding/errors';

const engine = new QuoteEngine({
  perCarFactors: [new AgeFactor()],
  totalFactors: [new CarCountFactor()],
});

const VALID_PROFILE = { age: 30, licenseYear: 2015, zipCode: '10001' };

describe('startSession', () => {
  it('should create a new session with step STARTED', () => {
    const store = new SessionStore();
    const session = startSession(store);
    expect(session.step).toBe(SessionStep.STARTED);
    expect(session.sessionId).toBeDefined();
  });
});

describe('submitProfile', () => {
  describe('happy path', () => {
    it('should advance session to PROFILED and return eligible cars', () => {
      const store = new SessionStore();
      const { sessionId } = startSession(store);
      const session = submitProfile(store, sessionId, VALID_PROFILE);
      expect(session.step).toBe(SessionStep.PROFILED);
      expect(session.profile).toEqual(VALID_PROFILE);
      expect(Array.isArray(session.eligibleCars)).toBe(true);
    });

    it('should return only cars that pass eligibility rules', () => {
      const store = new SessionStore();
      const { sessionId } = startSession(store);
      const session = submitProfile(store, sessionId, VALID_PROFILE);
      for (const car of session.eligibleCars ?? []) {
        expect(car.year).toBeGreaterThanOrEqual(2008);
        expect(car.value).toBeLessThan(150000);
      }
    });
  });

  describe('step order violations', () => {
    it('should throw StepAlreadyDoneError if called twice on same session', () => {
      const store = new SessionStore();
      const { sessionId } = startSession(store);
      submitProfile(store, sessionId, VALID_PROFILE);
      expect(() => submitProfile(store, sessionId, VALID_PROFILE)).toThrow(StepAlreadyDoneError);
    });

    it('should throw StepAlreadyDoneError if session is already QUOTED', () => {
      const store = new SessionStore();
      const { sessionId } = startSession(store);
      const profiled = submitProfile(store, sessionId, VALID_PROFILE);
      const carId = profiled.eligibleCars![0].carId;
      submitQuote(store, engine, sessionId, { carIds: [carId] });
      expect(() => submitProfile(store, sessionId, VALID_PROFILE)).toThrow(StepAlreadyDoneError);
    });
  });

  describe('invalid session', () => {
    it('should throw SessionNotFoundError for unknown sessionId', () => {
      const store = new SessionStore();
      expect(() => submitProfile(store, 'unknown', VALID_PROFILE)).toThrow(SessionNotFoundError);
    });
  });
});

describe('submitQuote', () => {
  describe('happy path', () => {
    it('should advance session to QUOTED and return a quote', () => {
      const store = new SessionStore();
      const { sessionId } = startSession(store);
      const profiled = submitProfile(store, sessionId, VALID_PROFILE);
      const carId = profiled.eligibleCars![0].carId;
      const session = submitQuote(store, engine, sessionId, { carIds: [carId] });
      expect(session.step).toBe(SessionStep.QUOTED);
      expect(session.quote).toBeDefined();
      expect(session.quote!.perCar[carId]).toBeGreaterThan(0);
    });
  });

  describe('step order violations', () => {
    it('should throw StepPrerequisiteError if profile step was not completed', () => {
      const store = new SessionStore();
      const { sessionId } = startSession(store);
      expect(() => submitQuote(store, engine, sessionId, { carIds: ['car-1'] })).toThrow(StepPrerequisiteError);
    });

    it('should throw StepAlreadyDoneError if called twice on same session', () => {
      const store = new SessionStore();
      const { sessionId } = startSession(store);
      const profiled = submitProfile(store, sessionId, VALID_PROFILE);
      const carId = profiled.eligibleCars![0].carId;
      submitQuote(store, engine, sessionId, { carIds: [carId] });
      expect(() => submitQuote(store, engine, sessionId, { carIds: [carId] })).toThrow(StepAlreadyDoneError);
    });
  });
});

describe('bindSession', () => {
  describe('happy path', () => {
    it('should advance session to BOUND and set boundAt', () => {
      const store = new SessionStore();
      const { sessionId } = startSession(store);
      const profiled = submitProfile(store, sessionId, VALID_PROFILE);
      const carId = profiled.eligibleCars![0].carId;
      submitQuote(store, engine, sessionId, { carIds: [carId] });
      const session = bindSession(store, sessionId);
      expect(session.step).toBe(SessionStep.BOUND);
      expect(session.boundAt).toBeInstanceOf(Date);
    });
  });

  describe('step order violations', () => {
    it('should throw StepPrerequisiteError if quote step was not completed', () => {
      const store = new SessionStore();
      const { sessionId } = startSession(store);
      submitProfile(store, sessionId, VALID_PROFILE);
      expect(() => bindSession(store, sessionId)).toThrow(StepPrerequisiteError);
    });

    it('should throw StepAlreadyDoneError if called twice on same session', () => {
      const store = new SessionStore();
      const { sessionId } = startSession(store);
      const profiled = submitProfile(store, sessionId, VALID_PROFILE);
      const carId = profiled.eligibleCars![0].carId;
      submitQuote(store, engine, sessionId, { carIds: [carId] });
      bindSession(store, sessionId);
      expect(() => bindSession(store, sessionId)).toThrow(StepAlreadyDoneError);
    });
  });
});

describe('getStatus', () => {
  it('should return session at any step', () => {
    const store = new SessionStore();
    const { sessionId } = startSession(store);
    const session = getStatus(store, sessionId);
    expect(session.sessionId).toBe(sessionId);
    expect(session.step).toBe(SessionStep.STARTED);
  });

  it('should throw SessionNotFoundError for unknown sessionId', () => {
    const store = new SessionStore();
    expect(() => getStatus(store, 'unknown')).toThrow(SessionNotFoundError);
  });
});
