import { CarCategory, type VendorCar } from './vendor';
import type { UserProfile } from './schemas';

const BASE_PREMIUM = 1000;
const YOUNG_DRIVER_AGE_THRESHOLD = 25;
const YOUNG_DRIVER_FACTOR = 1.3;
const LOW_SENIORITY_YEARS_THRESHOLD = 3;
const LOW_SENIORITY_FACTOR = 1.2;
const SPORT_FACTOR = 1.5;
const SUV_FACTOR = 1.1;
const MIN_INSURABLE_YEAR = 2008;
const MAX_INSURABLE_VALUE = 150_000;
export const MULTI_CAR_MIN_COUNT = 2;
export const MULTI_CAR_DISCOUNT_FACTOR = 0.95;

export type RiskFactor = (profile: UserProfile, car: VendorCar, currentYear: number) => number;
export type InsurabilityRule = (car: VendorCar) => string | null;

export const ageFactor: RiskFactor = (profile) =>
  profile.age < YOUNG_DRIVER_AGE_THRESHOLD ? YOUNG_DRIVER_FACTOR : 1.0;

export const seniorityFactor: RiskFactor = (profile, _car, currentYear) =>
  currentYear - profile.licenseYear < LOW_SENIORITY_YEARS_THRESHOLD ? LOW_SENIORITY_FACTOR : 1.0;

export const categoryFactor: RiskFactor = (_profile, car) => {
  if (car.category === CarCategory.Sport) return SPORT_FACTOR;
  if (car.category === CarCategory.Suv) return SUV_FACTOR;
  return 1.0;
};

export const RISK_FACTORS: RiskFactor[] = [ageFactor, seniorityFactor, categoryFactor];

export function calculatePremium(
  profile: UserProfile,
  car: VendorCar,
  currentYear: number = new Date().getFullYear(),
): number {
  const multiplier = RISK_FACTORS.reduce((acc, factor) => acc * factor(profile, car, currentYear), 1);
  return Math.round(BASE_PREMIUM * multiplier);
}

export const yearRule: InsurabilityRule = (car) =>
  car.year < MIN_INSURABLE_YEAR ? `year must be ${MIN_INSURABLE_YEAR} or later` : null;

export const categoryRule: InsurabilityRule = (car) =>
  car.category === CarCategory.Exotic ? 'category must not be exotic' : null;

export const valueRule: InsurabilityRule = (car) =>
  car.value >= MAX_INSURABLE_VALUE ? `value must be under ${MAX_INSURABLE_VALUE}` : null;

export const INSURABILITY_RULES: InsurabilityRule[] = [yearRule, categoryRule, valueRule];

export function getInsurabilityFailures(car: VendorCar): string[] {
  return INSURABILITY_RULES.map((r) => r(car)).filter((r): r is string => r !== null);

}

export function isInsurable(car: VendorCar): boolean {
  return getInsurabilityFailures(car).length === 0;
}
