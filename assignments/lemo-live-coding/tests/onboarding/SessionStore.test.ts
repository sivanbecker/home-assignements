import { SessionStore } from '../../src/onboarding/SessionStore';
import { SessionStep } from '../../src/onboarding/types';
import { SessionNotFoundError, SessionExpiredError, StepOrderError } from '../../src/onboarding/errors';

describe('SessionStore', () => {
  describe('create', () => {
    it('should return a session with a unique sessionId', () => {
      const store = new SessionStore();
      const a = store.create();
      const b = store.create();
      expect(a.sessionId).toBeDefined();
      expect(b.sessionId).toBeDefined();
      expect(a.sessionId).not.toBe(b.sessionId);
    });

    it('should return a session with step STARTED', () => {
      const store = new SessionStore();
      const session = store.create();
      expect(session.step).toBe(SessionStep.STARTED);
    });

    it('should return a session with a createdAt timestamp', () => {
      const store = new SessionStore();
      const before = new Date();
      const session = store.create();
      const after = new Date();
      expect(session.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(session.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('get', () => {
    it('should return the session by sessionId', () => {
      const store = new SessionStore();
      const created = store.create();
      const fetched = store.get(created.sessionId);
      expect(fetched.sessionId).toBe(created.sessionId);
    });

    it('should throw SessionNotFoundError when sessionId does not exist', () => {
      const store = new SessionStore();
      expect(() => store.get('nonexistent')).toThrow(SessionNotFoundError);
    });

    it('should throw SessionExpiredError when session has expired', () => {
      const store = new SessionStore({ ttlMs: 1 });
      const session = store.create();
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(() => store.get(session.sessionId)).toThrow(SessionExpiredError);
          resolve();
        }, 10);
      });
    });
  });

  describe('update', () => {
    it('should apply a data patch to the session and return updated session', () => {
      const store = new SessionStore();
      const session = store.create();
      const profile = { age: 30, licenseYear: 2015, zipCode: '10001' };
      const updated = store.update(session.sessionId, { profile });
      expect(updated.profile).toEqual(profile);
    });

    it('should throw SessionNotFoundError when updating a nonexistent session', () => {
      const store = new SessionStore();
      expect(() => store.update('nonexistent', { profile: { age: 30, licenseYear: 2015, zipCode: '10001' } })).toThrow(SessionNotFoundError);
    });

    it('should not mutate sessionId or createdAt when patching', () => {
      const store = new SessionStore();
      const session = store.create();
      store.update(session.sessionId, { profile: { age: 30, licenseYear: 2015, zipCode: '10001' } });
      const fetched = store.get(session.sessionId);
      expect(fetched.createdAt).toEqual(session.createdAt);
      expect(fetched.sessionId).toBe(session.sessionId);
    });
  });

  describe('advanceStep', () => {
    it('should advance the session step and return updated session', () => {
      const store = new SessionStore();
      const session = store.create();
      const updated = store.advanceStep(session.sessionId, SessionStep.PROFILED);
      expect(updated.step).toBe(SessionStep.PROFILED);
    });

    it('should throw SessionNotFoundError when advancing step on nonexistent session', () => {
      const store = new SessionStore();
      expect(() => store.advanceStep('nonexistent', SessionStep.PROFILED)).toThrow(SessionNotFoundError);
    });

    it('should not allow patching sessionId or createdAt via advanceStep', () => {
      const store = new SessionStore();
      const session = store.create();
      store.advanceStep(session.sessionId, SessionStep.PROFILED);
      const fetched = store.get(session.sessionId);
      expect(fetched.sessionId).toBe(session.sessionId);
      expect(fetched.createdAt).toEqual(session.createdAt);
    });

    it('should throw StepOrderError when advancing to a previous step', () => {
      const store = new SessionStore();
      const session = store.create();
      store.advanceStep(session.sessionId, SessionStep.PROFILED);
      store.advanceStep(session.sessionId, SessionStep.QUOTED);
      expect(() => store.advanceStep(session.sessionId, SessionStep.PROFILED)).toThrow(StepOrderError);
    });

    it('should throw StepOrderError when advancing to the same step', () => {
      const store = new SessionStore();
      const session = store.create();
      store.advanceStep(session.sessionId, SessionStep.PROFILED);
      expect(() => store.advanceStep(session.sessionId, SessionStep.PROFILED)).toThrow(StepOrderError);
    });
  });

  describe('scale: many sessions', () => {
    it('should handle 10000 concurrent sessions without errors', () => {
      const store = new SessionStore();
      const sessions = Array.from({ length: 10000 }, () => store.create());
      expect(sessions).toHaveLength(10000);
      const allUnique = new Set(sessions.map((s) => s.sessionId)).size === 10000;
      expect(allUnique).toBe(true);
    });
  });
});
