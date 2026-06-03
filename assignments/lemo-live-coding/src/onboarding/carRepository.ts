import type { CarOption } from './types';

const CAR_CATALOGUE: CarOption[] = [
  { carId: 'car-1', make: 'Toyota', model: 'Camry', year: 2018, value: 20000 },
  { carId: 'car-2', make: 'Honda', model: 'Civic', year: 2020, value: 18000 },
  { carId: 'car-3', make: 'Ford', model: 'Mustang', year: 2019, value: 45000 },
  { carId: 'car-4', make: 'Ferrari', model: '488', year: 2021, value: 280000 },
  { carId: 'car-5', make: 'Toyota', model: 'Corolla', year: 2005, value: 8000 },
];

export function getAllCars(): CarOption[] {
  return CAR_CATALOGUE;
}
