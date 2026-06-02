import type { Session, Quote, CarOption } from './types';

const BASE_PREMIUM = 1000;
const YOUNG_DRIVER_AGE_THRESHOLD = 25;
const YOUNG_DRIVER_MULTIPLIER = 1.3;
const MULTI_CAR_THRESHOLD = 2;
const MULTI_CAR_DISCOUNT = 0.95;

export interface PricingFactor {
  apply(session: Session, car: CarOption): number;
}

// reads session.profile — car argument is ignored
export interface ProfilePricingFactor extends PricingFactor {}

// reads the specific car being priced — profile may be ignored
export interface CarPricingFactor extends PricingFactor {}

// applies to the total after all per-car premiums are summed (e.g. multi-car discount)
export interface TotalPricingFactor {
  applyToTotal(session: Session): number;
}

export interface QuoteFactors {
  perCarFactors: PricingFactor[];
  totalFactors: TotalPricingFactor[];
}

export class AgeFactor implements ProfilePricingFactor {
  apply(session: Session, _car: CarOption): number {
    return (session.profile?.age ?? YOUNG_DRIVER_AGE_THRESHOLD) < YOUNG_DRIVER_AGE_THRESHOLD
      ? YOUNG_DRIVER_MULTIPLIER
      : 1.0;
  }
}

export class CarCountFactor implements TotalPricingFactor {
  applyToTotal(session: Session): number {
    return (session.selectedCarIds?.length ?? 0) >= MULTI_CAR_THRESHOLD ? MULTI_CAR_DISCOUNT : 1.0;
  }
}

export class QuoteEngine {
  constructor(private readonly factors: QuoteFactors) {}

  calculate(session: Session): Quote {
    const selectedCarIds = session.selectedCarIds ?? [];
    const eligibleCars = session.eligibleCars ?? [];

    const perCar: Record<string, number> = {};
    let subtotal = 0;

    for (const carId of selectedCarIds) {
      const car = eligibleCars.find((c) => c.carId === carId);
      if (!car) continue;

      const premium = this.factors.perCarFactors.reduce(
        (acc, f) => acc * f.apply(session, car),
        BASE_PREMIUM,
      );
      perCar[carId] = Math.round(premium);
      subtotal += perCar[carId];
    }

    const totalMultiplier = this.factors.totalFactors.reduce(
      (acc, f) => acc * f.applyToTotal(session),
      1,
    );

    return { perCar, total: Math.round(subtotal * totalMultiplier) };
  }
}
