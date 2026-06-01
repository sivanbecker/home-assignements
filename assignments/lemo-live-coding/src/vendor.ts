import { UserNotFoundError } from './errors';

export enum CarCategory {
  Sedan = 'sedan',
  Suv = 'suv',
  Sport = 'sport',
  Exotic = 'exotic',
}

export interface VendorCar {
  readonly id: string;
  readonly userId: string;
  readonly make: string;
  readonly model: string;
  readonly year: number;
  readonly category: CarCategory;
  readonly value: number;
}

const VENDOR_CARS: VendorCar[] = [
  { id: 'car-1', userId: 'user-1', make: 'Toyota', model: 'Camry', year: 2015, category: CarCategory.Sedan, value: 20000 },
  { id: 'car-2', userId: 'user-1', make: 'Honda', model: 'CR-V', year: 2019, category: CarCategory.Suv, value: 30000 },
  { id: 'car-3', userId: 'user-1', make: 'Ferrari', model: '488', year: 2020, category: CarCategory.Exotic, value: 250000 },
  { id: 'car-4', userId: 'user-2', make: 'Ford', model: 'Mustang', year: 2010, category: CarCategory.Sport, value: 25000 },
  { id: 'car-5', userId: 'user-2', make: 'Nissan', model: 'Altima', year: 2005, category: CarCategory.Sedan, value: 8000 },
];

// Users who exist in the system but may have no cars registered
const USERS_WITH_NO_CARS = ['user-empty'];

// Derived so adding a car for a new user automatically registers them
const KNOWN_USER_IDS = new Set([...VENDOR_CARS.map((c) => c.userId), ...USERS_WITH_NO_CARS]);

export function getCarsForUser(userId: string): VendorCar[] {
  if (!KNOWN_USER_IDS.has(userId)) {
    throw new UserNotFoundError(userId);
  }
  return VENDOR_CARS.filter((c) => c.userId === userId);
}
