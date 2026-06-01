import type { PostLemoBody, PostLemoResponse, InsurableCar, QuoteRequest, QuoteResult } from './schemas';
import { getCarsForUser, userExists } from './vendor';
import { calculatePremium, isInsurable, getInsurabilityFailures, MULTI_CAR_MIN_COUNT, MULTI_CAR_DISCOUNT_FACTOR } from './pricing';
import {
  DriverTooYoungError,
  EmptyCarSelectionError,
  CarNotFoundError,
  CarNotInsurableError,
  UserNotFoundError,
} from './errors';

export function getLemo(): void {
  // intentionally empty — GET /lemo returns 200 with no body
}

export function postLemo(body: PostLemoBody): PostLemoResponse {
  return { received: true, name: body.name, value: body.value };
}

export function getCars(userId: string): InsurableCar[] {
  const cars = getCarsForUser(userId);
  return cars.map((car) => ({ ...car, insurable: isInsurable(car) }));
}

export function postQuote(req: QuoteRequest, currentYear: number = new Date().getFullYear()): QuoteResult {
  if (!userExists(req.userId)) throw new UserNotFoundError(req.userId);
  if (req.user.age < 18) throw new DriverTooYoungError();
  if (req.carIds.length === 0) throw new EmptyCarSelectionError();

  const userCars = getCarsForUser(req.userId);
  const userCarMap = new Map(userCars.map((c) => [c.id, c]));

  const selectedCars = req.carIds.map((id) => {
    const car = userCarMap.get(id);
    if (!car) throw new CarNotFoundError(id);
    return car;
  });

  for (const car of selectedCars) {
    const failures = getInsurabilityFailures(car);
    if (failures.length > 0) throw new CarNotInsurableError(car.id, failures);
  }

  const quotes = selectedCars.map((car) => ({
    carId: car.id,
    premium: calculatePremium(req.user, car, currentYear),
  }));

  const total = quotes.reduce((sum, q) => sum + q.premium, 0);
  const combinedPremium = Math.round(quotes.length >= MULTI_CAR_MIN_COUNT ? total * MULTI_CAR_DISCOUNT_FACTOR : total);

  return { quotes, combinedPremium };
}
