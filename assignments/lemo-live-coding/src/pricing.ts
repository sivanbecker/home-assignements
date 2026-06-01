import { CarCategory, type VendorCar } from './vendor';

export interface UserProfile {
  readonly age: number;
  readonly licenseYear: number;
  readonly zipCode: string;
}

type RiskFactor = (profile: UserProfile, car: VendorCar, currentYear: number) => number;
type InsurabilityRule = (car: VendorCar) => string | null;

export const ageFactor: RiskFactor = (profile) => (profile.age < 25 ? 1.3 : 1.0);

export const seniorityFactor: RiskFactor = (profile, _car, currentYear) =>
  currentYear - profile.licenseYear < 3 ? 1.2 : 1.0;

export const categoryFactor: RiskFactor = (_profile, car) => {
  if (car.category === CarCategory.Sport) return 1.5;
  if (car.category === CarCategory.Suv) return 1.1;
  return 1.0;
};

export const RISK_FACTORS: RiskFactor[] = [ageFactor, seniorityFactor, categoryFactor];

export function calculatePremium(
  profile: UserProfile,
  car: VendorCar,
  currentYear: number = new Date().getFullYear(),
): number {
  const multiplier = RISK_FACTORS.reduce((acc, factor) => acc * factor(profile, car, currentYear), 1);
  return Math.round(1000 * multiplier);
}

export const yearRule: InsurabilityRule = (car) =>
  car.year < 2008 ? 'year must be 2008 or later' : null;

export const categoryRule: InsurabilityRule = (car) =>
  car.category === CarCategory.Exotic ? 'category must not be exotic' : null;

export const valueRule: InsurabilityRule = (car) =>
  car.value >= 150000 ? 'value must be under 150000' : null;

export const INSURABILITY_RULES: InsurabilityRule[] = [yearRule, categoryRule, valueRule];

export function getInsurabilityFailures(car: VendorCar): string[] {
  return INSURABILITY_RULES.map((r) => r(car)).filter(Boolean) as string[];
}

export function isInsurable(car: VendorCar): boolean {
  return getInsurabilityFailures(car).length === 0;
}
