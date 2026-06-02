import { QuoteEngine, CarCountFactor, AgeFactor } from '../../src/onboarding/QuoteEngine';
import { SessionStep } from '../../src/onboarding/types';
import type { Session } from '../../src/onboarding/types';

const BASE_SESSION: Session = {
  sessionId: 'test-session',
  step: SessionStep.PROFILED,
  createdAt: new Date(),
  profile: { age: 30, licenseYear: 2015, zipCode: '10001' },
  eligibleCars: [
    { carId: 'car-1', make: 'Toyota', model: 'Camry', year: 2018, value: 20000 },
    { carId: 'car-2', make: 'Honda', model: 'Civic', year: 2020, value: 18000 },
  ],
  selectedCarIds: ['car-1'],
};

describe('CarCountFactor', () => {
  const factor = new CarCountFactor();

  describe('happy path', () => {
    it('should return 1.0 multiplier for a single car', () => {
      const session = { ...BASE_SESSION, selectedCarIds: ['car-1'] };
      expect(factor.apply(session)).toBe(1.0);
    });

    it('should return 0.95 multiplier for two or more cars', () => {
      const session = { ...BASE_SESSION, selectedCarIds: ['car-1', 'car-2'] };
      expect(factor.apply(session)).toBe(0.95);
    });
  });

  describe('edge cases', () => {
    it('should return 1.0 multiplier for empty selection', () => {
      const session = { ...BASE_SESSION, selectedCarIds: [] };
      expect(factor.apply(session)).toBe(1.0);
    });
  });
});

describe('AgeFactor', () => {
  const factor = new AgeFactor();

  describe('happy path', () => {
    it('should return 1.0 multiplier for age 25 or older', () => {
      const session = { ...BASE_SESSION, profile: { ...BASE_SESSION.profile!, age: 25 } };
      expect(factor.apply(session)).toBe(1.0);
    });

    it('should return 1.3 multiplier for age under 25', () => {
      const session = { ...BASE_SESSION, profile: { ...BASE_SESSION.profile!, age: 24 } };
      expect(factor.apply(session)).toBe(1.3);
    });
  });

  describe('edge cases', () => {
    it('should return 1.0 multiplier for exactly age 25', () => {
      const session = { ...BASE_SESSION, profile: { ...BASE_SESSION.profile!, age: 25 } };
      expect(factor.apply(session)).toBe(1.0);
    });

    it('should return 1.3 multiplier for age 0', () => {
      const session = { ...BASE_SESSION, profile: { ...BASE_SESSION.profile!, age: 0 } };
      expect(factor.apply(session)).toBe(1.3);
    });
  });
});

describe('QuoteEngine', () => {
  describe('happy path', () => {
    it('should return a per-car premium of base 1000 with no factors', () => {
      const engine = new QuoteEngine([]);
      const session = { ...BASE_SESSION, selectedCarIds: ['car-1'] };
      const quote = engine.calculate(session);
      expect(quote.perCar['car-1']).toBe(1000);
      expect(quote.total).toBe(1000);
    });

    it('should apply AgeFactor multiplier to each car premium', () => {
      const engine = new QuoteEngine([new AgeFactor()]);
      const session = {
        ...BASE_SESSION,
        profile: { ...BASE_SESSION.profile!, age: 24 },
        selectedCarIds: ['car-1'],
      };
      const quote = engine.calculate(session);
      expect(quote.perCar['car-1']).toBe(1300);
      expect(quote.total).toBe(1300);
    });

    it('should apply CarCountFactor discount to total for multiple cars', () => {
      const engine = new QuoteEngine([new CarCountFactor()]);
      const session = { ...BASE_SESSION, selectedCarIds: ['car-1', 'car-2'] };
      const quote = engine.calculate(session);
      expect(quote.perCar['car-1']).toBe(1000);
      expect(quote.perCar['car-2']).toBe(1000);
      expect(quote.total).toBe(Math.round(2000 * 0.95));
    });

    it('should compose multiple factors and round to nearest integer', () => {
      const engine = new QuoteEngine([new AgeFactor(), new CarCountFactor()]);
      const session = {
        ...BASE_SESSION,
        profile: { ...BASE_SESSION.profile!, age: 24 },
        selectedCarIds: ['car-1', 'car-2'],
      };
      const quote = engine.calculate(session);
      expect(quote.perCar['car-1']).toBe(1300);
      expect(quote.perCar['car-2']).toBe(1300);
      expect(quote.total).toBe(Math.round(2600 * 0.95));
    });
  });

  describe('edge cases', () => {
    it('should return zero total for empty car selection', () => {
      const engine = new QuoteEngine([new AgeFactor(), new CarCountFactor()]);
      const session = { ...BASE_SESSION, selectedCarIds: [] };
      const quote = engine.calculate(session);
      expect(quote.total).toBe(0);
      expect(quote.perCar).toEqual({});
    });
  });
});
