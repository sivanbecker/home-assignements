import type { Session, Quote } from './types';

const BASE_PREMIUM = 1000;

export interface PricingFactor {
  apply(session: Session): number;
}

export interface QuoteFactors {
  perCarFactors: PricingFactor[];
  totalFactors: PricingFactor[];
}

export class CarCountFactor implements PricingFactor {
  apply(session: Session): number {
    return (session.selectedCarIds?.length ?? 0) >= 2 ? 0.95 : 1.0;
  }
}

export class AgeFactor implements PricingFactor {
  apply(session: Session): number {
    return (session.profile?.age ?? 25) < 25 ? 1.3 : 1.0;
  }
}

export class QuoteEngine {
  constructor(private readonly factors: QuoteFactors) {}

  calculate(session: Session): Quote {
    const selectedCarIds = session.selectedCarIds ?? [];

    const perCarMultiplier = this.factors.perCarFactors.reduce(
      (acc, f) => acc * f.apply(session),
      1,
    );

    const perCar: Record<string, number> = {};
    let subtotal = 0;
    for (const carId of selectedCarIds) {
      const premium = Math.round(BASE_PREMIUM * perCarMultiplier);
      perCar[carId] = premium;
      subtotal += premium;
    }

    const totalMultiplier = this.factors.totalFactors.reduce(
      (acc, f) => acc * f.apply(session),
      1,
    );

    return { perCar, total: Math.round(subtotal * totalMultiplier) };
  }
}
