import {
  ageFactor,
  seniorityFactor,
  categoryFactor,
  calculatePremium,
  yearRule,
  categoryRule,
  valueRule,
  isInsurable,
  getInsurabilityFailures,
} from '../src/pricing';
import { CarCategory, type VendorCar } from '../src/vendor';
import type { UserProfile } from '../src/types';

const BASE_YEAR = 2024;

function makeCar(overrides: Partial<VendorCar> = {}): VendorCar {
  return {
    id: 'car-test',
    userId: 'user-1',
    make: 'Toyota',
    model: 'Camry',
    year: 2015,
    category: CarCategory.Sedan,
    value: 20000,
    ...overrides,
  };
}

function makeProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return { age: 30, licenseYear: 2010, zipCode: '10001', ...overrides };
}

// ─── ageFactor ───────────────────────────────────────────────────────────────

describe('ageFactor', () => {
  it('should return 1.3 when driver age is under 25', () => {
    expect(ageFactor(makeProfile({ age: 24 }), makeCar(), BASE_YEAR)).toBe(1.3);
  });

  it('should return 1.0 when driver age is exactly 25', () => {
    expect(ageFactor(makeProfile({ age: 25 }), makeCar(), BASE_YEAR)).toBe(1.0);
  });

  it('should return 1.0 when driver age is over 25', () => {
    expect(ageFactor(makeProfile({ age: 40 }), makeCar(), BASE_YEAR)).toBe(1.0);
  });
});

// ─── seniorityFactor ─────────────────────────────────────────────────────────

describe('seniorityFactor', () => {
  it('should return 1.2 when license seniority is under 3 years', () => {
    expect(seniorityFactor(makeProfile({ licenseYear: 2022 }), makeCar(), BASE_YEAR)).toBe(1.2);
  });

  it('should return 1.2 when license seniority is exactly 2 years', () => {
    expect(seniorityFactor(makeProfile({ licenseYear: 2022 }), makeCar(), BASE_YEAR)).toBe(1.2);
  });

  it('should return 1.0 when license seniority is exactly 3 years', () => {
    expect(seniorityFactor(makeProfile({ licenseYear: 2021 }), makeCar(), BASE_YEAR)).toBe(1.0);
  });

  it('should return 1.0 when license seniority is over 3 years', () => {
    expect(seniorityFactor(makeProfile({ licenseYear: 2010 }), makeCar(), BASE_YEAR)).toBe(1.0);
  });
});

// ─── categoryFactor ──────────────────────────────────────────────────────────

describe('categoryFactor', () => {
  it.each([
    [CarCategory.Sport, 1.5],
    [CarCategory.Suv, 1.1],
    [CarCategory.Sedan, 1.0],
    [CarCategory.Exotic, 1.0],
  ])('should return %s multiplier for %s category', (category, expected) => {
    expect(categoryFactor(makeProfile(), makeCar({ category }), BASE_YEAR)).toBe(expected);
  });
});

// ─── calculatePremium ────────────────────────────────────────────────────────

describe('calculatePremium', () => {
  it('should return 1000 for base case (adult, senior license, sedan)', () => {
    expect(calculatePremium(makeProfile({ age: 30, licenseYear: 2010 }), makeCar({ category: CarCategory.Sedan }), BASE_YEAR)).toBe(1000);
  });

  it('should apply age multiplier only', () => {
    // 1000 * 1.3 = 1300
    expect(calculatePremium(makeProfile({ age: 24, licenseYear: 2010 }), makeCar({ category: CarCategory.Sedan }), BASE_YEAR)).toBe(1300);
  });

  it('should apply seniority multiplier only', () => {
    // 1000 * 1.2 = 1200
    expect(calculatePremium(makeProfile({ age: 30, licenseYear: 2022 }), makeCar({ category: CarCategory.Sedan }), BASE_YEAR)).toBe(1200);
  });

  it('should apply category multiplier for sport', () => {
    // 1000 * 1.5 = 1500
    expect(calculatePremium(makeProfile({ age: 30, licenseYear: 2010 }), makeCar({ category: CarCategory.Sport }), BASE_YEAR)).toBe(1500);
  });

  it('should apply category multiplier for suv', () => {
    // 1000 * 1.1 = 1100
    expect(calculatePremium(makeProfile({ age: 30, licenseYear: 2010 }), makeCar({ category: CarCategory.Suv }), BASE_YEAR)).toBe(1100);
  });

  it('should stack all multipliers multiplicatively', () => {
    // 1000 * 1.3 * 1.2 * 1.5 = 2340
    expect(calculatePremium(makeProfile({ age: 24, licenseYear: 2022 }), makeCar({ category: CarCategory.Sport }), BASE_YEAR)).toBe(2340);
  });

  it('should round to nearest integer', () => {
    // 1000 * 1.3 * 1.2 = 1560 (exact — also verify rounding works for non-exact)
    // 1000 * 1.3 * 1.1 = 1430
    expect(calculatePremium(makeProfile({ age: 24, licenseYear: 2010 }), makeCar({ category: CarCategory.Suv }), BASE_YEAR)).toBe(1430);
  });

  it('should use the provided currentYear for seniority calculation', () => {
    // licenseYear 2018, currentYear 2020 → seniority 2 → 1.2 factor
    expect(calculatePremium(makeProfile({ age: 30, licenseYear: 2018 }), makeCar(), 2020)).toBe(1200);
  });
});

// ─── insurability rules ──────────────────────────────────────────────────────

describe('yearRule', () => {
  it('should return null for a car made in 2008', () => {
    expect(yearRule(makeCar({ year: 2008 }))).toBeNull();
  });

  it('should return null for a car made after 2008', () => {
    expect(yearRule(makeCar({ year: 2020 }))).toBeNull();
  });

  it('should return a failure reason for a car made before 2008', () => {
    expect(yearRule(makeCar({ year: 2007 }))).toBe('year must be 2008 or later');
  });
});

describe('categoryRule', () => {
  it('should return null for sedan', () => {
    expect(categoryRule(makeCar({ category: CarCategory.Sedan }))).toBeNull();
  });

  it('should return null for suv', () => {
    expect(categoryRule(makeCar({ category: CarCategory.Suv }))).toBeNull();
  });

  it('should return null for sport', () => {
    expect(categoryRule(makeCar({ category: CarCategory.Sport }))).toBeNull();
  });

  it('should return a failure reason for exotic', () => {
    expect(categoryRule(makeCar({ category: CarCategory.Exotic }))).toBe('category must not be exotic');
  });
});

describe('valueRule', () => {
  it('should return null for a car valued under 150000', () => {
    expect(valueRule(makeCar({ value: 149999 }))).toBeNull();
  });

  it('should return a failure reason for a car valued at exactly 150000', () => {
    expect(valueRule(makeCar({ value: 150000 }))).toBe('value must be under 150000');
  });

  it('should return a failure reason for a car valued over 150000', () => {
    expect(valueRule(makeCar({ value: 200000 }))).toBe('value must be under 150000');
  });
});

// ─── isInsurable / getInsurabilityFailures ───────────────────────────────────

describe('isInsurable', () => {
  it('should return true for a car that passes all rules', () => {
    expect(isInsurable(makeCar())).toBe(true);
  });

  it('should return false for an exotic car', () => {
    expect(isInsurable(makeCar({ category: CarCategory.Exotic }))).toBe(false);
  });

  it('should return false for a car made before 2008', () => {
    expect(isInsurable(makeCar({ year: 2005 }))).toBe(false);
  });

  it('should return false for a car valued at 150000 or more', () => {
    expect(isInsurable(makeCar({ value: 150000 }))).toBe(false);
  });
});

describe('getInsurabilityFailures', () => {
  it('should return empty array for an insurable car', () => {
    expect(getInsurabilityFailures(makeCar())).toEqual([]);
  });

  it('should return one failure reason when one rule fails', () => {
    const failures = getInsurabilityFailures(makeCar({ category: CarCategory.Exotic }));
    expect(failures).toHaveLength(1);
    expect(failures[0]).toBe('category must not be exotic');
  });

  it('should return multiple failure reasons when multiple rules fail', () => {
    const failures = getInsurabilityFailures(makeCar({ year: 2005, value: 200000 }));
    expect(failures).toContain('year must be 2008 or later');
    expect(failures).toContain('value must be under 150000');
  });
});
