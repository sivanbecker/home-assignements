import { getLemo, postLemo, getCars, postQuote } from '../src/controllers';
import {
  UserNotFoundError,
  CarNotFoundError,
  CarNotInsurableError,
  DriverTooYoungError,
  EmptyCarSelectionError,
} from '../src/errors';
import type { QuoteRequest } from '../src/schemas';

const CURRENT_YEAR = 2024;

describe('controllers', () => {
  describe('getLemo', () => {
    it('should return undefined', () => {
      expect(getLemo()).toBeUndefined();
    });
  });

  describe('postLemo', () => {
    it('should return received true with the submitted name and value', () => {
      const result = postLemo({ name: 'example', value: 'demo' });
      expect(result).toEqual({ received: true, name: 'example', value: 'demo' });
    });

    it('should echo back empty string name and value as-is', () => {
      const result = postLemo({ name: '', value: '' });
      expect(result).toEqual({ received: true, name: '', value: '' });
    });

    it('should echo back whitespace name and value as-is', () => {
      const result = postLemo({ name: '  ', value: '  ' });
      expect(result).toEqual({ received: true, name: '  ', value: '  ' });
    });
  });
});

// ─── getCars ──────────────────────────────────────────────────────────────────

describe('getCars', () => {
  it('should return all cars for a known userId annotated with insurable', () => {
    const cars = getCars('user-1');
    expect(cars.length).toBeGreaterThan(0);
    for (const car of cars) {
      expect(typeof car.insurable).toBe('boolean');
    }
  });

  it('should mark insurable cars correctly', () => {
    const cars = getCars('user-1');
    const sedan = cars.find((c) => c.id === 'car-1');
    expect(sedan?.insurable).toBe(true);
  });

  it('should mark non-insurable cars correctly', () => {
    const cars = getCars('user-1');
    const exotic = cars.find((c) => c.id === 'car-3');
    expect(exotic?.insurable).toBe(false);
  });

  it('should return both insurable and non-insurable cars', () => {
    const cars = getCars('user-1');
    expect(cars.some((c) => c.insurable)).toBe(true);
    expect(cars.some((c) => !c.insurable)).toBe(true);
  });

  it('should throw UserNotFoundError for an unknown userId', () => {
    expect(() => getCars('unknown')).toThrow(UserNotFoundError);
  });
});

// ─── postQuote ────────────────────────────────────────────────────────────────

function makeQuoteRequest(overrides: Partial<QuoteRequest> = {}): QuoteRequest {
  return {
    userId: 'user-1',
    user: { age: 30, licenseYear: 2010, zipCode: '10001' },
    carIds: ['car-1'],
    ...overrides,
  };
}

describe('postQuote', () => {
  it('should return a quote with per-car premium and combined premium for a single car', () => {
    const result = postQuote(makeQuoteRequest({ carIds: ['car-1'] }), CURRENT_YEAR);
    expect(result.quotes).toHaveLength(1);
    expect(result.quotes[0].carId).toBe('car-1');
    expect(result.quotes[0].premium).toBe(1000);
    expect(result.combinedPremium).toBe(1000);
  });

  it('should apply multi-car discount when 2 or more cars are selected', () => {
    // car-1: sedan, car-2: suv → premiums 1000, 1100 → combined pre-discount 2100 × 0.95 = 1995
    const result = postQuote(makeQuoteRequest({ carIds: ['car-1', 'car-2'] }), CURRENT_YEAR);
    expect(result.quotes).toHaveLength(2);
    expect(result.quotes.find((q) => q.carId === 'car-1')?.premium).toBe(1000);
    expect(result.quotes.find((q) => q.carId === 'car-2')?.premium).toBe(1100);
    expect(result.combinedPremium).toBe(1995);
  });

  it('should not apply discount for a single car', () => {
    const result = postQuote(makeQuoteRequest({ carIds: ['car-1'] }), CURRENT_YEAR);
    expect(result.combinedPremium).toBe(result.quotes[0].premium);
  });

  it('should throw DriverTooYoungError when driver age is under 18', () => {
    expect(() =>
      postQuote(makeQuoteRequest({ user: { age: 17, licenseYear: 2010, zipCode: '10001' } }), CURRENT_YEAR),
    ).toThrow(DriverTooYoungError);
  });

  it('should throw EmptyCarSelectionError when carIds is empty', () => {
    expect(() => postQuote(makeQuoteRequest({ carIds: [] }), CURRENT_YEAR)).toThrow(EmptyCarSelectionError);
  });

  it('should throw UserNotFoundError when userId is unknown', () => {
    expect(() => postQuote(makeQuoteRequest({ userId: 'unknown' }), CURRENT_YEAR)).toThrow(UserNotFoundError);
  });

  it('should throw CarNotFoundError when a carId does not belong to the user', () => {
    // car-4 belongs to user-2, not user-1
    expect(() =>
      postQuote(makeQuoteRequest({ carIds: ['car-4'] }), CURRENT_YEAR),
    ).toThrow(CarNotFoundError);
  });

  it('should throw CarNotInsurableError when a selected car is not insurable', () => {
    // car-3 is exotic — not insurable
    expect(() =>
      postQuote(makeQuoteRequest({ carIds: ['car-3'] }), CURRENT_YEAR),
    ).toThrow(CarNotInsurableError);
  });

  it('should throw CarNotInsurableError with a message containing the carId', () => {
    expect(() =>
      postQuote(makeQuoteRequest({ carIds: ['car-3'] }), CURRENT_YEAR),
    ).toThrow(/car-3/);
  });

  it('should validate userId before age', () => {
    expect(() =>
      postQuote(makeQuoteRequest({ userId: 'unknown', user: { age: 16, licenseYear: 2010, zipCode: '10001' } }), CURRENT_YEAR),
    ).toThrow(UserNotFoundError);
  });

  it('should validate age before checking carIds', () => {
    expect(() =>
      postQuote(makeQuoteRequest({ user: { age: 16, licenseYear: 2010, zipCode: '10001' }, carIds: [] }), CURRENT_YEAR),
    ).toThrow(DriverTooYoungError);
  });
});
