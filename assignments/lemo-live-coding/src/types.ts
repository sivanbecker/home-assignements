import type { VendorCar } from './vendor';

export interface PostLemoBody {
  name: string;
  value: string;
}

export interface PostLemoResponse {
  received: true;
  name: string;
  value: string;
}

export interface UserProfile {
  readonly age: number;
  readonly licenseYear: number;
  readonly zipCode: string;
}

export interface InsurableCar extends VendorCar {
  readonly insurable: boolean;
}

export interface QuoteRequest {
  readonly userId: string;
  readonly user: UserProfile;
  readonly carIds: readonly string[];
}

export interface CarQuote {
  readonly carId: string;
  readonly premium: number;
}

export interface QuoteResult {
  readonly quotes: readonly CarQuote[];
  readonly combinedPremium: number;
}
